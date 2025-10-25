---
title: Line Clamp
description: Utilities for limiting the number of lines displayed for text content.
---

## Usage

Use `d-line-clamp-{n}` to truncate text at a specific number of lines with an ellipsis.

<code-well-header class="d-w100p">
  <dt-stack class="d-w100p" gap="500">
    <dt-stack gap="500" direction="row" class="d-ai-baseline">
      <p class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-3</p>
      <p class="d-line-clamp-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<p class="d-line-clamp-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
```

### Avoiding Conflicts with Display Utilities

<dt-notice kind="warning" class="d-wmx100p d-mb32" :hideClose="true">
  <template #default>
    <p>The line-clamp utility sets <code>display: -webkit-box</code> which may conflict with other display utilities. If you need to use line-clamp with flex or grid layouts, consider wrapping the clamped text in a separate element:</p>
  </template>
</dt-notice>

```html
<!-- This won't work because DtStack is flex-based -->
<dt-stack class="d-line-clamp-2"> ... </dt-stack>

<!-- This will work -->
<dt-stack>
  <p class="d-line-clamp-2"> ... </p>
</dt-stack>
```

## Examples

<code-well-header class="d-w100p">
  <dt-stack class="d-w100p" gap="500">
    <dt-stack gap="500" direction="row" class="d-ai-baseline">
      <p class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-2</p>
      <p class="d-line-clamp-2">Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore nulla pariatur.</p>
    </dt-stack>
    <dt-stack gap="500" direction="row" class="d-ai-baseline">
      <p class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-3</p>
      <p class="d-line-clamp-3">Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore nulla pariatur.</p>
    </dt-stack>
    <dt-stack gap="500" direction="row" class="d-ai-baseline">
      <p class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-4</p>
      <p class="d-line-clamp-4">Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore nulla pariatur.</p>
    </dt-stack>
    <dt-stack gap="500" direction="row" class="d-ai-baseline">
      <p class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-5</p>
      <p class="d-line-clamp-5">Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore nulla pariatur.</p>
    </dt-stack>
    <dt-stack gap="500" direction="row" class="d-ai-baseline">
      <p class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-6</p>
      <p class="d-line-clamp-6">Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore nulla pariatur.</p>
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<p class="d-line-clamp-2">Two lines of text lorem ipsum...</p>
<p class="d-line-clamp-3">Three lines of text lorem ipsum...</p>
<p class="d-line-clamp-4">Four lines of text lorem ipsum...</p>
<p class="d-line-clamp-5">Five lines of text lorem ipsum...</p>
<p class="d-line-clamp-6">Six lines of text lorem ipsum...</p>
```
## Interactive Demo

Try adjusting the line clamp value to see how the text truncates at different lengths:

<code-well-header class="d-w100p">
  <div>
    <label>
      Select line clamp value:
      <code class="d-code--sm d-docsite-code">{{ selectedClamp === 'none' ? 'No class applied' : '.d-line-clamp-' + selectedClamp }}</code>
    </label>
    <select v-model="selectedClamp">
      <option v-for="value in ['2', '3', '4', '5', '6', '7', '8', '9', 'none']" :key="value" :value="value">
        {{ value === 'none' ? 'No clamping' : value + ' line' + (value === '1' ? '' : 's') }}
      </option>
    </select>
  </div>
  <div class="d-ba d-bc-default d-bar8 d-p16">
    <p :class="`${selectedClamp === 'none' ? '' : 'd-line-clamp-' + selectedClamp}`">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    </p>
  </div>
</code-well-header>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in lineClamp" :key="i">
        <th class="d-code--sm d-docsite-code">.d-line-clamp-{{ i }}</th>
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
</script>
