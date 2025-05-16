---
title: Background Patterns
description: Utilities for adding distinctive background patterns for Department and Call Centers.
---

## Usage

Use `d-bgg-pattern-{pattern}-{dark|light}` to apply a pattern.

<code-well-header>
  <div class="d-d-flex d-ai-center d-w100p d-h32 d-bar4 d-bgg-to-br d-ba d-bc-default d-bgc-moderate d-bgg-pattern d-bgg-pattern-slanted-stripes-dark d-fc-primary">Ted's Call Center</div>
  <div class="d-d-flex d-ai-center d-w100p d-h32 d-bar4 d-bgg-to-br d-ba d-bc-default d-bgc-moderate d-bgg-pattern d-bgg-pattern-chevrons-dark">Vicky's Department</div>
</code-well-header>

```html

<div class="... d-bgg-pattern d-bgg-pattern-slanted-stripes-dark">...</div>
<div class="... d-bgg-pattern d-bgg-pattern-dots-circles-light">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="c in ['dark', 'light']">
      <tr v-for="i in ['blob', 'chevrons', 'crosses', 'crosshatch', 'dot-dash', 'dots-circles', 'horz-stripes', 'slanted-stripes', 'steps', 'stripe']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bgg-pattern-{{ i }}-{{ c }}</th>
        <td>
          <div class="d-d-flex d-jc-space-between d-ai-center">
            <div class="d-fl-grow1 d-code--sm">
              --bgg-pattern: --bgg-pattern-{{ i }}-{{ c }};
            </div>
            <div
              class="d-w24 d-h24 d-bgg-pattern d-ba d-bc-black-900 d-bar4"
              :class="[
                  {'d-bgc-neutral-white': c === 'dark'},
                  {'d-bgc-neutral-black': c === 'light'},
                  `d-bgg-pattern-${i}-${c}`
              ]"
            >
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
