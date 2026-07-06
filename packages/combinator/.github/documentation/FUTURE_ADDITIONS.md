# Future additions

## Completed

### Supported components through the library prop

Components can render nested Dialtone Vue components and icons in slots through
the `library` prop. `DtcNode` recursively renders library components, and the
standalone app passes all `Dt*` Dialtone Vue exports plus Dialtone icons.

### Icon-slot control

`control_icon_slot.vue` provides a searchable icon dropdown. `isIconSlot()`
detects icon slots by name, matching `icon`, names ending in `Icon`, and names
ending in `Icons`.

The control converts selected icons to template strings and includes
`:size="iconSize"` when slot bindings expose an icon-size value.

### Semantic-release config

`packages/combinator/release-ci.config.cjs` is the release source of truth.
Release branches are `staging`, `beta`, `alpha`, and `next`. The tag format is
`combinator/v${version}`.

### Code copy from data

The live code editor copies generated template text from `info` and `options`.
It does not read DOM text, so code-panel layout does not affect code
indentation.

## In progress or planned

### Renderer node scoped slots

Specific scoped slot cases work today. Icon slots can use `iconSize`, and code
generation includes bindings that the slot content references. A general
model for arbitrary scoped slot data is still incomplete.

### Settings and renderer menus

The settings model exists, and latent menu components still exist, but the live
root component does not mount `settings_menu`, `renderer_menu`, or
`renderer_button_bar`. DLT-3498 tracks the decision to rewire or remove those
components.

### Dedicated class control

The current UI has a Class tab for the native `class` attribute and `*Class`
props. Those members still use the normal string or selection controls. A future
dedicated class control could provide Dialtone utility suggestions while still
allowing custom classes.

### Orphaned component cleanup

DLT-3498 tracks the follow-up to rewire or remove these latent components:

- `settings_menu`
- `header`
- `event_console`
- `renderer_menu`
- `renderer_button_bar`
