---
layout: Blank
---

<!-- Just an empty utilitarian page to explore some in a completely blank context -->

<script setup>
import { ref, computed } from 'vue';
import { useThemeManager } from '@composables/useThemeManager';
import ExampleProfileCard from '@exampleComponents/ExampleProfileCard.vue';

const {
  currentMode,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
} = useThemeManager();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const borderless = ref(false);
const outlined = ref(false);
const muted = ref(false);
const showIcon = ref(false);
const showTabEndIcon = ref(false);
const showLeading = ref(false);
const showTrailing = ref(false);
const size = ref('md');
const selectOnFocus = ref(false);
const isDisabled = ref(false);
const labelSizeSelection = ref('default');
const resolvedLabelSize = computed(() => labelSizeSelection.value === 'default' ? undefined : labelSizeSelection.value);
const labelStrengthSelection = ref('default');
const resolvedLabelStrength = computed(() => labelStrengthSelection.value === 'default' ? undefined : labelStrengthSelection.value);
const showLabelClass = ref(false);
const resolvedLabelClass = computed(() => showLabelClass.value ? 'd-bgc-warning' : undefined);
const checkRadioLabelSize = ref('default');
const resolvedCheckRadioLabelSize = computed(() => checkRadioLabelSize.value === 'default' ? undefined : checkRadioLabelSize.value);
const checkRadioLabelStrength = ref('default');
const resolvedCheckRadioLabelStrength = computed(() => checkRadioLabelStrength.value === 'default' ? undefined : checkRadioLabelStrength.value);
const showBtnLeading = ref(false);
const showBtnTrailing = ref(false);
const showBtnStartIcon = ref(false);
const showBtnEndIcon = ref(false);
const removeBtnSlotClass = ref(false);
const highlightBtnSlotClass = ref(false);
const showBtnLabelClass = ref(false);
const resolvedBtnLabelClass = computed(() => showBtnLabelClass.value ? 'd-bgc-warning' : undefined);
const showTabLabelClass = ref(false);
const resolvedTabLabelClass = computed(() => showTabLabelClass.value ? 'd-bgc-warning' : undefined);
const showInputDescription = ref(false);
const showInputMessages = ref(false);
const inputMessages = computed(() => showInputMessages.value ? [{ message: 'Error validation message', type: 'error' }] : []);
const showInputMessagesClass = ref(false);
const resolvedInputMessagesClass = computed(() => showInputMessagesClass.value ? 'd-bgc-critical' : undefined);
const showInputDescriptionClass = ref(false);
const resolvedInputDescriptionClass = computed(() => showInputDescriptionClass.value ? 'd-bgc-success' : undefined);
const showDescription = ref(false);
const showCheckRadioMessages = ref(false);
const checkRadioMessages = computed(() => showCheckRadioMessages.value ? [{ message: 'Error validation message', type: 'error' }] : []);
const showCheckRadioMessagesClass = ref(false);
const resolvedCheckRadioMessagesClass = computed(() => showCheckRadioMessagesClass.value ? 'd-bgc-critical' : undefined);
const showCheckRadioDescriptionClass = ref(false);
const resolvedCheckRadioDescriptionClass = computed(() => showCheckRadioDescriptionClass.value ? 'd-bgc-success' : undefined);
const checkRadioDisabled = ref(false);
</script>

