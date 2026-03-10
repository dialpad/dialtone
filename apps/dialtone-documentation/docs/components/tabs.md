---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2129-4760
keywords: ["tab panel", "tab navigation", "d-tabs", "DtTabs", "dt-tabs", "segmented control", "tabbar"]
---

<code-well-header>
  <div class="d-w100p">
    <example-tabs />
  </div>
</code-well-header>

## Variants

### Default

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="defaultTabsExample" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.defaultTabsExample'
vueCode='
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Borderless

Remove the bottom border of any tablist.

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="borderlessTabsExample" borderless />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.borderlessTabsExample'
vueCode='
<dt-tab-group borderless>
  ...
</dt-tab-group>
'
showHtmlWarning />

### Muted

All tabs render as muted buttons. The selected tab is distinguished with active styling.

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="mutedTabsExample" kind="muted" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.mutedTabsExample'
vueCode='
<dt-tab-group kind="muted">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Outlined

The selected tab renders with an outlined border instead of a filled style.

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="outlinedTabsExample" outlined />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.outlinedTabsExample'
vueCode='
<dt-tab-group outlined>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Muted Outlined

Combines muted kind with outlined selected state.

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="mutedOutlinedTabsExample" kind="muted" outlined />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.mutedOutlinedTabsExample'
vueCode='
<dt-tab-group kind="muted" outlined>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Disabled

Add `disabled` to a specific tab.

<code-well-header>
  <dt-tab-group>
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>First</dt-tab>
      <dt-tab id="3" panel-id="4">Second</dt-tab>
      <dt-tab id="5" panel-id="6">Third</dt-tab>
      <dt-tab id="7" panel-id="8" disabled>Fourth</dt-tab>
    </template>
  </dt-tab-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledTabsExample'
vueCode='
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
    <dt-tab id="7" panel-id="8" disabled>Fourth</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

Add `disabled` to the tab group to disable all.

<code-well-header>
  <example-tabs ref="disabledTabsExample" disabled />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledTabsExample'
vueCode='
<dt-tab-group disabled>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Inverted

<dt-notice title="Deprecated" kind="error" class="d-wmx100p d-my16">
  The <code>inverted</code> prop has been deprecated. Use the <dt-link to="mode-island.html#inverting">v-dt-mode directive</dt-link> instead, or <dt-link to="mode-island.html#dtmodeisland-component">DtModeIsland</dt-link> when no natural container element exists.
</dt-notice>

In place of the `inverted` prop, use the [v-dt-mode directive](mode-island.html#inverting) on the component element.

<code-well-header>
  <div class="d-p8 d-bgc-contrast d-w100p">
    <div v-dt-mode:invert class="d-p16 d-bar8">
      <example-tabs ref="invertedTabsExample" />
    </div>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.invertedTabsExample'
vueCode='
<dt-tab-group v-dt-mode:invert>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

## Sizes

<code-well-header>
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
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.sizeTabsExample'
vueCode='
<dt-tab-group size="xs|sm|md|lg|xl">
  ...
</dt-tab-group>
'
showHtmlWarning />

## Icon Support

Use the `#startIcon` or `#endIcon` slot on `dt-tab` to add an icon. The slot provides `iconSize` to match the tab's size.

<dt-notice title="Deprecated" kind="warning" class="d-wmx100p d-my16">
  The <code>#icon</code> slot has been deprecated. Use <code>#startIcon</code> or <code>#endIcon</code> instead.
</dt-notice>

<code-well-header>
  <div class="d-w100p">
    <dt-tab-group>
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected>
          <template #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          First
        </dt-tab>
        <dt-tab id="3" panel-id="4">
          Second
        </dt-tab>
        <dt-tab id="5" panel-id="6">
          <template #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Third
        </dt-tab>
      </template>
    </dt-tab-group>
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      <template #startIcon="{ iconSize }">
        <dt-icon name="box-select" :size="iconSize" />
      </template>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      <template #endIcon="{ iconSize }">
        <dt-icon name="box-select" :size="iconSize" />
      </template>
      Third
    </dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

## Leading & Trailing

Use the `#leading` and `#trailing` slots on `dt-tab` to render content like badges or count indicators alongside tab labels. Use `leading-class` and `trailing-class` to adjust padding.

<code-well-header>
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
</code-well-header>

<code-example-tabs
vueCode='
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
'
showHtmlWarning />

## Advanced Usages

### Automatic Mode

By default, tabs use manual activation — the user must press `Enter` or `Space` after focusing a tab to select it. Set `activation-mode="auto"` to select tabs immediately on focus via arrow keys, following the <a class="d-link" href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank">WAI-ARIA Tabs pattern</a>.

<code-well-header>
  <example-tabs ref="autoActivationExample" activation-mode="auto" />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.autoActivationExample'
vueCode='
<dt-tab-group activation-mode="auto">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Validation Before Changing Tabs

If you need to do some validation before changing tabs, you can use the `before-change` event. If the event handler is prevented, the tab change will be cancelled.

<code-well-header>
  <example-tabs ref="validateTabsExample" validate />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.validateTabsExample'
vueCode='
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
'
showHtmlWarning />

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
