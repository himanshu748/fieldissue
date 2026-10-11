#!/usr/bin/env bash
set -euo pipefail

# Verify one reviewed checkpoint without uploading unrelated session history.
revision=${1:-HEAD}
checkpoint_remote=${2:-origin}
commit=$(git rev-parse --verify "${revision}^{commit}")
checkpoint=$(git show -s --format=%B "$commit" | git interpret-trailers --parse | sed -n 's/^Entire-Checkpoint: //p')
if [[ ! "$checkpoint" =~ ^([0-9A-HJKMNP-TV-Z]{26}|[0-9a-f]{12})$ ]]; then
  printf '%s\n' 'Missing or ambiguous Entire checkpoint trailer.' >&2
  exit 1
fi
if [[ ${#checkpoint} -eq 26 ]]; then
  checkpoint_ref="refs/entire/checkpoints/${checkpoint: -2}/$checkpoint"
else
  printf '%s\n' 'Legacy checkpoint: inspect its storage with the Entire CLI.' >&2
  exit 1
fi
local_hash=$(git rev-parse --verify "$checkpoint_ref" 2>/dev/null) || {
  printf '%s\n' 'Checkpoint is missing locally.' >&2
  exit 1
}
remote_result=$(git ls-remote --refs "$checkpoint_remote" "$checkpoint_ref" 2>/dev/null) || {
  printf '%s\n' 'Could not read the checkpoint remote.' >&2
  exit 1
}
remote_hash=${remote_result%%$'\t'*}
if [[ "$local_hash" != "$remote_hash" ]]; then
  printf '%s\n' 'Checkpoint is not synchronized with the remote.' >&2
  exit 1
fi
printf 'Commit: %s\nCheckpoint: %s\nSynchronized: yes\n' "$commit" "$checkpoint"
