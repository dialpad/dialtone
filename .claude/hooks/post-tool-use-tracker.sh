#!/bin/bash
set -e

# Post-tool-use hook that tracks edited files and their repos
# This runs after Edit, MultiEdit, or Write tools complete successfully


# Read tool information from stdin
tool_info=$(cat)


# Extract relevant data
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')
session_id=$(echo "$tool_info" | jq -r '.session_id // empty')


# Skip if not an edit tool or no file path
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0  # Exit 0 for skip conditions
fi


# Create cache directory in project
cache_dir="$CLAUDE_PROJECT_DIR/.claude/tsc-cache/${session_id:-default}"
mkdir -p "$cache_dir"

# Function to detect repo from file path
detect_repo() {
    local file="$1"
    local project_root="$CLAUDE_PROJECT_DIR"

    # Remove project root from path
    local relative_path="${file#$project_root/}"

    # Extract first directory component
    local repo=$(echo "$relative_path" | cut -d'/' -f1)

    # Dialtone monorepo structure
    case "$repo" in
        # Monorepo packages (packages/dialtone-vue, packages/dialtone-css, etc.)
        packages)
            local package=$(echo "$relative_path" | cut -d'/' -f2)
            if [[ -n "$package" ]]; then
                echo "packages/$package"
            else
                echo "$repo"
            fi
            ;;
        # Apps (apps/dialtone-documentation)
        apps)
            local app=$(echo "$relative_path" | cut -d'/' -f2)
            if [[ -n "$app" ]]; then
                echo "apps/$app"
            else
                echo "$repo"
            fi
            ;;
        # Common shared files
        common)
            echo "common"
            ;;
        # Scripts
        scripts)
            echo "scripts"
            ;;
        # CI/CD
        .github)
            echo ".github"
            ;;
        # Claude config
        .claude)
            echo ".claude"
            ;;
        *)
            # Check if it's a source file in root
            if [[ ! "$relative_path" =~ / ]]; then
                echo "root"
            else
                echo "unknown"
            fi
            ;;
    esac
}

# Function to get build command for repo
get_build_command() {
    local repo="$1"
    local project_root="$CLAUDE_PROJECT_DIR"

    # Dialtone uses NX — build commands go through pnpm nx
    case "$repo" in
        packages/dialtone-tokens)
            echo "pnpm nx run dialtone-tokens:build"
            ;;
        packages/dialtone-css)
            echo "pnpm nx run dialtone-css:build"
            ;;
        packages/dialtone-vue)
            echo "pnpm nx run dialtone-vue:build"
            ;;
        packages/dialtone-icons)
            echo "pnpm nx run dialtone-icons:build"
            ;;
        packages/dialtone-mcp-server)
            echo "pnpm nx run dialtone-mcp-server:build"
            ;;
        packages/language-server)
            echo "pnpm nx run language-server:build"
            ;;
        apps/dialtone-documentation)
            echo "pnpm nx run dialtone-documentation:build"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Function to get test command for repo
get_tsc_command() {
    local repo="$1"

    # Dialtone uses Vitest/Mocha/node --test depending on package
    case "$repo" in
        packages/dialtone-vue)
            echo "pnpm nx run dialtone-vue:test"
            ;;
        packages/eslint-plugin-dialtone)
            echo "pnpm nx run eslint-plugin-dialtone:test"
            ;;
        packages/stylelint-plugin-dialtone)
            echo "pnpm nx run stylelint-plugin-dialtone:test"
            ;;
        packages/postcss-responsive-variations)
            echo "pnpm nx run postcss-responsive-variations:test"
            ;;
        packages/dialtone-docs)
            echo "pnpm nx run dialtone-docs:test"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Detect repo
repo=$(detect_repo "$file_path")

# Skip if unknown repo
if [[ "$repo" == "unknown" ]] || [[ -z "$repo" ]]; then
    exit 0  # Exit 0 for skip conditions
fi

# Log edited file
echo "$(date +%s):$file_path:$repo" >> "$cache_dir/edited-files.log"

# Update affected repos list
if ! grep -q "^$repo$" "$cache_dir/affected-repos.txt" 2>/dev/null; then
    echo "$repo" >> "$cache_dir/affected-repos.txt"
fi

# Store build commands
build_cmd=$(get_build_command "$repo")
tsc_cmd=$(get_tsc_command "$repo")

if [[ -n "$build_cmd" ]]; then
    echo "$repo:build:$build_cmd" >> "$cache_dir/commands.txt.tmp"
fi

if [[ -n "$tsc_cmd" ]]; then
    echo "$repo:tsc:$tsc_cmd" >> "$cache_dir/commands.txt.tmp"
fi

# Remove duplicates from commands
if [[ -f "$cache_dir/commands.txt.tmp" ]]; then
    sort -u "$cache_dir/commands.txt.tmp" > "$cache_dir/commands.txt"
    rm -f "$cache_dir/commands.txt.tmp"
fi

# Exit cleanly
exit 0