<dt-stack class="d-p-400 d-bgc-primary" gap="400">
  <dt-stack direction="row" gap="100">
    <dt-text as="h1" kind="headline" :size="600">
      Scratchpad
    </dt-text>
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Mode: ${capitalize(currentMode)}`"
          importance="outlined"
          :size="200"
          kind="muted"
          icon-position="right"
          class="dialtone-shell-btn"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon :name="currentModeIconName" :size="iconSize" />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
          heading="Mode"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('system')"
          >
            System
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('light')"
          >
            Light
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('dark')"
          >
            Dark
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'dark' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
          heading="Contrast"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('default')"
          >
            Default
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('high')"
          >
            High
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
  </dt-stack>
  <article>

# Focusgroup directive

Declarative roving tabindex for composite widgets. Manages arrow-key navigation,
`tabindex` management, looping, focus memory, and disabled-item skipping — following
the [Open UI focusgroup proposal](https://open-ui.org/components/scoped-focusgroup.explainer/).

The directive handles **focus movement only**. Activation and selection (toggling
`aria-selected`, `aria-checked`, etc.) remain the consumer's responsibility.

## Usage

Import and install the directive:

```js
import { DtFocusgroupDirective } from "@dialpad/dialtone-vue";
app.use(DtFocusgroupDirective);
```

### Basic usage

Just add `v-dt-focusgroup` and any focusable child will be managed by the focusgroup.

> [!WARNING] Always pair with an ARIA role
> The directive manages keyboard focus but does not set any ARIA attributes. For screen readers to announce the widget correctly, you must provide a `role` (`toolbar`, `tablist`, `listbox`, `radiogroup`, `menu`), an accessible name (`aria-label`), and `aria-orientation` when the axis differs from the role's default. Without a role, the container is opaque to assistive technology — arrow-key cycling works, but the user has no context for what they're navigating.

```vue demo
<dt-stack v-dt-focusgroup direction="row" gap="100">
  <dt-button kind="muted" importance="outlined">Button</dt-button>
  <dt-button kind="muted" importance="outlined">Button</dt-button>
  <dt-button kind="muted" importance="outlined">Button</dt-button>
</dt-stack>
```

### Token syntax

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Formatting">
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-button kind="muted" importance="outlined">Italic</dt-button>
  <dt-button kind="muted" importance="outlined">Underline</dt-button>
</dt-stack>
```

### Object syntax

```vue demo
<dt-stack gap="100" role="listbox" v-dt-focusgroup="{ axis: 'vertical', loop: false }" aria-label="Fruits">
  <dt-button role="option" kind="muted" importance="outlined">Apple</dt-button>
  <dt-button role="option" kind="muted" importance="outlined">Banana</dt-button>
</dt-stack>
```

```vue demo
<dt-stack direction="row" gap="100" role="listbox" aria-orientation="horizontal" v-dt-focusgroup="{ axis: 'horizontal', loop: false }" aria-label="Fruits">
  <dt-button role="option" kind="muted" importance="outlined">Apple</dt-button>
  <dt-button role="option" kind="muted" importance="outlined">Banana</dt-button>
</dt-stack>
```

### Vertical toolbar

```vue demo
<dt-stack gap="100" role="toolbar" aria-orientation="vertical" v-dt-focusgroup="'vertical'" aria-label="Formatting">
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-button kind="muted" importance="outlined">Italic</dt-button>
  <dt-button kind="muted" importance="outlined">Underline</dt-button>
</dt-stack>
```

### noloop — focus stops at boundaries

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal noloop'" aria-label="Pagination">
  <dt-button kind="muted" importance="outlined">First</dt-button>
  <dt-button kind="muted" importance="outlined">Previous</dt-button>
  <dt-button kind="muted" importance="outlined">Next</dt-button>
  <dt-button kind="muted" importance="outlined">Last</dt-button>
</dt-stack>
```

### nomemory — re-entry always starts at first item

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal nomemory'" aria-label="Actions">
  <dt-button kind="muted" importance="outlined">Cut</dt-button>
  <dt-button kind="muted" importance="outlined">Copy</dt-button>
  <dt-button kind="muted" importance="outlined">Paste</dt-button>
</dt-stack>
```

### Disabled items — skipped by default

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Tools">
  <dt-button kind="muted" importance="outlined">Pen</dt-button>
  <dt-button kind="muted" importance="outlined" disabled>Eraser (disabled)</dt-button>
  <dt-button kind="muted" importance="outlined">Highlighter</dt-button>
</dt-stack>
```

### noskipdisabled — disabled items remain focusable

```vue demo
<dt-stack direction="row" gap="100" role="tablist" v-dt-focusgroup="'horizontal nomemory'" aria-label="Platforms">
  <dt-button role="tab" kind="muted" importance="outlined">Mac</dt-button>
  <dt-button role="tab" kind="muted" importance="outlined" class="d-btn--disabled" aria-disabled="true">Windows (disabled)</dt-button>
  <dt-button role="tab" kind="muted" importance="outlined">Linux</dt-button>
