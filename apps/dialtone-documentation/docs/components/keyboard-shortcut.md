---
title: Keyboard shortcut
description: This component displays a visual representation of a keyboard shortcut to the user.
status: ready
thumb: true
image: assets/images/components/keyboard-shortcut.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-keyboard-shortcut--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components?type=design&node-id=8922-20524&mode=design&t=4VsDQfzhbBwFVFl2-11
---

<code-well-header>
  <dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
</code-well-header>

## Base

Keyboard shortcut outlines a key combination with a border to represent a keyboard shortcut. `+` will be rendered as an icon rather than text. Supported symbol tags can be used in the shortcut prop, see the [Props, Slots & Events](#vue-api) section.

<code-well-header>
  <dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
</code-well-header>

<code-example-tabs
htmlCode='
<kbd class="d-keyboard-shortcut">
  <svg>...</svg>
  <svg>...</svg>
  <span aria-hidden="true" class="d-keyboard-shortcut__item">Ctrl</span>
  <svg>...</svg>
  <span aria-hidden="true" class="d-keyboard-shortcut__item">X</span>
</kbd>
'
vueCode='
<dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
'
showHtmlWarning />

## Usage

- Commands shown should always be device specific (different systems may require a different shortcut combination).
- Commonly used in list item, tooltips.
- Don't use actual “+” key as a shortcut.
- Avoid using browser or operating system shortcuts. For example, `Control+P` is `print`.

## Variants

### Inverted

<code-well-header bgclass="d-bgc-contrast">
  <dt-keyboard-shortcut inverted shortcut="{cmd}+Ctrl+X" />
</code-well-header>

<code-example-tabs
htmlCode='
<kbd class="d-keyboard-shortcut d-keyboard-shortcut--inverted">
  <svg>...</svg>
  <svg>...</svg>
  <span aria-hidden="true" class="d-keyboard-shortcut__item d-keyboard-shortcut__item--inverted">Ctrl</span>
  <svg>...</svg>
  <span aria-hidden="true" class="d-keyboard-shortcut__item d-keyboard-shortcut__item--inverted">X</span>
</kbd>
'
vueCode='
<dt-keyboard-shortcut inverted shortcut="{cmd}+Ctrl+X" />
'
showHtmlWarning />

### Shortcut size variation

<code-well-header>
  <dt-keyboard-shortcut
    class="d-fs-200"
    shortcut="{cmd}+Y"
    ref="sizeExample"
  />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.sizeExample"
vueCode='
<dt-keyboard-shortcut class="d-fs-200" shortcut="{cmd}+Y" />
'
/>

### All available shortcut aliases

<code-well-header>
  <dt-keyboard-shortcut
    ref="allShortcuts"
    shortcut="{cmd}+{win}+{arrow-right}+{arrow-left}+{arrow-up}+{arrow-down}"
  />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.allShortcuts"
vueCode='
<dt-keyboard-shortcut
  shortcut="{cmd}+{win}+{arrow-right}+{arrow-left}+{arrow-up}+{arrow-down}"
/>
'
/>

### Inline with text and screen reader text

<code-well-header>
  <div ref="inlineExample">
  Press
  <dt-keyboard-shortcut
    screen-reader-text="Ctrl and F5"
    shortcut="Ctrl + F5"
  />
  to hard refresh the page.
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.inlineExample"
vueCode='
Press
<dt-keyboard-shortcut
  screen-reader-text="Ctrl and F5"
  shortcut="Ctrl + F5"
/>
to hard refresh the page.
'
/>

## Accessibility

Keyboard shortcuts should be visible to sighted users and made available to assistive technology. This keyboard shortcut component is purely visual by default, and will not read out to a screen reader.

[aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts) should be used on the anchor element of the keyboard shortcut to indicate the existence of it to assistive technology.

If your keyboard shortcut is inline with text, you can set the screenReaderText prop so it is read by AT.

Example:

```vue
// This button can be activated by pressing control+shift+v, let's indicate that
// to the screenreader by using aria-keyshortcuts.
<button aria-keyshortcuts="control+shift+v">Press Me</button>
```

Abbreviations / symbols should be read out in full for voiceover / screen readers.

## References

- [Keyboard Symbols](http://xahlee.info/comp/unicode_computing_symbols.html)
- [aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)

## Vue API

<component-vue-api component-name="keyboardshortcut" />
