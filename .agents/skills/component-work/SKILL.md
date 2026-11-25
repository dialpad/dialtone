---
name: component-work
description: Create or update Dialtone Vue components and keep package/docs artifacts synchronized. Use when the user asks for component creation, component API changes, stories, docs, or related tests.
---

# Dialtone Component Work

## Goal

Modify Vue components while keeping tests, stories, docs, exports, and downstream data intentionally in sync.

## Trigger

- Creating or updating files under `packages/dialtone-vue/components/**`.
- Component prop, event, slot, style, story, or docs changes.

## Before You Build

1. Does it already exist? Look it up with the Dialtone MCP server or the `dialtone` CLI (see `.agents/resources/dialtone-lookup.md`), then grep `packages/dialtone-vue/components/` and `common/components_list.js` for the same or a similar name. If something close exists, ask whether to extend it.
2. Find the closest sibling component. Read how it handles sizes, icon sizes, slots and naming, and match it.
3. For a new public API, share a sketch first (props, slots, events, one story) and get agreement before building.

API shape, learned from review:

- Paired props that only make sense together are one prop. Slider combined `showTicks` and `tickInterval`, as `inverted` and `fillOrigin` were before it.
- Keep the old visual as an option instead of replacing it, and keep inherited defaults. The old spinner stayed as an option and kept its inherited colour default.
- Removing an allowed value is a breaking change: keep it working (deprecated, still passing the validator), or add a `BREAKING CHANGE:` footer.
- Changing a default is a breaking change too: keep the old default, or add a `BREAKING CHANGE:` footer.

## Required Context

- Existing component source, constants, tests, stories, MDX, VuePress docs, and exports.
- Matching Combinator variant file under `packages/combinator/src/variants/` when props, slots, values, or visual states change.
- `common/components_list.js` for component registration, and the root export in `packages/dialtone-vue/index.js`.
- `.agents/resources/rule-map.md`
- `.agents/resources/validation.md`
- `.agents/resources/doc-sync.md`
- `.agents/resources/rules/vue-components.md`

## Constraints

- New components use Composition API with `<script setup lang="ts">`.
- Existing Options API components stay Options API unless the user explicitly asks to convert them.
- Prop value arrays come from constants.
- Use `validator`, never `validate`.
- Prefer `data-qa` selectors in tests.
- Use Dialtone tokens and utility classes; do not hardcode raw color, spacing, or typography values. Custom styles go in `packages/dialtone-css/` with `var(--dt-*)`.
- ARIA only where the role allows it, and the WAI-ARIA keyboard pattern for each interactive widget: `.agents/skills/pr-prep/references/specialists/keyboard-aria.md`.
- One-class CSS specificity and layout tokens: `.agents/skills/pr-prep/references/specialists/css.md`.
- Keep `packages/combinator/src/variants/variants_<component>.js` in sync with component API changes; follow [variant authoring](references/variants.md).
- Keep changes scoped to the requested component or API.

## Workflow

1. Read the existing component surface before editing.
2. Run the Before You Build steps for a new component or public API.
3. Load matched rules from `rule-map.md`.
4. Update the smallest necessary set of artifacts: source, constants, tests, stories/MDX, VuePress docs, exports, docs JSON, MCP/query docs, and Combinator variants.
5. For a public page, preserve its canonical export and live `<component-vue-api>` association. Add useful missing alternate names or interaction phrases in frontmatter `keywords`, following `.agents/resources/rules/documentation-site.md`; do not add export aliases, synonym-filled descriptions, or API inventories to skills.
6. Run focused tests first, then broader builds when API or downstream data changed.
   For marked documentation examples, follow [source-example maintenance](../../resources/documentation-examples.md), regenerate coverage and recheck affected payload/API evidence.
7. For a meaningful new keyword, rebuild both adapters, record an alternate-term lookup and arrange adapter publication as `.agents/resources/rules/documentation-site.md` describes.
8. Include manual accessibility/keyboard QA notes for interactive components.

## Done When

- Changed component behavior has tests or an explicit test-gap reason.
- Documentation and downstream data impact is checked.
- Combinator variant impact is checked and updated when props, slots, values, or visual defaults changed; see [variant authoring](references/variants.md).
- Relevant validation commands are run or explicitly skipped.
- New or changed public API is reflected in stories/docs where needed.
- Public page associations remain valid for new, renamed, split, or removed components; keywords never imply installed compatibility or introduce components absent from the selected data.

## Verification

- Focused component tests.
- Commands from `.agents/resources/validation.md`.
- `doc-sync-check` when source changes affect AI docs.

## References

- `.agents/resources/rule-map.md`
- `.agents/resources/validation.md`
- `.agents/resources/doc-sync.md`
- `.agents/resources/package-map.md`
- `.agents/resources/rules/combinator-variants.md`
- [Variant authoring](references/variants.md): create or update `packages/combinator/src/variants/variants_<component>.js`.
- `.agents/resources/rules/vue-components.md`: API conventions, file layout, constants, docs artifacts.
- `.agents/skills/pr-prep/references/specialists/keyboard-aria.md` and `.agents/skills/pr-prep/references/specialists/css.md`