</dt-stack>
```

### dt-focusgroup-move event — selection follows focus

```vue demo
<dt-stack direction="row" gap="100" role="tablist" v-dt-focusgroup="'horizontal nomemory'" aria-label="Tabs" @dt-focusgroup-move="$event.detail.item.setAttribute('aria-selected', 'true'); $event.detail.previousItem.setAttribute('aria-selected', 'false')">
  <dt-button role="tab" kind="muted" importance="clear" aria-selected="true">One</dt-button>
  <dt-button role="tab" kind="muted" importance="clear" aria-selected="false">Two</dt-button>
  <dt-button role="tab" kind="muted" importance="clear" aria-selected="false">Three</dt-button>
</dt-stack>
```

### Item opt-out

Add `data-dt-focusgroup-skip` to exclude an element from arrow-key navigation
(e.g., text inputs that need their own arrow keys):

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Formatting with opt-out">
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-input data-dt-focusgroup-skip placeholder="This will be skipped" />
  <dt-button kind="muted" importance="outlined">Code</dt-button>
  <dt-link data-dt-focusgroup-skip>Skipped Text link</dt-link>
  <dt-button kind="muted" importance="outlined">Code</dt-button>
</dt-stack>
```

### Mixed focusable elements

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Mixed elements">
  <dt-button kind="muted" importance="outlined">Button</dt-button>
  <dt-link>Link</dt-link>
  <dt-select-menu
    :options="[
          { value: ``, label: `Please select one` },
          { value: `1`, label: `Option 1` },
          { value: `2`, label: `Option 2` },
          { value: `3`, label: `Option 3` },
        ]"
    label="Default"
    :model-value="modelValue"
    :label-visible="false"
    @input="onInput"
    @change="onChange"
  />
</dt-stack>
```

### Nesting depth

Items do not need to be direct children. The directive uses `querySelectorAll`
on the container, finding items at any nesting depth in DOM order:

```vue demo
<dt-stack direction="row" gap="100" role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Nested groups">
  <dt-stack direction="row" gap="100" class="d-bgc-moderate-opaque d-p-100">
    <dt-button kind="muted" importance="outlined">btn</dt-button>
    <dt-button kind="muted" importance="outlined">btn</dt-button>
    <dt-button kind="muted" importance="outlined">btn</dt-button>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-moderate-opaque d-p-100">
    <dt-button kind="muted" importance="outlined">btn</dt-button>
    <dt-button kind="muted" importance="outlined">btn</dt-button>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-moderate-opaque d-p-100">
    <dt-link>text link a</dt-link>
    <dt-link>text link b</dt-link>
  </dt-stack>
</dt-stack>
```

## Recipes

Real-world patterns showing how `v-dt-focusgroup` composes with Dialtone components.

### Table with row navigation

```vue demo
<table class="d-table dialtone-doc-table" v-dt-focusgroup="{ axis: 'vertical', selector: 'tbody tr' }" aria-label="Office List">
  <caption class="d-table__caption">Office List</caption>
  <thead>
    <tr>
      <th scope="col">Office</th>
      <th scope="col">Country</th>
      <th scope="col" width="10%">Employees</th>
      <th scope="col" colspan="2">Contact</th>
    </tr>
  </thead>
  <tbody>
    <tr class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer" tabindex="0">
      <th scope="row">Austin, TX</th>
      <td>United States</td>
      <td>48</td>
      <td>Henna Ferry</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 1</dt-button></td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 2</dt-button></td>
    </tr>
    <tr class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer" tabindex="-1">
      <th scope="row">Bangalore</th>
      <td>India</td>
      <td>13</td>
      <td>Arun Chadda</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 1</dt-button></td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 2</dt-button></td>
    </tr>
    <tr class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer" tabindex="-1">
      <th scope="row">San Francisco, CA</th>
      <td>United States</td>
      <td>108</td>
      <td>Shane Holmes</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 1</dt-button></td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 2</dt-button></td>
    </tr>
    <tr class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer" tabindex="-1">
      <th scope="row">Vancouver, BC</th>
      <td>Canada</td>
      <td>76</td>
      <td>Kendal Lewis</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 1</dt-button></td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="200">Button 2</dt-button></td>
    </tr>
  </tbody>
