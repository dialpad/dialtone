# Component configs

One file per component, default-exporting its config. Discovered automatically by
`component-axes.mjs`, so parallel agents never edit a shared file.

Required: `component` (the Dt* name), `label`, `page`, `axes`, `invalid`, `variantName`, `props`.
Optional: `pseudo`, `stateTarget`, `slots`, `slotPass`, `slotInvalid`, `slotContent`,
`slotDefaults`, `nativeSlots`, `rootClass`, `figmaSetId`, `figmaMergedSetId`. `figmaSetId` is
written by `run-batch` after a build, not by hand. `nativeSlots` names slots that become Figma
`SLOT` nodes (see the Slots section of `../README.md`).

See the built-in Button config at the top of `component-axes.mjs` and the configs in this
directory for worked examples —
in particular how axes come from the prop API, how `invalid` encodes reachability, and
how `stateTarget` names the element a pseudo-state actually lands on.
