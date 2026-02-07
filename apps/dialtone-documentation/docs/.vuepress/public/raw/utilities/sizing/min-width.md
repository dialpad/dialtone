# Min-width

Utilities to control an element's minimum width.

- **Keywords**: minimum width, mnw

## Percentages

Use `d-wmn{n}p` to set a minimum width percentage for an element. This can be combined with `d-w{n}p` and `d-wmx{n}` to have an element fill a certain height range.

```html
<div class="d-w64 d-wmn50p">1</div>
```

## Fixed

Use `d-wmn{n}` to set a fixed minimum width for an element. This can be combined with `d-w{n}p` and `d-wmx{n}` to have an element fill a certain height range.

```html
<div class="d-wmn64">1</div>
<div class="d-wmn96">2</div>
<div class="d-wmn332">3</div>
```

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-wmn{{ i }}p | min-inline-size: {{ i }}% !important; |
| .d-wmn{{ i }} | min-inline-size: {{ i }}px !important; |
| .d-wmn-{{ i }} | min-inline-size: {{ i }} !important; |

  </div>
