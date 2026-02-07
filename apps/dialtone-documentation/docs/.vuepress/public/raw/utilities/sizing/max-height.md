# Max-height

Utilities to control an element's maximum height.

- **Keywords**: maximum height, mxh

## Example

Use `d-hmx{n}p` or `d-hmx{n}` to set a maximum height percentage for an element. This can be combined with `d-h{n}p` and `d-hmn{n}` to have an element fill a certain height range.

```html
<div class="d-h216">
    <div class="d-h72 d-hmx50p">1</div>
</div>
```

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-hmx{{ i }}p | max-block-size: {{ i }}% !important; |
| .d-hmx{{ i }} | max-block-size: {{ i }}px !important; |
| .d-hmx-{{ i }} | max-block-size: {{ i }} !important; |

  </div>
