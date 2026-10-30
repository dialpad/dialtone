# Component configs

One file per component, default-exporting its config. Discovered automatically by
`component-axes.mjs`, so parallel agents never edit a shared file.

Required: `component` (the Dt* name), `label`, `page`, `axes`, `invalid`, `variantName`, `props`.
Optional: `pseudo`, `stateTarget`, `slots`, `slotPass`, `slotInvalid`, `slotContent`,
`slotDefaults`, `nativeSlots`, `textProps`, `flexLayout`, `rootClass`, `containerClass`,
`figmaSetId`, `figmaMergedSetId`. `figmaSetId` is
written by `run-batch` after a build, not by hand. `nativeSlots` names slots that become Figma
`SLOT` nodes (see the Slots section of `../README.md`). `textProps` maps a text the harness
injected (`{ 'Notice title': 'Title' }`) to the TEXT property it becomes, besides the label.
`flexLayout: true` opts a component into three layout behaviours the builder otherwise leaves
out, so every other set stays as built: a flex child with `flex-grow` fills a row that has a fixed
width, `align-self: center` is built as a stretched frame with centred content (the verifier checks
the midpoint, not the height), and a root with a finite `max-inline-size` hugs up to it. Text-only
block frames hug their width and keep the measured height, so retyped text grows the component but
does not wrap: Figma has no equivalent of the CSS `text-box-trim`, and a hugging height would make
the component taller than Dialtone. Used by Notice and Banner.
`containerClass` (a string or a function of the combo) is the surface the component is mounted on,
outside the measured tree, for variants that only make sense on one (links for dark backgrounds).

See the built-in Button config at the top of `component-axes.mjs` and the configs in this
directory for worked examples —
in particular how axes come from the prop API, how `invalid` encodes reachability, and
how `stateTarget` names the element a pseudo-state actually lands on.
