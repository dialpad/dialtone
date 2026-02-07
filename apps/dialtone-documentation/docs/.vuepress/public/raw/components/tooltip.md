# Tooltip

A tooltip is a floating label that briefly explains an action, function, or an element. Its content is exclusively text and shouldn't be vital information for users. If richer media is desired, consider using a popover instead.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-tooltip--default
- **Keywords**: hint, help text, d-tooltip, DtTooltip, dt-tooltip

## Tooltip as a Directive

### Usage

#### Default

Default tooltip directive uses top as default placement

```vue
<dt-button v-dt-tooltip="`Tooltip text`">Hover me</dt-button>
```

#### With Placement

It's possible to change the tooltip default placement with directive arguments, possible values: bottom, bottom-start, bottom-end, right, right-start, right-end, left, left-start, left-end, top, top-start, top-end.

```javascript
<dt-button v-dt-tooltip:bottom-start="`Tooltip text`">Placeholder Button</dt-button>
```

#### With Object Syntax

It's possible to change any property of the tooltip with object syntax.

```javascript
<dt-button v-dt-tooltip="{ message: 'Tooltip text', placement: 'bottom-start', delay: false }">Placeholder Button</dt-button>
```

### Import

Import the directive from dialtone-vue

```javascript
import { DtTooltipDirective } from "@dialpad/dialtone-vue";
```

Install the directive into vue instance

```javascript
Vue.use(DtTooltipDirective);
```

## Tooltip as a Component

The tooltip, also known as infotip or hint, is a common graphical user interface element in which, when hovering over a
screen element or component, a text box displays information about that element (such as a description of a button's
function, or what an abbreviation stands for). The tooltip is displayed continuously as long as the user hovers over the
element

A tooltip has two slots:

1. **the anchor** required slot
2. **the default** slot (which could be replaced with prop message)

### Base Styles

```vue
<dt-tooltip message="tooltip">
  <template #anchor>
    <dt-button>
      Hover me
    </dt-button>
  </template>
</dt-tooltip>
```

### Inverted

```vue
<dt-tooltip inverted message="tooltip">
  <template #anchor>
    <dt-button>
      Hover me
    </dt-button>
  </template>
</dt-tooltip>
```

### Placement

```vue
<dt-tooltip
  message="This is a simple tooltip. The tooltip can be positioned in different directions."
  :placement="placement"
>
  <template #anchor>
    <dt-button>
      {{ placement }}
    </dt-button>
  </template>
</dt-tooltip>
```

### External anchor

```vue
<dt-button
  id="external-tooltip-anchor"
  importance="outlined"
>
  External anchor
</dt-button>
<dt-tooltip
  external-anchor="#external-tooltip-anchor"
>
  This is a tooltip with external anchor
</dt-tooltip>
```

### Fallback Placements

The tooltip uses [headless-tippy](https://atomiks.github.io/tippyjs/v6/headless-tippy/) and
[popper](https://popper.js.org/docs/v2/modifiers/flip/), if the tooltip opens in a placement where it will
be clipped, it will move to a new position. It will do this automatically by default, but if you want to
manually specify which position it will move to in what order you can do so via the fallbackPlacements prop.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | The id of the tooltip | `string` | `(function)` |
| `fallbackPlacements` | If the popover does not fit in the direction described by "placement", it will attempt to change its direction to the "fallbackPlacements" if defined, otherwise it will automatically position to a new location as it sees best fit. See <a class="d-link" href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements" target="_blank" > Popper.js docs </a> | `array` | `['auto']` |
| `inverted` | If true, applies inverted styles to the tooltip | `boolean` | `false` |
| `offset` | Displaces the tooltip from its reference element by the specified number of pixels. See <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#offset" target="_blank" > Tippy.js docs </a> | `array` | `[0, 12]` |
| `placement` | The direction the popover displays relative to the anchor. See <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#placement" target="_blank" > Tippy.js docs </a> | `string` | `'top'` |
| `sticky` | If the tooltip sticks to the anchor. This is usually not needed, but can be needed if the reference element's position is animating, or to automatically update the popover position in those cases the DOM layout changes the reference element's position. `true` enables it, `reference` only checks the "reference" rect for changes and `popper` only checks the "popper" rect for changes. See <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#sticky" target="_blank" > Tippy.js docs </a> | `boolean\|string` | `true` |
| `appendTo` | Sets the element to which the tooltip is going to append to. 'body' will append to the nearest body (supports shadow DOM). This prop is not reactive, must be set on initial render. | `HTMLElement\|string` | `'body'` |
| `contentClass` | Additional css classes for the tooltip content element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `message` | A provided message for the tooltip content | `string` | `''` |
| `enabled` | Controls whether hover/focus causes the tooltip to appear. Cannot be combined with the show prop. show value will be ignored. by default this is true, if you override with false, the tooltip will never show up. | `boolean` | `true` |
| `show` | Controls whether the tooltip is shown. Leaving this null will have the tooltip trigger on mouseover by default. If you set this value, the default mouseover behavior will be disabled and you can control it as you need. Supports .sync modifier | `boolean` | `null` |
| `transition` | Whether the tooltip should have a transition effect (fade). | `boolean` | `true` |
| `delay` | Whether the tooltip will have a delay when being focused or moused over. | `boolean` | `true` |
| `theme` | Set a custom theme on the tooltip. See https://atomiks.github.io/tippyjs/v6/themes/ | `string` | `null` |
| `externalAnchor` | External anchor id to use in those cases the anchor can't be provided via the slot. For instance, using the combobox's input as the anchor for the popover. | `string` | `null` |

### Slots

| Name | Description |
| --- | --- |
| `anchor` | Slot for the anchor element |
| `default` | Slot for the content, defaults to message prop |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `shown` | Emitted when tooltip is shown or hidden | `Boolean` |
| `update:show` | Sync show value | `undefined` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-tooltip` | N/A | Applies tooltip's base styles. |
| `d-tooltip--show` | .d-tooltip | Shows the tooltip. |
| `d-tooltip--hide` | .d-tooltip | Hides the tooltip. |
| `d-tooltip--hover` | .d-btn | Allows the tooltip to become visible on hover or focus-visible; applies to the element triggering the tooltip. This is a CSS-only solution and not recommended. |
| `d-tooltip--inverted` | .d-tooltip | Inverts styles to work on dark backgrounds. |
| `d-tooltip__arrow--{$direction}` | .d-tooltip | Defines which side of the tooltip its arrow appears. This is required as no arrow is assigned by default. Examples below. |

## Accessibility

Reads out the tooltip content as a supplementary description for its trigger when the trigger is focused.
See also [wai aria practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip).

### Anchor

The anchor element that activates the tooltip should be fully accessible by keyboard. The easiest way to do this is by
using an element like an `DtButton` that is already accessible. When pressing the `ESC` key in a focused tooltip,
tooltip will be closed.

There are some required ARIA attributes for the anchor element (such as `aria-hidden` set based on `open`).
To make this as straightforward as possible, these ARIA attributes are passed
with the correct values as the `attrs` to the anchor slot. Applying them is as simple as using `v-bind`.

### Focus & Keyboard

Due to the different contexts in which a tooltip can be used, focus management and
keyboard shortcut `ESC` is provided.
You are encouraged to consult the ARIA documentation for the particular role.

| Item | Applies to | Description |
| --- | --- | --- |
| `role="tooltip"` | .d-tooltip | Ensures more reliable voiceover support. (Source) |
| `aria-describedby="#id"` | .d-btn | Reads out the tooltip content as a supplementary description for its trigger when the trigger is focused. The aria-describedby value should be the trigger's CSS ID. (Source) |
