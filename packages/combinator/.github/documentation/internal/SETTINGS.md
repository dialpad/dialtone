# Settings

`DtcCombinator` owns Combinator settings and initializes them from
`src/settings.json`.

## Default settings

```json
{
  "root": {
    "default-theme": "light",
    "default-sidebar": "right"
  },
  "code": {
    "default-scheme": "highlight",
    "default-verbose": false,
    "default-indent-spaces": 2
  },
  "renderer": {
    "default-positioning": "center",
    "default-background": "white"
  }
}
```

## Cached keys

The model uses `cachedRef(...)` with these localStorage keys from
`src/lib/constants.js`:

- `dialtoneCombinatorTheme`
- `dialtoneCombinatorSidebar`
- `dialtoneCombinatorCodeScheme`
- `dialtoneCombinatorCodeVerbose`
- `dialtoneCombinatorCodeIndent`
- `dialtoneCombinatorRendererPositioning`
- `dialtoneCombinatorRendererBackground`

## Live consumers

Mounted code currently consumes:

- `settings.root.theme`, used by code panel theme classes and token cache
  invalidation;
- `settings.code.scheme`, used by code panel syntax color scheme classes;
- `settings.code.indent`, used by code editor indentation and copied code;
- `settings.code.verbose`, used by code editor attribute filtering.

`blueprint` mode forces `settings.code.verbose` to `false`.

Renderer `positioning` and `background` remain in the settings model, but their
menu and renderer styling code are latent in the current app.

## Latent settings UI

`components/settings_menu/settings_menu.vue` can edit theme, scheme, sidebar,
indent, and verbose settings, but `DtcCombinator` does not mount it.

`components/renderer/renderer_menu.vue` can edit renderer background and
positioning, but `DtcRenderer` does not mount it.

DLT-3498 tracks whether to rewire or remove these menus.
