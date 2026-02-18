#!/bin/bash
# PreToolUse hook: Block file edits on protected branches (staging, production).
# This prevents accidental direct commits to release branches.

INPUT=$(cat stdin 2>/dev/null || cat)
if [ -z "$INPUT" ]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null)

# If no file path, nothing to protect
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ -z "$BRANCH" ]; then
  exit 0
fi

# Block edits on protected branches
if [ "$BRANCH" = "staging" ] || [ "$BRANCH" = "production" ]; then
  echo "{\"decision\":\"block\",\"reason\":\"BLOCKED: Cannot edit files on the '${BRANCH}' branch. Create a feature branch first.\"}"
  exit 2
fi

exit 0
