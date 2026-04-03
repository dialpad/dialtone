---
title: Resizable
description: A layout component that lets users resize adjacent panels by dragging a handle between them.
status: beta
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-resizable--default
---

<code-well-header custom class="d-p24 d-bgc-secondary d-bar8">
  <example-resizable />
</code-well-header>

## Usage

The resizable component splits a container into adjustable panels separated by draggable handles. It works well for sidebar layouts, split-view editors, and any interface where users should control how space is distributed.

### Examples

#### Two panels

<code-well-header custom class="d-p24 d-bgc-secondary d-bar8" ref="twoPanelExample">
  <example-resizable />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.twoPanelExample"
vueCode='
<dt-resizable>
  <dt-resizable-panel id="sidebar" initial-size="25p">
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    Main content
  </dt-resizable-panel>
</dt-resizable>
'
/>

#### Three panels

<code-well-header custom class="d-p24 d-bgc-secondary d-bar8" ref="threePanelExample">
  <example-resizable-three-panel />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.threePanelExample"
vueCode='
<dt-resizable>
  <dt-resizable-panel id="sidebar" initial-size="20p">
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    Content
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="details" initial-size="25p">
    Details
  </dt-resizable-panel>
</dt-resizable>
'
/>

#### Vertical

<code-well-header custom class="d-p24 d-bgc-secondary d-bar8" ref="verticalExample">
  <example-resizable-vertical />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.verticalExample"
vueCode='
<dt-resizable direction="column">
  <dt-resizable-panel id="top" initial-size="40p">
    Top
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="bottom">
    Bottom
  </dt-resizable-panel>
</dt-resizable>
'
/>

#### Nested layouts

Resizable groups can be nested. For example, a horizontal sidebar + content layout where the content area is itself a vertical split:

<code-example-tabs
vueCode='
<dt-resizable>
  <dt-resizable-panel id="sidebar" initial-size="25p">
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    <dt-resizable direction="column">
      <dt-resizable-panel id="editor" initial-size="60p">
        Editor
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="terminal">
        Terminal
      </dt-resizable-panel>
    </dt-resizable>
  </dt-resizable-panel>
</dt-resizable>
'
/>

### Best practices

<dialtone-usage>
<template #do>

- Set `initial-size` on panels with a known width (sidebars, detail panes). Omit it on the main content panel so it fills the remaining space.
- Set `user-min-size` on every panel. Without it, panels can shrink to nearly zero. A minimum of `"825"` (164px) keeps most content usable.
- Use `storage-key` to persist layouts. Users expect their panel arrangement to survive a page refresh.
- Always provide a way to restore collapsed panels — for example, a menu icon button in a sibling panel's header.
</template>

<template #dont>

- Don't pass raw pixel values for sizes. Only percentage tokens (`"25p"`) and Dialtone size tokens (`"925"`) are accepted.
- Don't set `initial-size` on every panel. Leave one panel without it so it absorbs remaining space and the layout always fills the container.
- Don't hide a panel without giving the user a way to bring it back. Collapsed panels should either use peek or provide an expand control in a visible sibling.
</template>

</dialtone-usage>

### Constraints

All size props accept two formats: percentage tokens (e.g., `"25p"` for 25% of the container) and Dialtone size tokens (e.g., `"925"` which resolves to 332px). Raw pixel values are not accepted — the component resolves token values from Dialtone's CSS custom properties at runtime.

`initial-size` defines where a panel starts. For panels whose size should flex with the available space (like a main content area), omit `initial-size` and the panel will fill whatever space remains.

#### User constraints

`user-min-size` and `user-max-size` set hard limits on how small or large a user can drag a panel. These are enforced during drag interactions.

<code-example-tabs
vueCode='
<dt-resizable-panel
  id="sidebar"
  initial-size="30p"
  user-min-size="20p"
  user-max-size="50p"
>
  Sidebar (min 20%, max 50%)
</dt-resizable-panel>
'
/>

#### System constraints

`system-min-size` and `system-max-size` define the range the layout engine uses when redistributing space during viewport resizes. These default to the user constraints when not specified. System min must be >= user min, and system max must be <= user max.

#### Fixed panels

