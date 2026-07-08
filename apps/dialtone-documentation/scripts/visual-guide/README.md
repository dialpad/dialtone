# Visual guide imagery (DLT-3469)

Generates the before/after PNGs used by the designer-facing visual migration
guide. Each scene under `scenes/*.vue` isolates one visual change (or one
must-stay-identical control) and is rendered twice: against this checkout's
Dialtone build ("after", run on `next`) and against a `staging` worktree's
build ("before"). Scene files are branch-neutral — chrome uses inline styles,
the subject uses real Dialtone tokens/classes/components, so each branch's own
build supplies its values.

## One-time worktree setup

```sh
git worktree add ../dialtone-staging staging
cd ../dialtone-staging
pnpm install --frozen-lockfile
pnpm nx run-many -t build -p dialtone-tokens dialtone-css dialtone-vue
```

## Generate

```sh
# from the repo root, on next (with tokens/css/vue built):
node apps/dialtone-documentation/scripts/visual-guide/generate.mjs --before-root=../dialtone-staging

# iterate on one scene:
node apps/dialtone-documentation/scripts/visual-guide/generate.mjs --only=token-type-scale
```

Output lands in `docs/.vuepress/public/assets/images/migration-visual/` as
`<scene>-<before|after>-<light|dark>.png`, consumed by the guide pages via the
`<before-after>` docs component. The generator copies `scenes/` + `harness/`
into the worktree automatically — never edit the worktree copy.

## Adding a scene

1. Drop a `.vue` file in `scenes/` — inline-styled chrome, real Dialtone
   subject. Look at an existing scene for the pattern.
2. Add it to `SCENES` in `generate.mjs` (`branches: ['after']` for
   Next-only components; `capture: 'viewport'` for top-layer content).
3. Re-run the generator, eyeball both modes and both branches.

Focus rings are suppressed during capture; set `data-vg-keep-focus` on any
element in a scene that deliberately demonstrates focus styling.
