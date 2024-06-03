---
title: Empty state
description: When there's no data to display in a list, table, or other information container, we use an ‘Empty State’ component to guide users, clarifying the expected information and suggesting ways to populate it.
status: ready
thumb: true
image: assets/images/components/empty-state.png
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-card--default
---

<code-well-header>
  <dt-empty-state
    illustration-name="mind"
    header-text="Nothing to see here"
    body-text="Looks like there's no data to display here."
  >
    <template #body>
      <dt-stack direction="row" gap="300">
        <dt-button importance="clear">Click me</dt-button>
        <dt-button>Click me</dt-button>
      </dt-stack>
    </template>
  </dt-empty-state>
</code-well-header>

## Morphology & Anatomy

Image with bullets
<code-well-header>
<img class="d-w60p d-bs-lg" alt="empty state bullets" src="/assets/images/components/empty-state01.png">
</code-well-header>

1. Illustrations*
2. Title
3. Description*
4. Actions
   - Primary (this primary action, can be a primary button or a muted one)
   - Secondary*
5. Background

*optionals

The empty state uses all the space of the container it's replacing, always keeping the content in the middle.

The space taken by the empty state can vary, the padding will be minimum 24px and can be flexible and adapt the container size.

## Uses & Best practices

We identify 4 types of empty state:

<b> Zero state: </b> nothing has been added yet, we recommend to use this space to teach the user how to fill this container, or give a useful tip like a shortcut for something relatable or tell them what needs to happen if no action can be taken.

<img class="d-w100p d-bs-lg d-my8" alt="empty state example" src="/assets/images/components/empty-state02.png">
<br>
<br>

<b> No results:</b> the user performed an action and there are no results, in this scenario the best usage of the empty state will be to recommend how to recover. If the user is filtering a table, recommend another filter that has results or, like the zero state case, how to create a new entry with the properties the user is filtering.

<img class="d-w100p d-bs-lg d-my8" alt="empty state example" src="/assets/images/components/empty-state03.png">
<br>
<br>

<b> New feature:</b> A new section or screen the user doesn’t know and we want to introduce to them, if this action would include a change in their plan we should inform it in the component, also try to indulge/seduce the user to use this feature or to look interesting to them.

<img class="d-w100p d-bs-lg d-my8" alt="empty state example" src="/assets/images/components/empty-state04.png">
<br>
<br>

<b> Not enabled:</b> the section isn’t available to the user at the moment.

<img class="d-w100p d-bs-lgd-my8" alt="empty state example" src="/assets/images/components/empty-state05.png">
<br>
<br>

<dialtone-usage>
<template #do>

- Give the user all the information necessary to know how to proceed, but not so much they feel overwhelmed.
- If you are going to use an illustration or an icon, try to have it in a 2nd hierarchical level, to avoid distracting the user from the real task, we recommend to use desaturated color’s  illustrations and keep the text as a main thing the user should read.
- The background of the component should match the background of the environment
- The component can contain borders, depending on the context, see examples below.

</template>

<template #dont>

- Use the empty state as a dead end, always give the user options on what to do.
- Use illustrations as a main part of the component
- Use elements so colorful they take away attention from the main task
</template>

</dialtone-usage>

### Writing and tone

We think this component is one of the most important regarding the [writing guidelines](/guides/writing-guidelines/index.md) (along with the error messages) so we take some time to write about how to communicate with our empty state.
First of all, let’s talk about the different atoms that can have a writing variable

- <b>Titles</b>: Needs to be scannable and informative, keep it short and concise.
- <b>Body</b>:  Avoid repeating the content of the title. Also, same as the title, keep it short and to the point.
If you need to provide a link to the user, you can use it here (e.g learn more) but please consider using the CTA section to be more concise to the user and more consistent to Dialtone.
- <b>CTA</b>:  We recommend the usage of imperative verbs (Create, Delete) instead of using more open words such as (OK, No, Yes). Also, try to connect the Title wording to the CTA, to keep the action clear to the user, we recommend avoiding using more than two words.