</table>
```

### Inbox

```vue demo
<dt-stack role="list" v-dt-focusgroup="'vertical'" aria-label="Contacts">
  <dt-stack role="listitem" tabindex="0" gap="100" class="d-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar8">
    <dt-stack direction="row" gap="100" class="d-w100p">
      <dt-avatar full-name="Ashanti Trevor" />
      <dt-stack class="d-fl1">
        <dt-text kind="body" :size="200" strength="bold">Ashanti Trevor</dt-text>
        <dt-stack direction="row" gap="50">
          <dt-stack direction="row" gap="100">
            <dt-icon name="phone-outgoing" size="200" class="d-fc-tertiary" />
            <dt-text kind="body" :size="100" tone="tertiary">Outgoing call</dt-text>
          </dt-stack>
          <dt-text kind="body" :size="100" tone="tertiary">&bull;</dt-text>
          <dt-text kind="body" :size="100" tone="tertiary">2 minutes 10 seconds</dt-text>
        </dt-stack>
      </dt-stack>
      <dt-text kind="body" :size="200" tone="tertiary" numeric>3:23 pm</dt-text>
      <dt-badge kind="count" type="bulletin" text="6" />
    </dt-stack>
  </dt-stack>
  <dt-stack role="listitem" tabindex="0" gap="100" class="d-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar8">
    <dt-stack direction="row" gap="100" class="d-w100p">
      <dt-avatar full-name="Marcus Chen" />
      <dt-stack class="d-fl1">
        <dt-text kind="body" :size="200" strength="bold">Marcus Chen</dt-text>
        <dt-stack direction="row" gap="50">
          <dt-stack direction="row" gap="100">
            <dt-icon name="phone-incoming" size="200" class="d-fc-tertiary" />
            <dt-text kind="body" :size="100" tone="tertiary">Incoming call</dt-text>
          </dt-stack>
          <dt-text kind="body" :size="100" tone="tertiary">&bull;</dt-text>
          <dt-text kind="body" :size="100" tone="tertiary">14 minutes 32 seconds</dt-text>
        </dt-stack>
      </dt-stack>
      <dt-text kind="body" :size="200" tone="tertiary" numeric>1:47 pm</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack role="listitem" tabindex="0" gap="100" class="d-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar8">
    <dt-stack direction="row" gap="100" class="d-w100p">
      <dt-avatar full-name="Priya Sharma" />
      <dt-stack class="d-fl1">
        <dt-text kind="body" :size="200" strength="bold">Priya Sharma</dt-text>
        <dt-stack direction="row" gap="50">
          <dt-stack direction="row" gap="100">
            <dt-icon name="phone-missed" size="200" class="d-fc-critical" />
            <dt-text kind="body" :size="100" tone="tertiary">Missed call</dt-text>
          </dt-stack>
          <dt-text kind="body" :size="100" tone="tertiary">&bull;</dt-text>
          <dt-text kind="body" :size="100" tone="tertiary">0 seconds</dt-text>
        </dt-stack>
      </dt-stack>
      <dt-text kind="body" :size="200" tone="tertiary" numeric>11:05 am</dt-text>
      <dt-badge kind="count" type="bulletin" text="3" />
    </dt-stack>
  </dt-stack>
