#!/bin/bash
# PreToolUse hook — checks documentation before push and PR creation
# Uses the edit tracker to see if code files were touched without doc updates
# Maps package source paths to dialtone-docs content files
# Push: suggests updating docs if missing
# PR creation: same + asks about /doc-janitor

tool_info=$(cat)

tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty' 2>/dev/null)
command=$(echo "$tool_info" | jq -r '.tool_input.command // empty' 2>/dev/null)
session_id=$(echo "$tool_info" | jq -r '.session_id // empty' 2>/dev/null)

# Only check Bash tool
if [[ "$tool_name" != "Bash" ]] || [[ -z "$command" ]]; then
    exit 0
fi

# Detect push and PR creation
is_push=false
is_pr=false

# Split on && and || to check each command in the chain independently
# This prevents "git stash push && git push" from being classified as stash-only
IFS=$'\n'
for cmd_part in $(echo "$command" | sed 's/&&/\n/g; s/||/\n/g; s/|/\n/g'); do
    # Skip stash push commands
    if echo "$cmd_part" | grep -qE 'git\s+stash\s+push'; then
        continue
    fi
    if echo "$cmd_part" | grep -qE 'git\s+.*push(\s|$)'; then
        is_push=true
    fi
done
unset IFS

if echo "$command" | grep -qE '(^|\s|&&|\|)gh\s+.*pr\s+create(\s|$)'; then
    is_pr=true
fi

if [[ "$is_push" == "false" ]] && [[ "$is_pr" == "false" ]]; then
    exit 0
fi

# Check if checks were already done this session
project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
marker_dir="$project_dir/.claude/tsc-cache/${session_id:-default}"

if [[ "$is_pr" == "true" ]]; then
    marker_file="$marker_dir/pr-create-done"
else
    marker_file="$marker_dir/push-done"
fi

# If marker exists, check if new edits happened after it was created
if [[ -f "$marker_file" ]]; then
    log_file_check="$marker_dir/edited-files.log"
    if [[ -f "$log_file_check" ]] && [[ "$log_file_check" -nt "$marker_file" ]]; then
        # New edits since last check — remove marker and re-run
        rm -f "$marker_file"
    else
        exit 0
    fi
fi

# Read edit tracker
log_file="$marker_dir/edited-files.log"

if [[ ! -f "$log_file" ]]; then
    # No edits tracked — allow
    exit 0
fi

edited_files=$(cat "$log_file" | cut -d: -f2)

# Dialtone docs content path
docs_content="packages/dialtone-docs/src/content"

# Map: source package paths to their corresponding dialtone-docs content files
# Check if code files were edited in these areas
has_token_edits=$(echo "$edited_files" | grep -c 'packages/dialtone-tokens/' || true)
has_css_edits=$(echo "$edited_files" | grep -c 'packages/dialtone-css/' || true)
has_vue_edits=$(echo "$edited_files" | grep -c 'packages/dialtone-vue/' || true)
has_icon_edits=$(echo "$edited_files" | grep -c 'packages/dialtone-icons/' || true)
has_ci_edits=$(echo "$edited_files" | grep -c '\.github/workflows/' || true)
has_mcp_edits=$(echo "$edited_files" | grep -c 'packages/dialtone-mcp-server/' || true)
has_eslint_edits=$(echo "$edited_files" | grep -c 'packages/eslint-plugin-dialtone/' || true)
has_stylelint_edits=$(echo "$edited_files" | grep -c 'packages/stylelint-plugin-dialtone/' || true)

# Check if any corresponding doc files were also edited
has_doc_edits=$(echo "$edited_files" | grep -c "$docs_content/" || true)

# Build list of packages touched without doc updates
missing_docs=""

if (( has_token_edits > 0 )); then
    # Check for token-related docs
    token_docs=$(echo "$edited_files" | grep -cE "(development-design-tokens|architecture-design-token-pipeline)" || true)
    if (( token_docs == 0 )); then
        missing_docs="${missing_docs}  - dialtone-tokens → development-design-tokens.md, architecture-design-token-pipeline.md\n"
    fi
fi

if (( has_css_edits > 0 )); then
    css_docs=$(echo "$edited_files" | grep -c "development-css-utilities" || true)
    if (( css_docs == 0 )); then
        missing_docs="${missing_docs}  - dialtone-css → development-css-utilities.md\n"
    fi
fi

if (( has_vue_edits > 0 )); then
    vue_docs=$(echo "$edited_files" | grep -cE "(development-component-workflow|reference-component-api-patterns|reference-accessibility-checklist|development-testing)" || true)
    if (( vue_docs == 0 )); then
        missing_docs="${missing_docs}  - dialtone-vue → development-component-workflow.md, reference-component-api-patterns.md\n"
    fi
