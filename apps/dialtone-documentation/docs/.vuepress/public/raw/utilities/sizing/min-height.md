# Min-height

Utilities to control an element's minimum height.

- **Keywords**: minimum height, mnh

## Percentages

Use `d-hmn{n}p` to set a minimum height percentage for an element. This can be combined with `d-h{n}p` and `d-hmx{n}` to have an element fill a certain height range.

```html
<div class="d-h216">
    <div class="d-hmn100p">1</div>
</div>
```

## Fixed

Use `d-hmn{n}` to set a fixed minimum height for an element. This can be combined with `d-h{n}p` and `d-hmx{n}` to have an element fill a certain height range.

```html
<div class="d-hmn64">1</div>
<div class="d-hmn96">2</div>
<div class="d-hmn332">3</div>
```

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-hmn{{ i }}p | min-block-size: {{ i }}% !important; |
| .d-hmn{{ i }} | min-block-size: {{ i }}px !important; |
| .d-hmn-{{ i }} | min-block-size: {{ i }} !important; |

  </div>
