# Background Clip

Utilities for controlling whether an element's background extends underneath its border, padding, or content box.

- **Keywords**: bg clip, padding box, content box

## Usage

Use `d-bgc-{name}` to control which box an element's background is clipped by.

```html

<div class="d-bgc-border-box">...</div>
<div class="d-bgc-padding-box">...</div>
<div class="d-bgc-content-box">...</div>
```

## Clipping Text

Use `d-bgc-text` to clip the background color(s) within the foreground text.

```html
<dt-text kind="headline" size="3xl" class="d-ba d-bgc-text d-bgg-to-r d-bgg-from-magenta-400 d-bgg-to-purple-400">...</dt-text>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bgc-border-box` | background-clip: border-box !important |
| `d-bgc-content-box` | background-clip: content-box !important |
| `d-bgc-padding-box` | background-clip: padding-box !important |
| `d-bgc-text` | color: transparent !important; -webkit-background-clip: text !important; background-clip: text !important |
