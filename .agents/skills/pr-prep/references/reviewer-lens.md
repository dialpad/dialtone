# Reviewer lens: what Dialtone reviewers raise

Built from a review of human feedback on recent Dialtone PRs. Bots rarely raise these, so they need a reader.

Sections run from most to least common. Skip a section whose condition does not match the diff. For each finding, name the file and line.

Reviewers accept a reasoned "no". Do not add code only to avoid a comment.

## 1. Migration and deprecation (when anything public changes)

- Anything public removed, renamed or re-defaulted (a prop value, exported constant, mode list, default colour, a visual such as a spinner) is breaking even if the new version is better. Keep the old one working, make it an option, or mark the change breaking.
- A deprecated prop, value or slot still renders the same and passes the validator, so Vue emits no invalid-prop warning.
- Its warning appears once per message and names the exact replacement (`emphasis="base"`, not "use emphasis").
- Validation uses the normalised value, not the raw legacy one.
- Behaviour production depends on is kept. An option that does nothing is removed, and the removal is documented.
- The migration guide lists every visible change, including class renames and removed config, and never says "looks the same" when it does not.

## 2. Docs and types

- Examples match the rendered markup and the real call signature.
- Docs answer the consumer: accepted input, what invalid input does, the default case. Terms are defined ("mode" means light or dark).
- Composable options have a named type, optional where defaults exist, accepting reactive input where the runtime does.
- New components are added to the lists that index them (Newest Components) and to the Combinator presets.

## 3. Logic, reactivity and lifecycle

- A watcher on a computed array or object that emits or does work: does it run when content is equal? Compare before emitting.
- A computed that reads DOM size or `$refs` will not recompute. Use a ResizeObserver and disconnect on unmount. No polling.
- `$nextTick` or async callbacks touching `$refs`: guard against unmount.
- Composables register their own `onMounted` and `onBeforeUnmount` instead of returning functions for the component to call.
- A cached measurement: what invalidates it when slots, children or content change?
- A lookup added to shared code such as Combinator can create a reactive dependency for every component using it.
- Props passed to `querySelector` or `closest`: catch an invalid selector and fall back.
- State copied from the document root (mode, contrast) goes stale. Use the directive or observe the root.
- Paged, truncated or ranked output: correct on page 2? Does each flag mean one thing? Are errors reported, not swallowed?

## 4. Write less

- Delete handlers, constants, rules and overrides nothing uses after the change. Merge near-identical helpers. Share one core between two paths.
- Docs say each thing once. Cut an intro the excerpt already gives. Short, specific descriptions.

## 5. Already exists, or matches a sibling

For each new function, composable, directive, constant map (`*_SIZES`, `*_ICON_SIZES`), component, Less block or story wrapper: write one line on what it does, then search by name (`rg`) and by meaning (the Dialtone CLI or MCP `search` tools, or a semantic search tool) in:

- `packages/dialtone-vue/common/utils/index.js`, `common/composables`, `directives/` (`mode`, `focusgroup`, `focustrap`, `tooltip`), `components/*/…Constants.js`;
- `packages/dialtone-css/lib/build/less` and tokens (`--dt-layout-*`, `--dt-size-*`, `--dt-spacing-*`);
- `common/components_list.js`: is the new component too close to an existing one?
- new utility classes: identical or near-identical CSS output to an existing utility; new tokens: duplicate or conflicting names.

Examples of misses reviewers caught: `v-dt-mode` instead of hand-syncing `data-dt-contrast`; DtInput's IME handling; extending TipTapLink instead of a new ProseMirror plugin; `DtDropdown` for menu composition; `returnFirstEl` and `hasSlotContent`; query-core for search logic.

Also ask: does the closest sibling solve this differently (icon size by component size: Button, then Badge, then Chip; Avatar owns its radius)? Is the same workaround now in more than one stylesheet, so it needs one layout hook or a shared fix? Is the logic in the right package, with no circular imports? A match is a prompt for a reason, not a blocker.

## 6. API shape (new or redesigned components)

- Two props that only make sense together can be one (`showTicks` plus `tickInterval`, `inverted` plus `fillOrigin`).
- Size scales are numeric (100 to 700), not t-shirt sizes. New names are logical (`start`, `end`, `blockStart`), see `.agents/resources/rules/logical-naming.md`.
- Every documented `@values` entry passes validation and defaults are valid values.
- Labels accept the types consumers pass (string or number).
- Is a new prop needed, or can the consumer handle an event?

## 7. Dead code and dependants

Updated where relevant: constants elsewhere (for example `CHIP_SIZES` in ComboboxMultiSelect), Combinator variants for new props and slots, the codemod, docs and `_data/*.json` class lists, stories still showing a removed value. A new token produces every platform output and has a docs page. Note effects on external consumers (Firespotter, web clients) when a public API changes.

## Not for a bot

Scope calls need a person: merge now with a follow-up, or fix first; fixed versus configurable; whether to split. Raise the question, do not decide it.
