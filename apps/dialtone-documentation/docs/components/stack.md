---
title: Stack
description: Stack is a layout component used to group elements together and apply a space between them.
status: beta
thumb: true
image: assets/images/components/stack.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-stack--default
---

<code-well-header>
  <dt-stack direction="row" gap="600">
    <dt-stack
      gap="500"
      class="d-bgc-magenta-100"
    >
      <div class="d-bgc-secondary">
        Stack item 1
      </div>
      <div class="d-bgc-secondary">
        Stack item 2
      </div>
      <div class="d-bgc-secondary">
        Stack item 3
      </div>
    </dt-stack>
    <dt-stack
      gap="500"
      direction="row"
      class="d-bgc-magenta-100"
    >
      <div class="d-bgc-secondary">
        Stack item 1
      </div>
      <div class="d-bgc-secondary">
        Stack item 2
      </div>
      <div class="d-bgc-secondary">
        Stack item 3
      </div>
    </dt-stack>
  </dt-stack>
</code-well-header>

## Direction

### Column: Flow Vertically

`column` is the default direction and doesn't need to be explictily set.

<code-well-header>
  <dt-stack
    gap="500"
    ref="columnExample"
  >
    <dt-badge text="Admin" />
    <dt-badge text="Customer" />
    <dt-badge
      text="Locked"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-lock :size="iconSize" />
      </template>
    </dt-badge>
    <dt-badge
      text="Chat log"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-message :size="iconSize" />
      </template>
    </dt-badge>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.columnExample"
vueCode='
<dt-stack
  gap="500"
>
  <dt-badge text="Admin" />
  <dt-badge text="Customer" />
  <dt-badge
    text="Locked"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-lock :size="iconSize" />
    </template>
  </dt-badge>
  <dt-badge
    text="Chat log"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-message :size="iconSize" />
    </template>
  </dt-badge>
</dt-stack>
'
/>

### Row: Flow Horizontally

<code-well-header>
  <dt-stack
    gap="500"
    direction="row"
    ref="rowExample"
  >
    <dt-badge text="Admin" />
    <dt-badge text="Customer" />
    <dt-badge
      text="Locked"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-lock :size="iconSize" />
      </template>
    </dt-badge>
    <dt-badge
      text="Chat log"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-message :size="iconSize" />
      </template>
    </dt-badge>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.rowExample"
vueCode='
<dt-stack
  gap="500"
  direction="row"
>
  <dt-badge text="Admin" />
  <dt-badge text="Customer" />
  <dt-badge
    text="Locked"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-lock :size="iconSize" />
    </template>
  </dt-badge>
  <dt-badge
    text="Chat log"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-message :size="iconSize" />
    </template>
  </dt-badge>
</dt-stack>
'
showHtmlWarning />

### Row Reverse

<code-well-header>
  <dt-stack
    gap="500"
    direction="row-reverse"
    ref="rowReverseExample"
  >
    <dt-badge text="Admin" />
    <dt-badge text="Customer" />
    <dt-badge
      text="Locked"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-lock :size="iconSize" />
      </template>
    </dt-badge>
    <dt-badge
      text="Chat log"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-message :size="iconSize" />
      </template>
    </dt-badge>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.rowReverseExample"
vueCode='
<dt-stack
  gap="500"
  direction="row-reverse"
>
  <dt-badge text="Admin" />
  <dt-badge text="Customer" />
  <dt-badge
    text="Locked"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-lock :size="iconSize" />
    </template>
  </dt-badge>
  <dt-badge
    text="Chat log"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-message :size="iconSize" />
    </template>
  </dt-badge>
</dt-stack>
'
/>

### Column Reverse

<code-well-header>
  <dt-stack
    gap="500"
    direction="column-reverse"
    ref="columnReverseExample"
  >
    <dt-badge text="Admin" />
    <dt-badge text="Customer" />
    <dt-badge
      text="Locked"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-lock :size="iconSize" />
      </template>
    </dt-badge>
    <dt-badge
      text="Chat log"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon-message :size="iconSize" />
      </template>
    </dt-badge>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.columnReverseExample"
vueCode='
<dt-stack
  gap="500"
  direction="column-reverse"
