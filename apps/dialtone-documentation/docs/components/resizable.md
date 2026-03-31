---
title: Resizable
description: A resizable layout component that allows users to resize adjacent panels by dragging a handle between them.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-resizable--default
---

## Usage

The resizable component system consists of three parts: `DtResizable` (the group container), `DtResizablePanel` (the resizable content areas), and `DtResizableHandle` (the draggable dividers between panels). Panels are sized using percentage tokens (e.g., `"25p"` for 25% of the container).

<dialtone-usage>
<template #do>

- Adjustable sidebar layouts (e.g., navigation + content).
- Split-view editors or file browsers.
- Any layout where the user should control how space is distributed.
</template>

<template #dont>

- Fixed layouts that should not be user-adjustable.
- Single-panel layouts with no adjacent content.
- Layouts with more than 4 panels (consider tabs or navigation instead).
</template>

</dialtone-usage>

### Basic Two-Panel Layout

```vue
<dt-resizable>
  <dt-resizable-panel id="sidebar" initial-size="25p">
    Sidebar content
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    Main content
  </dt-resizable-panel>
</dt-resizable>
```

### Three-Panel Layout

```vue
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
```

### Vertical (Column) Direction

```vue
<dt-resizable direction="column">
  <dt-resizable-panel id="top" initial-size="40p">
    Top panel
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="bottom">
    Bottom panel
  </dt-resizable-panel>
</dt-resizable>
```

## Constraints

Panels support user drag constraints (`userMinSize`/`userMaxSize`) and system viewport constraints (`systemMinSize`/`systemMaxSize`). User constraints define hard limits for drag interactions. System constraints define the range the layout engine uses during viewport resizes.

```vue
<dt-resizable>
  <dt-resizable-panel
    id="sidebar"
    initial-size="30p"
    user-min-size="20p"
    user-max-size="50p"
  >
    Sidebar (min 20%, max 50%)
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content" user-min-size="30p">
    Content (min 30%)
  </dt-resizable-panel>
</dt-resizable>
```

### Constraint Hierarchy

- **`userMinSize` / `userMaxSize`** — Hard floor/ceiling for user dragging. Applied during drag interactions.
- **`systemMinSize` / `systemMaxSize`** — Scaling range for the layout engine. Applied during viewport resizes.
- **`collapseSize`** — Container width threshold for auto-collapse. Applied during container resize.

System constraints fall back to user constraints when not specified. `systemMinSize` must be >= `userMinSize`, and `systemMaxSize` must be <= `userMaxSize`.

## Collapsible Panels

Mark a panel as `collapsible` to allow it to collapse to zero width. Use the `collapsed` prop for initial state, or call `collapsePanel()` programmatically.

```vue
<dt-resizable ref="group">
  <dt-resizable-panel
    id="sidebar"
    initial-size="25p"
    user-min-size="20p"
    collapsible
    :collapsed="isSidebarCollapsed"
  >
    Collapsible sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    Content
  </dt-resizable-panel>
</dt-resizable>
```

### Auto-Collapse Rules

Use the `collapseRules` prop on `DtResizable` to define which panels collapse first when space is constrained. Lower priority numbers collapse first.

```vue
<dt-resizable
  :collapse-rules="[
    { panelId: 'details', priority: 1 },
    { panelId: 'sidebar', priority: 2 },
  ]"
>
  ...
</dt-resizable>
```

## Persistence

Panel sizes can be persisted across page loads. Two approaches are available:

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Approach</th>
<th scope="col">Prop</th>
<th scope="col">Best For</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>storageKey</code></td>
<td><code>storage-key="my-layout"</code></td>
<td>Quick localStorage persistence</td>
</tr>
<tr>
<td><code>:storage</code></td>
<td><code>:storage="adapter"</code></td>
<td>Pinia, Vuex, IndexedDB, or API backends</td>
</tr>
</tbody>
</table>

### localStorage

The simplest option — pass a `storageKey` string and panel sizes are automatically saved to and restored from localStorage.

