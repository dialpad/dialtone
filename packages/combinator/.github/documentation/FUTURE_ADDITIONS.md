# Future Additions

## Add Supported Components

A recent feature was added that allows Dialtone Vue components
to be used in slots.

[Pull Request](https://github.com/dialpad/dialtone-combinator/pull/14)

This should allow some components to work as intended such as 'DtDropdown'.
Any component that requires nesting of Dialtone Vue components now has the potential to
be 'supported'.

## Renderer Node Scoped Slots

Add communication between the target component and the 'node' components in their slots
when scoped slot data is present.

There should be some sort of way to modify the renderer_target.vue `renderTarget()` 
hyper-script function `h(...)` to provide the scoped slot data to slots containing
dtc-node components.

There is some 
[existing documentation](https://vuejs.org/guide/extras/render-function.html#rendering-slots)
about rendering hyper-script with scoped slots.

## Icon Control

A control could be added to allow quick selection of icons for the user.

### Implementation

Currently, all the library components and icons are passed to a single `library` prop. 
Another prop `iconLibrary` could be implemented to allow icons to be passed in separately.

The `library` prop and the `iconLibrary` prop could be merged and passed to the renderer.
The `iconLibrary` prop could be passed to the icon control to allow.

To know which members to allow the icon control, a custom `@icon` tag could be added
to the dialtone-vue documentation. If a slot contains this `@icon` tag in its documentation
it should allow either the default 'slot' control or 'icon' control to be selected, with
the 'icon' control as the default.

This can be implemented using `getSlotControls()` in option_bar.vue.

## Class Control

A control that allows quick selection and suggestions of dialtone utility classes.

### Implementation

Currently, the user can usually pass a string, array, or object to a 'class' prop
(based on the prop type).

A 'class' control could be implemented to replace these 3 controls for each class prop.

A good idea would be to use the 'combobox with multiselect' Dialtone Vue recipe and
somehow provide a list of all the dialtone utility classes as suggestions.

There should also be functionality to allow the user to type in non dialtone classes
which I think is already supported by the component.

To know which members to allow the icon control, a custom `@class` tag could be added
to the dialtone-vue documentation. If a prop contains this `@class` tag in its documentation
it should disallow selection of the 'string' 'array' and 'object' controls and
allow the 'class' control to be selected with 'class' being the default.

This can be implemented using `getBindingControls()` in option_bar.vue, possibly even
a new `getPropControls()` could be implemented to abstract the logic since
this will only be possible for props.

## Semantic Versioning (CI)

Currently, releases have to be manually categorized. A semantic version
implementation similar to Dialtone or Dialtone Vue would be good.

## Sidebar Theming

Currently, the theming only affects the code panel area and the renderer area.
This was intended to be extended to the sidebar as well.

This will allow the entire combinator to be dark mode or light mode, fitting into
the consumer website and being able to match the theme.
