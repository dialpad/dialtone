# Overflow

Utilities for controlling how an element handles content that is too large for the container.

- **Keywords**: scroll, hidden, auto, clip, scrollbar

Consider using the custom scrollbar first with the [Scrollbar Directive](../../components/scrollbar.md).

## Examples

```html
<p class="d-of-auto">…</p>
<p class="d-of-x-auto">…</p>
<p class="d-of-y-auto">…</p>
<p class="d-of-hidden">…</p>
<p class="d-of-x-hidden">…</p>
<p class="d-of-y-hidden">…</p>
<p class="d-of-scroll">…</p>
<p class="d-of-x-scroll">…</p>
<p class="d-of-y-scroll">…</p>
<p class="d-of-visible">…</p>
<p class="d-of-x-visible">…</p>
<p class="d-of-y-visible">…</p>
<p class="d-of-unset">…</p>
```

## Classes

The `overflow` CSS shorthand property sets the desired behavior for how content is handled when it exceeds the wrapper's bounds in both directions (x-axis and then y-axis).

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-of-{{ className }} | {{ output }}; | {{ description }} |

  </div>