```vue
<dt-resizable storage-key="my-layout">
  ...
</dt-resizable>
```

### Pinia / Custom Store

For state management integration, implement the `ResizableStorageAdapter` interface (`save`, `load`, `clear`) and pass it via the `:storage` prop.

```js
// Pinia adapter example
const layoutStore = useLayoutStore();

const piniaAdapter = {
  save(data) { layoutStore.setLayout(data); },
  load() { return layoutStore.layout; },
  clear() { layoutStore.clearLayout(); },
};
```

```vue
<dt-resizable :storage="piniaAdapter">
  ...
</dt-resizable>
```

The same interface works with Vuex, IndexedDB, or an API backend — any object with `save`, `load`, and `clear` methods.

When both `storageKey` and `:storage` are provided, the custom adapter takes precedence.

## Peek Overlay

Collapsed panels can show a temporary overlay on hover or button trigger. Enable with `peekEnabled` on `DtResizablePanel`.

```vue
<dt-resizable-panel
  id="sidebar"
  initial-size="25p"
  collapsible
  peek-enabled
  peek-trigger="hover"
  peek-width="25p"
  :peek-grace-period="150"
>
  <template #default="{ isCollapsed, isPeeking }">
    Panel content
  </template>
  <template #peek-trigger="{ togglePeek, isPeeking }">
    <button @click="togglePeek">Toggle peek</button>
  </template>
</dt-resizable-panel>
```

## Keyboard Accessibility

The resize handle supports keyboard navigation. Press `Tab` to reach the handle, then use arrow keys to resize. The handle announces size changes to screen readers via `aria-valuenow`.

Double-click a handle to reset the adjacent panels to their initial sizes.

### Edit Mode

Handles are focusable when edit mode is active (`tabindex="0"`). In normal mode, handles have `tabindex="-1"` to keep the tab order clean. Edit mode is managed internally by the `DtResizable` component.

## Programmatic Control

Access methods via a template ref on the `DtResizable` component.

```vue
<template>
  <dt-resizable ref="group">
    ...
  </dt-resizable>
</template>

<script setup>
import { ref } from 'vue';
const group = ref(null);

// Collapse a panel
group.value.collapsePanel('sidebar', true);

// Lock a panel at its current size
group.value.lockPanel('sidebar');

// Unlock a panel
group.value.unlockPanel('sidebar');

// Resize a panel to a specific pixel size
group.value.resizePanel('sidebar', 300);

// Reset all panels to initial sizes
group.value.resetPanels();
</script>
```

### Exposed Methods

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Method</th>
<th scope="col">Signature</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>resizePanel</code></td>
<td><code>(panelId: string, size: number) =&gt; void</code></td>
<td>Resize a panel to a specific pixel size</td>
</tr>
<tr>
<td><code>collapsePanel</code></td>
<td><code>(panelId: string, collapsed: boolean) =&gt; void</code></td>
<td>Collapse or expand a panel</td>
</tr>
<tr>
<td><code>lockPanel</code></td>
<td><code>(panelId: string) =&gt; void</code></td>
<td>Lock a panel at its current size</td>
</tr>
<tr>
<td><code>unlockPanel</code></td>
<td><code>(panelId: string) =&gt; void</code></td>
<td>Unlock a previously locked panel</td>
</tr>
<tr>
<td><code>resetPanels</code></td>
<td><code>(beforePanelId?, afterPanelId?, behavior?) =&gt; void</code></td>
<td>Reset panels to initial sizes</td>
</tr>
</tbody>
</table>

### Exposed Readonly State

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Property</th>
<th scope="col">Type</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>state</code></td>
<td><code>readonly object</code></td>
<td>Current layout state including <code>panels</code>, <code>containerSize</code>, <code>isResizing</code></td>
</tr>
<tr>
<td><code>panelConfigs</code></td>
<td><code>ComputedRef&lt;Array&gt;</code></td>
<td>Panel configurations from the <code>panels</code> prop</td>
</tr>
<tr>
<td><code>allocationStrategy</code></td>
<td><code>ComputedRef&lt;string&gt;</code></td>
<td>Current space allocation strategy</td>
</tr>
</tbody>
</table>

