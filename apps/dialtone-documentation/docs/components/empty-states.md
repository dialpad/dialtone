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
Empty state storybook
</code-well-header>

## Morphology & Anatomy

Image with bullets
<code-well-header>
<img class="d-w90p" alt="empty state bullets" src="/assets/images/components/empty-state01.png">
</code-well-header>

1. Illustrations*
2. Title
3. Description*
4. Actions

- Primary (this primary action, can be a primary button or a muted one)
- Secondary*

5.Background

The empty state uses all the space of the container it's replacing, always keeping the content in the middle.
_optionals

The space taken by the empty state can vary, the padding will be minimum 24px and can be flexible and adapt the container size.

## Uses & Best practices

We identify 4 types of empty states:

<b> Zero state: </b> nothing has been added yet, we recommend to use this space to teach the user how to fill this container, or give a useful tip like a shortcut for something relatable or tell them what needs to happen if no action can be taken.

<img class="d-w90p" alt="empty state example" src="/assets/images/components/empty-state02.png">

<b> No results:</b> the user performed an action and there are no results, in this scenario the best usage of the empty state will be to recommend how to recover. If the user is filtering a table, recommend another filter that has results or, like the zero state case, how to create a new entry with the properties the user is filtering.

<img class="d-w90p" alt="empty state example" src="/assets/images/components/empty-state03.png">

<b> New feature:</b> A new section or screen the user doesn’t know and we want to introduce to them, if this action would include a change in their plan we should inform it in the component, also try to indulge/seduce the user to use this feature or to look interesting to them.

<img class="d-w90p" alt="empty state example" src="/assets/images/components/empty-state04.png">

<b> Not enabled:</b> the section isn’t available to the user at the moment.

<img class="d-w90p" alt="empty state example" src="/assets/images/components/empty-state05.png">

<dialtone-usage>
<template #do>

- Give the user all the information necessary to know how to proceed, but not as much for them to feel overwhelmed.
- If you are gonna use an illustration or an icon, try to have it in a 2nd hierarchical level, to avoid distracting the user from the real task, we recommend to use desaturated color’s  illustrations and keep the text as a main thing the user should read.
- The background of the component should match the background of the environment
- The component can contain borders, depending on the context, see examples below.

</template>

<template #dont>

- Use the empty state as a dead end, always keep the user options on what to do.
- Use illustrations as a main part of the component
- Use elements too colorful to take away the attention from the main task
</template>

</dialtone-usage>

### Writing and tone

We think this component is one of the most important regarding the [writing guidelines](/guides/writing-guidelines/index.md) (along with the error messages) so we take some time to write about how to communicate with our empty states.
First of all, let’s talk about the different atoms that can have a writing variable

- Titles: Needs to be scannable and informative, keep it short and concise.
- Body:  Avoid repeating the content of the title. Also, same as the title, keep it short and to the point.
If you need to provide a link to the user, you can use it here (e.g learn more) but please consider using the CTA section to be more concise to the user and more consistent to Dialtone.
- CTA:  We recommend the usage of imperative verbs (Create, Delete) instead of using more open words such as (OK, No, Yes). Also, try to connect the Title wording to the CTA, to keep the action clear to the user, we recommend avoiding using more than two words.

And regarding the difference of the types of variables of the component:

- Zero state: Like we said in the uses and best practices, we recommend combining the title and the CTA (if usable and possible) to teach the user how to populate this area. E.g
Title: You don’t have any a.i recaps yet
Description: Use it to analyze your calls and get more insights about it!
CTA: [Activate]
- No results: In this scenario, we need to contemplate the variables of the user to understand how to react, this could be a expected scenario (searching for something you know you won’t find) or the surprised scenario (‘I was expecting to find something here, but there’s nothing’)
Title: No results found
Description: Try adjusting the your search or filters to find what you are looking for
CTA: [create] [clear filters]
- New feature: We want to communicate this variable to be as easy to understand as possible. Usually when we communicate with this variable, we are offering a new service (paid or not) that the user can take advantage of, so work on selling it in a more marketable way.
Title: Now you can analyze your metrics in live calls!
Description: Don’t need to end a call to have the best insights.
CTA: [Activate]
- Not available: The user doesn’t have permission to see the information for X or Y. Try to use this space to make it easier to request permission to access. Be clear and concise to communicate that they don’t have access, and don’t spend too much time telling them why, focus on asking for permission.
Title: You don’t have access to this information
Description: Ask your administrators permission
CTA: Request permission

