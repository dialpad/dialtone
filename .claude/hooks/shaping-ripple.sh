#!/bin/bash

# Shaping Ripple Check Hook (PostToolUse — advisory only)
# Fires after Edit/MultiEdit/Write on markdown files with 'shaping: true' frontmatter.
# Reminds Claude to check for cascading changes across shaping documents.
# This hook is advisory — it must NEVER exit non-zero or block operations.

tool_info=$(cat)

if [ -z "$tool_info" ]; then
  exit 0
fi

file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")

# Skip if no file path, not markdown, or file doesn't exist
if [[ -z "$file_path" ]] || [[ "$file_path" != *.md ]] || [[ ! -f "$file_path" ]]; then
  exit 0
fi

# Check first 10 lines for shaping frontmatter (tolerates whitespace)
if head -10 "$file_path" 2>/dev/null | grep -qE '^\s*shaping:\s*true'; then
  cat >&2 <<'MSG'
Ripple check:
- Updated a Breadboard diagram? → Affordance tables are the source of truth. Update tables FIRST, then render to Mermaid
- Changed Requirements? → update Fit Check + any Gaps, Open Questions by Part
- Changed Shape (A, B...) Parts? → update Fit Check + any Gaps, Open Questions by Part
- Changed Slices? → update per-slice affordance tables and demo statements
MSG
fi

exit 0
