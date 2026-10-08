"""Pinned quantized MiniLM inference in a short-lived CPU process (no remote inference)."""

import json
import os
import sys

MODEL = "sentence-transformers/all-MiniLM-L6-v2"
REPOSITORY = "Xenova/all-MiniLM-L6-v2"
REVISION = "751bff37182d3f1213fa05d7196b954e230abad9"


def main():
    import numpy as np
    import onnxruntime as ort
    from huggingface_hub import hf_hub_download
    from tokenizers import Tokenizer

    payload = json.loads(sys.stdin.read(25000))
    texts = payload["texts"]
    if not isinstance(texts, list) or not 1 <= len(texts) <= 5:
        raise ValueError("invalid_batch")
    if any(not isinstance(t, str) or not 1 <= len(t) <= 4000 for t in texts):
        raise ValueError("invalid_text")
    cache = os.environ.get("EMBEDDING_CACHE_PATH", "/tmp/fieldissue-models")

    def download(name):
        return hf_hub_download(REPOSITORY, name, revision=REVISION, cache_dir=cache)

    tokenizer = Tokenizer.from_file(download("tokenizer.json"))
    tokenizer.enable_truncation(max_length=256)
    tokenizer.enable_padding(pad_id=0, pad_token="[PAD]")
    encoded = tokenizer.encode_batch(texts)
    inputs = {
        "input_ids": np.array([e.ids for e in encoded], dtype=np.int64),
        "attention_mask": np.array([e.attention_mask for e in encoded], dtype=np.int64),
        "token_type_ids": np.array([e.type_ids for e in encoded], dtype=np.int64),
    }
    options = ort.SessionOptions()
    options.intra_op_num_threads = 1
    options.inter_op_num_threads = 1
    session = ort.InferenceSession(
        download("onnx/model_quantized.onnx"), options, providers=["CPUExecutionProvider"]
    )
    outputs = session.run(None, {i.name: inputs[i.name] for i in session.get_inputs()})
    mask = inputs["attention_mask"][..., None].astype(np.float32)
    pooled = (outputs[0] * mask).sum(axis=1) / np.clip(mask.sum(axis=1), 1e-9, None)
    vectors = pooled / np.clip(np.linalg.norm(pooled, axis=1, keepdims=True), 1e-9, None)
    print(
        json.dumps(
            {"model": MODEL, "revision": REVISION, "dimensions": 384, "vectors": vectors.tolist()}
        )
    )


if __name__ == "__main__":
    main()
