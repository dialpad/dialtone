# Tabs

Tabs allow users to navigation between grouped content in different views while within the same page context.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
- **Keywords**: tab panel, tab navigation, d-tabs, DtTabs, dt-tabs, segmented control, tabbar

## Variants

### Default

```vue
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>
  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
```

### Borderless

Add a `d-tablist--no-border` to remove the bottom border of any tablist. Handy for small tablists and tablists serving as subtabs to a larger menu.

```vue
<dt-tab-group :borderless="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
```

### Inverted

Add `d-tablist--inverted` when you want to display tabs on inverted background.

```vue
<dt-tab-group :inverted="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
```

### Disabled

```vue
<dt-tab-group :disabled="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4" disabled>
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
```

## Sizes

### Default

```vue
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>
  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
```

### Small

```vue
<dt-tab-group size="sm">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
```

## Advanced Usages

### Validation Before Changing Tabs

If you need to do some validation before changing tabs, you can use the `before-change` event. If the event handler is prevented, the tab change will be cancelled.

```vue
<dt-tab-group
  size="sm"
  @before-change="confirmBeforeLeave"
>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>
  <template #default>
    <div>
      <dt-tab-panel id="2" tab-id="1">
        <p>First Panel</p>
      </dt-tab-panel>
      <dt-tab-panel id="4" tab-id="3">
        <p>Second Panel</p>
      </dt-tab-panel>
      <dt-tab-panel id="6" tab-id="5">
        <p>Third Panel</p>
      </dt-tab-panel>
    </div>
  </template>
</dt-tab-group>
<script setup>
  function confirmBeforeLeave (event) {
    const confirmed = confirm("Are you sure to change tab?");
    if (!confirmed) {
      event.preventDefault();
    }
  }
</script>
```

## Vue API

### Tab Group

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `label` | Identifies the tab group | `string` | `''` |
| `selected` | The id of the selected tab panel which should be displayed | `string` | `''` |
| `disabled` | If true, disables the tab group | `boolean` | `false` |
| `inverted` | If true, applies inverted styles to the tab group | `boolean` | `false` |
| `borderless` | If true, applies borderless styles to the tab group | `boolean` | `false` |
| `size` | If provided, applies size styles to the tab group | `string` | `'default'` |
| `tabListClass` | Pass through classes, used to customize the tab list | `string\|array\|object` | `''` |
| `tabListChildProps` | Pass through props, used to customize the tab list | `object` | `{}` |

### Slots

| Name | Description |
| --- | --- |
| `tabs` | Slot for Tabs |
| `default` | Default slot for Panel |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `change` | Change tab event with the arguments: selected id of the current tab and disabled value | `Object` |
| `before-change` | Before change tab event with the event argument, useful to perform validations and prevent changing tabs if neccessary. | `Event` |

### Tab Panel

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | Id of the panel | `string` | `''` |
| `tabId` | Id of the associated tab | `string` | `''` |
| `hidden` | If true, hides the tab content | `boolean` | `false` |
| `tabPanelClass` | Used to customize the tab element | `string\|array\|object` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for Tab Panel |

### Tab

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | Id of the tab | `string` | `''` |
| `panelId` | Id of the associated content panel | `string` | `''` |
| `label` | Describes the tab | `string` | `''` |
| `selected` | Controls the state of the tab | `boolean` | `false` |
| `disabled` | If true, disables the tab | `boolean` | `false` |
| `tabClass` | Used to customize the tab element | `string\|array\|object` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `default` | default slot, defaults contains dt-button |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `focus` | Native button focus in event | `FocusEvent` |
| `click` | Native button click event | `PointerEvent \| KeyboardEvent` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-tablist` | N/A | Parent wrapper class for the tablist. |
| `d-tablist--no-border` | .d-tablist | Styles tablist without a bottom border. |
| `d-tablist--sm` | N/A | Resizes the tablist to a smaller size. |
| `d-tablist--inverted` | N/A | Inverts the tablist to work on dark backgrounds. |
| `d-tab` | N/A | Styles each tab. |
| `d-tab--selected` | .d-tab | Styles the selected tab. |

## Accessibility

To create accessible tabs, be sure to implement the <a class="d-link" href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-2/tabs.html" target="_blank">proper keyboard navigation</a> and utilize the following ARIA roles to properly declare element roles, content relationships, and current status:

| Item | Applies to | Description |
| --- | --- | --- |
| `role="tablist"` | .d-tablist | A container for all tab role elements. (Source) |
| `aria-label="Tab Title"` | .d-tablist | Use to the tablist element, this provides a common, readable title for what content the tab group provides. |
| `role="tab"` | .d-tab | Indicates an interactive element within a tablist. Elements with a tab role must either be a child of a tablist or have an id part of the aria-owns property of a tablist. (Source) |
| `aria-controls="[tabpanel-id]"` | .d-tab | Use on the tab element, this communicates a connection between a tab and a tabpanel. (Source) |
| `aria-selected="[true/false]"` | .d-tab--selected | Use on the tab element, this is set to true when it is the selected element. It is set to false when it is not selected. (Source) |
| `id="[unique-id]"` | .d-tab | Use on the tab element, this provides a unique identifier that the tabpanel can reference with the aria-labelledby attribute. |
| `role="tabpanel"` | N/A | Use on the container for content associated with a tab. (Source) |
| `id="[unique-id]"` | N/A | Use on the tabpanel element, this provides a unique identifier that the tab can reference with the aria-controls attribute. |
| `aria-labelledby="[tab-id]"` | N/A | Use on the tabpanel element, this communicates a connection between a tabpanel and a tab. (Source) |
| `hidden` | N/A | Use on the tabpanel element, use this to hide tabpanels that are not currently selected. |