>
  <dt-badge text="Admin" />
  <dt-badge text="Customer" />
  <dt-badge
    text="Locked"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-lock :size="iconSize" />
    </template>
  </dt-badge>
  <dt-badge
    text="Chat log"
  >
    <template #leftIcon="{ iconSize }">
      <dt-icon-message :size="iconSize" />
    </template>
  </dt-badge>
</dt-stack>
'
/>

## Gap

<code-well-header>

  <dt-stack class=" d-w100p">
    <h3 class="d-label">Select a gap option</h3>
    <dt-stack
      :direction="{ 'default': 'column', 'md': 'row' }"
      gap="200"
      class="d-bgc-primary d-p2 d-bar4 d-mb16"
    >
      <dt-button
        v-for="gap in gaps"
        size="xs"
        kind="muted"
        importance="clear"
        class="d-fl1"
        :key="gap"
        :class="{ 'd-btn--active': gap === selectedGap }"
        @click="setGap(gap)"
      >
        {{ gap }}
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack
    :direction="{ 'default': 'column', 'md': 'row' }"
    gap="500"
    class="d-ai-flex-start d-w100p"
  >
    <dt-stack class="d-w50p md:d-w100p">
      <h3 class="d-headline--md">Column</h3>
      <dt-stack
        :gap="selectedGap"
        ref="gapExample"
        class="d-bgc-magenta-100 d-t d-td300 d-ttf-quint"
      >
        <div class="d-bgc-secondary">Stack item 1</div>
        <div class="d-bgc-secondary">Stack item 2</div>
        <div class="d-bgc-secondary">Stack item 3</div>
      </dt-stack>
    </dt-stack>
    <dt-stack class="d-w50p md:d-w100p">
      <h3 class="d-headline--md">Row</h3>
      <div class="d-d-inline-flex">
        <dt-stack
          direction="row"
          :gap="selectedGap"
          ref="gapExample"
          class="d-bgc-magenta-100 d-t d-td300 d-ttf-quint"
        >
          <div class="d-bgc-secondary">Stack item 1</div>
          <div class="d-bgc-secondary">Stack item 2</div>
          <div class="d-bgc-secondary">Stack item 3</div>
        </dt-stack>
      </div>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.gapExample"
vueCode='
<dt-stack
  gap="400"
>
  <div>
    Stack item 1
  </div>
  <div>
    Stack item 2
  </div>
  <div>
    Stack item 3
  </div>
</dt-stack>
'
/>

### Available gaps

<div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">Size</div>
          </th>
          <th scope="col" class="d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">Design Token</div>
          </th>
          <th scope="col" class="d-ta-right d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">REM</div>
          </th>
          <th scope="col" class="d-ta-right d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">PX</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
              0
          </th>
          <td>
            <strong>var(--dt-space-0)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.0rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             0px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
             50
          </th>
          <td>
            <strong>var(--dt-space-50)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.05rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            .5px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            100
          </th>
          <td>
            <strong>var(--dt-space-100)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.1rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             1px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            200
          </th>
          <td>
            <strong>var(--dt-space-200)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             2px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            300
          </th>
          <td>
            <strong>var(--dt-space-300)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.4rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             4px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            350
          </th>
          <td>
            <strong>var(--dt-space-350)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.6rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             6px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            400
          </th>
          <td>
            <strong>var(--dt-space-400)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.8rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             8px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            450
          </th>
          <td>
            <strong>var(--dt-space-450)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            1.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            12px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            500
          </th>
          <td>
            <strong>var(--dt-space-500)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            1.6rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            16px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            525
          </th>
          <td>
            <strong>var(--dt-space-525)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            2.0rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            20px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            550
          </th>
          <td>
            <strong>var(--dt-space-550)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            2.4rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            24px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            600
          </th>
          <td>
            <strong>var(--dt-space-600)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            3.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            32px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            625
          </th>
          <td>
            <strong>var(--dt-space-625)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            4.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            42px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            650
          </th>
          <td>
            <strong>var(--dt-space-650)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            4.8rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            48px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            700
          </th>
          <td>
            <strong>var(--dt-space-700)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            6.4rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            64px
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Responsive

Stacks column at small screen size and column reverse at large screen

