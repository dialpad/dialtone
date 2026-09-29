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
