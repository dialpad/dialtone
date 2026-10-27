#!/bin/bash
# Existing PreToolUse entry point; documentation review is advisory.
# The edit tracker remains available to its other consumers.
node "$(dirname "${BASH_SOURCE[0]}")/doc-review-adapter.mjs" || {
    printf '%s\n' 'Documentation review unavailable; run scripts/check-doc-review.mjs explicitly.' >&2
    exit 0
}
