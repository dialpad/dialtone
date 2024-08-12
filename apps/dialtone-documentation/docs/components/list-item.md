---
title: List item
description: A list item is an element that can be used to represent individual items in a list.
status: ready
thumb: true
image: assets/images/components/list-item.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-list-item--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10732%3A69390
---

<code-well-header class="d-d-block">
  <ul>
    <dt-list-item navigationType="tab">
      <template #left>
        <dt-icon name="check" />
      </template>
      <span>Default List Item</span>
      <template #subtitle>
        Description
      </template>
      <template #bottom>
        <dt-badge text="Label" />
      </template>
      <template #right>
        <dt-icon name="external-link" />
      </template>
    </dt-list-item>
  </ul>
</code-well-header>

## Base style

A list item provides accessibility controls and common functionality. The component uses child components that provide styling and slots for different types of list items. If you want to create a custom list item you can pass a type "custom", which will let you define the structure of the content.

The default list item has 5 slots that can be used for the most common use cases, **left**, **right**, **default**, **subtitle** and **bottom** slot. All of the slots are optional.

The **left** slot can contain content, such as an avatar, that will be positioned to the left of the main content.

The **right** slot works the same way, but its contents are placed to the right of the main slot.

The **default** slot contains the main content of the list item.

The **subtitle** slot can be used to display content below the default slot. The slot has smaller text size and lighter color than default slot.

The **bottom** slot can be used to display content below the subtitle slot.

<code-well-header class="d-d-block">
  <ul>
    <dt-list-item navigationType="tab">
      <template #left>
        <dt-icon name="check" />
      </template>
      <span>Default List Item</span>
      <template #subtitle>
        Description
      </template>
      <template #bottom>
        <dt-badge text="Label" />
      </template>
      <template #right>
        <dt-icon name="external-link" />
      </template>
    </dt-list-item>
  </ul>
</code-well-header>

<code-example-tabs
htmlCode='
<ul>
  <li id="dt4" class="dt-list-item dt-list-item--focusable" tabindex="0" role="listitem">
    <div class="dt-item-layout">
      <section class="dt-item-layout--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-500" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </section>
      <section class="dt-item-layout--content">
        <div class="dt-item-layout--subtitle">
          {subtitle}
        </div>
        <div class="dt-item-layout--bottom">
          {bottom}
        </div>
      </section>
      <section class="dt-item-layout--right">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-500" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </section>
    </div>
  </li>
</ul>
'
vueCode='
<ul>
  <dt-list-item navigationType="tab">
    <template #left>
      <dt-icon name="check" />
    </template>
    <span>Default List Item</span>
    <template #subtitle>
      Description
    </template>
    <template #bottom>
      <dt-badge text="Label" />
    </template>
    <template #right>
      <dt-icon name="external-link" />
    </template>
  </dt-list-item>
</ul>
'
/>

## Variants

### Custom list item

When `type` is set to "custom" the list item will not render any styles or slots. This type can be used when the list item has to support content that does not work with the default structure.

<code-well-header class="d-d-block">
  <ul ref="customListItem">
    <dt-list-item
      navigation-type="tab"
      type="custom"
    >
      <div class="d-py8 d-px12 d-d-flex d-ai-center d-jc-space-between">
        <div>
          <time
            class="d-fs-100 d-pr12"
            datetime="10:00"
          >
            10:00
          </time>
          <span class="d-fs-200">
            Custom List Item Example
          </span>
        </div>
        <div class="d-p6 d-tn8 d-r12 d-d-flex d-bgc-white d-bar4 d-bs-md">
          <dt-button
            class="d-p4 d-py8"
            importance="clear"
            title="share"
          >
            <template #icon>
              <dt-icon
                name="share-2"
                size="200"
              />
            </template>
          </dt-button>
          <dt-button
            class="d-p4 d-py8 d-ml4"
            importance="clear"
            title="star"
          >
            <template #icon>
              <dt-icon
                name="star"
                size="200"
              />
            </template>
          </dt-button>
          <dt-button
            class="d-p4 d-py8 d-ml4"
            importance="clear"
            title="more"
          >
            <template #icon>
              <dt-icon
                name="more-vertical"
                size="200"
              />
            </template>
          </dt-button>
        </div>
      </div>
    </dt-list-item>
  </ul>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.customListItem'
vueCode='
<ul>
  <dt-list-item
    navigation-type="tab"
    type="custom"
  >
    <div class="d-py8 d-px12 d-d-flex d-ai-center d-jc-space-between">
      <div>
        <time
          class="d-fs-100 d-pr12"
          datetime="10:00"
        >
          10:00
        </time>
        <span class="d-fs-200">
          Custom List Item Example
        </span>
      </div>
      <div class="d-p6 d-tn8 d-r12 d-d-flex d-bgc-white d-bar4 d-bs-md">
        <dt-button
          class="d-p4 d-py8"
          importance="clear"
          title="share"
        >
          <template #icon>
            <dt-icon
              name="share-2"
              size="200"
            />
          </template>
        </dt-button>
        <dt-button
          class="d-p4 d-py8 d-ml4"
          importance="clear"
          title="star"
        >
          <template #icon>
            <dt-icon
              name="star"
              size="200"
            />
          </template>
        </dt-button>
        <dt-button
          class="d-p4 d-py8 d-ml4"
          importance="clear"
          title="more"
        >
          <template #icon>
            <dt-icon
              name="more-vertical"
              size="200"
            />
          </template>
        </dt-button>
      </div>
      </div>
  </dt-list-item>
</ul>
'
/>

## Vue API

<component-vue-api component-name="listitem" />
