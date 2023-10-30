---
title: Background Patterns
description: Utilities for adding distinctive background patterns for Department and Call Centers.
---

## Usage

Use `d-bgg-pattern-{pattern}-{dark|light}` to apply a pattern.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102 d-stack8" custom>
  <div class="d-d-flex d-ai-center d-w100p d-h32 d-bar4 d-bgg-to-br d-bgg-from-gold-200 d-bgg-to-gold-200 d-bgg-pattern d-bgg-pattern-slanted-stripes-dark d-fs-200 d-fw-bold d-fc-primary">Ted's Call Center</div>
  <div class="d-d-flex d-ai-center d-w100p d-h32 d-bar4 d-bgg-to-br d-bgg-from-purple-400 d-bgg-to-purple-500 d-bgg-pattern d-bgg-pattern-dots-circles-light d-fs-200 d-fw-bold d-fc-neutral-white">Vicky's Department</div>
</code-well-header>

```html

<div class="... d-bgg-pattern d-bgg-pattern-slanted-stripes-dark">...</div>
<div class="... d-bgg-pattern d-bgg-pattern-dots-circles-light">...</div>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="c in ['dark', 'light']">
        <tr v-for="i in ['blob', 'chevrons', 'crosses', 'crosshatch', 'dot-dash', 'dots-circles', 'horz-stripes', 'slanted-stripes', 'steps', 'stripe']">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bgg-pattern-{{ i }}-{{ c }}</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl-grow1 d-ff-mono d-fs-100">
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
</div>
