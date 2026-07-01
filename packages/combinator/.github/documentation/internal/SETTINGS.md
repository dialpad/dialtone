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
  },
  "controls": {
    "default-hide-deprecated": true,
    "default-hide-inactive": false
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
- `dialtoneCombinatorControlsHideDeprecated`
- `dialtoneCombinatorControlsHideInactive`

## Live consumers

Mounted code currently consumes:

- `settings.root.theme`, used by code panel theme classes and token cache
  invalidation;
- `settings.code.scheme`, used by code panel syntax color scheme classes;
- `settings.code.indent`, used by code editor indentation and copied code;
- `settings.code.verbose`, used by code editor attribute filtering;
- `settings.controls.hideDeprecated`, used by the option bar to hide deprecated
  controls by default;
- `settings.controls.hideInactive`, used by the option bar to hide disabled
  controls when enabled.

`blueprint` mode forces `settings.code.verbose` to `false`.

Renderer `positioning` and `background` remain in the settings model, but their
menu and renderer styling code are latent in the current app.

## Live option-bar settings

`components/option_bar/option_bar_settings.vue` is mounted in the option bar. It
opens a settings popover from the settings icon button and edits only the
`controls` settings group.

The live controls settings are:

- `Hide Deprecated`: on by default. Deprecated controls are detected from
  docgen/JSDoc deprecation metadata and hidden during normal browsing.
- `Hide Disabled`: off by default. When enabled, inactive controls disabled by
  exclusions, inferred dependencies, or slot-class dependencies are hidden during
  normal browsing.

Active search temporarily surfaces matching controls hidden by these display
settings. Surfaced controls keep their state: deprecated controls still show the
deprecated badge, and disabled controls remain disabled.

## Latent settings UI

`components/settings_menu/settings_menu.vue` can edit theme, scheme, sidebar,
indent, and verbose settings, but `DtcCombinator` does not mount it. It is
separate from the live option-bar control-display settings popover.

`components/renderer/renderer_menu.vue` can edit renderer background and
positioning, but `DtcRenderer` does not mount it.

DLT-3498 tracks whether to rewire or remove these menus.
