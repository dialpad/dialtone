# Usage

The purpose of this document is to instruct how to implement Dialtone Combinator in an external project.

`$COMPONENT$` represents the component you want to combinate™ from Dialtone Vue.

## Combinator
_Required_

### Import

The combinator, a target component, and the Dialtone Vue component documentation
must be imported to use the combinator.

The documentation is provided from the consumer's Dialtone Vue so that it is up to
date with the version they are using.

```js
import documentation from '.../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import { $COMPONENT$ } from '@dialpad/dialtone-vue';
import { DtcCombinator } from '@dialpad/dialtone-combinator';
```

*Ideally component-documentation should be included as an export in dialtone-vue, 
but it isn't currently, so it has to be imported using the node_modules path.

### Use

```vue
<dtc-combinator 
  :component="$COMPONENT$"
  :documentation="documentation"
/>
```

## Component Library
_Optional_, _Recommended_

A library _should_ be provided to allow rendering of external components
in slots, such as Dialtone Vue components or icons.

Without the library, only html content and native Vue components
can be compiled in the renderer.

The `library` prop requires a single layered object with key-value pairs
of export name and component definition, respectively.

*Example using DtButton as target component, and Dialtone Vue components
in the library (no icons).

### Import

```js
import documentation from '.../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import { ref } from 'vue';
```

### Use

```vue
<dtc-combinator 
  :component="dialtoneVue.DtButton"
  :documentation="documentation"
  :library="dialtoneVueComponents"
/>
```

```vue
<script setup>
  const dialtoneVueComponents = ref(
    Object.fromEntries(
      Object.entries(dialtoneVue).filter(([exportName]) => {
        return exportName.startsWith('Dt');
      }),
    ),
  );
</script>
```

### Caveats

Since dialtone icons are not exported in a bundle, there is some sorcery required
to provide them as a library. For implementing this, check out 'App.vue' (using require) or
the dialtone project 'client.js' vuepress config file (import from internal dialtone icon data).

## Variants

Variants can be used to customize the data for members of a component.

This is passed to the combinator through the `variants` prop.

The default variant will always exist, even if not declared. However, it can be
overridden by declaring it and setting custom data on members.

<details>
<summary>Format</summary>
<pre>
<code>
{
    VARIANT_NAME: 
    {
        MEMBER_GROUP: 
        {
            MEMBER: 
            {
                MEMBER_FIELD: VALUE,
                ...
            },
            ...
        },
        ...
    },
    ...
}
</code>
</pre>
</details>

<details>
<summary>Example</summary>
<pre>
<code>
{
    default: {
        slots: {
            default: {
                initialValue: 'Place call',
            },
        },
    },
    primary: {
        slots: {
            default: {
                initialValue: 'Primary',
            },
        },
        props: {
            importance: {
                initialValue: 'primary',
                lockControl: true,
            },
        },
    },
}
</code>
</pre>
<i>The 'default' and 'primary' variants for 'DtButton'</i>
</details>

Any data provided will be set on the 'info' object for the member it is provided for.
Most of the time this is overriding data generated from the Dialtone Vue documentation.

There are some special fields that are intended to be used just by variants:
* hideControl: Hides the control for the member in the sidebar
* lockControl: Locks the control for the member in the sidebar

A good place to look to see many of the fields that are used by a member is
'option_bar_member_group.vue', this is where the member data is exposed to the
underlying control.

## Variant Bank
_Optional_

A storage of shared variants can be imported to use with the combinator.

*Example using DtButton as target component

### Import

```js
import documentation from '.../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import { variantBank } from '@dialpad/dialtone-combinator';
import { DtButton } from '@dialpad/dialtone-vue';
import { ref } from 'vue';
```

### Use

```vue
<dtc-combinator 
  :component="DtButton"
  :documentation="documentation"
  :variants="componentVariants"
/>
```

```vue
<script setup>
  const componentVariants = ref(variantBank.DtButton);
</script>
```

## Blueprint Mode

Blueprint mode can be activated to remove the sidebar and settings and just show the
renderer/code panel split view.

```vue
<dtc-combinator
  ...
  :blueprint="true"
/>
```

## Styling

Additional styling classes can be given to the header and root sections
of the combinator.

```vue
<dtc-combinator
  ...
  header-class="d-py32"
  root-class="d-px32"
/>
```
