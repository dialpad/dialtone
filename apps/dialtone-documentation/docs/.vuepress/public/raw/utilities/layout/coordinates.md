# Coordinates

Utility classes to assign an element’s top, right, bottom, or left position.

- **Keywords**: top,right,bottom,left,inset,position offset

## Positive Coordinates

### Examples

Use the `top|right|bottom|left|x|y|all` utility classes to absolutely position elements within the nearest positioned element.

```html
<!-- Example 1 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-x0 d-t0 d-h50p">1</div>
</div>

<!-- Example 2 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-y0 d-r0 d-w50p">2</div>
</div>

<!-- Example 3 -->
<div class="d-ps-relative d-h128 d-w128">
      <div class="d-ps-absolute d-x0 d-b0 d-h50p">3</div>
</div>

<!-- Example 4 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-y0 d-l0 d-w50p">4</div>
</div>

<!-- Example 5 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-all0">5</div>
</div>

<!-- Example 6 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-t0 d-l0 d-w50p d-h50p">6</div>
</div>

<!-- Example 7 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-t0 d-r0 d-w50p d-h50p">7</div>
</div>

<!-- Example 8 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-b0 d-r0 d-w50p d-h50p">8</div>
</div>

<!-- Example 9 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-b0 d-l0 d-w50p d-h50p">9</div>
</div>

<!-- Example 10 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-all8">10</div>
</div>
```

### Classes

<div class="d-bar8 d-ba d-bc-subtle">
  <div class="d-w100p d-of-auto">
| Value | {{ dir }} |  |
| --- | --- | --- |
| {{ value }} | N/A | .d-{{ pre }}{{ coordinate }}{{ suffix }} .d-{{ pre }}{{ coordinate }} |

  </div>
</div>

## Negative Coordinates

### Examples

Use the `top|right|bottom|left|x|y|all` utility classes to absolutely position elements within the nearest positioned element.

```html
<!-- Example 1 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-xn2 d-tn2 d-h50p">1</div>
</div>

<!-- Example 2 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-yn2 d-rn2 d-w50p">2</div>
</div>

<!-- Example 3 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-xn2 d-bn2 d-h50p">3</div>
</div>

<!-- Example 4 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-yn2 d-ln2 d-w50p">4</div>
</div>

<!-- Example 5 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-alln2">5</div>
</div>

<!-- Example 6 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-tn4 d-ln4 d-w50p d-h50p">6</div>
</div>

<!-- Example 7 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-tn8 d-rn8 d-w50p d-h50p">7</div>
</div>

<!-- Example 8 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-bn8 d-rn8 d-w50p d-h50p">8</div>
</div>

<!-- Example 9 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-bn4 d-ln4 d-w50p d-h50p">9</div>
</div>
```

### Classes

<div class="d-bar8 d-ba d-bc-subtle">
  <div class="d-w100p d-of-auto">
| Value | {{ dir }} |  |
| --- | --- | --- |
| {{ value }} | N/A | .d-{{ pre }}n{{ coordinate }}{{ suffix }} .d-{{ pre }}n{{ coordinate }} |

  </div>
</div>