## Props

### DtResizable

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Prop</th>
<th scope="col">Type</th>
<th scope="col">Default</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>direction</code></td>
<td><code>'row' | 'column'</code></td>
<td><code>'row'</code></td>
<td>Layout direction. <code>'row'</code> for horizontal, <code>'column'</code> for vertical.</td>
</tr>
<tr>
<td><code>storageKey</code></td>
<td><code>string</code></td>
<td><code>null</code></td>
<td>localStorage key for persisting panel sizes.</td>
</tr>
<tr>
<td><code>storage</code></td>
<td><code>ResizableStorageAdapter</code></td>
<td><code>null</code></td>
<td>Custom storage adapter. Overrides <code>storageKey</code> when both provided.</td>
</tr>
<tr>
<td><code>spaceAllocationStrategy</code></td>
<td><code>'proportional' | 'preserve-manual'</code></td>
<td><code>'proportional'</code></td>
<td>Strategy for redistributing space when panels open/close.</td>
</tr>
<tr>
<td><code>collapseRules</code></td>
<td><code>Array&lt;CollapseRule&gt;</code></td>
<td><code>[]</code></td>
<td>Rules defining which panels collapse first when space is constrained.</td>
</tr>
<tr>
<td><code>messages</code></td>
<td><code>Object</code></td>
<td><code>{}</code></td>
<td>i18n overrides for screen reader announcements.</td>
</tr>
</tbody>
</table>

### DtResizablePanel

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Prop</th>
<th scope="col">Type</th>
<th scope="col">Default</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>id</code></td>
<td><code>string</code></td>
<td><strong>required</strong></td>
<td>Unique panel identifier.</td>
</tr>
<tr>
<td><code>initialSize</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Initial size as percentage token (e.g., <code>'25p'</code> for 25%).</td>
</tr>
<tr>
<td><code>userMinSize</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Minimum size for user drag interactions.</td>
</tr>
<tr>
<td><code>userMaxSize</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Maximum size for user drag interactions.</td>
</tr>
<tr>
<td><code>systemMinSize</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Minimum size for system viewport scaling.</td>
</tr>
<tr>
<td><code>systemMaxSize</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Maximum size for system viewport scaling.</td>
</tr>
<tr>
<td><code>collapseSize</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Container width threshold for auto-collapse.</td>
</tr>
<tr>
<td><code>resizable</code></td>
<td><code>boolean</code></td>
<td><code>true</code></td>
<td>Whether this panel can be resized by dragging.</td>
</tr>
<tr>
<td><code>collapsible</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Whether this panel can be collapsed.</td>
</tr>
<tr>
<td><code>collapsed</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Initial collapsed state.</td>
</tr>
<tr>
<td><code>peekEnabled</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Enable peek overlay when panel is collapsed.</td>
</tr>
<tr>
<td><code>peekTrigger</code></td>
<td><code>'hover' | 'button' | 'both'</code></td>
<td><code>'hover'</code></td>
<td>What triggers the peek overlay.</td>
</tr>
<tr>
<td><code>peekWhenManual</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Allow peek even for manually collapsed panels.</td>
</tr>
<tr>
<td><code>peekWidth</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>Width of the peek overlay. Uses <code>initialSize</code> if not set.</td>
</tr>
<tr>
<td><code>peekGracePeriod</code></td>
<td><code>number</code></td>
<td><code>150</code></td>
<td>Grace period (ms) before hiding peek on mouse leave.</td>
</tr>
</tbody>
</table>

