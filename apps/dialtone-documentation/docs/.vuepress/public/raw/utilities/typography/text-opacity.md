# Text Opacity

Utilities for controlling an element's font-color opacity.

- **Keywords**: font opacity, color alpha

The ability to control an element's color is <em>only</em> provided as a class. We do not provide variables to control this. The text opacity class resets the font color's alpha channel CSS variable value.

## Usage

Use `d-fco{n}` to change a font-color's opacity. You can also change font-color's opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

```html
<p class="d-fc-critical">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco99">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco95">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco90">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco85">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco75">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco25">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco10">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco0">The quick brown fox jumps over the lazy dog.</p>
```

### Inheritance Constraints

Text opacity CSS Utilities won't be inherited by its children. A font-color utility class must be present on the same element to work.

<div class="d-d-grid d-g16 lg:d-g-cols2">
  <div>
      <strong>Text opacity utility classes don't inherit colors.</strong>

```html
// This will not work
<div class="d-fc-critical">
  <p>The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fco50">The quick brown fox jumps over the lazy dog.</p>
</div>
```

  </div>
  <div>
  <strong>Apply each utility class to the same element</strong>

```html
// This will
<div class="d-fc-critical">
  <p>The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
</div>
```

  </div>
</div>

## Classes

| Class | Output |
| --- | --- |
| `d-fco0` | --fco: 0% !important |
| `d-fco10` | --fco: 10% !important |
| `d-fco100` | --fco: 100% !important |
| `d-fco25` | --fco: 25% !important |
| `d-fco50` | --fco: 50% !important |
| `d-fco75` | --fco: 75% !important |
| `d-fco85` | --fco: 85% !important |
| `d-fco90` | --fco: 90% !important |
| `d-fco95` | --fco: 95% !important |
| `d-fco99` | --fco: 99% !important |
