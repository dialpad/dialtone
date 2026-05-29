# Thumbnail overrides

The thumb pipeline resolves what to render for each component using exactly two
inputs:

1. `apps/dialtone-documentation/thumbs/<slug>.vue` — if this file exists, render it
2. Otherwise — render the Combinator's `default` variant from
   `packages/combinator/src/variants/variants_<snake_name>.js`

No hidden third tier. Authoring an override here is the only way to deviate
from the Combinator default (e.g., to force an open state on an overlay, pick
a non-default variant, or compose a parent-required leaf component).

Components without a wall page in `apps/dialtone-documentation/docs/components/`
are skipped entirely — the generator auto-discovers wall slugs at startup, so
adding/removing a `.md` page automatically opts the component in or out.

## File convention

```text
apps/dialtone-documentation/thumbs/<slug>.vue
```

`<slug>` is the kebab-case slug used in the docs site URL — e.g. `skeleton.vue`,
`rich-text-editor.vue`. The generator discovers these files via
`import.meta.glob` in `scripts/thumbs/harness/main.js`.

## Live preview while authoring

```bash
pnpm nx run dialtone-documentation:thumbs:preview
```

Starts a Vite dev server. Two ways to navigate:

1. **Picker** — `http://localhost:5899/` (no query string) shows the full list of
   components. Click any name to preview it. Components with an override file in
   this directory are flagged with an `override` badge.

2. **Direct URL** — bookmark a specific component:

   ```text
   http://localhost:5899/?thumb=DtSegmentedControl&mode=dark
   http://localhost:5899/?thumb=DtSegmentedControl&mode=light
   ```

   Component names are the PascalCase `Dt*` exports from `@dialpad/dialtone-vue`.
   Mode is `dark` (default) or `light`. Toggle either by editing the URL.

Save your `.vue` override file in this directory and the browser hot-reloads instantly.
No need to run the full generator until you're happy with the result.

The dashed outline you see in preview is the 400×225 capture boundary — it
won't appear in the generated PNG.

## Regenerate the PNGs

Once the override looks right:

```bash
# Single component
node apps/dialtone-documentation/scripts/thumbs/generate.mjs --component=<slug> --force

# All components
pnpm nx run dialtone-documentation:thumbs
```

## Available globals in your `.vue` file

The harness registers all `Dt*` exports from `@dialpad/dialtone-vue` and all
`DtIcon*` from `@dialpad/dialtone-icons/vue` globally — use kebab-case:

```vue
<template>
  <dt-stack gap="300" :style="{ width: '320px' }">
    <dt-skeleton :paragraph-option="{ lines: 4 }" />
  </dt-stack>
</template>
```

No imports needed.

The 400×225 viewport is fixed; content is centered. Use inline `:style="{ width: '…' }"`
on a wrapper to give components a frame to render inside.

## Pre-commit hook

A husky pre-commit hook auto-regenerates thumbnails when your staged changes
include any of these paths ("thumb inputs"):

- `packages/dialtone-vue/components/`
- `apps/dialtone-documentation/thumbs/`
- `packages/combinator/src/variants/`
- `packages/dialtone-tokens/`

When it fires, it runs `pnpm nx run dialtone-documentation:thumbs` and
auto-stages any updated PNGs from
`apps/dialtone-documentation/docs/.vuepress/public/assets/images/components/`.
The PNGs fold into your existing commit — no separate "regen thumbs" commit
needed.

### Timing

The generator uses a content-hash cache, so only stale slugs actually rerun:

- Single-component change, cache warm: ~5–10s
- Cold cache (first regen after pulling, or token/harness changes): up to ~3 min for all 60 components

### Seeing PNG changes in your diff

Normal and expected after touching a component source, override file, variant,
or token. The hook regenerated them and staged them for you. Don't try to
revert — the new bytes are correct.

### If the hook fails

Most likely cause: Playwright's Chromium isn't installed locally.
If the hook does fail with a missing-browser error (custom `.npmrc` with
`ignore-scripts`, `pnpm install --ignore-scripts`, a failed first install, or
an OS/arch switch), install Chromium explicitly. Run:

```bash
pnpm exec playwright install --with-deps chromium
```

Less common: `dialtone-tokens` or `dialtone-vue` dist artifacts are out of date:

```bash
pnpm nx run dialtone-tokens:build
pnpm nx run dialtone-vue:build
```

Then retry the commit.

### Bypassing the hook

For genuine WIP / throwaway commits where you don't care if PNGs are stale:

```bash
git commit --no-verify    # skips ALL hooks, including lint-staged
HUSKY=0 git commit ...    # same effect via env var
```

Stale PNGs will then linger until a later commit triggers the hook again, or
you regen manually with `pnpm nx run dialtone-documentation:thumbs`.
