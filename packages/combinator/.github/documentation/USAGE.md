# Usage

This document covers direct use of the Combinator package. The Dialtone
documentation site and thumbnail tooling already wire these pieces together.

`$COMPONENT$` below represents the Dialtone Vue component you want to render.

## Required imports

Import the Combinator, the target component, and Dialtone Vue's generated
component documentation:

```js
import documentation from '@dialpad/dialtone-vue/component-documentation.json';
import { $COMPONENT$ } from '@dialpad/dialtone-vue';
import { DtcCombinator } from '@dialpad/dialtone-combinator';
```

`@dialpad/dialtone-vue` exports `component-documentation.json`; do not
import it through a `node_modules` file path.

## Basic use

```vue
<dtc-combinator
  :component="$COMPONENT$"
  :documentation="componentDocumentation"
/>
```

```vue
<script setup>
import documentation from '@dialpad/dialtone-vue/component-documentation.json';
import { DtButton } from '@dialpad/dialtone-vue';

const componentDocumentation = documentation.find(
  component => component.displayName === DtButton.name,
);
</script>
```

The standalone app in `src/App.vue` is the current package-local example.

## Library components

Pass a `library` object when slot templates need to render external components,
such as other Dialtone Vue components or Dialtone icons. The renderer uses this
library when parsing slot template strings.

```vue
<dtc-combinator
  :component="dialtoneVue.DtButton"
  :documentation="componentDocumentation"
  :library="library"
/>
```

```vue
<script setup>
import * as dialtoneVue from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';

const library = {
  ...Object.fromEntries(
    Object.entries(dialtoneVue).filter(([name, value]) => {
      return name.startsWith('Dt') && typeof value === 'object';
    }),
  ),
  ...dialtoneIcons,
};
</script>
```

## Variants

Variants provide initial values and metadata for a target component. Pass one
component's variant object to the `variants` prop:

```vue
<dtc-combinator
  :component="DtButton"
  :documentation="componentDocumentation"
  :variants="buttonVariants"
/>
```

```js
import { variantBank } from '@dialpad/dialtone-combinator';

const buttonVariants = variantBank().DtButton;
```

Inside the package source, the registry lives at
`src/variants/variants.js`. Each component variant file can contain:

- `defaults`, applied before the selected preset;
- `exclusions`, evaluated against current prop and slot values;
- `default`, the default preset and reset target;
- any number of named presets shown in the preset dropdown.

Member metadata can also add control hints such as `tokenCategory` and
`searchKeywords`. Search keywords supplement the automatic member-name and
logical-alias search corpus.

See [internal/EXCLUSIONS.md](internal/EXCLUSIONS.md) for exclusion mechanics.

### Selecting a preset

Use `preset` to select an existing variant by its exact name, or bind it with
`v-model:preset` to track selections:

```vue
<dtc-combinator
  v-model:preset="selectedPreset"
  :component="DtButton"
  :documentation="componentDocumentation"
  :variants="buttonVariants"
/>
```

The prop defaults to `default`. Unknown names and an empty name at mount also
load `default`. Dropdown selections, spec-sheet selections, and reset actions
emit `update:preset` with the selected name. Edits emit an empty string to mark
custom options; echoing that value through the prop preserves those edits.
An unchanged model value emitted by the preview does not mark it custom.
Without a binding, the playground continues to manage its own selection.

The documentation site maps these names to URL slugs, such as
`avatar.html?preset=with-presence-no-icon`. Selecting a preset replaces the
query while preserving other query values and the current browser hash.
Choosing `default` removes only the `preset` parameter instead of writing
`preset=default`; other query parameters and the hash remain intact.
Custom edits remove the preset query; they are not serialized into the URL.
Missing or invalid queries load `default`, and slug matching ignores case.
Empty or colliding slugs receive a deterministic suffix so links remain unique.
Appending a colliding name preserves the first declared preset's clean link.
The docs authoring tests reject fallback slugs in shipped preset banks; choose
distinct names before publishing. Keep preset names stable to preserve their URLs.

## Blueprint mode

Blueprint mode hides the option bar and forces code verbose mode off. It keeps
the renderer and code panel.

```vue
<dtc-combinator
  :component="DtButton"
  :documentation="componentDocumentation"
  :blueprint="true"
/>
```

## Dev mode

`dev-mode` enables the code panel's "Copy JSON" button when the current options
differ from the default preset. The copied text is a variant preset fragment.

```vue
<dtc-combinator
  :component="DtButton"
  :documentation="componentDocumentation"
  dev-mode
/>
```

## Styles

You can pass classes to the root `DtcCombinator` component with normal Vue class
binding:

```vue
<dtc-combinator
  class="d-w100p"
  :component="DtButton"
  :documentation="componentDocumentation"
/>
```

There is no mounted header slot or `header-class` prop in the current root
component.
