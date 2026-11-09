# @dialpad/dialtone-figma-components-sync

Measures real rendered Dialtone Vue components — via a headless browser and the Chrome
DevTools Protocol, reading the browser's own computed-style cascade as ground truth,
not a reimplementation of it — and builds matching Figma component variant sets through
a dev plugin. Verification passes (values, token identity, both slot states of a merged
set, and a raster screenshot diff) check the result, plus a negative-control
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
a person) and write access to a Figma file to build into. Reviewers rely on the check output recorded in the PR.

Registered so far, built with the current model and checked clean: Button, ButtonIcon, ButtonStacked,
ButtonLink, Notice, Banner, Collapsible and Loader. More components are added in batches, each with its
own rebuild and check.

## Setup

It needs Node 22.18 or newer, because the provenance step loads TypeScript from the tokens package with native type stripping.

The measurement harness imports the built `dialtone-vue`, `dialtone-icons` and `dialtone-css`
packages and the token CSS, so build them first (`pnpm nx run dialtone-vue:build` and
`pnpm nx run dialtone-css:build` cover them). `dialtone-tokens` is also an implicit dependency:
its `resolve_tokens.ts` is loaded at runtime.

The pipeline reads a gitignored `.env` in this package. Never commit it or paste a token
into a chat, a PR or a log.

| Variable | What |
| --- | --- |
| `PERSONAL_ACCESS_TOKEN` | A Figma personal access token that can read files and variables |
| `PREVIEW_FILE_KEY` | The preview file, "Dialtone 2026 Preview" (target `preview`) |
| `MAIN_FILE_KEY` | The main file, "Dialtone 2026" (target `main`) |

## Targets

Components are built into the Figma file that **owns** the Dialtone variable collection, so
the hidden tokens bind locally and a file that consumes the components sees one Appearance
toggle. Pick the file with `--target preview` or `--target main` on every command (or set
`SYNC_TARGET`). There is no default target.

| Target | File | Notes |
| --- | --- | --- |
| `preview` | the preview file ("Dialtone 2026 Preview"), home collection "Dialtone 2026 Preview" | Safe to rebuild; start here |
| `main` | the main file ("Dialtone 2026"), home collection "Dialtone 2026" | Asks for `--yes` before it writes |

Each target keeps its own state under `sync-scripts/build-data/<target>/` (component set ids,
build fingerprints, the icon library), so building into one never touches the other. To point
at another file, copy the shape of `sync-scripts/targets.mjs` into the gitignored
`sync-scripts/targets.local.mjs`.

Build order within a target: Icons (`--icons`), Loader, Button, then the other sets (a set that
uses another needs it built first). The tokens in the target file must be current: sync the
variables first (`pnpm --filter dialtone-tokens sync:variables`; for the preview file add
`--file-key <preview key>` and set `COLLECTION_NAME="Dialtone 2026 Preview"`, otherwise it would
create a second collection), or a stale composed colour fails the checks.

Files that already have a committed home in `packages/dialtone-tokens/sync-scripts/`
(`color.ts`, `figma_api.ts`, `token_*.ts`, `transform.ts`, `utils.ts`, `sync_*.ts`) are not
duplicated here.
