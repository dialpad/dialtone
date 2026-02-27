#!/bin/bash
# PreToolUse hook: Validate commit messages match Dialtone convention.
# Format: <type>(<scope>): <jira> <subject>
# See .github/COMMIT_CONVENTION.md for full specification.

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

# Only check git commit commands (skip amends which reuse existing messages)
if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi
if echo "$COMMAND" | grep -q "\-\-amend"; then
  exit 0
fi

# Block if Co-Authored-By is present (case-insensitive)
if echo "$COMMAND" | grep -qi "co-authored-by"; then
  echo '{"decision":"block","reason":"BLOCKED: Co-Authored-By lines are not allowed in Dialtone commits. Remove the Co-Authored-By line and retry."}'
  exit 2
fi

# Extract commit message — handle both -m "msg" and heredoc formats
FIRST_LINE=$(echo "$COMMAND" | python3 -c "
import sys, re

cmd = sys.stdin.read()

# Try heredoc format: git commit -m \"\$(cat <<'EOF' ... EOF)\"
heredoc = re.search(r\"<<'?EOF'?\\n(.*?)\\nEOF\", cmd, re.DOTALL)
if heredoc:
    msg = heredoc.group(1).strip()
    print(msg.split('\\n')[0])
    sys.exit(0)

# Try -m \"message\" or -m 'message'
m_flag = re.search(r'-m\\s+[\"\\x27](.*?)[\"\\x27]', cmd, re.DOTALL)
if m_flag:
    msg = m_flag.group(1).strip()
    print(msg.split('\\n')[0])
    sys.exit(0)

print('')
" 2>/dev/null)

# If we couldn't extract a message, let it through (might be -m from a variable, etc.)
if [ -z "$FIRST_LINE" ]; then
  exit 0
fi

# Validate first line against Dialtone commit convention
VALID=$(echo "$FIRST_LINE" | python3 -c "
import sys, re
line = sys.stdin.read().strip()
pattern = r'^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.+\))?: (NO-JIRA|[A-Z]{2,}-\d+( [A-Z]{2,}-\d+)*) .+$'
if re.match(pattern, line):
    print('yes')
else:
    print('no')
" 2>/dev/null)

if [ "$VALID" != "yes" ]; then
  echo '{"decision":"block","reason":"BLOCKED: Commit message does not follow Dialtone convention. Expected: <type>(<scope>): <jira> <subject>. See .github/COMMIT_CONVENTION.md"}'
  exit 2
fi

exit 0
