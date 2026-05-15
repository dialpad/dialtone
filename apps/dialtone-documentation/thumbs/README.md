# Thumbnail overrides

Hand-authored `.vue` files in this directory replace the auto-generated thumbnail
for a component when its default render isn't viable (e.g., skeleton has no
inherent size, root-layout needs full viewport, rich-text-editor uses async
ProseMirror, etc.).

## File convention

```text
apps/dialtone-documentation/thumbs/<slug>.vue
```

`<slug>` is the kebab-case slug used in the docs site URL — e.g. `skeleton.vue`,
`rich-text-editor.vue`. The generator discovers these files via
`import.meta.glob` in `scripts/thumbs/harness/main.js`; the override wins over
the Combinator-variant lookup if present.

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
