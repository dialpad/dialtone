---
name: style-work
description: Add or change Dialtone CSS utility classes (d-* in Less) and design tokens (--dt-* variables). Use when the user asks for a new utility, a new or changed token, or a check that a style value already exists.
---

# Dialtone Style Work

## Goal

Add as little CSS as possible. Reuse an existing class or token first; build a new one only when the search finds nothing close.

## Trigger

- Editing `packages/dialtone-css/lib/build/less/**` utilities or variables.
- Editing `packages/dialtone-tokens/tokens/**`.
- A component needs a size, space, colour or radius value and no class or token is named yet.

## Required Context

- `.agents/resources/dialtone-lookup.md`
- `.agents/resources/rules/css-utilities.md`
- `.agents/resources/rules/design-tokens.md`
- `.agents/resources/rules/logical-naming.md`
- `.agents/resources/validation.md`

## Constraints

- Search first; do not add a second class or token with the same output.
- Values are `var(--dt-*)` tokens, never raw values. Prefer a semantic token over a base one.
- Keep the change scoped to the requested class or token.
- Code is the source of truth for tokens. `pnpm sync:variables` in `packages/dialtone-tokens` pushes them to Figma and is a separate step the user asks for.

## Workflow

### 1. Does It Already Exist?

1. Dialtone MCP `search_utility_classes` and `search_tokens`, or the `dialtone` CLI (see `dialtone-lookup.md`).
2. The Less sources in `packages/dialtone-css/lib/build/less/` and the token sources in `packages/dialtone-tokens/tokens/`.
3. A component prop that already covers the concern. DtBox covers surface, spacing, sizing, positioning, logical insets and z-index; keep utilities for non-DtBox elements, responsive variants, calc coordinates, resets and local escape hatches.

If something close exists, use it or ask whether to extend it.

Prefer a semantic token over a base one. Review caught a component with literal heights where `--dt-layout-*` tokens and `calc()` already existed. Component tokens reference semantic tokens, never the base palette.

### 2. Naming

- Logical names: `logical-naming.md`.
- Use the numeric scale the neighbouring classes and tokens use (`d-p-100`, `dtSpace400`). Read two or three siblings in the same file and match them. Do not add a new scale step when one is near.

### 3. Build It

Utilities (`css-utilities.md`):

- Add to the Less file that already groups that CSS property: `layout`, `spacing`, `flex`, `grid`, `sizing`, `typography`, `colors`, `backgrounds`, `borders`, `effects`, `interactivity`. A new file also needs the build pipeline updated; avoid it.
- Colour utilities are generated as OKLCH relative colours; read `packages/dialtone-css/postcss/dialtone-generators.cjs` before debugging their output.
- Responsive variants (`sm:`, `md:`, `lg:`, `xl:`) come from `postcss-responsive-variations`. Add one only for a clear use case.
- Keep selectors flat. Specificity: `.agents/skills/pr-prep/references/specialists/css.md`.

Tokens (`design-tokens.md`):

- Global colour, space, font and shadow values go in `tokens/base/default.json`, with the dark values in `tokens/base/dark.json` in the same change. Component tokens go in `tokens/components/<component>/`; brand themes in `tokens/theme/<brand>/`.
- Reference other tokens with `{dtColor.neutral.900}`. No circular or missing references.
- Leave `tokens/$metadata.json` build order alone unless you have read the dependency chain.

### 4. Checks

Take the commands from `validation.md`, and read its Writes section first: `dialtone-tokens:build` runs `git clean -fx themes/`, and `dialtone-css:build` depends on it. Both builds write `themes` and build output.

- Build: `pnpm nx run dialtone-css:build` for utilities, `pnpm nx run dialtone-tokens:build` for tokens.
- The built CSS contains the new class or token. For tokens, also the `[data-dt-mode="dark"]` values.
- Token changes also reach the Android and iOS outputs from the same build; check those files changed as expected.
- The docs JSON has the entry: `packages/dialtone-css/lib/dist/dialtone-docs.json` and `tokens-docs.json` for CSS, `packages/dialtone-tokens/dist/doc.json` for tokens.
- After `pnpm nx run dialtone-query-core:build`, `search_utility_classes` or `search_tokens` finds the new name.

## Done When

- The search step found nothing close, or the reuse is recorded.
- The new class or token is in the build output, the docs JSON and the MCP lookup.
- A token also has dark mode values and builds for Android and iOS.

## Verification

- Commands from `validation.md` for the changed path.
- Focused lint and tests listed there for `packages/dialtone-css/**` or `packages/dialtone-tokens/**`.

## References

- `.agents/resources/rules/css-utilities.md`
- `.agents/resources/rules/design-tokens.md`
- `.agents/resources/rules/logical-naming.md`
- `.agents/resources/dialtone-lookup.md`
- `.agents/resources/validation.md`
- `.agents/skills/pr-prep/references/specialists/css.md`
