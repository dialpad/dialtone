---
title: Line Clamp
description: Utilities for limiting the number of lines displayed for text content.
---

## Usage

Use `d-lc-{n}` to truncate text at a specific number of lines with an ellipsis.

<code-well-header>
  <dt-stack gap="500" class="d-w100p d-ai-baseline">
    <dt-stack gap="400" class="d-fl1 d-jc-space-between">
      <!-- <code class="d-code--sm d-docsite-code">class="d-lc-<strong>{{ selectedClamp }}</strong>"</code> -->
      <dt-select-menu
        :value="selectedClamp"
        @input="selectedClamp = $event"
        :options="clampOptions"
      />
    </dt-stack>
    <dt-stack class="" direction="row" gap="400">
      <p :class="`d-lc-${selectedClamp}`">
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

### Avoiding Conflicts with Display Utilities

<dt-notice kind="warning" class="d-wmx100p d-mb32" :hideClose="true">
  <template #default>
    <p>The line-clamp utility sets <code>display: -webkit-box</code> which will conflict with other display utilities. If you need to use line-clamp with flex or grid layouts, consider wrapping the clamped text in a separate element:</p>
  </template>
</dt-notice>

```html
<!-- This won't work because DtStack is flex-based -->
<dt-stack class="d-lc-2"> ... </dt-stack>

<!-- This will work -->
<dt-stack>
  <p class="d-lc-2"> ... </p>
</dt-stack>
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
  import { ref, computed } from 'vue';
  import { lineClamp } from '@data/type.json';

  const selectedClamp = ref('3');

  // Create options for the DtSelectMenu component
  const clampOptions = computed(() => [
    { value: '1', label: '1 line' },
    { value: '2', label: '2 lines' },
    { value: '3', label: '3 lines' },
    { value: '4', label: '4 lines' },
    { value: '5', label: '5 lines' },
    { value: '6', label: '6 lines' },
    { value: '7', label: '7 lines' },
    { value: '8', label: '8 lines' },
    { value: '9', label: '9 lines' },
    { value: 'none', label: 'None' },
    { value: 'unset', label: 'Unset' }
  ]);
</script>
