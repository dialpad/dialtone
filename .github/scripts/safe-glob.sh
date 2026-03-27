#!/usr/bin/env bash
# safe-glob — sandboxed file finder for Claude Code Review
# Prevents directory traversal outside the repository root.
# Usage: safe-glob <pattern> [search_path]
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

if [[ ! -d "$TARGET" ]]; then
  echo "ERROR: Directory not found: ${SEARCH_PATH:-$REPO_DIR}"
  exit 1
fi

find "$TARGET" \
  -not -path '*/.git/*' \
  -not -name '.env' \
  -not -name '.env.*' \
  -name "$PATTERN" \
  -type f \
  2>/dev/null \
  | head -500 | sort || true
