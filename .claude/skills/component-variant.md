---
description: "Combinator variant authoring task. Use '/component-variant <component>' when adding or updating a Dialtone Vue component variant file."
---

# Component Variant Skill

## Goal

Create or update the Combinator variant file that represents a Dialtone Vue component in the playground, docs component examples, and component-wall thumbnail flow.

## Trigger

- A Dialtone Vue component prop, slot, supported value, or visual default changes.
- A component needs a Combinator preset, or an unsupported component is becoming
  viable.
- A component-wall thumbnail renders poorly from the current default variant.

## Required context

- Component source and constants under `packages/dialtone-vue/components/**`.
- Generated component docs behavior from `scripts/build-dialtone-vue-docs.mjs`.
- Existing variant file under `packages/combinator/src/variants/`.
- `packages/combinator/src/variants/variants.js`.
- `packages/combinator/src/unsupported_components.json`.
- `.claude/rules/combinator-variants.md`.

## Constraints

- Do not invent props or slots that are absent from docgen output.
- Keep token-numbered values as strings.
- Use exclusions for invalid combinations only.
- Let prop dependencies handle parent-off child-disabled cases when JSDoc can express the dependency.
- Keep presets focused on common states.

## Workflow

1. Read the component source, constants, stories, docs, and existing variant file.
2. Confirm the member names that docgen exposes.
3. Update or create `variants_<component>.js`.
4. Register new files in `variants.js`.
5. Remove or add an `unsupported_components.json` entry if support status
   changes.
6. Add defaults, presets, token categories, and exclusions from verified source behavior.
7. Check whether the `default` preset is a good thumbnail input.
8. Run focused Combinator tests when rule behavior changed.

## Done when

- The variant file matches current component API.
- New variant files are registered.
- Unsupported status is accurate and includes a short reason when present.
- Invalid combinations are disabled, hidden, cleared, or value-disabled.
- The default preset is useful for the component-wall thumbnail or an override is planned.

## Verification

- `pnpm --dir packages/combinator test` for broad variant or rule changes.
- Focused `vitest` commands for `src/lib/exclusion_rules.test.js`, `src/lib/prop_dependencies.test.js`, or option-bar tests when relevant.
- `pnpm nx run dialtone-documentation:thumbs:preview` when judging thumbnail output.

## References

- `.claude/rules/combinator-variants.md`
- `packages/combinator/.github/documentation/internal/EXCLUSIONS.md`
- `apps/dialtone-documentation/thumbs/README.md`
