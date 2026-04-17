---
title: Resizable
description: A layout component that lets users resize adjacent panels by dragging a handle between them.
status: beta
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-resizable--default
---

## Usage

The resizable component splits a container into adjustable panels separated by draggable handles. It works well for sidebar layouts, split-view editors, and any interface where users should control how space is distributed.

```vue code-only
<dt-resizable>
  <dt-resizable-panel> ... </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel> ... </dt-resizable-panel>
</dt-resizable>
```

## Examples

### Two panels

```vue demo
<example-resizable />
<!-- @code -->
<dt-box block-size="400" inline-size="100p">
  <dt-resizable>
    <dt-resizable-panel id="sidebar" initial-size="25p">
      Sidebar
    </dt-resizable-panel>
    <dt-resizable-handle />
    <dt-resizable-panel id="content">
      Main content
    </dt-resizable-panel>
  </dt-resizable>
</dt-box>
```

### Three panels

```vue demo
<example-resizable-three-panel />
<!-- @code -->
<dt-box block-size="400" inline-size="100p">
  <dt-resizable>
    <dt-resizable-panel id="ex3-sidebar" initial-size="20p" user-min-size="825">
      Sidebar
    </dt-resizable-panel>
    <dt-resizable-handle />
    <dt-resizable-panel id="ex3-content">
      Content
    </dt-resizable-panel>
    <dt-resizable-handle />
    <dt-resizable-panel id="ex3-details" initial-size="25p" user-min-size="825">
      Details
    </dt-resizable-panel>
  </dt-resizable>
</dt-box>
```

### Vertical

```vue demo
<example-resizable-vertical />
<!-- @code -->
<dt-box block-size="400" inline-size="100p">
  <dt-resizable direction="column">
    <dt-resizable-panel id="exv-top" initial-size="40p">
      Top Panel
    </dt-resizable-panel>
    <dt-resizable-handle />
    <dt-resizable-panel id="exv-bottom">
      Bottom Panel
    </dt-resizable-panel>
  </dt-resizable>
</dt-box>
```

### Nested layouts

Resizable groups can be nested. For example, a horizontal sidebar + content layout where the content area is itself a vertical split:

```vue demo
<example-resizable-nested />
<!-- @code -->
<dt-box block-size="400" inline-size="100p">
  <dt-resizable>
    <dt-resizable-panel id="ex-sidebar" initial-size="25p" user-min-size="825" user-max-size="50p">
      Sidebar
    </dt-resizable-panel>
    <dt-resizable-handle />
    <dt-resizable-panel id="content">
      <dt-resizable direction="column">
        <dt-resizable-panel id="editor" initial-size="25p">
          Content Start
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel id="terminal">
          Content End
        </dt-resizable-panel>
      </dt-resizable>
    </dt-resizable-panel>
  </dt-resizable>
</dt-box>
```

## Best practices

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
- Don't hide a panel without giving the user a way to bring it back. Provide an expand control in a visible sibling panel (e.g., a menu button in the content header).
</template>

</dialtone-usage>

## Constraints

All size props accept two formats: percentage tokens (e.g., `"25p"` for 25% of the container) and Dialtone size tokens (e.g., `"925"` which resolves to 332px). Raw pixel values are not accepted — the component resolves token values from Dialtone's CSS custom properties at runtime.

`initial-size` defines where a panel starts. For panels whose size should flex with the available space (like a main content area), omit `initial-size` and the panel will fill whatever space remains.

### User constraints

`user-min-size` and `user-max-size` set hard limits on how small or large a user can drag a panel. These are enforced during drag interactions.

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable-panel
    id="sidebar"
    initial-size="30p"
    user-min-size="20p"
    user-max-size="50p"
  >
    Sidebar (min 20%, max 50%)
  </dt-resizable-panel>
</dt-box>
```

### System constraints

`system-min-size` and `system-max-size` define the range the layout engine uses when redistributing space during viewport resizes. These default to the user constraints when not specified. System min must be >= user min, and system max must be <= user max.

#### Fixed panels

Set `:resizable="false"` to fix a panel at its `initial-size`. Fixed panels cannot be dragged, and no handle is rendered between a fixed panel and its neighbor. The layout engine subtracts fixed panel widths first, then distributes the remaining space among resizable panels.

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable>
    <dt-resizable-panel id="nav" initial-size="700" :resizable="false">
      Navigation (64px, fixed)
    </dt-resizable-panel>
    <dt-resizable-panel id="content">
      Content (fills remaining space)
    </dt-resizable-panel>
  </dt-resizable>
</dt-box>
```

