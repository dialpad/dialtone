---
name: style-work
description: Add or change Dialtone CSS utility classes (d-*, generated or Less) and design tokens (--dt-* variables). Use when the user asks for a new utility, a new or changed token, or a check that a style value already exists.
---

# Dialtone Style Work

## Goal

Add as little CSS as possible. Reuse an existing class or token first; build a new one only when the search finds nothing close.

## Trigger

- Editing `packages/dialtone-css/lib/build/less/**`, `packages/dialtone-css/postcss/constants.cjs` or `dialtone-generators.cjs`.
- Editing `packages/dialtone-tokens/tokens/**`.
- A component needs a size, space, color or radius value and no class or token is named yet.

## Required Context

- `.agents/resources/dialtone-lookup.md`
- `.agents/resources/rules/css-utilities.md`
- `.agents/resources/rules/design-tokens.md`
- `.agents/resources/rules/logical-naming.md`
- `.agents/resources/validation.md`

## Constraints

- Search first; do not add a second class or token with the same output.
- A CSS value that a design token covers (color, spacing, size, radius, shadow, type) is a `var(--dt-*)` token, never a raw value; CSS keywords such as `flex` or `none` stay as they are. Prefer a semantic token; a base reference is valid when it is the true source (a specific palette stop). In token JSON, base tokens hold literal values (colors in `oklch()`) and other tokens reference source keys (`{color.black.900}`).
- A value that sets a component's height or size uses `--dt-layout-*` (or `--dt-size-*`), with `calc()` where there is no exact stop. Spacing tokens are for gaps and padding. Review lesson: a badge used `--dt-spacing-*` for line-height, and the maintainer asked for `--dt-layout-*` because line-height sets the overall height.
- Keep the change scoped to the requested class or token.
- Code is the source of truth for tokens. `pnpm sync:variables` in `packages/dialtone-tokens` pushes them to Figma and is a separate step the user asks for.

## Workflow

### 1. Does It Already Exist?

1. Dialtone MCP `search_utility_classes` and `search_tokens`, or the `dialtone` CLI (see `dialtone-lookup.md`).
2. The generated-class stops in `packages/dialtone-css/postcss/constants.cjs`, the Less sources in `packages/dialtone-css/lib/build/less/`, and the token sources in `packages/dialtone-tokens/tokens/`.
3. A component prop that already covers the concern (DtBox covers surface, spacing, sizing and positioning).

If the MCP and CLI are unavailable, grep `constants.cjs`, the Less and the token JSON instead, and say in the result which search ran. If something close exists, use it or ask whether to extend it.

Prefer a semantic token over a base one.

### 2. Naming

- Logical names: `logical-naming.md`.
- Match the numeric scale the neighbors use: read two or three siblings, for classes in `constants.cjs`, for tokens in the same JSON file (`spacing.400`, `--dt-spacing-400`). Do not add a new scale step when one is near.

### 3. Build It

Utilities (`css-utilities.md`). Most are generated, not written in Less. Token-stop padding, margin, gap, sizing, position, color, border and grid classes come from `constants.cjs` (for example `SPACING_STOPS`, `PADDING_SIZES_SPACING`) through `dialtone-generators.cjs`; `d-p-100` is in no Less file.

- A new scale class means adding the stop to `constants.cjs`. Each generated stop reads a token, and without it the class has no value: a `SPACING_STOPS` stop needs `spacing.<stop>` and `spacing.<stop>-negative`, a `LAYOUT_STOPS` stop needs `layout.<stop>`, and a `RADIUS_STOPS` stop needs `size.radius.<stop>`, all in `tokens/base/default.json`. For any other scale, grep `dialtone-generators.cjs` for the `var(--dt-*)` it emits and add that token. Write hand-made Less only for a one-off class, in the existing file for that CSS property.
- Color utilities are generated as OKLCH relative colors; read `dialtone-generators.cjs` before debugging their output.
- Responsive variants (`sm:`, `md:`, `lg:`, `xl:`) come from `postcss-responsive-variations`. Add one only for a clear use case.
- Specificity: `.agents/skills/pr-prep/references/specialists/css.md`.

Tokens (`design-tokens.md`):

- Base values go in `tokens/base/` (`default.json`, with palettes in `material/` and `refs/`; `spacing.base` is in `tokens/root.json`). Semantic tokens live in `tokens/theme/dp/` (`default`, `dark`, `high-contrast`, `high-contrast-dark`); the other folders under `tokens/theme/` are further themes. Component tokens go in `tokens/components/<component>/`.
- A new semantic token goes in `tokens/theme/dp/default.json`, then check dark mode and high contrast: add the `dp/dark.json` override and the high-contrast pair wherever the value differs. The other theme folders are small brand overrides layered on dp: touch one only when that brand needs a different value. `.coderabbit.yaml` asks for "all 8 themes"; in the files, that means the dp set plus any brand override.
- Dark values: palette and shadow tokens go in `tokens/base/dark.json` (it only holds `color` and `shadow`); semantic tokens go in `tokens/theme/<theme>/dark.json`.
- References use the source keys: `{color.black.900}`, `{size.400}`, `{spacing.base}`. No circular or missing references.
- Leave `tokens/$metadata.json` build order alone unless you have read the dependency chain.

### 4. Checks

Take the commands from `validation.md`, and read its Writes section first. Builds write only git-ignored output unless noted below.

- Utilities: `pnpm nx run dialtone-css:build` (writes `themes`, because it depends on `dialtone-tokens:build`, which runs `git clean -fx themes/`). The built CSS contains the class.
- Tokens: `pnpm nx run dialtone-tokens:build` (also writes `themes`). `dist/css/tokens-dp-light.css` contains the token, and `tokens-dp-dark.css` (or `[data-dt-mode="dark"]` in the layered build) has the dark value where you added one.
- Mobile outputs, all git-ignored: grep for the token in `packages/dialtone-tokens/dist/android/res/values/`, `dist/android/java/` and `dist/ios/tokens-*.swift`. `dist_ios/Sources` is written only by `pnpm nx run dialtone-tokens:build:ios`.
- Docs JSON: `dialtone-css:build` writes `packages/dialtone-css/lib/dist/dialtone-docs.json` (utilities) and `tokens-docs.json` (the token data MCP and CLI read). `dialtone-tokens:build` alone does not refresh `tokens-docs.json`. `packages/dialtone-tokens/dist/doc.json` is the tokens package's own docs.
- Lookup: `dialtone-query-core` bundles those JSON files at build time and the MCP server bundles query-core. Build with `pnpm nx run-many -t build -p dialtone-cli dialtone-mcp-server`, which also writes `themes` and `keywords` (tracked `packages/dialtone-icons/src/keywords-*.json`; check `git status`). Restart the session, then `search_utility_classes` or `search_tokens` finds the name. The rebuilt `dialtone` CLI needs no restart; check its reported source, since it can read installed data instead of the fresh build.

## Done When

- The search step found nothing close, or the reuse is recorded.
- The new class or token is in the build output, `tokens-docs.json` or `dialtone-docs.json`, and the CLI or MCP lookup. When neither lookup is available, the build output and a grep of the docs JSON count, and the result says the lookup did not run.
- A token has a dark value where it differs and shows up in the Android and iOS outputs.

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
