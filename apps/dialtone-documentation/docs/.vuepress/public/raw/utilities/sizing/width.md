# Width

Utilities to control an element's width.

- **Keywords**: size, wide, vw, viewport width

## Percentages

Use `d-w{n}p` to set a percentage width for an element.

```html
<div class="d-w10p">d-w10p</div>
<div class="d-w20p">d-w20p</div>
<div class="d-w25p">d-w25p</div>
<div class="d-w30p">d-w30p</div>
<div class="d-w40p">d-w40p</div>
<div class="d-w50p">d-w50p</div>
<div class="d-w60p">d-w60p</div>
<div class="d-w70p">d-w70p</div>
<div class="d-w75p">d-w75p</div>
<div class="d-w80p">d-w80p</div>
<div class="d-w90p">d-w90p</div>
<div class="d-w100p">d-w100p</div>
```

## Fixed

Use `d-w{n}` to set a fixed width for an element.

```html
<div class="d-w0">...</div>
<div class="d-w1">...</div>
<div class="d-w2">...</div>
<div class="d-w4">...</div>
<div class="d-w6">...</div>
<div class="d-w8">...</div>
<div class="d-w12">...</div>
<div class="d-w16">...</div>
<div class="d-w20">...</div>
<div class="d-w24">...</div>
<div class="d-w32">...</div>
<div class="d-w42">...</div>
<div class="d-w48">...</div>
<div class="d-w64">...</div>
<div class="d-w72">...</div>
<div class="d-w84">...</div>
<div class="d-w96">...</div>
<div class="d-w102">...</div>
<div class="d-w114">...</div>
<div class="d-w128">...</div>
<div class="d-w164">...</div>
<div class="d-w216">...</div>
<div class="d-w264">...</div>
<div class="d-w332">...</div>
<div class="d-w464">...</div>
<div class="d-w512">...</div>
<div class="d-w628">...</div>
<div class="d-w764">...</div>
<div class="d-w828">...</div>
<div class="d-w912">...</div>
<div class="d-w1024">...</div>
<div class="d-w1140">...</div>
<div class="d-w1268">...</div>
<div class="d-w1340">...</div>
```

## Screen

Use `d-w100vw` to have an element cover the user's viewport.

```html
<div class="d-h100vh d-w100vw">...</div>
```

## Auto

Use `d-w-auto` have the browser calculate and select a width.

```html
<div class="d-w-auto">...</div>
```

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-w{{ i }}p | inline-size: {{ i }}% !important; |
| .d-w{{ i }} | inline-size: {{ i }}px !important; |
| .d-w100vw | inline-size: 100vw !important; |
| .d-w-{{ i }} | inline-size: {{ i }} !important; |

  </div>
