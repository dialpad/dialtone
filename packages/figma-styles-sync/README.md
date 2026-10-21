# @dialpad/dialtone-figma-styles-sync

Writes Dialtone text, effect, and paint styles into Figma. Unlike
`dialtone-tokens`' variables sync, which posts to Figma's REST API, styles
have no write endpoint — Figma only exposes `createTextStyle()`,
`createEffectStyle()` and `createPaintStyle()` through the Plugin API, so
this package builds a Figma plugin rather than a script.

Lives separately from `packages/dialtone-tokens/` because it ships a Figma
plugin rather than a script `dialtone-tokens` could just run — a different
build and distribution surface (`manifest.json`, a bundled `code.js`, a UI
panel) that doesn't belong in a tokens package.

Component variant sets are a separate package,
[`@dialpad/dialtone-figma-components-sync`](../figma-components-sync/README.md)
— the measurement and construction pipeline there is heavier (a full
provenance-verified variant build per component) and deserves its own
build/test/release surface rather than sharing this one.

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
(`focus-inset`) is `INNER_SHADOW`, and so is any shadow whose resolved values
match an `-inset` shadow layer-for-layer (`focus`, a whole-object alias of
`focus-inset`); everything else is `DROP_SHADOW`.
Confirmed against the built CSS, not the token data — every layer's own
`type` field says `dropShadow` even for the inset one, since CSS expresses
`inset` as a trailing keyword on the shared `box-shadow` property rather than
a distinct type. The real signal is the compiled `--dt-shadow-focus-inset`
value carrying a trailing ` inset`, tied to the token name, not the layer.

## Paint styles

`src/resolve_paint_styles.ts` resolves Dialtone's 3 gradient tokens
(`color.gradient.magenta-purple`, `color.gradient.gold-red-magenta-purple`,
`color.gradient.orange-red-magenta-purple`) into one `GRADIENT_LINEAR` paint
style each.

A gradient stop binds a variable when its token's RAW value references
another token (`magenta-purple`'s 2 stops both do), and falls back to a
literal `oklch()` colour when it doesn't (every stop of
`gold-red-magenta-purple` and `orange-red-magenta-purple` is a baked literal
with no token behind it). The
resolver reads `raw`, not `resolved` — resolution substitutes a reference
with the referenced token's own literal, discarding exactly what needs
binding. There's no `setBoundVariableForColorStop` helper; the plugin sets
`boundVariables.color` directly on the `ColorStop` object literal, alongside
a literal `color` that Figma uses as the stop's fallback swatch until the
binding resolves.

**`gradientTransform` needs the stop coefficients to shrink, not just rotate.**
Figma's `gradientTransform` maps a point in the shape's own 0-1 space to
gradient space — the inverse of what the matrix's row/column shape suggests.
A pure rotation reproduces CSS's direction exactly but not its extent: CSS's
gradient line on a non-axis-aligned angle is longer than the box's own side
(√2× at 45°/135° on a square), so a stop's coefficients must shrink to
compensate, or every diagonal gradient's stops land too close to the center
(verified at 135°: a 10%/90% stop pair rendered at ~22%/~78% instead).
Confirmed by rendering both sides and reading pixels back before using the
corrected formula on the real gradients.
