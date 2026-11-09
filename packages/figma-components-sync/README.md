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
| `FIGMA_CODE_CONNECT_TOKEN` | Only for publishing Code Connect: a personal access token with the **File content (read)** and **Code Connect (write)** scopes. Kept apart from `PERSONAL_ACCESS_TOKEN` so the sync's token can stay read-only |

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

## Code Connect

Code Connect makes Dev Mode show real Vue for a Figma instance (`<DtButton kind="critical" :size="400">…`),
instead of a layer-by-layer translation. The templates are plain `.figma.ts` files ("parserless": a
`figma.code` template, which is framework-agnostic, so it works for Vue) in `code-connect/`, one per
published set, and are published to the **main** file, because mappings attach to published components.

| File | What it maps |
| --- | --- |
| `code-connect/Dt*.figma.ts` | One template per set, **generated** by `sync-scripts/code-connect.mjs --target main` from the config (each axis value's attributes are derived from `props()`; the config's `codeConnect` block adds slots, icons and always-on attributes). Only values that differ from the component's defaults are written. `--check` fails if a committed file differs from what the config would produce |
| `code-connect/generated/icons/` | One template per icon component (626), generated by `sync-scripts/code-connect-icons.mjs --target main` from the icon library's ids; gitignored. The icon's component name travels in the template's `metadata.props`, so a button writes `<DtIconXCircle :size="iconSize" />` in its slot |
| `figma.config.json` | Which files the CLI reads |

Publish with the Code Connect CLI from this package (it is not a dependency; run it with `npx`):

```bash
node sync-scripts/code-connect-icons.mjs --target main        # the icon templates
FIGMA_ACCESS_TOKEN=<the Code Connect token> npx --package @figma/code-connect figma connect publish --label Vue --force --batch-size 100
```

`--dry-run` validates without publishing. `--force` replaces a mapping that was made in the Figma UI.

What it relies on, found while building it:

- A template runs only on an **instance**. A variant inside the library file is a component, so
  Dev Mode there and `get_design_context` on it show only the plain mapping. Check a template on an
  instance in a file that uses the library.
- The mapping reaches a consuming file only after the library is **republished**.
- The templates run as plain JavaScript: no type annotations, and a template that throws shows
  Figma's generic pass-through instead of an error. A helper that misbehaves is found by
  publishing a smaller template and bisecting.
- `getSlot()` hands back a reference to the slot, not its contents. Whether anything was dropped into
  a native slot is read with `findLayers` (text or an instance under the slot); `traverseInstances` made it throw.
- Mappings attach to the published component's key, which in-place updates keep and a `--rebuild` does not.

