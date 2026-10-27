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

## Required Context

- Existing component source, constants, tests, stories, MDX, VuePress docs, and exports.
- Matching Combinator variant file under `packages/combinator/src/variants/` when props, slots, values, or visual states change.
- `common/components_list.js` for component registration.
- `.agents/resources/rule-map.md`
- `.agents/resources/validation.md`
- `.agents/resources/doc-sync.md`

## Constraints

- New components use Composition API with `<script setup lang="ts">`.
- Existing Options API components stay Options API unless the user explicitly asks to convert them.
- Prop value arrays come from constants.
- Use `validator`, never `validate`.
- Prefer `data-qa` selectors in tests.
- Use Dialtone tokens and utility classes; do not hardcode raw color, spacing, or typography values.
- Keep `packages/combinator/src/variants/variants_<component>.js` in sync with component API changes.
- Keep changes scoped to the requested component or API.

## Workflow

1. Read the existing component surface before editing.
2. Check for overlap or naming collisions before new components.
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
- Combinator variant impact is checked and updated when props, slots, values, or visual defaults changed.
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
