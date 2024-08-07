---
title: Stack
description: Stack is a layout component used to group elements together and apply a space between them.
status: beta
thumb: true
image: assets/images/components/stack.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-stack--default
---

<code-well-header>
    <div class="d-stack d-stack--gap-500">
      <div class="d-bgc-magenta-100">
        Stack item 1
      </div>
      <div class="d-bgc-magenta-100">
        Stack item 2
      </div>
      <div class="d-bgc-magenta-100">
        Stack item 3
      </div>
    </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-500">
  <div class="d-bgc-magenta-100">Stack item 1</div>
  <div class="d-bgc-magenta-100">Stack item 2</div>
  <div class="d-bgc-magenta-100">Stack item 3</div>
</div>
'
vueCode='
<dt-stack
  gap="500"
>
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
showHtmlWarning />

## Examples

### Direction

Row: flow horizontally

<code-well-header>
    <div class="d-stack d-stack--row d-stack--gap-400">
      <span class="d-badge">Co-host</span>
      <span class="d-badge">Customer</span>
      <span class="d-badge">
        <span class="d-badge__icon-left">
          <dt-icon name="lock" size="200" />
        </span>
        <span class="d-badge__label">Locked</span>
      </span>
      <span class="d-badge">
        <span class="d-badge__icon-left">
          <dt-icon name="message" size="200" />
        </span>
        <span class="d-badge__label">Chat log</span>
      </span>
    </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--row d-stack--gap-500">
  <span class="d-badge">
    <span class="d-badge__label"> co-host </span>
  </span>
  <span class="d-badge">
    <span class="d-badge__label"> Customer </span>
  </span>
  <span class="d-badge">
    <span class="d-badge__icon-left">
      <svg>...</svg>
    </span>
    <span class="d-badge__label"> Locked </span>
  </span>
  <span class="d-badge">
    <span class="d-badge__icon-left">
      <svg>...</svg>
    </span>
    <span class="d-badge__label"> Chat log </span>
  </span>
</div>
'
vueCode='
<dt-stack
  gap="500"
  direction="row"
>
  <dt-badge text="co-host" />
  <dt-badge text="Customer" />
  <dt-badge
    icon-left="lock"
    text="Locked"
  />
  <dt-badge
    icon-left="message"
    text="Chat log"
  />
</dt-stack>
'
showHtmlWarning />

### Responsive

Stacks column at small screen size and column reverse at large screen

<code-well-header>
    <div class="d-stack d-stack--row d-stack--sm--column d-stack--lg--column-reverse d-stack--gap-100">
      <div class="d-bgc-magenta-100">
        Stack item 1
      </div>
      <div class="d-bgc-magenta-100">
        Stack item 2
      </div>
      <div class="d-bgc-magenta-100">
        Stack item 3
      </div>
    </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--row d-stack--sm--column d-stack--lg--column-reverse d-stack--gap-0">
  <div class="d-bgc-magenta-100">Stack item 1</div>
  <div class="d-bgc-magenta-100">Stack item 2</div>
  <div class="d-bgc-magenta-100">Stack item 3</div>
</div>
'
vueCode='
<dt-stack
  :direction="{ `default`: `row`, `sm`: `column`, `lg`: `column-reverse` }"
>
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
showHtmlWarning />

Set gap to 600 at extra large screen size, 500 for large screen size, 400 for medium screen size, and 300 for small screen size

<code-well-header>
    <dt-stack :gap="{ xl: '600', lg: '500', md: '400', sm: '300' }">
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
</code-well-header>

Stacks row with gap 300 and stacks in row reverse the second element with gap 600

<code-well-header>
    <section class="d-stack d-stack--row d-stack--gap-300">
      <div class="d-bgc-magenta-100">
        Stack item 1
      </div>
      <div>
        <div class="d-bgc-magenta-100">
          Stack item 2
        </div>
        <div class="d-stack d-stack--row-reverse d-stack--gap-600">
          <div class="d-bgc-magenta-200">
            Stack item 3
          </div>
          <div class="d-bgc-magenta-200">
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
