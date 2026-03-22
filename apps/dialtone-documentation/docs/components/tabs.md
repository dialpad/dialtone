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

<code-example vueCode='
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <div class="d-w100p">
    <example-tabs />
  </div>
</code-example>

### Borderless

Remove the bottom border of any tablist.

<code-example vueCode='
<dt-tab-group borderless>
  ...
</dt-tab-group>
'>
  <div class="d-w100p">
    <example-tabs borderless />
  </div>
</code-example>

### Muted

All tabs render as muted buttons. The selected tab is distinguished with active styling.

<code-example vueCode='
<dt-tab-group kind="muted">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <div class="d-w100p">
    <example-tabs kind="muted" />
  </div>
</code-example>

### Outlined

The selected tab renders with an outlined border instead of a filled style.

<code-example vueCode='
<dt-tab-group outlined>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <div class="d-w100p">
    <example-tabs outlined />
  </div>
</code-example>

### Muted Outlined

Combines muted kind with outlined selected state.

<code-example vueCode='
<dt-tab-group kind="muted" outlined>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <div class="d-w100p">
    <example-tabs kind="muted" outlined />
  </div>
</code-example>

### Disabled

Add `disabled` to a specific tab.

<code-example>
  <dt-tab-group>
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>First</dt-tab>
      <dt-tab id="3" panel-id="4">Second</dt-tab>
      <dt-tab id="5" panel-id="6">Third</dt-tab>
      <dt-tab id="7" panel-id="8" disabled>Fourth</dt-tab>
    </template>
  </dt-tab-group>
</code-example>

Add `disabled` to the tab group to disable all.

<code-example vueCode='
<dt-tab-group disabled>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <example-tabs disabled />
</code-example>

### Inverted

<dt-notice title="Deprecated" kind="info" class="d-wmx100p d-my16" hide-close>
  The <code>inverted</code> prop has been deprecated. Use the <dt-link to="mode-island.html#inverting">v-dt-mode directive</dt-link> instead.
</dt-notice>

In place of the `inverted` prop, use the [v-dt-mode directive](mode-island.html#inverting) on the component element.

<code-example vueCode='
<dt-tab-group v-dt-mode:invert>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
  </template>
</dt-tab-group>
'>
  <div class="d-p8 d-bgc-contrast d-w100p">
    <div v-dt-mode:invert class="d-p16 d-bar8">
      <example-tabs />
    </div>
  </div>
</code-example>

## Spread

Control how tabs distribute available horizontal space within the tab list. It only applies to horizontal tabs, and has no effect with `orientation="vertical"`.

### Grow

Tabs expand proportionally to fill the container. Longer labels receive more space.

<code-example>
  <div class="d-w100p">
    <dt-tab-group spread="grow">
      <template #tabs>
        <dt-tab id="sg1" panel-id="sg2" selected>Tab 1</dt-tab>
        <dt-tab id="sg3" panel-id="sg4">Tab the second</dt-tab>
        <dt-tab id="sg5" panel-id="sg6">Tab the third</dt-tab>
      </template>
    </dt-tab-group>
  </div>
</code-example>

### Equal

All tabs share the same width, regardless of label length.

<code-example>
  <div class="d-w100p">
    <dt-tab-group spread="equal">
      <template #tabs>
        <dt-tab id="se1" panel-id="se2" selected>Tab 1</dt-tab>
        <dt-tab id="se3" panel-id="se4">Tab the second</dt-tab>
        <dt-tab id="se5" panel-id="se6">Tab the third</dt-tab>
      </template>
    </dt-tab-group>
  </div>
</code-example>

## Sizes

<code-example vueCode='
<dt-tab-group size="xs|sm|md|lg|xl">
  ...
</dt-tab-group>
'>
  <dt-stack gap="500" class="d-w100p">
    <dt-tab-group size="xs">
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
    <dt-tab-group size="sm">
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
    <dt-tab-group size="lg">
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
    <dt-tab-group size="xl">
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
</code-example>

## Slots

### Icon

Use the `#startIcon` or `#endIcon` slot on `dt-tab` to add an icon. The slot provides `iconSize` to match the tab's size.

<dt-notice title="Deprecated" kind="info" class="d-wmx100p d-my16" hide-close>
  The <code>#icon</code> slot has been deprecated. Use <code>#startIcon</code> or <code>#endIcon</code> instead.
</dt-notice>

<code-example>
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
</code-example>

### Leading & Trailing

Use the `#leading` and `#trailing` slots on `dt-tab` to render content like badges or count indicators alongside tab labels. Use `leading-class` and `trailing-class` to adjust padding.

<code-example>
  <div class="d-w100p">
    <dt-tab-group>
      <template #tabs>
        <dt-tab id="lt1" panel-id="lt2" selected trailing-class="d-pr8">
          Inbox
          <template #trailing>
            <dt-badge kind="count" type="bulletin" text="9" />
          </template>
        </dt-tab>
        <dt-tab id="lt3" panel-id="lt4" trailing-class="d-pr8">
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
</code-example>

## Orientation

Set `orientation="vertical"` to stack tabs vertically alongside the panel.

<code-example vueCode='
<dt-tab-group orientation="vertical">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <example-tabs orientation="vertical" />
</code-example>

## Advanced Usages

### Automatic Mode

By default, tabs use manual activation — the user must press `Enter` or `Space` after focusing a tab to select it. Set `activation-mode="auto"` to select tabs immediately on focus via arrow keys, following the <a class="d-link" href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank">WAI-ARIA Tabs pattern</a>.

<code-example vueCode='
<dt-tab-group activation-mode="auto">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'>
  <example-tabs activation-mode="auto" />
</code-example>

### Validation Before Changing Tabs

If you need to do some validation before changing tabs, you can use the `before-change` event. If the event handler is prevented, the tab change will be cancelled.

<code-example vueCode='
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
'>
  <example-tabs validate />
</code-example>

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
