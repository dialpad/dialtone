# Logical Naming Rules

Apply when adding or changing public component props, slots, events, prop values, docs, and Combinator metadata.

## Public API

- Use logical direction names for new public component APIs.
- Do not add physical direction props such as `top`, `right`, `bottom`, or `left` when logical equivalents fit.
- Prefer `start` / `end` for the inline axis and `blockStart` / `blockEnd` for the block axis.
- For CSS geometry props, use full logical names such as `insetBlockStart`, `insetInlineEnd`, `paddingBlockStart`, and `borderWidthInlineEnd`.

## Descriptions And Docs

- Keep identifiers logical.
- On first mention in JSDoc or public docs, add the LTR-default physical equivalent in prose when it helps discoverability.
- Use parentheticals like `block-start side (aka top)` and `inline-end side (aka right)`.
- Do not create deprecated physical aliases for new APIs.

## Combinator Search

- Use `packages/combinator/src/lib/logical_aliases.js` for reusable logical-to-physical search aliases. Single physical words (`top`, `left`) match logical prop names automatically through it — do not repeat them as per-prop `searchKeywords`.
- Search normalization strips spaces and hyphens, so `z index` and `z-index` already match `zIndex` with no keywords.
- Add explicit `searchKeywords` only for multi-word phrases the name and aliases cannot derive, such as `padding left` or `sticky top`.