</dt-stack>
```

### Contact List, with custom selector


```vue demo
<dt-stack role="list" v-dt-focusgroup="{ axis: 'vertical', loop: false, selector: '[data-custom-attribute-name]' }" aria-label="Contacts" class="d-w-400">
  <dt-hovercard placement="right">
    <template #anchor>
      <dt-recipe-contact-row data-custom-attribute-name role="listitem" name="Ashanti Trevor" avatar-presence="active" user-status="Good morning!" has-call-button />
    </template>
    <template #content>
      <ExampleProfileCard />
    </template>
  </dt-hovercard>
  <dt-hovercard placement="right">
    <template #anchor>
      <dt-recipe-contact-row data-custom-attribute-name role="listitem" name="Marcus Chen" avatar-presence="away" presence-text="Away" user-status="Out for a bit" has-call-button />
    </template>
    <template #content>
      <ExampleProfileCard />
    </template>
  </dt-hovercard>
  <dt-hovercard placement="right">
    <template #anchor>
      <dt-recipe-contact-row data-custom-attribute-name role="listitem" name="Priya Sharma" avatar-presence="busy" presence-text="In a meeting" user-status="Meetings all day" has-call-button />
    </template>
    <template #content>
      <ExampleProfileCard />
    </template>
  </dt-hovercard>
  <dt-hovercard placement="right">
    <template #anchor>
      <dt-recipe-contact-row data-custom-attribute-name role="listitem" name="Jordan Kim" unread-count="3" :has-unreads="true" has-call-button />
    </template>
    <template #content>
      <ExampleProfileCard />
    </template>
  </dt-hovercard>
