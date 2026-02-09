# Copy as Markdown — Clipboard Copy of Raw Markdown

## Overview

**Status:** Complete
**Created:** 2026-02-06
**Depends on:** [Raw Markdown Generation Pipeline](../archive/raw-markdown-generation-pipeline.md)

The "Copy as Markdown" dropdown item in PageHeader.vue fetches the generated raw markdown file and copies its full contents to the clipboard.

## Goals

- Fetch the raw markdown file (`/raw/components/{slug}.md`) on click
- Copy the response text to the user's clipboard via the Clipboard API
- Show the existing checkmark icon feedback after a successful copy
- Only show the menu item on component pages (where raw markdown exists)

## Non-Goals

- "Copy Markdown link" — existing separate handler (not yet fully implemented)
- "Open in Claude.ai" / "Open in ChatGPT" links — separate task

## Changes

### `PageHeader.vue`

**Template:**
- Line 165: Added `v-if="rawMarkdownUrl"` to hide "Copy as Markdown" on non-component pages
- Line 165: Changed `@click` from `onCopyMarkdownLink(close)` to `onCopyAsMarkdown(close)`

**Script:**
- Extracted `showCopiedFeedback()` helper from duplicated checkmark icon logic
- `onCopyMarkdownLink()` now delegates to `showCopiedFeedback()`
- New `async onCopyAsMarkdown(close)`:
  1. Closes the dropdown
  2. Fetches `rawMarkdownUrl.value` via the Fetch API
  3. Copies the response text to clipboard via `navigator.clipboard.writeText()`
  4. Shows checkmark icon feedback on success
  5. Logs errors to console on failure

No new dependencies — uses browser Fetch API and Clipboard API.

## Verification

1. Navigate to a component page (e.g. `/components/avatar`)
2. Click the Copy dropdown, click "Copy as Markdown"
3. Paste into a text editor — should contain clean GFM markdown for that component
4. Confirm the checkmark icon appears briefly after copying
5. On a non-component page, confirm "Copy as Markdown" is hidden
