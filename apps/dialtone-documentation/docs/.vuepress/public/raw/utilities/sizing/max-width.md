# Max-width

Utilities to control an element's maximum width.

- **Keywords**: maximum width, mxw

## Percentages

Use `d-wmx{n}p` to set a minimum width percentage for an element. This can be combined with `d-w{n}p` and `d-wmn{n}` to have an element fill a certain height range.

```html
<div class="d-w100p d-wmx50p">1</div>
```

## Fixed

Use `d-wmx{n}` to set a fixed minimum width for an element. This can be combined with `d-w{n}p` and `d-wmn{n}` to have an element fill a certain height range.

```html
<div class="d-w100p d-wmx64">1</div>
<div class="d-w100p d-wmx96">2</div>
<div class="d-w100p d-wmx332">3</div>
```

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-wmx{{ i }}p | max-inline-size: {{ i }}% !important; |
| .d-wmx{{ i }} | max-inline-size: {{ i }}px !important; |
| .d-wmx-{{ i }} | max-inline-size: {{ i }} !important; |

  </div>
