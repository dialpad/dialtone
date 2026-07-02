# Dialtone Migration Helper

A Chrome MV3 extension for comparing a live Dialtone `next` page against the latest stable Dialtone release without changing the app build.

## Features

- **Inspect tokens**: hover an element to see applied `--dt-*` tokens as current value -> stable value, plus detected `d-*` utility classes.
- **Apply stable tokens**: temporarily apply stable Dialtone custom-property definitions to the page, then remove them cleanly. The popup reports observed live-DOM changes and the discovery-backed override scope.
- **Replace stable tokens**: in-place token value substitution — each `dialtone-css-*` style tag keeps its structure, mode blocks, `@layer` wrappers, and token names; only `--dt-*` declaration values are swapped to the last stable release. Mechanically-renamed families (`spacing←space`, `layout←size`, `positive←success`) are translated via a reverse-rename table. Unmatched tokens keep their next values so nothing is ever undefined. Restores originals exactly on toggle-off.
- **Apply stable Avatar + Presence**: experimental component-only spike that injects stable Avatar/Presence CSS, scopes the stable tokens referenced by that CSS to those nodes, and temporarily remaps next Avatar size and Presence state classes to stable aliases.
- **Theme/version controls**: auto-detect `data-dt-brand` and `data-dt-theme` / `data-dt-mode`, with popup overrides and a stable version pin.

## Safety Boundaries

The stable override is intentionally narrow:

- Emits only CSS custom-property declarations.
- Preserves the original selector scope, for example `:root`, `.d-btn`, or component selectors.
- Preserves conditional grouping wrappers such as `@media`, `@supports`, and `@container`.
- Unwraps `@layer` wrappers at runtime so stable component custom properties can beat current unlayered Dialtone rules in Firespotter's bundled CSS.
- Loads `docs/analysis/dependency-graph.json`, `docs/analysis/tokens.json`, and `docs/analysis/utilities.json` at runtime. Exact token names come from the dependency graph, token definitions, and utility token references; broad prefix families still come only from the dependency graph. There is no copied token list in `content.js`.
- Skips `!important` declarations.
- Drops all non-token CSS declarations, including layout, reset, color, spacing, and utility declarations.
- Does not rewrite classes, attributes, tags, or DOM structure.

This means hardcoded utility changes and markup migrations are out of scope. The old full-framework CSS swap and structure rewrite attempts are not loaded by the manifest.

The Avatar + Presence button is intentionally outside that safe token-only boundary. It is an incremental viability test for component swaps: only selectors matching `.d-avatar*` or `.d-presence*` are injected, stable dependency tokens are scoped to Avatar/Presence nodes, and class aliases are restored when toggled off.

Layer note: CSS dotted layer names are nested. A layer plan that wants legacy app CSS below Dialtone and app overrides above Dialtone must verify the actual top-level layer order in the browser. Because the runtime override unwraps `@layer`, real-page validation must also confirm intentional app custom-property overrides still win where required.

## Load In Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this folder.
4. Open a Dialtone page and use the extension popup.
5. Toggle **Enable inspector** for hover inspection, **Apply stable tokens** for the safe token override, or **Apply stable Avatar + Presence** for the component-swap spike.

## Test And Verification

Run the local fixture suite:

```sh
node e2e.mjs
```

Run syntax checks:

```sh
node --check background.js
node --check content.js
node --check token-renames.js
node --check popup.js
node --check e2e.mjs
```

Real authenticated Firespotter validation is documented in `docs/verification/safe-custom-property-override.md`:

```sh
REAL_PAGE_CDP=http://127.0.0.1:9222 REAL_PAGE_URL='https://localhost.uv-beta.dialpad.net/app/feed/aglzfnV2LWJldGFyGAsSC1VzZXJQcm9maWxlGICA2KiXi8QIDA/aglzfnV2LWJldGFyGAsSC1VzZXJQcm9maWxlGICAmOPRoYoLDA' node e2e.mjs --real-page
```

Without `REAL_PAGE_CDP`, `--real-page` fails explicitly instead of silently reporting local fixture success.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | MV3 manifest; loads `rules.js`, `structure.js`, `token-renames.js`, and `content.js` as page content scripts and exposes the discovery JSON files. |
| `background.js` | Fetches and caches stable token CSS, parsed stable token maps, and stable framework CSS from unpkg. |
| `content.js` | Inspector tooltip, theme detection, in-place token value substitution (replace mode), safe custom-property override extraction/adoption, Avatar component-swap spike, live-DOM reporting, and cleanup. |
| `token-renames.js` | Reverse-rename tables mapping next-side token names to stable-side candidates (spacing←space, layout←size, positive←success). Loaded before `content.js`; sets `globalThis.__dtTokenRenames`. |
| `rules.js`, `structure.js` | DOM-structure rewrite engine (declarative ops, inverse registry, MutationObserver). Loaded by the manifest before `content.js`. |
| `popup.html` / `popup.js` / `popup.css` | Popup toggles, detected theme display, override change counts, Avatar swap status, override scope summary, version pin, refresh, and manual theme override. |
| `e2e.mjs` | Playwright local fixture tests plus optional CDP real-page validation. |
| `docs/analysis/*.json` | Completed discovery outputs used to scope the token filter and real-page diagnostics. |
| `docs/verification/safe-custom-property-override.md` | Real-page validation command and manual fallback checklist. |
