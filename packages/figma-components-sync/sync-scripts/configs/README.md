# Component configs

One file per component, default-exporting its config. Discovered automatically by
`component-axes.mjs`, so parallel agents never edit a shared file.

Required: `component` (the Dt* name), `label`, `page`, `axes`, `variantName`, `props`.
`page` names the set (`DtButtonLink`); `family` is the Figma page it lives on, shared with the related
sets ("Buttons", "Text fields", "Selection controls", "Menus & pickers", "Navigation", "Feedback",
"Overlays", "Identity & status", "Content", "Layout"). The Assets panel lists a library by page, so a
page per set put an extra click between the panel and every component. A config with no `family`
keeps a page of its own, named by `page`. A build replaces only its own set on the page, stacks the
page's sets by name, and removes the same set from an older one-set page, deleting that page once it is empty.
Optional: `invalid` (combos that cannot exist; leave it out when every combination is reachable), `pseudo`, `stateTarget`, `slots`, `slotPass`, `slotInvalid`, `slotContent`,
`slotDefaults`, `nativeSlots`, `textProps`, `textStyles`, `snapTokens`, `noSnap`, `flexLayout`, `blockLayout`,
`edgeSlots`, `rootClass`, `containerClass`, `effectiveDefaults`.
`effectiveDefaults: { axis: value }` names the rendered default of an axis that is not its prop
default (`open: true` for a collapsible whose `open` prop is `null`; `showAction: false` where the
flag is true but no slot content is supplied), read by `default-variant.mjs`. Set ids are not part of a config: `run-batch` records them in
`build-data/<target>/set-ids.json` and `component-axes.mjs` overlays them onto the config when it
loads, so do not add or edit `figmaSetId` or `figmaMergedSetId` in a config file. `nativeSlots` names slots that become Figma
`SLOT` nodes (see the Slots section of `../README.md`). `textProps` maps a text the harness
injected (`{ 'Notice title': 'Title' }`) to the TEXT property it becomes, besides the label.
`noSnap: ['minHeight']` lists fields a snapping config leaves exact, for a value that is not near any
token on that field's scale (a textarea's 40px minimum would otherwise become 48). It is passed to the
builder in the payload and read by the verifier, so both agree.
`snapTokens: true` builds the spacing, corners and minimum sizes the CSS COMPUTES at the nearest
Dialtone token and binds them (an 8px token that yields 7px is the 8px token); a circle is bound to
the pill token. See "What gets bound" in `../README.md`.
`blockLayout: true` builds a `display: block` frame that only stacks its children (one left edge,
each following the last with no gap or overlap) as a VERTICAL auto-layout instead of coordinates, as
the browser's block flow is a column. Its children fill the width where the parent has a width of its
own. Anything else (side by side, overlapping, spaced by margins) keeps coordinates; a grid that
stacks children in one cell (DtLoader's rings) is deliberately not auto-layout. Used by Banner and
Collapsible, whose outer frames were not auto-layout before.
`textStyles: false` keeps a component's text raw instead of applying the Dialtone library's text
styles (ButtonLink: its underline axis conflicts with a shared Label property, see the README).
`flexLayout: true` opts a component into four layout behaviours the builder otherwise leaves
out, so every other set stays as built: a flex child with `flex-grow` fills a row that has a fixed
width, `align-self: center` is built as a stretched frame with centred content (the verifier checks
the midpoint, not the height), a root with a finite `max-inline-size` hugs up to it, and the
children of a row with `align-items: stretch` fill its height (the payload's `st` on the row, `ns`
on a child that opts out with its own `align-self`). That last one is what keeps DtSplitButton's
end half as tall as its start half once the start half's padding snaps to a token; the verifier's
`stretchedHeight` check compares the siblings with each other, since each still matches the browser. Text-only
block frames hug their width and keep the measured height, so retyped text grows the component but
does not wrap: Figma has no equivalent of the CSS `text-box-trim`, and a hugging height would make
the component taller than Dialtone. Used by Notice, Banner, Input, InputTextarea and SplitButton.
`edgeSlots: { gap }` builds a Leading and a Trailing native slot that sit flush with the border, as
Button's `leading` / `trailing` do through negative margins Figma cannot hold. The root loses its
padding; a `content` wrapper carries the vertical padding, the gap and the existing children, and
each slot is empty but as wide as the padding minus the gap (its minimum width), with its content
centred on the height. Dropped-in content is flush at the edge with the code's gap after it, and
nothing has to be deleted. `gap` is the slot's own margin on the content side (2px, `spacing-25`).
The same flag holds a negative inline margin as an overhang: the frame is the box the layout sees
and its one child hangs over the outer edge (Button's icons, `-2px`), so the icon states match the
code. The checks fold the built shape back into the DOM's flat one (`edge-slots.mjs`) and check the
structure separately. Used by DtButton.
`containerClass` (a string or a function of the combo) is the surface the component is mounted on,
outside the measured tree, for variants that only make sense on one (links for dark backgrounds).

See the built-in Button config at the top of `component-axes.mjs` and the configs in this
directory for worked examples —
in particular how axes come from the prop API, how `invalid` encodes reachability, and
how `stateTarget` names the element a pseudo-state actually lands on.
