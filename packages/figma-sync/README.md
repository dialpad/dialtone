# @dialpad/dialtone-figma-sync

Writes Dialtone styles and components into Figma. Unlike `dialtone-tokens`'
variables sync, which posts to Figma's REST API, styles and components have
no write endpoint — Figma only exposes `createTextStyle()`, `createEffectStyle()`
and `createPaintStyle()` through the Plugin API, so this package builds a
Figma plugin rather than a script.

Lives separately from `packages/dialtone-tokens/` because it depends on
`dialtone-vue` (to measure real rendered components), and the dependency
graph runs `dialtone-tokens → dialtone-css → dialtone-vue` — keeping it in
`dialtone-tokens` would create a cycle.

## Structure

| Path | Contents |
| --- | --- |
| `src/` | Resolves Dialtone tokens into the styles the plugin needs to create |
| `plugin/` | The Figma dev plugin (manifest + Plugin API code) |

## Text styles

`src/resolve_text_styles.ts` resolves the 29 typography composites — `text.*`,
`typography.inputs.*`, `typography.button.*` — into one spec per style,
reusing `dialtone-tokens`' own resolver so a value here cannot drift from what
the variables sync already created.

Bind `fontFamily`, `fontSize` and `fontWeight` to their matching variable
(`text/body/md/fontSize`, and so on) — confirmed against the live file that
`setBoundVariable('fontWeight', …)` correctly resolves to the nearest loaded
named style (e.g. binding a `700` variable turns `fontName.style` from
`Regular` into `Bold`), as long as every style used is loaded first.

**`lineHeight` cannot bind.** Confirmed directly: Figma always reads a bound
variable's number as `PIXELS`, but Dialtone's line-heights are unitless
multipliers (`1.6`, not `160` or `1.6px`). Binding one produces a line height
of 1.6 pixels — text collapsed to an unreadable smear. Set it as a literal
`{ unit: 'PERCENT', value: multiplier * 100 }` instead; a token change here
needs a plugin rerun to catch up, same as any other literal.

`textCase` has no corresponding variable in the sync today, so it is always
literal.

## Effect styles

`src/resolve_effect_styles.ts` resolves the 8 shadow composites — `small`,
`medium`, `large`, `extraLarge`, `card`, `focus`, `focus-inset`,
`focus-outset` — grouping each shadow's per-layer field tokens
(`shadow.small.1.blur`, `.color`, `.offsetX`, `.offsetY`, `.spread`) back into
one style per shadow with one Figma `Effect` per layer.

Every field on every layer binds to a real variable — none of these are
literals, unlike a text style's `lineHeight`. That only works because both
light and dark now have the same layer count per shadow, the padding fix from
the variables work — Figma has no per-mode concept for a style, so a shadow
whose light and dark forms genuinely differed in layer count could never be
one correct style; with matching counts, one style with every field bound
renders correctly in both modes for free.

A shadow's name decides its Figma effect `type`: anything ending `-inset`
(only `focus-inset`) is `INNER_SHADOW`; everything else is `DROP_SHADOW`.
Confirmed against the built CSS, not the token data — every layer's own
`type` field says `dropShadow` even for the inset one, since CSS expresses
`inset` as a trailing keyword on the shared `box-shadow` property rather than
a distinct type. The real signal is the compiled `--dt-shadow-focus-inset`
value carrying a trailing ` inset`, tied to the token name, not the layer.
