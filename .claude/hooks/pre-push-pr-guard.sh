#!/bin/bash
set -e
# Existing PreToolUse entry point; documentation review is advisory.
node "$(dirname "${BASH_SOURCE[0]}")/doc-review-adapter.mjs" || {
    printf '%s\n' 'Documentation review unavailable; run scripts/check-doc-review.mjs explicitly.' >&2
    exit 0
}
