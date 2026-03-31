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
<dt-resizable direction="row">
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
<dt-resizable direction="row">
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
<dt-resizable direction="row">
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

| Constraint | Purpose | Applied during |
|---|---|---|
| `userMinSize` / `userMaxSize` | Hard floor/ceiling for user dragging | Drag interactions |
| `systemMinSize` / `systemMaxSize` | Scaling range for the layout engine | Viewport resizes |
| `collapseSize` | Container width threshold for auto-collapse | Container resize |

System constraints fall back to user constraints when not specified. `systemMinSize` must be >= `userMinSize`, and `systemMaxSize` must be <= `userMaxSize`.

## Collapsible Panels

Mark a panel as `collapsible` to allow it to collapse to zero width. Use the `collapsed` prop for initial state, or call `collapsePanel()` programmatically.

```vue
<dt-resizable ref="group" direction="row">
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
  direction="row"
  :collapse-rules="[
    { panelId: 'details', priority: 1 },
    { panelId: 'sidebar', priority: 2 },
  ]"
>
  ...
</dt-resizable>
```

## Persistence

Panel sizes can be persisted across page loads. Use `storageKey` for localStorage, or provide a custom adapter via the `:storage` prop.

### localStorage (Built-in)

```vue
<dt-resizable direction="row" storage-key="my-layout">
  ...
</dt-resizable>
```

### Custom Storage Adapter

Implement the `ResizableStorageAdapter` interface to persist layouts with Pinia, Vuex, IndexedDB, or any other storage backend.

```js
import { localStorageAdapter } from '@dialpad/dialtone-vue';

// Built-in localStorage factory
const adapter = localStorageAdapter('my-key');

// Custom adapter
const piniaAdapter = {
  save(data) { store.setLayout(data); },
  load() { return store.layout; },
  clear() { store.clearLayout(); },
};
```

```vue
<dt-resizable direction="row" :storage="piniaAdapter">
  ...
</dt-resizable>
```

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
  <dt-resizable ref="group" direction="row">
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

| Method | Signature | Description |
|---|---|---|
| `resizePanel` | `(panelId: string, size: number) => void` | Resize a panel to a specific pixel size |
| `collapsePanel` | `(panelId: string, collapsed: boolean) => void` | Collapse or expand a panel |
| `lockPanel` | `(panelId: string) => void` | Lock a panel at its current size |
| `unlockPanel` | `(panelId: string) => void` | Unlock a previously locked panel |
| `resetPanels` | `(beforePanelId?, afterPanelId?, behavior?) => void` | Reset panels to initial sizes |

### Exposed Readonly State

| Property | Type | Description |
|---|---|---|
| `state` | `readonly object` | Current layout state including `panels`, `containerSize`, `isResizing` |
| `panelConfigs` | `ComputedRef<Array>` | Panel configurations from the `panels` prop |
| `allocationStrategy` | `ComputedRef<string>` | Current space allocation strategy |

## Props

### DtResizable

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'row' \| 'column'` | `'row'` | Layout direction. `'row'` for horizontal, `'column'` for vertical. |
| `storageKey` | `string` | `null` | localStorage key for persisting panel sizes. |
| `storage` | `ResizableStorageAdapter` | `null` | Custom storage adapter. Overrides `storageKey` when both provided. |
| `panels` | `Array` | `[]` | Panel configurations array for programmatic initialization. |
| `spaceAllocationStrategy` | `'proportional' \| 'preserve-manual'` | `'proportional'` | Strategy for redistributing space when panels open/close. |
| `collapseRules` | `Array<CollapseRule>` | `[]` | Rules defining which panels collapse first when space is constrained. |

### DtResizablePanel

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | **required** | Unique panel identifier. |
| `initialSize` | `string` | `undefined` | Initial size as percentage token (e.g., `'25p'` for 25%). |
| `userMinSize` | `string` | `undefined` | Minimum size for user drag interactions. |
| `userMaxSize` | `string` | `undefined` | Maximum size for user drag interactions. |
| `systemMinSize` | `string` | `undefined` | Minimum size for system viewport scaling. |
| `systemMaxSize` | `string` | `undefined` | Maximum size for system viewport scaling. |
| `collapseSize` | `string` | `undefined` | Container width threshold for auto-collapse. |
| `resizable` | `boolean` | `true` | Whether this panel can be resized by dragging. |
| `collapsible` | `boolean` | `false` | Whether this panel can be collapsed. |
| `collapsed` | `boolean` | `false` | Initial collapsed state. |
| `peekEnabled` | `boolean` | `false` | Enable peek overlay when panel is collapsed. |
| `peekTrigger` | `'hover' \| 'button' \| 'both'` | `'hover'` | What triggers the peek overlay. |
| `peekWhenManual` | `boolean` | `false` | Allow peek even for manually collapsed panels. |
| `peekWidth` | `string` | `undefined` | Width of the peek overlay. Uses `initialSize` if not set. |
| `peekGracePeriod` | `number` | `150` | Grace period (ms) before hiding peek on mouse leave. |

### DtResizableHandle

| Prop | Type | Default | Description |
|---|---|---|---|
| `beforePanelId` | `string` | `null` | ID of the panel before this handle. Auto-detected if not set. |
| `afterPanelId` | `string` | `null` | ID of the panel after this handle. Auto-detected if not set. |
| `disabled` | `boolean` | `false` | Disable resize interaction for this handle. |
| `disableResetOnDoubleClick` | `boolean` | `false` | Disable the double-click reset behavior. |
| `resetBehavior` | `'both' \| 'before' \| 'after' \| 'all'` | `'both'` | Which panels to reset on double-click. |
| `offsetElement` | `string` | `undefined` | CSS selector for an element to offset the handle position. |
| `offsetAmount` | `number` | `0` | Pixel offset amount for the handle position. |
| `offsetDirection` | `'start' \| 'end' \| 'both'` | `'both'` | Direction of the offset. |

## Events

### DtResizable

| Event | Payload | Description |
|---|---|---|
| `panel-resize` | `(panelId: string, size: number)` | Emitted when a panel is resized. |
| `panel-collapse` | `(panelId: string, collapsed: boolean)` | Emitted when a panel is collapsed or expanded. |
| `resize-start` | `(handleId: string)` | Emitted when a resize drag begins. |
| `resize-end` | `(handleId: string)` | Emitted when a resize drag ends. |

## Slots

### DtResizable

| Slot | Scoped Props | Description |
|---|---|---|
| `default` | `{ panels, direction, isResizing, spaceAllocationStrategy, resizePanel, collapsePanel, startResize, stopResize }` | Container for panels and handles. |

### DtResizablePanel

| Slot | Scoped Props | Description |
|---|---|---|
| `default` | `{ panel, isCollapsed, isResizing, isPeeking }` | Panel content. |
| `peek-trigger` | `{ togglePeek, isPeeking }` | Custom trigger element for the peek overlay. |
| `peek-content` | `{ exitPeek }` | Custom content for the peek overlay. Falls back to default slot. |

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

| Token | Meaning |
|---|---|
| `'25p'` | 25% of container |
| `'50p'` | 50% of container |
| `'100p'` | 100% of container |
