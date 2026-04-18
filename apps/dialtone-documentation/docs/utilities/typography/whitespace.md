---
title: Whitespace
description: Utilities for controlling an element's whitespace.
keywords: ["nowrap", "pre", "pre wrap", "word spacing"]
---

## Normal

Use `d-ws-normal` to collapse an element's text whitespaces sequences and newline characters are treated like whitespace. Lines are broken as needed to fill boxes.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-350">
  <p class="d-ws-normal">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentium Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
</div>
```

## No Wrap

Use `d-ws-nowrap` to collapse an element's text whitespaces sequences, but line breaks are not honored. This keeps text from wrapping.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-350">
  <p class="d-ws-nowrap d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
</div>
```

## Pre

Use `d-ws-pre` to preserve an element's whitespaces sequences. Lines are only broken at new line characters and `<br/>` elements.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-350">
  <p class="d-ws-pre d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>       Blanditiisitaquequodpraesentiumexplicaboincidunt?       Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
</div>
```

## Pre Line

Use `d-ws-pre-line` to collapse an element's whitespaces sequences. Lines are broken at new line characters, `<br/>` elements, or as needed to fill boxes.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-350">
  <p class="d-ws-pre-line d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
</div>
```

## Pre Wrap

Use `d-ws-pre-wrap` to preserve an element's whitespaces sequences. Lines are broken at new line characters, `<br/>` elements, or as needed to fill boxes.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-350">
  <p class="d-ws-pre-wrap d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>      Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
</div>
```

## Break Spaces

Use `d-ws-break-spaces` to have an element act like `pre-wrap` except that any sequence of preserved whitespace always takes up space, a line breaking opportunity exists after every preserved whitespace character, and preserved spaces take up space and do not hang which affects the element's intrinisic size (`min-content` and `max-content` sizes).

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-350">
  <p class="d-ws-break-spaces d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces', 'unset']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-ws-{{ i }}</th>
        <td class="d-code--sm">white-space: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
