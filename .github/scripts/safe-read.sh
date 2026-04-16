#!/usr/bin/env bash
# safe-read — sandboxed file reader for Claude Code Review
# Prevents directory traversal outside the repository root.
# Usage: safe-read <file_path>
set -euo pipefail

REPO_DIR="${REPO_DIR:?REPO_DIR must be set}"
FILE_PATH="$1"

if [[ -z "$FILE_PATH" ]]; then
  echo "ERROR: File path required"
  exit 1
fi

RESOLVED=$(realpath -m "$FILE_PATH" 2>/dev/null)

if [[ "$RESOLVED" != "$REPO_DIR" && "$RESOLVED" != "$REPO_DIR"/* ]]; then
  echo "ERROR: Access denied. Can only read files within the repository."
  exit 1
fi

BASENAME=$(basename "$RESOLVED")
if [[ "$BASENAME" == .env || "$BASENAME" == .env.* ]]; then
  echo "ERROR: Access denied. Cannot read environment files."
  exit 1
fi

if [[ ! -f "$RESOLVED" ]]; then
  echo "ERROR: File not found: $FILE_PATH"
  exit 1
fi

cat -n "$RESOLVED"