<code-well-header>
  <div class="d-stack d-stack--row d-stack--sm-column d-stack--lg-column-reverse d-stack--gap-500 d-bgc-magenta-100">
    <div class="d-bgc-secondary">
      Stack item 1
    </div>
    <div class="d-bgc-secondary">
      Stack item 2
    </div>
    <div class="d-bgc-secondary">
      Stack item 3
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--row d-stack--sm-column d-stack--lg-column-reverse d-stack--gap-0">
  <div>Stack item 1</div>
  <div>Stack item 2</div>
  <div>Stack item 3</div>
</div>
'
vueCode='
<dt-stack
  :direction="{ `default`: `row`, `sm`: `column`, `lg`: `column-reverse` }"
>
  <div>
    Stack item 1
  </div>
  <div>
    Stack item 2
  </div>
  <div>
    Stack item 3
  </div>
</dt-stack>
'
showHtmlWarning />

Set `200` as the default gap, `300` for small and larger, `400` for medium, `500` for large, and `600` for extra large. Learn more about how our breakpoints work in the [Responsive Breakpoints documentation](/utilities/responsive/breakpoints.md).

<code-well-header>
  <dt-stack :gap="{ default: '200', xl: '600', lg: '500', md: '400', sm: '300' }" class="d-bgc-magenta-100">
    <div class="d-bgc-secondary">
      Stack item 1
    </div>
    <div class="d-bgc-secondary">
      Stack item 2
    </div>
    <div class="d-bgc-secondary">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-300 d-stack--sm-gap-300 d-stack--md-gap-400 d-stack--lg-gap-500 d-stack--xl-gap-600">
  <div class="d-bgc-magenta-100">Stack item 1</div>
  <div class="d-bgc-magenta-100">Stack item 2</div>
  <div class="d-bgc-magenta-100">Stack item 3</div>
</div>
'
vueCode='
<dt-stack :gap="{ default: `300`, xl: `600`, lg: `500`, md: `400`, sm: `300` }">
  <div class="d-bgc-magenta-100">
    Stack item 1
  </div>
  <div class="d-bgc-magenta-100">
    Stack item 2
  </div>
  <div class="d-bgc-magenta-100">
    Stack item 3
  </div>
</dt-stack>
'
/>

Stacks row with gap 300 and stacks in row reverse the nested stack with gap 600.

<code-well-header>
    <section class="d-stack d-stack--row d-stack--gap-300 d-bgc-magenta-100 d-ai-stretch">
      <div class="d-bgc-secondary d-ba d-bc-default">
        Stack item 1
      </div>
      <div>
        <div class="d-bgc-secondary d-ba d-bc-default">
          Stack item 2
        </div>
        <div class="d-stack d-stack--row-reverse d-stack--gap-600 d-bgc-magenta-100">
          <div class="d-bgc-secondary d-ba d-bc-default">
            Stack item 3
          </div>
          <div class="d-bgc-secondary d-ba d-bc-default">
            Stack item 4
          </div>
        </div>
      </div>
    </section>
</code-well-header>

<code-example-tabs
htmlCode='
<section class="d-stack d-stack--row d-stack--gap-300">
  <div class="d-bgc-magenta-100">Stack item 1</div>
  <div>
    <div class="d-bgc-magenta-100">Stack item 2</div>
    <div class="d-stack d-stack--row-reverse d-stack--gap-500">
      <div class="d-bgc-magenta-200">Stack item 3</div>
      <div class="d-bgc-magenta-200">Stack item 4</div>
    </div>
  </div>
</section>
'
vueCode='
<dt-stack
  direction="row"
  as="section"
  gap="300"
>
  <div class="d-bgc-magenta-100">Stack item 1</div>
  <div>
    <div class="d-bgc-magenta-100">Stack item 2</div>
    <dt-stack
      direction="row-reverse"
      gap="500"
    >
      <div class="d-bgc-magenta-200">Stack item 3</div>
      <div class="d-bgc-magenta-200">Stack item 4</div>
    </dt-stack>
  </div>
</dt-stack>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="stack" />

## Classes

<component-class-table component-name="stack"></component-class-table>

<script setup>
  import { ref } from 'vue';
  import {
    DtIconMessage,
    DtIconLock,
  } from '@dialpad/dialtone-icons/vue3';

  const selectedGap = ref('400');

  const setGap = (gap) => {
    selectedGap.value = gap;
  };

  const gaps = window.DIALTONE_CONSTANTS.DT_STACK_GAP;
</script>
