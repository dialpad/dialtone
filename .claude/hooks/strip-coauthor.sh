#!/bin/bash
# PreToolUse hook: Block commits that contain Co-Authored-By lines.
# Dialtone uses a strict commit format that does not allow Co-Authored-By trailers.

INPUT=$(cat stdin 2>/dev/null || cat)
if [ -z "$INPUT" ]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('command', ''))
except Exception:
    print('')
" 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Only check git commit commands
if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

# Block if Co-Authored-By is present (case-insensitive)
if echo "$COMMAND" | grep -qi "co-authored-by"; then
  echo '{"decision":"block","reason":"BLOCKED: Co-Authored-By lines are not allowed in Dialtone commits. Remove the Co-Authored-By line and retry."}'
  exit 2
fi

exit 0