### DtResizableHandle

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Prop</th>
<th scope="col">Type</th>
<th scope="col">Default</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>beforePanelId</code></td>
<td><code>string</code></td>
<td><code>null</code></td>
<td>ID of the panel before this handle. Auto-detected if not set.</td>
</tr>
<tr>
<td><code>afterPanelId</code></td>
<td><code>string</code></td>
<td><code>null</code></td>
<td>ID of the panel after this handle. Auto-detected if not set.</td>
</tr>
<tr>
<td><code>disabled</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Disable resize interaction for this handle.</td>
</tr>
<tr>
<td><code>disableResetOnDoubleClick</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Disable the double-click reset behavior.</td>
</tr>
<tr>
<td><code>resetBehavior</code></td>
<td><code>'both' | 'before' | 'after' | 'all'</code></td>
<td><code>'both'</code></td>
<td>Which panels to reset on double-click.</td>
</tr>
<tr>
<td><code>offsetElement</code></td>
<td><code>string</code></td>
<td><code>undefined</code></td>
<td>CSS selector for an element to offset the handle position.</td>
</tr>
<tr>
<td><code>offsetAmount</code></td>
<td><code>number</code></td>
<td><code>0</code></td>
<td>Pixel offset amount for the handle position.</td>
</tr>
<tr>
<td><code>offsetDirection</code></td>
<td><code>'start' | 'end' | 'both'</code></td>
<td><code>'both'</code></td>
<td>Direction of the offset.</td>
</tr>
<tr>
<td><code>ariaLabel</code></td>
<td><code>string</code></td>
<td><code>null</code></td>
<td>Override the default aria-label for i18n.</td>
</tr>
</tbody>
</table>

## Events

### DtResizable

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Event</th>
<th scope="col">Payload</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>panel-resize</code></td>
<td><code>(panelId: string, size: number)</code></td>
<td>Emitted when a panel is resized.</td>
</tr>
<tr>
<td><code>panel-collapse</code></td>
<td><code>(panelId: string, collapsed: boolean)</code></td>
<td>Emitted when a panel is collapsed or expanded.</td>
</tr>
<tr>
<td><code>resize-start</code></td>
<td><code>(handleId: string)</code></td>
<td>Emitted when a resize drag begins.</td>
</tr>
<tr>
<td><code>resize-end</code></td>
<td><code>(handleId: string)</code></td>
<td>Emitted when a resize drag ends.</td>
</tr>
</tbody>
</table>

## Slots

### DtResizable

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Slot</th>
<th scope="col">Scoped Props</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>default</code></td>
<td><code>{ panels, direction, isResizing, resizePanel, collapsePanel, startResize, stopResize }</code></td>
<td>Container for panels and handles.</td>
</tr>
</tbody>
</table>

### DtResizablePanel

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Slot</th>
<th scope="col">Scoped Props</th>
<th scope="col">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>default</code></td>
<td><code>{ panel, isCollapsed, isResizing, isPeeking }</code></td>
<td>Panel content.</td>
</tr>
<tr>
<td><code>peek-trigger</code></td>
<td><code>{ togglePeek, isPeeking }</code></td>
<td>Custom trigger element for the peek overlay.</td>
</tr>
<tr>
<td><code>peek-content</code></td>
<td><code>{ exitPeek }</code></td>
<td>Custom content for the peek overlay. Falls back to default slot.</td>
</tr>
</tbody>
</table>

## Accessibility

- The `DtResizableHandle` renders as a `role="separator"` with `aria-orientation` matching the layout direction.
- Handles expose `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` indicating the size of the panel before the handle as a percentage.
- Arrow keys resize panels in increments. Larger increments are used with `Shift` held.
- `Enter` or `Space` on a handle toggles edit mode, which makes handles focusable via `Tab`.
- `Escape` exits edit mode.
- Screen reader announcements describe size changes during keyboard resize.
- Double-click on a handle resets adjacent panels to their initial sizes.

## Size Tokens

All size props accept percentage tokens with a `p` suffix. The value represents a percentage of the container size.

<table class="d-table dialtone-doc-table">
<thead>
<tr>
<th scope="col">Token</th>
<th scope="col">Meaning</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>'25p'</code></td>
<td>25% of container</td>
</tr>
<tr>
<td><code>'50p'</code></td>
<td>50% of container</td>
</tr>
<tr>
<td><code>'100p'</code></td>
<td>100% of container</td>
</tr>
</tbody>
</table>
