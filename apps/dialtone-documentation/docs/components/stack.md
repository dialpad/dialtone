---
title: Stack
description: Stack is a layout component used to group elements together and apply a space between them.
status: beta
thumb: true
image: assets/images/components/stack.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-stack--default
---

<code-well-header>
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
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-500">
  <div>Stack item 1</div>
  <div>Stack item 2</div>
  <div>Stack item 3</div>
</div>
'
vueCode='
<dt-stack
  gap="500"
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

## Examples

### Direction

#### Row: flow horizontally

<code-well-header>
  <dt-stack
    gap="500"
    direction="row"
    ref="rowExample"
  >
    <dt-badge text="co-host" />
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
  <dt-badge text="co-host" />
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

#### Column: flow vertically

<code-well-header>
  <dt-stack
    gap="500"
    direction="column"
    ref="columnExample"
  >
    <dt-badge text="co-host" />
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
  direction="column"
>
  <dt-badge text="co-host" />
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

#### Row reverse

<code-well-header>
  <dt-stack
    gap="500"
    direction="row-reverse"
    ref="rowReverseExample"
  >
    <dt-badge text="co-host" />
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
  <dt-badge text="co-host" />
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

#### Column reverse

<code-well-header>
  <dt-stack
    gap="500"
    direction="column-reverse"
    ref="columnReverseExample"
  >
    <dt-badge text="co-host" />
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
  <dt-badge text="co-host" />
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

### Gap

<code-well-header>
  <div class="d-d-flex d-g24">
    <dt-select-menu
      label="Gap"
      size="md"
      @change="setGap"
    >
      <option
        v-for="gap in gaps"
        :key="gap"
        :selected="gap === selectedGap"
        :value="gap"
        v-text="gap"
      />
    </dt-select-menu>
    <dt-stack
      :gap="selectedGap"
      ref="gapExample"
    >
      <div>Stack item 1</div>
      <div>Stack item 2</div>
      <div>Stack item 3</div>
    </dt-stack>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.gapExample"
vueCode='
<dt-stack
  :gap="selectedGap"
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

### Responsive

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

Set 300 as the default gap, 600 at <= XL, 500 at <= L, 400 at <= M, and 300 at <= SM. Check how our breakpoints work [here](/utilities/responsive/breakpoints.md).

<code-well-header>
  <dt-stack :gap="{ default: '300', xl: '600', lg: '500', md: '400', sm: '300' }" class="d-bgc-magenta-100">
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

  const selectedGap = ref('500');

  const setGap = (gap) => {
    selectedGap.value = gap;
  };

  const gaps = window.DIALTONE_CONSTANTS.DT_STACK_GAP;
</script>