## Variants and examples

### Base

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__header">
      <div>(header slot)</div>
    </div>
    <div class="d-card__content">
      <div>(content slot)</div>
    </div>
    <div class="d-card__footer">
      <div>(footer slot)</div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__header">
    <div>(header slot)</div>
  </div>
  <div class="d-card__content">
    <div>(content slot)</div>
  </div>
  <div class="d-card__footer">
    <div>(footer slot)</div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #header>
    (header slot)
  </template>
  <template #content>
    (content slot)
  </template>
  <template #footer>
    (footer slot)
  </template>
</dt-card>
'
showHtmlWarning />

### With Header

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__header">
      <div class="d-headline--md">
        Lorem ipsum
      </div>
      <button type="button" class="d-btn d-btn--xs d-btn--circle">
        <dt-icon name="more-vertical" size="200" />
      </button>
    </div>
    <div class="d-card__content">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__header">
    <div class="d-headline--md">
      Lorem ipsum
    </div>
    <button type="button" class="d-btn d-btn--xs d-btn--circle">
      <dt-icon name="more-vertical" size="200" />
    </button>
  </div>
  <div class="d-card__content">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #header>
    <p class="d-headline-medium">Lorem ipsum</p>
      <dt-button
        size="xs"
        importance="clear"
        aria-label="Menu button"
      >
        <template #icon>
          <dt-icon
            name="more-vertical"
            size="100"
          />
        </template>
      </dt-button>
  </template>
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
</dt-card>
'
showHtmlWarning />

### With Footer

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
    <div class="d-card__footer">
      <div class="d-d-flex d-gg8">
        <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
      </div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__content">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
  <div class="d-card__footer">
    <div class="d-d-flex d-gg8">
      <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
    </div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
  <template #footer>
    <dt-button
      importance="outlined"
      size="sm"
    >
      Button
    </dt-button>
  </template>
</dt-card>
'
showHtmlWarning />

### Content only

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__content">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
</dt-card>
'
showHtmlWarning />

### With Header, Footer and scrollable content

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__header">
      <div class="d-headline--md">
        Lorem ipsum
      </div>
      <button type="button" class="d-btn d-btn--xs d-btn--circle">
        <dt-icon name="more-vertical" size="200" />
      </button>
    </div>
    <div class="d-card__content d-h72">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
    <div class="d-card__footer">
      <div class="d-d-flex d-gg8">
        <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
      </div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__header">
    <div class="d-headline--md">
      Lorem ipsum
    </div>
    <button type="button" class="d-btn d-btn--xs d-btn--circle">
      <dt-icon name="more-vertical" size="200" />
    </button>
  </div>
  <div class="d-card__content d-h84">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
  <div class="d-card__footer">
    <div class="d-d-flex d-gg8">
      <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
    </div>
  </div>
</div>
'
vueCode='
<dt-card max-height="50px" class="d-w264">
  <template #header>
    <p class="d-headline-medium">Lorem ipsum</p>
      <dt-button
        size="xs"
        importance="clear"
        aria-label="Menu button"
      >
        <template #icon>
          <dt-icon
            name="more-vertical"
            size="100"
          />
        </template>
      </dt-button>
  </template>
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
  <template #footer>
    <dt-button
      importance="outlined"
      size="sm"
    >
      Button
    </dt-button>
  </template>
</dt-card>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="empty-state" />

## Classes

At minimum, empty state contains body of content. It could also have header with buttons, and footer with buttons/text.

<component-class-table component-name="empty-state"></component-class-table>