fi

if (( has_icon_edits > 0 )); then
    icon_docs=$(echo "$edited_files" | grep -c "development-icons" || true)
    if (( icon_docs == 0 )); then
        missing_docs="${missing_docs}  - dialtone-icons → development-icons.md\n"
    fi
fi

if (( has_ci_edits > 0 )); then
    ci_docs=$(echo "$edited_files" | grep -c "workflow-ci-pipeline" || true)
    if (( ci_docs == 0 )); then
        missing_docs="${missing_docs}  - .github/workflows → workflow-ci-pipeline.md\n"
    fi
fi

docs_missing=false
if [[ -n "$missing_docs" ]]; then
    docs_missing=true
fi

# If no issues and not a PR, allow through
if [[ "$docs_missing" == "false" ]] && [[ "$is_pr" == "false" ]]; then
    mkdir -p "$marker_dir"
    touch "$marker_file"
    exit 0
fi

mkdir -p "$marker_dir"

CYAN=$'\033[1;36m'; RESET=$'\033[0m'

if [[ "$is_pr" == "true" ]]; then
    echo -e "${CYAN}📋 PR creation check triggered${RESET}" >&2

    if [[ "$docs_missing" == "true" ]]; then
        # Write missing docs mapping to cache so the skill can read it
        echo -e "$missing_docs" > "$marker_dir/missing-docs.txt"

        jq -n \
          --arg missing "$missing_docs" \
          --arg log_file "$log_file" \
          --arg marker_dir "$marker_dir" \
          --arg marker_file "$marker_file" \
        '{
          "hookSpecificOutput": { "permissionDecision": "deny" },
          "systemMessage": ("Code files were edited this session but the corresponding dialtone-docs content was not updated.\n\nMissing doc updates:\n" + $missing + "\nRun the doc-sync-enforcer skill now. For each mapping above:\n1. Read the source files that were changed (listed in " + $log_file + ")\n2. Read the corresponding doc file in packages/dialtone-docs/src/content/\n3. Update the doc file to reflect the source code changes — update relevant sections, examples, and the last_updated frontmatter field\n4. If the change is trivial (bug fix, formatting only), note that and skip the doc update\n\nAfter the enforcer finishes, ask the user: \"Want me to run /doc-janitor to clean up stale artifacts before the PR?\"\nIf yes, launch the doc-janitor agent.\nIf no, skip.\n\nThen run:\n  mkdir -p " + $marker_dir + " && touch " + $marker_file + "\n\nThen retry the PR creation.")
        }'
    else
        jq -n \
          --arg marker_dir "$marker_dir" \
          --arg marker_file "$marker_file" \
        '{
          "hookSpecificOutput": { "permissionDecision": "deny" },
          "systemMessage": ("PR creation check: docs look up to date.\n\nAsk the user: \"Want me to run /doc-janitor to clean up stale artifacts before the PR?\"\nIf yes, launch the doc-janitor agent.\nIf no, skip.\n\nThen run:\n  mkdir -p " + $marker_dir + " && touch " + $marker_file + "\n\nThen retry the PR creation.")
        }'
    fi
else
    # Push: only block if docs are missing
    if [[ "$docs_missing" == "true" ]]; then
        echo -e "${CYAN}📋 Pre-push doc check triggered${RESET}" >&2

        # Write missing docs mapping to cache so the skill can read it
        echo -e "$missing_docs" > "$marker_dir/missing-docs.txt"

        jq -n \
          --arg missing "$missing_docs" \
          --arg log_file "$log_file" \
          --arg marker_dir "$marker_dir" \
          --arg marker_file "$marker_file" \
        '{
          "hookSpecificOutput": { "permissionDecision": "deny" },
          "systemMessage": ("Code files were edited this session but the corresponding dialtone-docs content was not updated.\n\nMissing doc updates:\n" + $missing + "\nRun the doc-sync-enforcer skill now. For each mapping above:\n1. Read the source files that were changed (listed in " + $log_file + ")\n2. Read the corresponding doc file in packages/dialtone-docs/src/content/\n3. Update the doc file to reflect the source code changes — update relevant sections, examples, and the last_updated frontmatter field\n4. If the change is trivial (bug fix, formatting only), note that and skip the doc update\n\nAfter the enforcer finishes, run:\n  mkdir -p " + $marker_dir + " && touch " + $marker_file + "\n\nThen retry the push.")
        }'
    else
        # Docs were updated, allow push
        touch "$marker_file"
        exit 0
    fi
fi

exit 0