</dt-stack>
```

  </article>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Disabled Button
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Not just a matter of applying opacity to whole button, but w/ combination of `color-mix()` and tweaking existing DtButton css variables via `oklch()` of specific properties – separate opacity and saturation for border, bgc, fc, etc.
    </dt-text>
    <dt-stack class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <span>
        <dt-checkbox v-model="isDisabled">Disabled</dt-checkbox>
      </span>
    </dt-stack>
    <dt-stack gap="100" ref="disabledAll">
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="outlined"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="clear"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="danger"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="outlined"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="clear"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="positive">Place Call<template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="outlined">Place Call<template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="clear">Place Call<template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="muted" importance="clear"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="muted" importance="outlined"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Button: Leading/Trailing
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Freeform elements that are rendered before/after the button content.
    </dt-text>
    <dt-stack gap="200" direction="row" align="baseline" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-checkbox v-model="showBtnLeading">
        Leading
      </dt-checkbox>
      <dt-checkbox v-model="showBtnTrailing">
        Trailing
      </dt-checkbox>
      <dt-checkbox v-model="showBtnStartIcon">
        Start Icon
      </dt-checkbox>
      <dt-checkbox v-model="showBtnEndIcon">
        End Icon
      </dt-checkbox>
      <dt-checkbox v-model="showBtnLabelClass">
        `labelClass`
      </dt-checkbox>
      <dt-checkbox v-model="removeBtnSlotClass">
        Remove leading/trailing class
      </dt-checkbox>
      <dt-checkbox v-model="highlightBtnSlotClass">
        Highlight leading/trailing
      </dt-checkbox>
    </dt-stack>
    <dt-stack gap="100" direction="row">
      <dt-button kind="muted" importance="outlined" :size="100" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-25', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-1', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="200" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-25', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-50', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="300" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-50', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-100', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="400" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-100', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-125', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="500" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-100', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-150', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Sizing update: Button/Input/Select
    </dt-text>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="100"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" :size="100" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="100"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="200"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" :size="200" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="200"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="300"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" :size="300" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="300"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="400"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" :size="400" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="400"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="500"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" :size="500" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="500"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Input / Select
    </dt-text>
    <dt-stack gap="200" direction="row" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-select-menu
        label="Label Size"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
        ]"
        :model-value="labelSizeSelection"
        @change="labelSizeSelection = $event"
      />
      <dt-select-menu
        label="Label Strength"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'bold', label: 'bold' },
          { value: 'semibold', label: 'semibold' },
          { value: 'medium', label: 'medium' },
          { value: 'normal', label: 'normal' },
        ]"
        :model-value="labelStrengthSelection"
        @change="labelStrengthSelection = $event"
      />
      <dt-checkbox v-model="showLabelClass">`labelClass`</dt-checkbox>
      <dt-checkbox v-model="showInputDescription">Description</dt-checkbox>
      <dt-checkbox v-model="showInputMessages">Messages</dt-checkbox>
      <dt-checkbox v-model="showInputMessagesClass">`messagesClass`</dt-checkbox>
      <dt-checkbox v-model="showInputDescriptionClass">`descriptionClass`</dt-checkbox>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-stack gap="100" class="d-fl1">
        <dt-input label="Extra Small" type="text" placeholder="Placeholder" :size="100" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Small" type="text" placeholder="Placeholder" :size="200" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Medium" type="text" placeholder="Placeholder" :size="300" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Large" type="text" placeholder="Placeholder" :size="400" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Extra large" type="text" placeholder="Placeholder" :size="500" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          :size="100"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          :size="200"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          :size="300"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          :size="400"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          :size="500"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Tabs
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Just straight up refactor to use DtButton instead of custom markup/style. Use mix of DtButton variants depending on `active`. Uses all DtButton sizes (currently at least).
    </dt-text>
    <dt-stack gap="200" direction="row" align="baseline" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-checkbox v-model="borderless">
        Borderless
      </dt-checkbox>
      <dt-checkbox v-model="outlined">
        Outlined
      </dt-checkbox>
      <dt-checkbox v-model="muted">
        Muted
      </dt-checkbox>
      <dt-checkbox v-model="showIcon">
        Start Icon
      </dt-checkbox>
      <dt-checkbox v-model="showTabEndIcon">
        End Icon
      </dt-checkbox>
      <dt-checkbox v-model="showLeading">
        Leading
      </dt-checkbox>
      <dt-checkbox v-model="showTrailing">
        Trailing
      </dt-checkbox>
      <dt-checkbox v-model="selectOnFocus">
        Select on focus
      </dt-checkbox>
      <dt-checkbox v-model="showTabLabelClass">
        `labelClass`
      </dt-checkbox>
      <dt-select-menu
        :options="[
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md (default)' },
          { value: 'lg', label: 'lg' },
          { value: 'xl', label: 'xl' },
        ]"
        :model-value="size"
        @change="size = $event"
      />
    </dt-stack>
    <dt-stack gap="25" hidden>
      <dt-text as="h3" kind="headline" :size="300">
        Backwards-compatible old tabs html
      </dt-text>
      <div>
        <div class="d-tablist" role="tablist" aria-label=""><button
            class="base-button__button d-btn d-btn--primary d-tab d-tab--selected" data-qa="dt-tab" aria-label=""
            type="button" id="dt-tab-1" role="tab" aria-selected="true" aria-controls="dt-panel-2"
            tabindex="0"><!----><!----><span data-qa="dt-button-label" class="base-button__label d-btn__label">
              <p>
                First tab
              </p>
            </span></button> <button class="base-button__button d-btn d-btn--primary d-tab" data-qa="dt-tab" aria-label=""
            type="button" id="dt-tab-3" role="tab" aria-selected="false" aria-controls="dt-panel-4"
            tabindex="-1"><!----><!----><span data-qa="dt-button-label" class="base-button__label d-btn__label">
              <p>
                Second tab
              </p>
            </span></button> <button class="base-button__button d-btn d-btn--primary d-tab" data-qa="dt-tab"
            aria-label="Third Label" type="button" id="dt-tab-5" role="tab" aria-selected="false" aria-controls="dt-panel-6"
            tabindex="-1"><!----><!----><span data-qa="dt-button-label" class="base-button__label d-btn__label">
              <p>
                Third tab
              </p>
            </span></button></div>
      </div>
    </dt-stack>
    <dt-tab-group :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Argentina
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="3" panel-id="4" leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United States
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="5" panel-id="6" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United Kingdom
        </dt-tab>
        <dt-tab id="7" panel-id="8" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          India
        </dt-tab>
        <dt-tab id="9" panel-id="10" disabled :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Canada
        </dt-tab>
      </template>
      <div class="d-py-100">
        <dt-tab-panel id="2" tab-id="1">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/Argentina" target="_blank">Argentina</dt-link> stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
            <dt-text as="p" kind="body" :size="300">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="4" tab-id="3">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_States">United States</dt-link> spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
            <dt-text as="p" kind="body" :size="300">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
            <dt-text as="p" kind="body" :size="300">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="6" tab-id="5">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_Kingdom" target="_blank">United Kingdom</dt-link> comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
            <dt-text as="p" kind="body" :size="300">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="8" tab-id="7">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/India" target="_blank">India</dt-link> extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
            <dt-text as="p" kind="body" :size="300">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="10" tab-id="9">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/Canada" target="_blank">Canada</dt-link> stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
            <dt-text as="p" kind="body" :size="300">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
          </dt-stack>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
    <dt-tab-group tab-list-class="d-w264" orientation="vertical" :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Argentina
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="3" panel-id="4" leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United States
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="5" panel-id="6" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United Kingdom
        </dt-tab>
        <dt-tab id="7" panel-id="8" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          India
        </dt-tab>
        <dt-tab id="9" panel-id="10" disabled :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Canada
        </dt-tab>
      </template>
      <div class="d-pis-300 d-w100p d-py-50">
        <dt-tab-panel id="2" tab-id="1">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/Argentina" target="_blank">Argentina</dt-link> stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
            <dt-text as="p" kind="body" :size="300">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="4" tab-id="3">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_States" target="_blank">United States</dt-link> spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
            <dt-text as="p" kind="body" :size="300">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
            <dt-text as="p" kind="body" :size="300">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="6" tab-id="5">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_Kingdom" target="_blank">United Kingdom</dt-link> comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
            <dt-text as="p" kind="body" :size="300">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="8" tab-id="7">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/India" target="_blank">India</dt-link> extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
            <dt-text as="p" kind="body" :size="300">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="10" tab-id="9">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">Canada stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
            <dt-text as="p" kind="body" :size="300">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
          </dt-stack>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Notice / Banner / Toast
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Updated typography sizing and intelligent icon alignment. Icon margin adjusts based on content layout: title-only, message-only, or title+message.
    </dt-text>
    <dt-stack gap="200">
      <dt-text as="h2" kind="headline" :size="400">
        Notice
      </dt-text>
      <div class="d-d-grid d-g-400 d-g-cols2">
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Default</dt-text>
          <dt-notice kind="success" title="Success" hide-action>
            Action completed successfully.
          </dt-notice>
          <dt-notice kind="warning" title="Warning" hide-action>
            Please review before proceeding.
          </dt-notice>
          <dt-notice kind="error" title="Error" hide-action>
            Something went wrong. Please try again.
          </dt-notice>
          <dt-notice kind="base" title="Base" hide-action>
            A neutral notice for general information.
          </dt-notice>
        </dt-stack>
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Important</dt-text>
          <dt-notice kind="info" title="Important info" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
          <dt-notice kind="success" title="Important success" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
          <dt-notice kind="warning" title="Important warning" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
          <dt-notice kind="error" title="Important error" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
        </dt-stack>
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Alignment per internal parts</dt-text>
          <dt-notice kind="info" title="Title only" hide-action />
          <dt-notice kind="info" hide-action>
            Message only — icon aligns to center when there is a single line of content.
          </dt-notice>
          <dt-notice kind="info" title="Title and message" hide-action>
            When both title and message are present, the icon aligns to the top of the content stack.
          </dt-notice>
        </dt-stack>
      </div>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text as="h2" kind="headline" :size="400">
        Banner
      </dt-text>
      <dt-stack gap="100">
        <dt-banner kind="info" title="Info banner" class="d-ps-relative d-zi-base">
          Banners are more prominent than notices.
        </dt-banner>
        <dt-banner kind="success" title="Success banner" class="d-ps-relative d-zi-base">
          Action completed successfully.
        </dt-banner>
        <dt-banner kind="warning" title="Warning banner" class="d-ps-relative d-zi-base">
          Please review before proceeding.
        </dt-banner>
        <dt-banner kind="error" title="Error banner" class="d-ps-relative d-zi-base">
          Something went wrong.
        </dt-banner>
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="h3" kind="headline" :size="300">Important</dt-text>
        <dt-banner kind="info" title="Info banner" :important="true" class="d-ps-relative d-zi-base">
          Banners are more prominent than notices.
        </dt-banner>
        <dt-banner kind="success" title="Success banner" :important="true" class="d-ps-relative d-zi-base">
          Action completed successfully.
        </dt-banner>
        <dt-banner kind="warning" title="Warning banner" :important="true" class="d-ps-relative d-zi-base">
          Please review before proceeding.
        </dt-banner>
        <dt-banner kind="error" title="Error banner" :important="true" class="d-ps-relative d-zi-base">
          Something went wrong.
        </dt-banner>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text as="h2" kind="headline" :size="400">
        Toast
      </dt-text>
      <div class="d-d-grid d-g-400 d-g-cols2">
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Default</dt-text>
          <dt-toast :show="true" kind="info" title="Info toast" message="Informational message." :duration="null" />
          <dt-toast :show="true" kind="success" title="Success toast" message="Action completed." :duration="null" />
          <dt-toast :show="true" kind="warning" title="Warning toast" message="Review before proceeding." :duration="null" />
          <dt-toast :show="true" kind="error" title="Error toast" message="Something went wrong." :duration="null" />
          <dt-toast :show="true" kind="base" title="Base toast" message="Neutral notification." :duration="null" />
        </dt-stack>
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Important</dt-text>
          <dt-toast :show="true" kind="info" title="Info toast" message="Informational message." :important="true" :duration="null" />
          <dt-toast :show="true" kind="success" title="Success toast" message="Action completed." :important="true" :duration="null" />
          <dt-toast :show="true" kind="warning" title="Warning toast" message="Review before proceeding." :important="true" :duration="null" />
          <dt-toast :show="true" kind="error" title="Error toast" message="Something went wrong." :important="true" :duration="null" />
          <dt-toast :show="true" kind="base" title="Base toast" message="Neutral notification." :important="true" :duration="null" />
        </dt-stack>
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Alignment per internal parts</dt-text>
          <dt-toast :show="true" kind="info" title="Title only" :duration="null" />
          <dt-toast :show="true" kind="info" message="Action completed." :duration="null" />
          <dt-toast :show="true" kind="info" title="Title and message" message="Review before proceeding." :duration="null" />
        </dt-stack>
      </div>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Radio / Checkbox
    </dt-text>
    <dt-stack gap="200" direction="row" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-select-menu
        label="Label Size"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
        ]"
        :model-value="checkRadioLabelSize"
        @change="checkRadioLabelSize = $event"
      />
      <dt-select-menu
        label="Label Strength"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'bold', label: 'bold' },
          { value: 'semibold', label: 'semibold' },
          { value: 'medium', label: 'medium' },
          { value: 'normal', label: 'normal' },
        ]"
        :model-value="checkRadioLabelStrength"
        @change="checkRadioLabelStrength = $event"
      />
      <dt-checkbox v-model="showDescription">Description</dt-checkbox>
      <dt-checkbox v-model="checkRadioDisabled">Disabled</dt-checkbox>
      <dt-checkbox v-model="showLabelClass">`labelClass`</dt-checkbox>
      <dt-checkbox v-model="showCheckRadioMessages">Messages</dt-checkbox>
      <dt-checkbox v-model="showCheckRadioMessagesClass">`messagesClass`</dt-checkbox>
      <dt-checkbox v-model="showCheckRadioDescriptionClass">`descriptionClass`</dt-checkbox>
    </dt-stack>
    <dt-stack gap="200" direction="row">
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="h2" kind="headline" :size="400">Checkbox</dt-text>
        <dt-checkbox label="Checkbox label" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this checkbox' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-checkbox label="Checkbox label" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this checkbox' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-checkbox label="Checkbox label" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this checkbox' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="h2" kind="headline" :size="400">Radio</dt-text>
        <dt-radio label="Radio label" value="1" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this radio' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-radio label="Radio label" value="2" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this radio' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-radio label="Radio label" value="3" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this radio' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-stack>
<div class="d-h-1200"></div>
