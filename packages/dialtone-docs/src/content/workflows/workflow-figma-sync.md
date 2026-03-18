---
type: workflow
category: workflows
keywords: [figma, tokens-studio, figma-sync, sync-scripts, design-tokens, figma-variables, style-dictionary, figma-api, personal-access-token]
ai_summary: How the Dialtone Figma ↔ token sync works — the two sync scripts, what each does, required environment variables, and when to run each direction.
last_updated: 2026-03-04
related_packages: [dialtone-tokens]
---

# Figma Sync Workflow

The `dialtone-tokens` package keeps Figma and the token source files in sync via two scripts in `packages/dialtone-tokens/sync-scripts/`. Both directions are manually triggered — there is no automatic sync on commit.

## Two Directions

| Script | Direction | When to use |
|--------|-----------|-------------|
| `sync_figma_to_tokens.ts` | Figma → repo | A designer updated tokens in Figma and you need to pull those changes into the codebase |
| `sync_tokens_to_figma.ts` | repo → Figma | Token changes were made in the repo and need to be pushed back to Figma to keep the Figma file current |

## Required Environment Variables

Both scripts need these two environment variables:

| Variable | Description |
|----------|-------------|
| `PERSONAL_ACCESS_TOKEN` | Figma personal access token for API authentication. Generate at figma.com → Account → Personal access tokens. |
| `FILE_KEY` | The unique identifier for the Figma file. Found in the Figma file URL: `figma.com/file/{FILE_KEY}/...` |

Set them in a `.env` file in `packages/dialtone-tokens/` (loaded automatically via `dotenv/config`) or pass them as environment variables. In GitHub Actions, `PERSONAL_ACCESS_TOKEN` comes from the `GH_ACTION_VARIABLES_SYNC_FIGMA_TOKEN` secret.

## Figma → Repo (`sync_figma_to_tokens.ts`)

### What It Does

1. Calls the Figma REST API: `GET /v1/files/{fileKey}/variables/local`
2. Converts the response to **Tokens Studio JSON format** and writes files to `figma_tokens/`:
   - `figma_tokens/base.global.json` — Base and global variables
   - `figma_tokens/components.global.json` — Component-specific variables
   - `figma_tokens/root.value.json` — Root/primitive values
3. Transforms the Tokens Studio format into **Style Dictionary format** and merges the result into `tokens/base/default.json`

### What Changes in the Repo

After running `sync_figma_to_tokens`, three files may be modified:
- `packages/dialtone-tokens/figma_tokens/base.global.json`
- `packages/dialtone-tokens/figma_tokens/components.global.json`
- `packages/dialtone-tokens/figma_tokens/root.value.json`
- `packages/dialtone-tokens/tokens/base/default.json`

These changes need to be committed and a token rebuild needs to run before the updated values reach CSS output.

### How to Run

```bash
# From the monorepo root
pnpm nx run dialtone-tokens:sync:figma-to-tokens -- --output tokens

# From inside packages/dialtone-tokens
npm run sync:figma-to-tokens -- --output directory_name
```

The `--output` flag specifies the destination directory (default: `figma_tokens`). Using `--output tokens` writes directly into the Style Dictionary source directory.

### Via GitHub Actions

The `sync-figma-to-tokens.yml` workflow exposes this as a manual `workflow_dispatch` with a required `file_key` input. It runs the script and opens a PR with the resulting token file changes. This is the recommended path when pulling designer changes, as it creates a reviewable PR rather than committing directly.

## Repo → Figma (`sync_tokens_to_figma.ts`)

### What It Does

1. Reads all JSON files from `figma_tokens/`
2. Flattens the nested token structure into forward-slash-delimited keys (e.g., `color/primary/main`)
3. Calls the Figma REST API: `GET /v1/files/{fileKey}/variables/local` to get the current Figma state
4. Computes a diff between the local tokens and the Figma variables
5. If differences exist, sends a `POST /v1/files/{fileKey}/variables` request with the update payload (create/update/delete actions for collections, modes, variables, and mode values)
6. If no differences exist, exits without making any API call

### How to Run

```bash
# From the monorepo root
pnpm nx run dialtone-tokens:sync:tokens-to-figma

# From inside packages/dialtone-tokens
npm run sync:tokens-to-figma
```

No additional flags needed — it always reads from `figma_tokens/`.

### Via GitHub Actions

The `sync-tokens-to-figma.yml` workflow exposes this as a manual `workflow_dispatch` with a required `file_key` input. Both Figma sync workflows are manual-only — there is no automated trigger on token file changes.

## Token Format Comparison

The two formats used in this pipeline are structurally different:

**Tokens Studio format** (lives in `figma_tokens/`) — Closer to the W3C Design Tokens spec. Uses `$`-prefixed metadata keys. Preserves Figma-specific metadata in `$extensions.com.figma`:

```json
{
  "space": {
    "100": {
      "$type": "number",
      "$value": 4,
      "$extensions": {
        "com.figma": {
          "scopes": ["GAP", "WIDTH_HEIGHT"],
          "codeSyntax": { "WEB": "--dt-space-100" }
        }
      }
    }
  }
}
```

**Style Dictionary format** (lives in `tokens/`) — The format Style Dictionary builds from. Plain keys without `$` prefix. Pixel/rem values as strings. No Figma metadata:

```json
{
  "space": {
    "100": {
      "value": "4px",
      "type": "spacing"
    }
  }
}
```

The sync scripts handle the transformation between these formats automatically. When working directly on tokens in the repo without a Figma sync, edit the Style Dictionary format files in `tokens/` — not the `figma_tokens/` files.

## Typical Workflow

**Designer updates tokens in Figma:**
1. Designer notifies the team that Figma variables have changed
2. Team member triggers `sync-figma-to-tokens` workflow in GitHub Actions with the correct `file_key`
3. The workflow opens a PR with the token file changes
4. PR is reviewed, merged
5. `pnpm nx run dialtone-tokens:build` regenerates CSS/LESS/JS outputs
6. `pnpm nx run dialtone-css:build` picks up new token CSS files

**Developer updates tokens in the repo:**
1. Edit `tokens/base/default.json` or theme files under `tokens/theme/`
2. Run `pnpm nx run dialtone-tokens:build` to verify the output
3. Merge the changes to `staging`
4. Trigger `sync-tokens-to-figma` workflow in GitHub Actions to push the changes back to Figma

## What the Sync Does NOT Do

- Does not sync component documentation (`.md` files in `apps/dialtone-documentation/docs/`)
- Does not sync Storybook stories or Vue component files
- Does not automatically run on every commit or merge — both directions are always manually triggered
- Does not modify `tokens/theme/` files — only `tokens/base/default.json` is written by `sync_figma_to_tokens`
