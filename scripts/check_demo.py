"""Bounded, read-only availability checks until the judging deadline."""

import json
import os
import time
import urllib.request
from datetime import datetime, timezone

DEADLINE = datetime(2026, 10, 19, 6, 59, tzinfo=timezone.utc)
BASE_URL = "https://fieldissue-demo.onrender.com"
ENDPOINTS = (("/health", "ok"), ("/ready", "ready"))


def utcnow():
    return datetime.now(timezone.utc)


def check_demo(now=utcnow, opener=urllib.request.urlopen, sleep=time.sleep):
    """Return (expired, failures); never start a request at/after the deadline."""
    failures = []
    for path, expected in ENDPOINTS:
        for attempt in range(2):
            remaining = (DEADLINE - now()).total_seconds()
            if remaining <= 0:
                return True, failures
            try:
                request = urllib.request.Request(
                    BASE_URL + path,
                    headers={"User-Agent": "FieldIssue-availability-monitor/1.0"},
                )
                with opener(request, timeout=min(25, remaining)) as response:
                    if response.status != 200:
                        raise ValueError("unexpected HTTP status")
                    body = json.loads(response.read(65537))
                    if not isinstance(body, dict) or body.get("status") != expected:
                        raise ValueError("unexpected readiness status")
                print(f"{path}: healthy")
                break
            except Exception as error:
                # Never dump response bodies, connection strings, or provider logs.
                print(f"{path}: attempt {attempt + 1} failed ({type(error).__name__})")
                if attempt == 1:
                    failures.append(path)
                else:
                    remaining = (DEADLINE - now()).total_seconds()
                    if remaining > 0:
                        sleep(min(5, remaining))
    return now() >= DEADLINE, failures


if __name__ == "__main__":
    expired, failures = check_demo()
    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        with open(output, "a", encoding="utf-8") as handle:
            handle.write(f"expired={str(expired).lower()}\n")
    if expired:
        print("Judging deadline reached; no further health requests.")
    elif failures:
        raise SystemExit("Unavailable after bounded retry: " + ", ".join(failures))
