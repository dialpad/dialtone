---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2129-4760
keywords: ["tab panel", "tab navigation", "d-tabs", "DtTabs", "dt-tabs", "segmented control", "tabbar"]
---

<component-combinator component-name="DtTabGroup" />

## Variants

### Default

```vue demo
<div class="d-w100p">
  <example-tabs />
</div>
<!-- @code -->
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

### Borderless

Remove the bottom border of any tablist.

```vue demo
<div class="d-w100p">
  <example-tabs borderless />
</div>
<!-- @code -->
<dt-tab-group borderless>
  ...
</dt-tab-group>
```

### Muted

All tabs render as muted buttons. The selected tab is distinguished with active styling.

```vue demo
<div class="d-w100p">
  <example-tabs kind="muted" />
</div>
<!-- @code -->
<dt-tab-group kind="muted">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

### Outlined

The selected tab renders with an outlined border instead of a filled style.

```vue demo
<div class="d-w100p">
  <example-tabs outlined />
</div>
<!-- @code -->
<dt-tab-group outlined>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

### Muted Outlined

Combines muted kind with outlined selected state.

```vue demo
<div class="d-w100p">
  <example-tabs kind="muted" outlined />
</div>
<!-- @code -->
<dt-tab-group kind="muted" outlined>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

### Disabled

Add `disabled` to a specific tab.

```vue demo
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
    <dt-tab id="7" panel-id="8" disabled>Fourth</dt-tab>
  </template>
</dt-tab-group>
```

Add `disabled` to the tab group to disable all.

```vue demo
<example-tabs disabled />
<!-- @code -->
<dt-tab-group disabled>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

### Inverted

<dt-notice title="Deprecated" kind="info" class="d-wmx100p d-my-200" hide-close>
  The <code>inverted</code> prop has been deprecated. Use the <dt-link to="mode-island.html#inverting">v-dt-mode directive</dt-link> instead.
</dt-notice>

In place of the `inverted` prop, use the [v-dt-mode directive](mode-island.html#inverting) on the component element.

```vue demo
<div class="d-p-100 d-bgc-contrast d-w100p">
  <div v-dt-mode:invert class="d-p-200 d-bar8">
    <example-tabs />
  </div>
</div>
<!-- @code -->
<dt-tab-group v-dt-mode:invert>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
  </template>
</dt-tab-group>
```

## Spread

Control how tabs distribute available horizontal space within the tab list. It only applies to horizontal tabs, and has no effect with `orientation="vertical"`.

### Grow

Tabs expand proportionally to fill the container. Longer labels receive more space.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-tab-group spread="grow">
    <template #tabs>
      <dt-tab id="sg1" panel-id="sg2" selected>Tab 1</dt-tab>
      <dt-tab id="sg3" panel-id="sg4">Tab the second</dt-tab>
      <dt-tab id="sg5" panel-id="sg6">Tab the third</dt-tab>
    </template>
  </dt-tab-group>
</div>
```

### Equal

All tabs share the same width, regardless of label length.

```vue demo
<!-- @wrapper -->
<div class="d-w-800">
  <dt-tab-group spread="equal">
    <template #tabs>
      <dt-tab id="se1" panel-id="se2" selected>Tab 1</dt-tab>
      <dt-tab id="se3" panel-id="se4">Tab the second</dt-tab>
      <dt-tab id="se5" panel-id="se6">Tab the third</dt-tab>
    </template>
  </dt-tab-group>
</div>
```

## Sizes

