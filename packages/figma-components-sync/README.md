# @dialpad/dialtone-figma-components-sync

Measures real rendered Dialtone Vue components — via a headless browser and the Chrome
DevTools Protocol, reading the browser's own computed-style cascade as ground truth,
not a reimplementation of it — and builds matching Figma component variant sets through
a dev plugin. Four independent verification passes (values, token identity, slot
correctness, and a raster screenshot diff) check the result, plus a negative-control
pass that perturbs every comparable field to prove the checks themselves actually fire.

Sibling to [`@dialpad/dialtone-figma-styles-sync`](../figma-styles-sync/README.md),
which does the equivalent for text/effect/paint styles — split out because this
pipeline's measurement pass is heavier (a full browser-driven provenance capture per
component, not a token lookup) and warrants its own build/test/release surface.

## Structure

| Path | Contents |
| --- | --- |
| `plugin/` | The Figma dev plugin ("Dialtone Components Sync"): generated `code.js` + `manifest.json`, and a hand-authored `ui.html` |
| `sync-scripts/` | The full pipeline: measurement (`cdp-provenance.mjs`, `build-spec.mjs`), Figma construction (`encode-build.mjs`, `build-plugin.mjs`), verification (`check-all.mjs`, `verify-components.mjs`, `negative-control.mjs`, `visual-compare.mjs`), per-component `configs/`, and the raster-verification harness (`verify-harness/`) |
| `sync-scripts/superseded/` | Retired approaches, kept for reference with their own README explaining what replaced each one and why |

See [`sync-scripts/README.md`](sync-scripts/README.md) for the full pipeline — how a
run works end to end, what each check actually catches, and the failure modes this
project has already hit once.

## Provenance

Ported from a working, uncommitted spike (26 components, 4,569 variants, 51/51 checks
passing as of its last run) that lived only in one branch's working directory and was
never previously tracked in this repo — this package is that same code, given a real
home. The excluded parts: three `audit-*.mjs` scripts the original README flagged as
"look maintained and are not — imported by nothing" (not ported; saved out of the repo
for reference), and files that already have a proper, committed home in
`packages/dialtone-tokens/sync-scripts/` (`color.ts`, `figma_api.ts`, `token_*.ts`,
`transform.ts`, `utils.ts`, `sync_*.ts`) rather than being duplicated here — nothing in
`sync-scripts/` ever imported them, so nothing needed rewiring.

**Before running this against a real Figma file**: the two Figma personal access tokens
used during the original spike were pasted into a chat transcript and need rotating —
treat any credential from that era as already compromised, and issue fresh ones for the
`.env` this package reads (`PERSONAL_ACCESS_TOKEN`, `FILE_KEY`), never reusing the old
values.
