# Migration Plan: Replace `jsonToMarkdownConverter` with `@tiptap/static-renderer`

## Background

The custom `jsonToMarkdownConverter` object in `rich_text_editor.vue` is buggy and difficult to maintain.
`@tiptap/static-renderer` is a free TipTap package that provides a `renderToMarkdown` function accepting
the same ProseMirror JSON that `editor.getJSON()` already returns — no conversion step needed.

---

## Steps

### Step 1 — Add the dependency

In `packages/dialtone-vue/package.json`:
- Add `"@tiptap/static-renderer": "3.19.0"` to `dependencies`
- Remove `"turndown": "7.2.0"` (confirmed unused — zero imports across the package)

Run `pnpm install` from the repo root.

### Step 2 — Create `markdownRenderer.js` utility

Create `packages/dialtone-vue/components/rich_text_editor/markdownRenderer.js`.

Exports a single function: `renderEditorToMarkdown(jsonContent, extensions)`.

Internally calls `renderToMarkdown` from `@tiptap/static-renderer/pm/markdown` with custom
`nodeMapping` and `markMapping` options.

#### Custom node mappings (built-in renderer has no knowledge of these extensions)

| Node | Output format | Notes |
|---|---|---|
| `mention` | `<!-- @mention: {"id": "...", "contactKey": "...", "name": "..."} -->` | HTML comment |
| `channel` | `<!-- @channel: {"id": "...", "channelKey": "...", "name": "...", "locked": "..."} -->` | HTML comment; `locked` coerced via `String()` |
| `emoji` | raw `code` attribute value | Built-in `renderText` returns Unicode — different behavior |
| `variable` | `{{id=altText}}` | Built-in `renderText` returns only altText — different behavior |
| `slash-commands` | `/${command}` | Drop `parameters` — attribute does not exist on node schema (latent bug in current converter) |

#### Built-in behavior overrides (defaults differ from current output)

| Type | Built-in default | Current behavior | Fix |
|---|---|---|---|
| `paragraph` | `\n${children}\n` (leading + trailing newline) | `${children}\n` (trailing newline only) | Custom node mapping |
| `italic` mark | `_text_` (underscore) | `*text*` (asterisk) | Custom mark mapping |
| `underline` mark | `<u>text</u>` | pass-through (no-op) | Custom mark mapping returning children unchanged |
| `codeBlock` | `` ```lang\n...\n```\n `` | `` ```\n...\n``` `` (no language, no trailing newline) | Custom node mapping |

### Step 3 — Update `rich_text_editor.vue`

1. Add import at the top of `<script>`: `import { renderEditorToMarkdown } from './markdownRenderer';`
2. Delete the entire `jsonToMarkdownConverter` object from `data()` (~150 lines)
3. Update the two call sites to use the new utility, passing `this.editor.getJSON()` and `this.extensions`:
   - `getOutput()` — markdown case
   - `triggerInputChangeEvents()` — markdown value line

### Step 4 — Update tests

Tests currently call `wrapper.vm.jsonToMarkdownConverter.convertToMarkdown(jsonInput)` directly.
Replace with testing via `wrapper.vm.getOutput()` — set content via the editor, assert the output.

**14 existing markdown assertions to verify.** The only expected behavioral change is the nested
bold+italic case (`**Bold and *****italic***** nested**`) — the static renderer may produce slightly
different nesting. Run the tests and update that assertion to match the actual output (it will still
be valid markdown).

### Step 5 — Verify and ship

```bash
pnpm nx run dialtone-vue:test -- --testPathPattern=rich_text_editor
pnpm nx run dialtone-vue:build
pnpm nx run dialtone-vue:lint
```

---

## Key Risks

| Risk | Mitigation |
|---|---|
| `italic` uses `_` vs `*` in built-in | Override `markMapping.italic` to use `*` — will break all italic tests if missed |
| `paragraph` adds leading `\n` in built-in | Override `nodeMapping.paragraph` to trailing-only — will break all 14 tests if missed |
| Nested bold+italic output differs | Run tests, observe actual output, update assertion to match |
| `slash-commands` `parameters` attr never existed | New mapping uses only `command` attr — existing behavior was silently broken |
| `underline` now outputs `<u>text</u>` | Override `markMapping.underline` to pass-through (no markdown equivalent) |

## Files Changed

| File | Change |
|---|---|
| `packages/dialtone-vue/package.json` | Add `@tiptap/static-renderer`, remove `turndown` |
| `rich_text_editor/markdownRenderer.js` | **New file** — custom renderer utility |
| `rich_text_editor/rich_text_editor.vue` | Remove `jsonToMarkdownConverter`, import + call new utility |
| `rich_text_editor/rich_text_editor.test.js` | Update markdown test section to use `getOutput()` |