Set `:resizable="false"` to lock a panel at its `initial-size`. Fixed panels cannot be dragged, and no handle is rendered between a fixed panel and its neighbor. The layout engine subtracts fixed panel widths first, then distributes the remaining space among resizable panels.

<code-example-tabs
vueCode='
<dt-resizable>
  <dt-resizable-panel id="nav" initial-size="700" :resizable="false">
    Navigation (64px, fixed)
  </dt-resizable-panel>
  <dt-resizable-panel id="content">
    Content (fills remaining space)
  </dt-resizable-panel>
</dt-resizable>
'
/>

### Collapsing panels

<code-well-header custom class="d-p24 d-bgc-secondary d-bar8" ref="collapsibleExample">
  <example-resizable-collapsible />
</code-well-header>

Mark a panel as `collapsible` to let it collapse to zero width. Use the `collapsed` prop for the initial state, or call `collapsePanel()` from a template ref.

<code-example-tabs
:htmlCode="() => $refs.collapsibleExample"
vueCode='
<dt-resizable @panel-collapse="onPanelCollapse">
  <dt-resizable-panel
    id="sidebar"
    initial-size="25p"
    user-min-size="825"
    collapsible
    :collapsed="isSidebarCollapsed"
  >
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    <header>
      <button @click="isSidebarCollapsed = !isSidebarCollapsed">
        Toggle sidebar
      </button>
    </header>
    Content
  </dt-resizable-panel>
</dt-resizable>

<script setup>
import { ref } from "vue";

const isSidebarCollapsed = ref(false);

function onPanelCollapse (panelId, collapsed) {
  if (panelId === "sidebar") {
    isSidebarCollapsed.value = collapsed;
  }
}
</script>
'
/>

Listen to `@panel-collapse` to keep your local state in sync — the panel can also be collapsed by the system (auto-collapse rules, viewport resize). Always provide a visible control in a sibling panel to restore a collapsed panel.

#### Dynamic constraints on collapse

For layouts where a panel starts hidden (e.g., a detail pane that opens when an item is selected), bind `initial-size` to a computed value that changes based on collapsed state:

<code-example-tabs
vueCode='
<dt-resizable-panel
  id="list"
  :initial-size="isDetailOpen ? &apos;30p&apos; : &apos;100p&apos;"
>
  List
</dt-resizable-panel>
<dt-resizable-handle />
<dt-resizable-panel
  id="detail"
  :initial-size="isDetailOpen ? &apos;70p&apos; : &apos;0p&apos;"
  collapsible
  :collapsed="!isDetailOpen"
>
  Detail
</dt-resizable-panel>
'
/>

#### Auto-collapse rules

Use `collapse-rules` to define which panels collapse first when space gets tight. Lower priority numbers collapse first.

<code-example-tabs
vueCode='
<dt-resizable
  :collapse-rules="[
    { panelId: &apos;details&apos;, priority: 1 },
    { panelId: &apos;sidebar&apos;, priority: 2 },
  ]"
>
  ...
</dt-resizable>
'
/>

### Persisting panel sizes

Add a `storage-key` to save panel sizes to localStorage automatically. Users resize once, and the layout restores on their next visit.

<code-example-tabs
vueCode='
<dt-resizable storage-key="my-layout">
  ...
</dt-resizable>
'
/>

For state management integration (Pinia, Vuex, or an API), implement the `ResizableStorageAdapter` interface and pass it via `:storage`:

```js
const piniaAdapter = {
  save(data) { layoutStore.setLayout(data); },
  load() { return layoutStore.layout; },
  clear() { layoutStore.clearLayout(); },
};
```

<code-example-tabs
vueCode='
<dt-resizable :storage="piniaAdapter">
  ...
</dt-resizable>
'
/>

When both `storage-key` and `:storage` are provided, the custom adapter takes precedence.

### Peek panel overlay

Collapsed panels can show a temporary overlay on hover or button click, letting users preview content without permanently expanding the panel.

<code-example-tabs
vueCode='
<dt-resizable-panel
  id="sidebar"
  collapsible
  peek-enabled
  peek-trigger="hover"
  peek-width="25p"
