#!/usr/bin/env bash
# safe-grep — sandboxed grep for Claude Code Review
# Prevents directory traversal outside the repository root.
# Usage: safe-grep <pattern> [search_path]
set -euo pipefail

REPO_DIR="${REPO_DIR:?REPO_DIR must be set}"
PATTERN="${1:-}"
SEARCH_PATH="${2:-}"

if [[ -z "$PATTERN" ]]; then
  echo "ERROR: Pattern required"
  exit 1
fi

if [[ -n "$SEARCH_PATH" ]]; then
  RESOLVED=$(realpath -m "$SEARCH_PATH" 2>/dev/null)
  if [[ "$RESOLVED" != "$REPO_DIR" && "$RESOLVED" != "$REPO_DIR"/* ]]; then
    echo "ERROR: Access denied. Can only search within the repository."
    exit 1
  fi
  TARGET="$RESOLVED"
else
  TARGET="$REPO_DIR"
fi

if [[ ! -e "$TARGET" ]]; then
  echo "ERROR: Path not found: $SEARCH_PATH"
  exit 1
fi

grep -rn \
  --exclude-dir=".git" \
  --exclude=".env" \
  --exclude=".env.*" \
  -- "$PATTERN" "$TARGET" 2>/dev/null \
  | head -500 || true
