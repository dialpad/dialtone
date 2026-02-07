# Height

Utilities to control an element's height.

- **Keywords**: size, tall, vh, viewport height

## Percentages

Use `d-h{n}p` to set a percentage height for an element.

```html
<div class="d-h216">
  <div class="d-h10p">d-h10p</div>
  <div class="d-h20p">d-h20p</div>
  <div class="d-h25p">d-h25p</div>
  <div class="d-h30p">d-h30p</div>
  <div class="d-h40p">d-h40p</div>
  <div class="d-h50p">d-h50p</div>
  <div class="d-h60p">d-h60p</div>
  <div class="d-h70p">d-h70p</div>
  <div class="d-h75p">d-h75p</div>
  <div class="d-h80p">d-h80p</div>
  <div class="d-h90p">d-h80p</div>
  <div class="d-h100p">d-h100p</div>
</div>
```

## Fixed

Use `d-h{n}` to set a fixed height for an element.

```html
<div class="d-hmn264">
  <div class="d-h0">...</div>
  <div class="d-h1">...</div>
  <div class="d-h2">...</div>
  <div class="d-h4">...</div>
  <div class="d-h6">...</div>
  <div class="d-h8">...</div>
  <div class="d-h12">...</div>
  <div class="d-h16">...</div>
  <div class="d-h20">...</div>
  <div class="d-h24">...</div>
  <div class="d-h32">...</div>
  <div class="d-h42">...</div>
  <div class="d-h48">...</div>
  <div class="d-h64">...</div>
  <div class="d-h72">...</div>
  <div class="d-h84">...</div>
  <div class="d-h96">...</div>
  <div class="d-h102">...</div>
  <div class="d-h114">...</div>
  <div class="d-h128">...</div>
  <div class="d-h164">...</div>
  <div class="d-h216">...</div>
  <div class="d-h264">...</div>
  <div class="d-h332">...</div>
  <div class="d-h464">...</div>
  <div class="d-h512">...</div>
  <div class="d-h628">...</div>
  <div class="d-h764">...</div>
  <div class="d-h828">...</div>
  <div class="d-h912">...</div>
  <div class="d-h1024">...</div>
  <div class="d-h1140">...</div>
  <div class="d-h1268">...</div>
  <div class="d-h1340">...</div>
</div>
```

## Screen

Use `d-h100vh` to have an element cover the user's viewport.

```html
<div class="d-h100vh d-w100vw">...</div>
```

## Auto

Use `d-h-auto` have the browser calculate and select a height.

```html
<div class="d-h-auto">...</div>
```

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-h{{ i }}p | block-size: {{ i }}% !important; |
| .d-h{{ i }} | block-size: {{ i }}px !important; |
| .d-h100vh | block-size: 100vh !important; |
| .d-h-{{ i }} | block-size: {{ i }} !important; |

  </div>