>
  Sidebar content (peek on hover when collapsed)
</dt-resizable-panel>
'
/>

Set `peek-trigger` to `"button"` to show a toggle button instead of hovering, or `"both"` for either. Use the `peek-trigger` slot to customize the button:

<code-example-tabs
vueCode='
<template #peek-trigger="{ togglePeek, isPeeking }">
  <button @click="togglePeek">
    {{ isPeeking ? "Hide" : "Preview" }}
  </button>
</template>
'
/>

### Space allocation strategies

When a panel opens or closes, the remaining panels need to redistribute space. The `space-allocation-strategy` prop controls how:

- **`proportional`** (default) — All unlocked panels give or take space proportionally based on their current size.
- **`preserve-manual`** — Panels that the user has manually resized keep their exact size. Only panels the user hasn't touched give up space.

### Programmatic control

Sometimes the layout needs to respond to application state — collapsing a sidebar when a user clicks a menu item, locking a panel during a loading state, or resetting the layout from a settings page.

Access these methods via a template ref on `DtResizable`:

<code-example-tabs
vueCode='
<template>
  <dt-resizable ref="group">
    ...
  </dt-resizable>
</template>

<script setup>
import { ref } from "vue";
const group = ref(null);

group.value.collapsePanel("sidebar", true);
group.value.lockPanel("sidebar");
group.value.unlockPanel("sidebar");
group.value.resizePanel("sidebar", 300);
group.value.resetPanels();
</script>
'
/>

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Method</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>collapsePanel(id, collapsed)</code></td>
<td>Collapse or expand a panel.</td>
</tr>
<tr>
<td><code>lockPanel(id)</code></td>
<td>Lock a panel at its current size. Drag and viewport resize won't affect it.</td>
</tr>
<tr>
<td><code>unlockPanel(id)</code></td>
<td>Unlock a previously locked panel.</td>
</tr>
<tr>
<td><code>resizePanel(id, pixels)</code></td>
<td>Set a panel to an exact pixel size.</td>
</tr>
<tr>
<td><code>resetPanels()</code></td>
<td>Reset all panels to their initial sizes. Pass panel IDs to reset a specific pair.</td>
</tr>
</tbody>
</table>

## Accessibility

### Keyboard navigation

Each resize handle has `role="separator"` with `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-controls`, and `aria-valuetext` reflecting the current layout. Handles are always focusable (`tabindex="0"`) and follow the [W3C ARIA separator pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Key</th>
<th scope="col">Action</th>
</tr>
</thead>
<tbody>
<tr>
<td>Arrow keys</td>
<td>Resize by 8px</td>
</tr>
<tr>
<td>Shift + Arrow</td>
<td>Resize by 24px</td>
</tr>
<tr>
<td>Ctrl/Cmd + Arrow</td>
<td>Resize by 1px</td>
</tr>
<tr>
<td>Enter</td>
<td>Collapse or expand the adjacent panel (if collapsible)</td>
</tr>
<tr>
<td>Home</td>
<td>Set panel to minimum size</td>
</tr>
<tr>
<td>End</td>
<td>Set panel to maximum size</td>
</tr>
<tr>
<td>R</td>
<td>Reset adjacent panels to initial sizes</td>
</tr>
<tr>
<td>Escape</td>
<td>Remove focus from the handle</td>
</tr>
</tbody>
</table>

Size changes are announced to screen readers via an `aria-live` region. All announcement strings are configurable via the `messages` prop on `DtResizable` for i18n.

Double-clicking a handle resets the two adjacent panels to their initial size proportions.

## Vue API

### DtResizable

<component-vue-api component-name="resizable" />

### DtResizablePanel

<component-vue-api component-name="resizable_panel" />

### DtResizableHandle

<component-vue-api component-name="resizable_handle" />

<script setup>
import ExampleResizable from '@exampleComponents/ExampleResizable.vue';
import ExampleResizableThreePanel from '@exampleComponents/ExampleResizableThreePanel.vue';
import ExampleResizableVertical from '@exampleComponents/ExampleResizableVertical.vue';
import ExampleResizableCollapsible from '@exampleComponents/ExampleResizableCollapsible.vue';
</script>
