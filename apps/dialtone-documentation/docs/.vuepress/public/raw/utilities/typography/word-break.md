# Word Break

Utilities for controlling the way words break within an element. Useful when you want to ensure that text will absolutely not overflow its container, regardless readability risk.

- **Keywords**: break all, break word, overflow wrap

## Normal

Use `d-wb-normal` to reset an element's line break rule.

```html
<p class="d-wb-normal">...</p>
```

## Break All

Use `d-wb-break-all` on an element to insert word breaks between any two characters (excluding Chinese, Japanese, or
Korean text) to prevent text from overflowing. The break between any two characters can lead to awkward line breaks in
the middle of short words, for a more conservative way to handle it see [`d-ww-break-word`](./word-wrap.md#break-word).

```html
<p class="d-wb-break-all">...</p>
```

## Break Word

Use `d-wb-break-word` on an element to insert word breaks between any two characters (including Chinese, Japanese, or
Korean text) to prevent text from overflowing. The break between any two characters can lead to awkward line breaks in
the middle of short words, for a more conservative way to handle it see [`d-ww-break-word`](./word-wrap.md#break-word).

```html
<p class="d-wb-break-word">...</p>
```

## Keep All

Use `d-wb-keep-all` on an element to not use word breaks for Chinese, Japanese, or Korean (CJK) text. Non-CJK text
behavior is set to normal.

```html
<p class="d-wb-keep-all">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-wb-break-all` | word-break: break-all !important |
| `d-wb-break-word` | overflow-wrap: break-word !important |
| `d-wb-keep-all` | word-break: keep-all !important |
| `d-wb-normal` | word-break: normal !important |
| `d-wb-unset` | word-break: unset !important |