## Collapsing panels

```vue demo-only
<example-resizable-collapsible />
```

Mark a panel as `collapsible` to let it collapse to zero width. Use the `collapsed` prop for the initial state, or call `collapsePanel()` from a template ref.

```vue code-only
<dt-box block-size="400" inline-size="100p">
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
</dt-box>
```

```js
<script setup>
import { ref } from 'vue';

const isSidebarCollapsed = ref(false);

function onPanelCollapse (panelId, collapsed) {
  if (panelId === 'sidebar') {
    isSidebarCollapsed.value = collapsed;
  }
}
</script>

```

Listen to `@panel-collapse` to keep your local state in sync — the panel can also be collapsed by the system (auto-collapse rules, viewport resize). Always provide a visible control in a sibling panel to restore a collapsed panel.

### Dynamic constraints on collapse

For layouts where a panel starts hidden (e.g., a detail pane that opens when an item is selected), bind `initial-size` to a computed value that changes based on collapsed state:

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable-panel
    id="list"
    :initial-size="isDetailOpen ? '30p' : '100p'"
  >
    List
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel
    id="detail"
    :initial-size="isDetailOpen ? '70p' : '0p'"
    collapsible
    :collapsed="!isDetailOpen"
  >
    Detail
  </dt-resizable-panel>
</dt-box>
```

### Auto-collapse rules

Use `collapse-rules` to define which panels collapse first when space gets tight. Lower priority numbers collapse first.

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable
    :collapse-rules="[
      { panelId: 'details', priority: 1 },
      { panelId: 'sidebar', priority: 2 },
    ]"
  >
    ...
  </dt-resizable>
</dt-box>
```

## Persisting panel sizes

Add a `storage-key` to save panel sizes to localStorage automatically. Users resize once, and the layout restores on their next visit.

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable storage-key="my-layout">
    ...
  </dt-resizable>
</dt-box>
```

For state management integration (Pinia, Vuex, or an API), implement the `ResizableStorageAdapter` interface and pass it via `:storage`:

```js
const piniaAdapter = {
  save(data) { layoutStore.setLayout(data); },
  load() { return layoutStore.layout; },
  clear() { layoutStore.clearLayout(); },
};
```

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable :storage="piniaAdapter">
    ...
  </dt-resizable>
</dt-box>
```

When both `storage-key` and `:storage` are provided, the custom adapter takes precedence.

## Space allocation strategies

When a panel opens or closes, the remaining panels need to redistribute space. The `space-allocation-strategy` prop controls how:

- **`proportional`** (default) — All non-collapsed panels give or take space proportionally based on their current size.
- **`preserve-manual`** — Panels that the user has manually resized keep their exact size. Only panels the user hasn't touched give up space.

### Offset from fixed elements

```vue demo-only
<example-resizable-offset />
```

When a fixed or absolutely positioned element (like a toolbar or header) overlaps the resizable area, set `offset-element` on `DtResizable` to automatically offset all handles and panel content below it.

```vue code-only
<dt-box block-size="400" inline-size="100p">
  <dt-resizable offset-element="#toolbar">
    <div id="toolbar" style="position: absolute; top: 0; left: 0; right: 0; height: 48px; z-index: 10;">
      Toolbar
    </div>
    <dt-resizable-panel id="left" initial-size="50p">
      Left
    </dt-resizable-panel>
    <dt-resizable-handle />
    <dt-resizable-panel id="right" initial-size="50p">
      Right
    </dt-resizable-panel>
  </dt-resizable>
</dt-box>
```

Alternatively, use `offset-amount` for an explicit pixel value without measuring an element. If both are provided, `offset-amount` takes precedence.

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
import ExampleResizableNested from '@exampleComponents/ExampleResizableNested.vue';
import ExampleResizableThreePanel from '@exampleComponents/ExampleResizableThreePanel.vue';
import ExampleResizableVertical from '@exampleComponents/ExampleResizableVertical.vue';
import ExampleResizableCollapsible from '@exampleComponents/ExampleResizableCollapsible.vue';
import ExampleResizableOffset from '@exampleComponents/ExampleResizableOffset.vue';
</script>
