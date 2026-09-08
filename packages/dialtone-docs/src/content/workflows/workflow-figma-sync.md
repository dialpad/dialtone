---
type: workflow
category: workflows
keywords: [figma, figma-sync, sync-scripts, design-tokens, figma-variables, style-dictionary, figma-api, personal-access-token, tokens-studio]
ai_summary: How Dialtone tokens reach Figma variables — the resolver, the scope policy, the CSS check, how to run it locally, and how CI triggers it.
last_updated: 2026-08-27
related_packages: [dialtone-tokens]
---

# Figma Sync Workflow

Design tokens are written from the repo into a Figma variables collection. **Code is the source of truth**: the tokens in `packages/dialtone-tokens/tokens/` decide what Figma contains, not the other way round.

## Where Tokens Studio fits

`tokens/` is in Tokens Studio format, and the plugin's own bookkeeping lives there: `$themes.json`, `$metadata.json`, `{reference}` values, and `$extensions["studio.tokens"]` modifiers. **The plugin still works for authoring and nothing here changes that.**

What this replaces is only the plugin's *push to Figma variables*. Tokens Studio flattens references past a couple of hops, which is why so many semantic variables in Figma today hold a hard-coded value instead of a link. `sync:variables` keeps the reference at any depth.

The directory that was removed, `figma_tokens/`, was never a plugin sync target. It had no `$themes.json`, and it was the output of `sync_figma_to_tokens.ts`.

## Editing or adding a token

`tokens/` is JSON, so editing it by hand is a normal path and needs no plugin. Use whatever you use for the rest of the repo.

The Tokens Studio plugin is an alternative for the same job, and it earns its place in one specific case: adding a whole new **set** or **theme** means updating `tokens/$metadata.json` (which holds `tokenSetOrder`, and decides precedence) and `tokens/$themes.json` (which says which sets each theme uses, and whether each is emitted or reference-only). The plugin maintains both. Adding a token to a set that already exists touches neither, so a plain edit is fine.

Either way the change lands as a pull request and gets reviewed like anything else.

### Getting it into Figma, today

Run it yourself after the change is in:

```bash
cd packages/dialtone-tokens
pnpm sync:variables
```

The sync resolves the token sets itself, so it does not need `dialtone-tokens:build` first. The checks do: `sync:variables:check` compares the resolved values against the built CSS, so build before you run it. It needs no Figma access, which makes it the quickest way to tell a resolution problem apart from a Figma one.

### Getting it into Figma, once CI is set up

The push trigger takes over. Open the pull request, and if you want to see the change in Figma before it merges, comment `/sync-tokens` on it: that syncs to a separate preview file. Merging to `next` syncs the main file.

At that point the local command becomes a debugging tool rather than the normal path. `sync:variables:check` stays useful for the same reason as before.

### What stays manual either way

**Publishing the library.** Figma's REST API has no endpoint that publishes one. Someone has to click publish before any consuming file sees the change, and again after every update. CI writing variables does not put them in front of anyone on its own.

**Pruning.** Deleting a variable whose token is gone is deliberate rather than automatic, because a rename is indistinguishable from a delete plus an add. See [Renaming a token needs care](#renaming-a-token-needs-care).

## Two things to avoid

**Do not use the plugin to push variables.** Use it to author, then let `sync:variables` write. The plugin's own push flattens references.

**Do not edit variables in Figma.** The sync diffs against the file and overwrites anything that differs from the token source, so a hand-edit lasts until the next run and no longer.

## Renaming a token needs care

The sync matches variables to tokens **by name**. Rename `color.surface.bold` to `color.surface.emphasis` and the sync sees one variable gone and one new, which with pruning on is a delete plus a create. Every Figma binding to the old name breaks, silently.

A rename in code is indistinguishable from a delete plus an add, so treat it as a breaking change: check what would be removed before running a prune, and expect to rebind in Figma.

## The pieces

Everything lives in `packages/dialtone-tokens/sync-scripts/`.

| File | What it does |
|------|--------------|
| `resolve_tokens.ts` | Runs Style Dictionary over the token sets to produce a per-mode list of variables. Uses the same set composition and transforms as the CSS build, so a value cannot drift from what Dialtone ships |
| `variable_policy.ts` | Two tables: which tokens are excluded, and which Figma pickers each variable appears in |
| `build_variables.ts` | Converts the resolved tokens into a Figma payload, diffs it against the file, and posts the difference |
| `check_against_css.ts` | Compares every resolved value against the built CSS. Needs no Figma access |
| `figma_api.ts` | The REST client. Two calls: read local variables, write variables |

## Flags

| Flag | Effect |
|------|--------|
| `--dry-run` | Report what would change and post nothing |
| `--file-key KEY` | Override `FILE_KEY`, for pointing at a scratch file |
| `--out FILE` | Also write the payload to a file, for inspection |

The sync is idempotent. It reads the file first and sends only the difference, so a second run reports nothing to post.

## Credentials

| Variable | Description |
|----------|-------------|
| `PERSONAL_ACCESS_TOKEN` | Figma personal access token. Needs both `file_variables:read` and `file_variables:write`, which are Enterprise-only, and the account needs an Editor seat |
| `FILE_KEY` | From the Figma URL: `figma.com/design/{FILE_KEY}/...` |

Locally, put both in `packages/dialtone-tokens/.env`, which is gitignored and loaded via `dotenv/config`.

In CI they come from a GitHub environment rather than a plain repo secret, so a run started from a pull request cannot reach the token without approval.

## CI, in detail

`.github/workflows/sync-variables-to-figma.yml`, once it is set up:

| Trigger | Writes to | Environment |
|---------|-----------|-------------|
| Push to `next` touching `tokens/**` | the main file | `figma-sync-main` |
| A `/sync-tokens` comment on a pull request | the preview file | `figma-sync-preview` |

The comment trigger requires write access to the repo, so an outside pull request cannot start a run that holds a Figma token, and the workflow definition is read from the base branch rather than the pull request.

**Preview runs share one Figma file.** The REST API has no endpoint that creates a file, so there is no way to give each pull request its own. Two people syncing different branches will overwrite each other; the run log names the commit that wrote last.

## What does not cross

Not everything in the token source can be a Figma variable.

| Excluded | Why |
|----------|-----|
| Tokens marked `$deprecated` | The source names its own retirements. A new collection should not be seeded with them |
| `space.*` and the `size.*` numeric ladder | Deprecated in favour of `spacing.*` and `layout.*`. `size.radius.*` and `size.border.*` are kept: they are current and have no equivalent on either scale |
| Negative dimensions | Nothing in Figma consumes one |
| Percentages | A Figma variable holds a number, not a percentage |
| Gradients | A Figma `COLOR` variable holds one solid value |
| `avatar.hue`, `.lightness`, `.chroma`, `.anchor` | Inputs to a colour computation, not design properties |
| Shadow composites | Light and dark have different numbers of layers, and a variable needs a value in every mode |

Two more things change on the way across:

- **Font families.** A token holds a CSS stack. Figma needs one resolvable family, so the stack is mapped to the face it renders as on macOS.
- **Colours outside sRGB.** Tokens are authored in OKLCH, which is wider than the sRGB a Figma variable stores. Those values are gamut-mapped by reducing chroma while holding lightness and hue, which is what a browser does on an sRGB display.

## The other direction

`sync_figma_to_tokens.ts` still exists and pulls Figma variables back into the repo. Since code owns tokens, it is **not** authoritative, and running both directions risks whichever ran last winning. Treat it as a migration tool rather than part of the normal workflow.
