# Superseded

Kept for reference, not for running. Each was replaced once the browser became the
authority instead of a reimplementation of it.

| File | Replaced by | Why |
| --- | --- | --- |
| `css-provenance.mjs` | `cdp-provenance.mjs` | Reimplemented the CSS cascade. Every bug it had produced a plausible wrong token that no value-comparing verifier could see (H-9). `CSS.getMatchedStylesForNode` is the same engine that paints the pixels. |
| `extract-anatomy.mjs` | `build-spec.mjs` | Resolved tokens by reverse-looking-up values. 1,591 tokens collide on value, so it returned the right colour under a plausibly wrong name. |
| `rebind-button.mjs` | `audit-provenance.mjs` | A one-off Button audit against the old parser, so it could only ever confirm that parser's own answers. |
| `verify-figma-components.mjs` | `verify-components.mjs` | Button-only, root-plus-first-text-node, light-mode only. **Its comment referred to a `forceState()` that was never written**, so it reported 210/560 as complete (B-11). Actively misleading if run. |

## Retired 2026-08-23

- `probe-render.mjs` — rasterised four hardcoded node ids from an early experiment.
  `visual-compare.mjs` does this properly.
- `extract-disabled.mjs` — one-off investigation into Button's computed disabled colours.
  Superseded by the general synthesised-variable path (`dvars` in `encode-build.mjs`), which
  handles every computed colour rather than one component's.
- `combine-variants.js` — combined loose components into a variant set as a separate step.
  `build-plugin.mjs` now calls `combineAsVariants` in `main()` once all shards have landed.
- `serve-build-data.mjs` — served shard payloads to the plugin. `run-batch.mjs` runs its own
  server inline so it can also catch the result POST and continue into verification.
