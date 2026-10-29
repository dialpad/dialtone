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

See [`sync-scripts/README.md`](sync-scripts/README.md) for the full pipeline — how a
run works end to end, what each check actually catches, and the failure modes this
project has already hit once.

## Status

Not in CI: it needs a real browser, a Figma desktop session (the plugin can only be launched by
a person) and a scratch file. Reviewers rely on the check output recorded in the PR.

Registered so far, built with the current model and checked clean: Button, ButtonIcon,
ButtonLink, Notice, Banner, Collapsible and Loader. More components are added in batches, each with its
own rebuild and check.

## Setup

It needs Node 22.18 or newer, because the provenance step loads TypeScript from the tokens package with native type stripping.

The pipeline reads a gitignored `.env` in this package. Never commit it or paste a token
into a chat, a PR or a log.

| Variable | What |
| --- | --- |
| `PERSONAL_ACCESS_TOKEN` | A Figma personal access token that can read files and variables |
| `FILE_KEY` | The scratch file the components are built into. Nobody's source of truth |
| `TOKENS_FILE_KEY` | The file that holds the published Dialtone variables (the unrestricted collection). Library variables are resolved from it by name and imported by key |

Files that already have a committed home in `packages/dialtone-tokens/sync-scripts/`
(`color.ts`, `figma_api.ts`, `token_*.ts`, `transform.ts`, `utils.ts`, `sync_*.ts`) are not
duplicated here.
