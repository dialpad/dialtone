# Component configs

One file per component, default-exporting its config. Discovered automatically by
`component-axes.mjs`, so parallel agents never edit a shared file.

Required: `component` (the Dt* name), `label`, `page`, `axes`, `invalid`, `variantName`, `props`.
Optional: `pseudo`, `stateTarget`, `slots`, `slotPass`, `slotInvalid`, `slotContent`,
`slotDefaults`, `nativeSlots`, `textProps`, `rootClass`, `containerClass`, `figmaSetId`,
`figmaMergedSetId`. `figmaSetId` is
written by `run-batch` after a build, not by hand. `nativeSlots` names slots that become Figma
`SLOT` nodes (see the Slots section of `../README.md`). `textProps` maps a text the harness
injected (`{ 'Notice title': 'Title' }`) to the TEXT property it becomes, besides the label.
`containerClass` (a string or a function of the combo) is the surface the component is mounted on,
outside the measured tree, for variants that only make sense on one (links for dark backgrounds).

See the built-in Button config at the top of `component-axes.mjs` and the configs in this
directory for worked examples —
in particular how axes come from the prop API, how `invalid` encodes reachability, and
how `stateTarget` names the element a pseudo-state actually lands on.
