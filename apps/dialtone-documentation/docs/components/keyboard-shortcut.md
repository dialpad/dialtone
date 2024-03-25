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

## Variants

### Base

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

## Vue API

<component-vue-api component-name="keyboardshortcut" />
