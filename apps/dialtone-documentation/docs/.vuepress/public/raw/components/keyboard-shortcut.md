# Keyboard shortcut

This component displays a visual representation of a keyboard shortcut to the user.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-keyboard-shortcut--default
- **Keywords**: hotkey, key binding, shortcut key, d-kbd, DtKeyboardShortcut, dt-keyboard-shortcut, kbd, accelerator

## Base

Keyboard shortcut outlines a key combination with a border to represent a keyboard shortcut. `+` will be rendered as an icon rather than text. Supported symbol tags can be used in the shortcut prop, see the [Props, Slots & Events](#vue-api) section.

```vue
<dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
```

## Usage

- Commands shown should always be device specific (different systems may require a different shortcut combination).
- Commonly used in list item, tooltips.
- Don't use actual “+” key as a shortcut.
- Avoid using browser or operating system shortcuts. For example, `Control+P` is `print`.

## Variants

### Inverted

```vue
<dt-keyboard-shortcut inverted shortcut="{cmd}+Ctrl+X" />
```

### Shortcut Size Variation

```vue
<dt-keyboard-shortcut class="d-fs-200" shortcut="{cmd}+Y" />
```

### All Available Shortcut Aliases

```vue
<dt-keyboard-shortcut
  shortcut="{cmd}+{opt}+{win}+{arrow-right}+{arrow-left}+{arrow-up}+{arrow-down}"
/>
```

### Inline with Text and Screen Reader Text

```vue
Press
<dt-keyboard-shortcut
  screen-reader-text="Control plus F5"
  shortcut="Ctrl + F5"
/>
to hard refresh the page.
```

## Accessibility

Keyboard shortcuts are visible to sighted users and made available to assistive technology. This component automatically generates accessible text in a visually-hidden element that will be announced by screen readers.

The auto-generated accessible text converts:

- **Icon aliases**: (e.g., `{cmd}`) to full names (e.g., "Command")
- **Key abbreviations**: (e.g., "Ctrl", "Alt") to full names (e.g., "Control", "Alt")
- **Plus separators**: (`+`) to the word "plus"

For example, `{cmd}+Ctrl+X` will be announced as "Command plus Control plus X".

### Customizing the Screen Reader Text

You can override the auto-generated accessible text by providing the `screenReaderText` prop with custom text.

### Announcing shortcuts independent of DtKeyboardShortcut

If an element (e.g. a `button`) can be triggered by a keyboard shortcut, the [aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts) attribute should be used to announce the keyboard shortcut to screen readers.

Example:

```vue
// This button can be activated by pressing control+shift+v, let's indicate that
// to the screenreader by using aria-keyshortcuts.
<button aria-keyshortcuts="control+shift+v">Press Me</button>
```

Abbreviations / symbols should be spelled out in full for voiceover / screen readers, e.g. "Control" instead of "Ctrl".

## References

- [Keyboard Symbols](http://xahlee.info/comp/unicode_computing_symbols.html)
- [aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `inverted` | If true, applies inverted styles. | `boolean` | `false` |
| `shortcut` | Include any of these tokens in your string to render the corresponding symbol: {cmd} {opt} {win} {arrow-right} {arrow-left} {arrow-up} {arrow-down} | `string` | `''` |
| `screenReaderText` | Optional text to override the auto-generated accessible text for assistive technology. If not provided, accessible text will be automatically generated from the shortcut. | `string` | `null` |