And regarding the difference of the types of variables of the component:

- <b>Zero state</b>: Like we said in the uses and best practices, we recommend combining the title and the CTA (if usable and possible) to teach the user how to populate this area. E.g
Title: You don’t have any AI recaps yet
Description: Use it to analyze your calls and get more insights about it!
CTA: [Activate]
- <b>No results</b>: In this scenario, we need to contemplate the variables of the user to understand how to react, this could be a expected scenario (searching for something you know you won’t find) or the surprised scenario (‘I was expecting to find something here, but there’s nothing’)
Title: No results found
Description: Try adjusting the your search or filters to find what you are looking for
CTA: [create] [clear filters]
- <b>New feature</b>: We want to communicate this variable to be as easy to understand as possible. Usually when we communicate with this variable, we are offering a new service (paid or not) that the user can take advantage of, so work on selling it in a more marketable way.
Title: Now you can analyze your metrics in live calls!
Description: Don’t need to end a call to have the best insights.
CTA: [Activate]
- <b>Not available</b>: The user doesn’t have permission to see the information for X or Y. Try to use this space to make it easier to request permission to access. Be clear and concise to communicate that they don’t have access, and don’t spend too much time telling them why, focus on asking for permission.
Title: You don’t have access to this information
Description: Ask your administrators permission
CTA: Request permission

## Variants and examples

There are some rules to follow when using empty state.

- Consumer should <b><u>always</u></b> provide either a <b>bodyText</b> prop or content in <b>body</b> slot.
- Console warning if both <b>bodyText</b> prop or <b>body</b> slot are not provided

There are multiple ways to use empty state as shown below:

### Base

<code-well-header>
  <dt-empty-state
    illustration-name="mind"
    header-text="Nothing to see here"
    body-text="Looks like there's no data to display here."
  >
    <template #body>
      <dt-stack direction="row" gap="300">
        <dt-button importance="clear">Click me</dt-button>
        <dt-button>Click me</dt-button>
      </dt-stack>
    </template>
  </dt-empty-state>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-0 d-empty-state d-empty-state--size-lg">
  <span class="d-empty-state__illustration">
    <svg>...</svg>
  </span>
  <div class="d-stack d-stack--gap-450 d-empty-state__content d-empty-state__content--lg">
    <div class="d-empty-state__header-text d-headline--xxl">Nothing to see here</div>
    <p class="d-empty-state__body-text d-body--md">Looks like theres no data to display here.</p>
  </div>
  <div class="d-stack d-stack--row d-stack--gap-300"><button class="d-btn">Click me</button> <button class="d-btn d-btn--primary">Click me</button></div>
</div>
'
vueCode='
<dt-empty-state
  illustration-name="mind"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="300">
      <dt-button importance="clear">Click me</dt-button>
      <dt-button>Click me</dt-button>
    </dt-stack>
  </template>
</dt-empty-state>
'
showHtmlWarning />

### With Header and Body text

<code-well-header>
<dt-empty-state
  illustration-name="mind"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
/>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-0 d-empty-state d-empty-state--size-lg">
  <span class="d-empty-state__illustration">
    <svg>...</svg>
  </span>
  <div class="d-stack d-stack--gap-450 d-empty-state__content d-empty-state__content--lg">
    <div class="d-empty-state__header-text d-headline--xxl">Nothing to see here</div>
    <p class="d-empty-state__body-text d-body--md">Looks like theres no data to display here.</p>
  </div>
</div>
'
vueCode='
<dt-empty-state
  illustration-name="mind"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
/>
'
showHtmlWarning />

### With Header and Body slot

