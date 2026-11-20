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
2. For a new or changed SVG, get the Figma source from the user. Do not redraw, trace or guess an SVG. A keyword-only change needs no Figma source: edit the entry in `keywords-icons.json`, apply check 4, and run Workflow steps 5 and 8.
3. Write only the SVG and its keyword entry. Everything else is generated.

## Required Context

- `.agents/resources/validation.md`
- `.agents/resources/rules/icons.md`
- `packages/dialtone-icons/.github/CONTRIBUTING.md`: the SVG preparation steps, not repeated here.

## Constraints

Four checks reviewers keep raising that the bots miss:

1. The SVG is a fresh export from the Figma icon library's 12px (size 100) component (`brand-full-color` icons may be 24px), and the glyph is centred in its viewBox: equal margins left and right, and top and bottom. Review caught an x-shaped glyph that sat off-centre. If it is off, ask for a new Figma export; do not nudge coordinates by hand.
2. Strokes, standard icons only: no `stroke`, `stroke-width` or `stroke-linecap` attributes on any element. Outline strokes in Figma first. The build only turns `fill` into `currentColor`, so a stroke keeps its hardcoded colour and ignores the text colour. `brand-full-color` icons are exempt: they keep their strokes, colours and gradients as exported.
3. Name: the icon name (file name and keyword key) is the library's singular name unless the object itself is plural (`variable`, not `variables`; `scissors` and `headphones` stay plural). It also matches the prefixes of sibling icons in its category (`mail-*`, `message-*`): review renamed an `email-` icon to `mail-`.
4. Keywords: the search terms people type. Do not repeat words already in the name or the category.

Also:

- Standard icons follow the preparation steps in CONTRIBUTING; their near-black hex fills are not converted to `currentColor`, so normalize them. `brand-full-color` icons skip that cleanup.
- Never hand-edit generated files (`packages/dialtone-icons/src/icons/`, `packages/dialtone-icons/dist/`, platform output).
- Keep changes to the one icon.

## Workflow

1. Run Before You Build.
2. Check the SVG against the four checks; for a standard icon, also the CONTRIBUTING preparation steps.
3. Add or replace `packages/dialtone-icons/src/svg/icons/<category>/<name>.svg`. Categories are the folders under `packages/dialtone-icons/src/svg/icons/`.
4. For a new icon, add `categories.<category>.<name>` to `packages/dialtone-icons/src/keywords-icons.json`, sorted with its neighbours. Propose keywords and let the user confirm them.
5. Run `pnpm nx run dialtone-icons:build`. It rebuilds both keyword files from the SVG list: an SVG with no entry gets `[]`, an entry with no SVG is dropped, and keywords are looked up by folder name, so the category key must equal the folder name. A category folder with no key in the JSON crashes the build. Confirm the new entry still has its keywords.
6. Check `packages/dialtone-icons/dist/svg/icons/<name>.svg` has `currentColor` (standard icons) or the kept gradients (full-colour), and spot-check `packages/dialtone-icons/src/icons/<name>.vue`. The build deletes `dist` first and it is gitignored, so it cannot be diffed.
7. For an update, run `git diff` on the source SVG to confirm only the intended change.
8. Ask the user to check rendering on the docs icon page (`/design/icons/`).

## Done When

- A new or changed SVG is the Figma source and passes checks 1, 3 and 4, plus check 2 for a standard icon; a keyword-only change passes check 4.
- A new icon has keywords.
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
