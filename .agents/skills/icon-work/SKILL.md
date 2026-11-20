---
name: icon-work
description: Add or update an icon in `@dialpad/dialtone-icons`. Use when the user asks to add an icon, update an icon's SVG, or change icon keywords.
---

# Dialtone Icon Work

## Goal

Add or update one icon from its Figma source, with the keywords, build output and docs in step.

## Trigger

- Adding or updating files under `packages/dialtone-icons/src/svg/icons/**`.
- Changing `packages/dialtone-icons/src/keywords-icons.json`.

## Before You Build

1. Does it already exist? Look it up with the Dialtone MCP server or the `dialtone` CLI (see `.agents/resources/dialtone-lookup.md`). If a close icon exists, ask whether to update it instead.
2. Get the Figma source from the user. Do not redraw, trace or guess an SVG.
3. Write only the SVG and its keyword entry. Everything else is generated.

## Required Context

- `.agents/resources/validation.md`
- `.agents/resources/rules/icons.md`
- `packages/dialtone-icons/.github/CONTRIBUTING.md`: the SVG preparation steps, not repeated here.

## Constraints

Four checks reviewers keep raising that the bots miss:

1. The SVG comes from the Figma icon library, exported from the 12px (size 100) component, and is centred in its viewBox. An off-centre `x` was caught in review, and the reviewer supplied the Figma source.
2. Strokes are outlined in the SVG, so there are no live strokes. This was caught in review as well.
3. Keywords are singular and split into single words (`notification`, not `notifications` or `notification-bell`).
4. The file name and category match the library: kebab-case name, in the category folder Figma uses.

Also:

- Standard icons follow the preparation steps in CONTRIBUTING, including the `brand-full-color` exception. Near-black hex fills are not converted to `currentColor`, so normalize them.
- Never hand-edit generated files (`src/icons/`, `dist/`, platform output).
- Keep changes to the one icon.

## Workflow

1. Run Before You Build.
2. Check the SVG against the four checks and the CONTRIBUTING preparation steps.
3. Add or replace `src/svg/icons/<category>/<name>.svg`. Categories are the folders under `src/svg/icons/`.
4. For a new icon, add `categories.<category>.<name>` to `src/keywords-icons.json`, sorted with its neighbours. Propose keywords and let the user confirm them.
5. Run `pnpm nx run dialtone-icons:build`. The build rewrites tracked `keywords-*.json` files when a source SVG has no entry, so check `git status` afterwards and keep only the intended changes.
6. Check `dist/svg/icons/<name>.svg` has `currentColor` (standard icons) or the kept gradients (full-colour), and spot-check `src/icons/<name>.vue`.
7. For an update, compare the old and new dist SVG to confirm only the intended change.
8. Ask the user to check rendering on the docs icon page (`/design/icons/`).

## Done When

- The four checks pass and the SVG is the Figma source.
- Keywords are present for a new icon.
- The build ran and only intended files changed.
- The user has the docs page to check rendering.

## Verification

- `pnpm nx run dialtone-icons:build`, then `git status --porcelain`.
- Commands from `.agents/resources/validation.md`.

## References

- `.agents/resources/validation.md`
- `.agents/resources/rules/icons.md`
- `.agents/resources/dialtone-lookup.md`
- `.agents/skills/pr-prep/references/specialists/icons.md`: the reviewer lens for an icon diff.
