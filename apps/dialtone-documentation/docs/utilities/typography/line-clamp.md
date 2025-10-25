---
title: Line Clamp
description: Limiting the number of lines displayed for text content.
---

## Usage

Use `d-lc-{n}` to truncate text at a specific number of lines with an ellipsis.

<code-well-header>
  <dt-stack direction="row" gap="500" class="d-w100p d-ai-flex-start">
    <div>
      <code class="d-code--sm d-docsite-code">d-lc-2</code>
      <p class="d-lc-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
    <div>
      <code class="d-code--sm d-docsite-code">d-lc-3</code>
      <p class="d-lc-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
    <div>
      <code class="d-code--sm d-docsite-code">d-lc-4</code>
      <p class="d-lc-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
  </dt-stack>
</code-well-header>

```html
<p class="d-lc-{n}">Lorem ipsum dolor...</p>
```

### Avoiding display conflicts

<dt-notice kind="error" class="d-wmx100p d-mb16" :hideClose="true">
  <template #default>
    Avoid applying line-clamp to elements with flex or grid <code>display</code> styles. The clamped text should be considered a child element of the flex or grid container.
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
  import { lineClamp } from '@data/type.json';
</script>
