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
      <template #subtitle>
        {subtitle}
      </template>
      <template #bottom>
        {bottom}
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
    <template #subtitle>
      {subtitle}
    </template>
    <template #bottom>
      {bottom}
    </template>
    <template #right>
      <dt-icon name="external-link" />
    </template>
  </dt-list-item>
</ul>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="listitem" />
