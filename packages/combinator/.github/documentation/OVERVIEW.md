# Overview

Dialtone Combinator is a Vue playground for Dialtone Vue components. It takes
component documentation, a target component, optional library components, and
optional variant presets, then renders:

- a live component preview;
- an option bar for editable props, slots, and classes;
- a code panel that generates Vue template text from the current state.

For consumer integration, see [USAGE](USAGE.md).

## Documentation

### Package workflow

- [README](../../README.md)
- [CONTRIBUTING](CONTRIBUTING.md)
- [RELEASING](RELEASING.md)
- [COMMIT_CONVENTION](COMMIT_CONVENTION.md)
- [FUTURE_ADDITIONS](FUTURE_ADDITIONS.md)
- [KNOWN_ISSUES](KNOWN_ISSUES.md)

### Internal architecture

- [SYSTEM](internal/SYSTEM.md)
- [RENDERER](internal/RENDERER.md)
- [OPTION_BAR](internal/OPTION_BAR.md)
- [CODE_PANEL](internal/CODE_PANEL.md)
- [CONTROLS](internal/CONTROLS.md)
- [EXCLUSIONS](internal/EXCLUSIONS.md)
- [SETTINGS](internal/SETTINGS.md)
- [TESTING](internal/TESTING.md)

### Consumer usage

- [USAGE](USAGE.md)

## Terminology

- Root: `DtcCombinator`, the root playground component in
  `src/components/combinator.vue`.
- Target component: the Dialtone Vue component that the playground renders.
- Documentation: the raw component metadata from
  `@dialpad/dialtone-vue/component-documentation.json`.
- Info: the processed, immutable component metadata that child components use.
- Options: the reactive value map for props, attributes, slots, and bindings.
- Member: one prop, attribute, slot, or event in the component metadata.
- Binding: a prop or attribute passed to the target component with `v-bind`.
- Variant: a preset object that overrides member metadata and initial values for
  one target component.
- Defaults: variant metadata that applies before the selected preset.
- Exclusions: variant rules that hide, disable, clear, or disable values for
  members under specific prop or slot conditions.
- Disabled member: a member that exclusions, prop dependencies, or empty
  slot-class dependencies suppress.

## Folder structure

```text
packages/combinator/
  .github/documentation/      Package docs and internal maintainer docs
  dist/                       Vite package build output
  src/
    assets/                   Less themes, schemes, and transitions
    components/
      code_editor/            Generated template display and editing
      code_example/           Latent docs-site code example experiment
      code_panel/             Mounted code panel wrapper
      controls/               Reusable value controls
      event_console/          Latent event console components
      header/                 Latent header component
      option_bar/             Mounted prop, slot, class, and search UI
      renderer/               Mounted renderer plus latent renderer menu files
      settings_menu/          Latent settings popover
      tools/                  Shared UI helpers such as node and overlay
    lib/                      Plain JavaScript processing and utilities
    variants/                 Component variant files and variant registry
    App.vue                   Standalone playground app
    settings.json             Default settings
    supported_components.json Supported component list
```

Latent components are present in the tree, but the live app does not mount them.
Do not describe them as reachable UI. DLT-3498 tracks the rewire-or-remove
follow-up.

## Root system

`DtcCombinator` owns the main state:

- `info`, derived from Dialtone Vue documentation and variant metadata;
- `options`, a reactive value map initialized from `info`;
- `settings`, a localStorage-backed settings model;
- `disabledMembers`, a computed set from exclusions, prop dependencies, and
  slot-class dependencies.

The mounted UI has three main areas:

- `DtcRenderer` renders the target component.
- `DtcOptionBar` edits props, slots, and classes.
- `DtcCodePanel` shows generated Vue template code.

The root toolbar also owns the variant preset picker, reset button, and
fullscreen button.

See [SYSTEM](internal/SYSTEM.md).

## Supported components

`src/supported_components.json` lists components that should work in the
standalone app and package tests. The standalone app can still show unsupported
Dialtone Vue exports, but it labels them as unsupported in the component picker.

When adding a supported component, add or update its variant file under
`src/variants/`, register it in `src/variants/variants.js`, and run the package
tests.

## Docgen

Combinator consumes Dialtone Vue's generated component documentation through the
package export:

```js
import documentation from '@dialpad/dialtone-vue/component-documentation.json';
```

`src/lib/info.js` and `src/lib/info_extend.js` process the raw data.
Current processing includes:

- model prop rename handling from `@model` tags;
- custom HTML attributes from `@property ... attribute` tags;
- native `class` attribute injection for components that support root classes;
- type normalization;
- default value lookup from component props;
- boolean enum normalization for mixed-state controls.

The Combinator depends on accurate component comments and `@values` tags. If
docgen data is incomplete, the option bar may fall back to a generic control.
