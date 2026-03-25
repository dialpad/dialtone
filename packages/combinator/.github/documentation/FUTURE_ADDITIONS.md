# Future Additions

## Completed

### Add Supported Components

Components can now be used in slots via the library system. `node.vue` recursively
renders library components, and 28+ components have variant definitions with slot
examples demonstrating nested Dialtone Vue components.

[Original Pull Request](https://github.com/dialpad/dialtone-combinator/pull/14)

### Icon Control

A dedicated icon slot control (`control_icon_slot.vue`) provides a searchable dropdown
of all Dialtone icons using `dt-recipe-combobox-with-popover`. Icons are detected by
naming convention (`isIconSlot()` checks for names equal to 'icon' or ending with
'Icon'/'Icons') rather than the originally proposed `@icon` documentation tag.

The control handles icon-to-template conversion, scoped slot bindings (`iconSize`),
and clear/reset. Icons are passed through the existing `library` prop rather than a
separate `iconLibrary` prop as originally proposed.

### Semantic Versioning (CI)

Implemented via `release-ci.config.cjs` with semantic-release-plus. Release branches:
`staging` (production), `beta`, `alpha`, `next` (prerelease). Tag format:
`combinator/v${version}`.

---

## In Progress

### Renderer Node Scoped Slots

Scoped slot data is partially supported. The renderer passes slot bindings through
`renderer_target.vue`, and specific cases are handled (icon slots extract `iconSize`
bindings, code generation detects used binding names from slot content).

The general case — full communication of arbitrary scoped slot data between the target
component and node components — is not yet complete. The existing icon slot pattern
(`hasIconSizeBinding`) could be generalized so that any slot with scoped data
automatically makes those bindings available to its content.

[Vue render function slots documentation](https://vuejs.org/guide/extras/render-function.html#rendering-slots)

### Sidebar Theming

The settings system supports a light/dark theme toggle, and the code panel and renderer
respond to it via `dtc-theme--${theme}` classes. The sidebar (option bar) does not yet
fully respond to theme changes. Extending theming to the sidebar would be mostly CSS
work to ensure the option bar respects the existing theme classes.

---

## Future

### Class Control

A control that allows quick selection and suggestions of Dialtone utility classes.

Props with a `Class` suffix (e.g., `labelClass`) are currently treated as regular
string or selection controls. A dedicated class control using 'combobox with multiselect'
could replace these, providing a list of Dialtone utility classes as suggestions while
still allowing custom class input.

#### Implementation

Detection could use naming convention (props ending in `Class`) similar to how icon
slots are detected, rather than the originally proposed `@class` documentation tag.

This can be implemented using `getBindingControls()` in option_bar.vue. A dedicated
`getPropControls()` could be added to abstract the logic since this would only apply
to props.
