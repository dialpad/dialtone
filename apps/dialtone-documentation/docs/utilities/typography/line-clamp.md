---
title: Line Clamp
description: Utilities for limiting the number of lines displayed for text content.
---

## Usage

Use `d-lc-{n}` to truncate text at a specific number of lines with an ellipsis.

<code-well-header>
  <dt-stack class="d-w100p">
    <h3 class="d-label">Select variant</h3>
    <dt-stack
      :direction="{ 'default': 'column', 'md': 'row' }"
      gap="200"
      class="d-ba d-bc-subtle d-p2 d-bar8 d-mb16"
    >
      <dt-button
        v-for="value in clampValues"
        size="xs"
        kind="muted"
        importance="clear"
        class="d-fl1 d-bar6"
        :key="value"
        :class="{ 'd-btn--active': value === selectedClamp }"
        @click="setClamp(value)"
      >
        {{ value === 'none' ? 'None' : value === 'unset' ? 'Unset' : value }}
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <p :class="`d-lc-${selectedClamp}`" class="d-fl1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
      <dt-stack class="d-as-flex-end d-fc-success">
        <dt-icon name="arrow-left" size="400" />
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<p class="d-lc-{n}">Lorem ipsum dolor...</p>
```

### Avoiding display conflicts

<dt-notice kind="warning" class="d-wmx100p d-mb32" :hideClose="true">
  <template #default>
    <p>The line-clamp utility sets <code>display: -webkit-box</code> which will conflict with other display utilities. If you need to use line-clamp with flex or grid layouts, consider wrapping the clamped text in a separate element:</p>
  </template>
</dt-notice>

#### Flex example

```html
<!-- This won't work because DtStack is flex-based -->
<dt-stack class="d-lc-3"> ... </dt-stack>

<!-- This will -->
<dt-stack>
  <p class="d-lc-3"> ... </p>
</dt-stack>

```

#### Grid example

```html
<!-- This won't work -->
<div class="d-lc-3 d-d-grid"> ... </div>

<!-- This will -->
<div class="d-d-grid">
  <p class="d-lc-3"> ... </p>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in lineClamp" :key="i">
        <th class="d-code--sm d-docsite-code">.d-lc-{{ i }}</th>
        <td class="d-code--sm">
          {{ i !== 'none' && i !== 'unset' ? `-webkit-line-clamp: ${i} !important;` : '-webkit-line-clamp: unset !important;' }}
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { ref } from 'vue';
  import { lineClamp } from '@data/type.json';

  const selectedClamp = ref('3');

  const setClamp = (value) => {
    selectedClamp.value = value;
  };

  const clampValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'none', 'unset'];
</script>
