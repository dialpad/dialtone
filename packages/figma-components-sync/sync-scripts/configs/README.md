# Component configs

One file per component, default-exporting its config. Discovered automatically by
`component-axes.mjs`, so parallel agents never edit a shared file.

Required: `component` (the Dt* name), `label`, `page`, `axes`, `invalid`, `variantName`, `props`.
Optional: `pseudo`, `stateTarget`, `slots`, `slotPass`, `slotInvalid`, `rootClass`, `figmaSetId`.

See the five built-in configs at the top of `component-axes.mjs` for worked examples —
in particular how axes come from the prop API, how `invalid` encodes reachability, and
how `stateTarget` names the element a pseudo-state actually lands on.