```vue demo
<dt-stack gap="200" class="d-w100p">
  <dt-tab-group :size="100">
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>
        First
      </dt-tab>
      <dt-tab id="3" panel-id="4">
        Second
      </dt-tab>
      <dt-tab id="5" panel-id="6">
        Third
      </dt-tab>
    </template>
  </dt-tab-group>
  <dt-tab-group :size="200">
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>
        First
      </dt-tab>
      <dt-tab id="3" panel-id="4">
        Second
      </dt-tab>
      <dt-tab id="5" panel-id="6">
        Third
      </dt-tab>
    </template>
  </dt-tab-group>
  <dt-tab-group>
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>
        First
      </dt-tab>
      <dt-tab id="3" panel-id="4">
        Second
      </dt-tab>
      <dt-tab id="5" panel-id="6">
        Third
      </dt-tab>
    </template>
  </dt-tab-group>
  <dt-tab-group :size="400">
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>
        First
      </dt-tab>
      <dt-tab id="3" panel-id="4">
        Second
      </dt-tab>
      <dt-tab id="5" panel-id="6">
        Third
      </dt-tab>
    </template>
  </dt-tab-group>
  <dt-tab-group :size="500">
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>
        First
      </dt-tab>
      <dt-tab id="3" panel-id="4">
        Second
      </dt-tab>
      <dt-tab id="5" panel-id="6">
        Third
      </dt-tab>
    </template>
  </dt-tab-group>
</dt-stack>
<!-- @code -->
<dt-tab-group :size="100|200|300|400|500">
  ...
</dt-tab-group>
```

## Slots

### Icon

Use the `#startIcon` or `#endIcon` slot on `dt-tab` to add an icon. The slot provides `iconSize` to match the tab's size.

<dt-notice title="Deprecated" kind="info" class="d-wmx100p d-my-200" hide-close>
  The <code>#icon</code> slot has been deprecated. Use <code>#startIcon</code> or <code>#endIcon</code> instead.
</dt-notice>

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-tab-group>
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>
        First
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
      </dt-tab>
      <dt-tab id="3" panel-id="4">
        Second
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        <template #endIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
      </dt-tab>
      <dt-tab id="5" panel-id="6">
        Third
        <template #endIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
      </dt-tab>
    </template>
  </dt-tab-group>
</div>
```

### Leading & Trailing

Use the `#leading` and `#trailing` slots on `dt-tab` to render content like badges or count indicators alongside tab labels. Use `leading-class` and `trailing-class` to adjust padding.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-tab-group>
    <template #tabs>
      <dt-tab id="lt1" panel-id="lt2" selected trailing-class="d-pie-100">
        Inbox
        <template #trailing>
          <dt-badge kind="count" type="bulletin" text="9" />
        </template>
      </dt-tab>
      <dt-tab id="lt3" panel-id="lt4" trailing-class="d-pie-100">
        Archive
        <template #trailing>
          <dt-badge kind="count" text="99+" />
        </template>
      </dt-tab>
      <dt-tab id="lt5" panel-id="lt6">
        Drafts
      </dt-tab>
    </template>
  </dt-tab-group>
</div>
```

## Orientation

Set `orientation="vertical"` to stack tabs vertically alongside the panel.

```vue demo
<example-tabs orientation="vertical" />
<!-- @code -->
<dt-tab-group orientation="vertical">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

## Advanced Usages

### Automatic Mode

By default, tabs use manual activation — the user must press `Enter` or `Space` after focusing a tab to select it. Set `activation-mode="auto"` to select tabs immediately on focus via arrow keys, following the <a class="d-link" href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank">WAI-ARIA Tabs pattern</a>.

```vue demo
<example-tabs activation-mode="auto" />
<!-- @code -->
<dt-tab-group activation-mode="auto">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
```

### Validation Before Changing Tabs

If you need to do some validation before changing tabs, you can use the `before-change` event. If the event handler is prevented, the tab change will be cancelled.

```vue demo
<example-tabs validate />
<!-- @code -->
<dt-tab-group @before-change="confirmBeforeLeave">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
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

<component-vue-api component-name="tabgroup" :also-import="['tab', 'tabpanel']" />

### Tab Panel

<component-vue-api component-name="tabpanel" :show-import="false" />

### Tab

<component-vue-api component-name="tab" :show-import="false" />

## Classes

<component-class-table component-name="tabs" />

## Accessibility

To create accessible tabs, be sure to implement the <a class="d-link" href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-2/tabs.html" target="_blank">proper keyboard navigation</a> and utilize the following ARIA roles to properly declare element roles, content relationships, and current status:

<component-accessible-table component-name="tabs" />

<script setup>
  import ExampleTabs from "@exampleComponents/ExampleTabs.vue";
</script>
