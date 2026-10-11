"""Frozen note datasets and prompts for the independent v3 experiment."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Any

from training import common

ROOT = Path(__file__).parent
DATASET = ROOT / "dataset" / "v3"
PROMPT_VERSION = "fieldissue-note-json-v3"
SYSTEM_PROMPT = common.SYSTEM_PROMPT + (
    " Category is the primary reported problem, not the location. "
    "ACCESSIBILITY covers explicitly blocked pedestrian or wheelchair access. "
    "TRAIL covers defects on unpaved walking trails. LIGHTING covers failed public lamps. "
    "OTHER covers uncategorized concerns. LOW includes cosmetic wear with normal use. "
    "MEDIUM is a definite maintenance problem without stated major hazard. "
    "HIGH requires substantial loss of access or an explicit serious hazard. "
    "CRITICAL requires a current or imminent life-threatening event involving people. "
    "Urgent wording alone is insufficient. Respect negation and safe alternatives."
)


def normalized(note: str) -> str:
    return re.sub(r"[^\w]+", " ", unicodedata.normalize("NFKC", note).casefold()).strip()


def grams(note: str) -> set[str]:
    value = normalized(note)
    return {value[i : i + 5] for i in range(max(1, len(value) - 4))}


def similarity(a: str, b: str) -> float:
    ga, gb = grams(a), grams(b)
    return len(ga & gb) / len(ga | gb) if ga | gb else 1.0


def load(path: Path) -> list[dict[str, Any]]:
    rows = [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
    seen = set()
    for row in rows:
        if row["id"] in seen:
            raise ValueError("Duplicate dataset ID")
        seen.add(row["id"])
        common.validate_prediction(row["target"])
        if row["language"] not in ("english", "hindi", "hinglish"):
            raise ValueError("Unknown language")
        if not row["note"].strip() or row["source"] not in ("synthetic", "public-source"):
            raise ValueError("Missing note provenance")
    return rows


def prompt_tokens(tokenizer: Any, note: str, examples: list[dict] | None = None) -> list[int]:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for row in examples or []:
        messages += [
            {"role": "user", "content": json.dumps({"note": row["note"]}, ensure_ascii=False)},
            {"role": "assistant", "content": json.dumps(row["target"], ensure_ascii=False)},
        ]
    messages.append({"role": "user", "content": json.dumps({"note": note}, ensure_ascii=False)})
    rendered = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True, enable_thinking=False
    )
    return tokenizer.encode(rendered, add_special_tokens=False)


def build_datum(row: dict, tokenizer: Any, types: Any, max_tokens: int = 2048) -> Any:
    prompt = prompt_tokens(tokenizer, row["note"])
    target = tokenizer.encode(
        json.dumps(row["target"], ensure_ascii=False), add_special_tokens=False
    )
    target.append(tokenizer.eos_token_id)
    full = prompt + target
    if len(full) > max_tokens:
        raise ValueError("Training row exceeds the registered token bound")
    return types.Datum(
        model_input=types.ModelInput.from_ints(full[:-1]),
        loss_fn_inputs={
            "target_tokens": full[1:],
            "weights": [0.0] * (len(prompt) - 1) + [1.0] * len(target),
        },
    )
