#!/bin/bash
# Skill auto-activation hook
# Analyzes user prompts and suggests relevant Dialtone skills

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Find tsx binary — check common locations for pnpm monorepos
find_tsx() {
  # Check PATH first (global install or hoisted)
  if command -v tsx >/dev/null 2>&1; then
    echo "tsx"
    return
  fi

  # Check project node_modules/.bin
  if [ -x "$PROJECT_ROOT/node_modules/.bin/tsx" ]; then
    echo "$PROJECT_ROOT/node_modules/.bin/tsx"
    return
  fi

  # Search pnpm store for tsx CLI
  local tsx_cli
  tsx_cli=$(find "$PROJECT_ROOT/node_modules/.pnpm" -path "*/tsx/dist/cli.mjs" -type f 2>/dev/null | head -1)
  if [ -n "$tsx_cli" ]; then
    echo "node $tsx_cli"
    return
  fi

  return 1
}

TSX_CMD=$(find_tsx)

if [ -n "$TSX_CMD" ]; then
  cat | $TSX_CMD "$SCRIPT_DIR/skill-activation.ts" 2>/dev/null
fi

# Always allow the prompt through
exit 0
