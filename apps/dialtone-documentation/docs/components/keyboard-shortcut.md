---
title: Keyboard shortcut
description: This component displays a visual representation of a keyboard shortcut to the user.
status: ready
thumb: true
image: assets/images/components/keyboard-shortcut.png
storybook: https://vue.dialpad.design/?path=/story/components-keyboard-shortcut--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components?type=design&node-id=8922-20524&mode=design&t=4VsDQfzhbBwFVFl2-11
---

<code-well-header>
  <dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
</code-well-header>

## Variants

### Base

<code-well-header>
  <dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
</code-well-header>

```html
  <dt-keyboard-shortcut shortcut="{cmd}+Ctrl+X"/>
```

### Inverted

<code-well-header bgclass="d-bgc-contrast">
  <dt-keyboard-shortcut inverted shortcut="{cmd}+Ctrl+X" />
</code-well-header>

```html
  <dt-keyboard-shortcut inverted shortcut="{cmd}+Ctrl+X" />
```

## Vue API

<component-vue-api component-name="keyboardshortcut" />
