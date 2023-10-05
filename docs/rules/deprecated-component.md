# Finds deprecated components that should be replaced by Dialtone Vue components

## Rule Details

This informs developers of deprecated product side components that should be replaced by Dialtone Vue components. It will suggest a replacement component.

Currently the components with the below filenames are considered deprecated:

- select_menu
- dropdown_menu
- base_toggle
- base_date_picker
- checkbox

This rule specifically targets components in ubervoice. If you are using Dialtone Vue outside of ubervoice you should not enable this rule.

Examples of **incorrect** code for this rule:

**import of a deprecated component**:

```js
import SelectMenu from '../components/select_menu.vue';
```

Examples of **correct** code for this rule:

**import of a Dialtone Vue component**:

```js
import { DtComboboxWithPopover } from '@dialpad/dialtone-vue';
```

**import of a custom local component**:

```js
import MyComponent from './my_component.vue';
```