<code-well-header>
  <dt-empty-state
    illustration-name="mind"
    header-text="Nothing to see here"
  >
    <template #body>
      <dt-stack direction="row" gap="300">
        <dt-button importance="clear">Click me</dt-button>
        <dt-button>Click me</dt-button>
      </dt-stack>
    </template>
  </dt-empty-state>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-0 d-empty-state d-empty-state--size-lg">
  <span class="d-empty-state__illustration">
    <svg>...</svg>
  </span>
  <div class="d-stack d-stack--gap-450 d-empty-state__content d-empty-state__content--lg">
    <div class="d-empty-state__header-text d-headline--xxl">Nothing to see here</div>
  </div>
  <div class="d-stack d-stack--row d-stack--gap-300"><button class="d-btn">Click me</button> <button class="d-btn d-btn--primary">Click me</button></div>
</div>
'
vueCode='
<dt-empty-state
  illustration-name="mind"
  header-text="Nothing to see here"
>
  <template #body>
    <dt-stack direction="row" gap="300">
      <dt-button importance="clear">Click me</dt-button>
      <dt-button>Click me</dt-button>
    </dt-stack>
  </template>
</dt-empty-state>
'
showHtmlWarning />

## Variable size

Remember the below rules when setting the size of the empty state component.

- Size only changes <b>headerText</b> and <b>bodyText</b> font size and width container.
- Illustration component has priority over icon in <b>lg</b> and <b>md</b> size.
- Illustration component will not be shown in <b>sm</b> size.
- Icon component will be shown in <b>lg</b> and <b>md</b> size only if illustrationName prop is not provided.
- Icon component will always be shown in <b>sm</b> size.

<br>
Below are some examples of how to render empty state at different sizes:

### Small size with icon

<code-well-header>
<dt-empty-state
  size="sm"
  icon-name="concierge-bell"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="300">
      <dt-button importance="clear">Click me</dt-button>
      <dt-button>Click me</dt-button>
    </dt-stack>
  </template>
</dt-empty-state>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-0 d-empty-state d-empty-state--size-sm">
  <span class="d-empty-state__icon">
    <svg>...</svg>
  </span>
  <div class="d-stack d-stack--gap-450 d-empty-state__content d-empty-state__content--sm">
    <div class="d-empty-state__header-text d-headline--md">Nothing to see here</div>
    <p class="d-empty-state__body-text d-body--sm">Looks like theres no data to display here.</p>
  </div>
  <div class="d-stack d-stack--row d-stack--gap-300"><button class="d-btn">Click me</button> <button class="d-btn d-btn--primary">Click me</button></div>
</div>
'
vueCode='
<dt-empty-state
  size="sm"
  icon-name="concierge-bell"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="300">
      <dt-button importance="clear">Click me</dt-button>
      <dt-button>Click me</dt-button>
    </dt-stack>
  </template>
</dt-empty-state>
'
showHtmlWarning />

### Medium size without illustration and icon

<code-well-header>
<dt-empty-state
  size="md"
  icon-name="concierge-bell"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="300">
      <dt-button importance="clear">Click me</dt-button>
      <dt-button>Click me</dt-button>
    </dt-stack>
  </template>
</dt-empty-state>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-0 d-empty-state d-empty-state--size-md">
  <span class="d-empty-state__icon">
    <svg>...</svg>
  </span>
  <div class="d-stack d-stack--gap-450 d-empty-state__content d-empty-state__content--md">
    <div class="d-empty-state__header-text d-headline--xl">Nothing to see here</div>
    <p class="d-empty-state__body-text d-body--sm">Looks like theres no data to display here.</p>
  </div>
  <div class="d-stack d-stack--row d-stack--gap-300"><button class="d-btn">Click me</button> <button class="d-btn d-btn--primary">Click me</button></div>
</div>
'
vueCode='
<dt-empty-state
  size="md"
  icon-name="concierge-bell"
  header-text="Nothing to see here"
  body-text="Looks like theres no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="300">
      <dt-button importance="clear">Click me</dt-button>
      <dt-button>Click me</dt-button>
    </dt-stack>
  </template>
</dt-empty-state>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="empty-state" />

## Classes

At a minimum, empty state requires a body of content. It can optionally contain a header with buttons, or a footer with buttons/text.

<component-class-table component-name="empty-state"></component-class-table>
