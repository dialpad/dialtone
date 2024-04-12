---
title: Pagination
description: Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
status: ready
thumb: true
image: assets/images/components/pagination.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-pagination--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10984%3A76640
---

<code-well-header>
  <dt-pagination
    :total-pages="25"
    aria-label="Pagination"
    prev-aria-label="Previous page"
    next-aria-label="Next page"
    :page-number-aria-label="() => {}"
  />
</code-well-header>

<code-example-tabs
htmlCode='
<nav aria-label="Pagination" class="d-pagination">
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-pagination__button d-fc-black-300 d-bgc-transparent" type="button" disabled="" aria-label="Previous page">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <span class="d-icon__wrapper">
        <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
          <div
            class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
            style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
          ></div>
        </div>
        <svg>...</svg>
      </span>
    </span>
  </button>
  <div class="">
    <button class="base-button__button d-btn d-btn--primary" type="button">
        <span class="d-btn__label base-button__label">1</span>
    </button>
  </div>
  <div class="">
    <button class="base-button__button d-btn d-btn--muted" type="button">
        <span class="d-btn__label base-button__label">2</span>
    </button>
  </div>
  <div class="">
    <button class="base-button__button d-btn d-btn--muted" type="button">
        <span class="d-btn__label base-button__label">3</span>
    </button>
  </div>
  <div class="">
    <button class="base-button__button d-btn d-btn--muted" type="button">
        <span class="d-btn__label base-button__label">4</span>
    </button>
  </div>
  <div class="d-pagination__separator">
    <div class="d-pagination__separator-icon" >
      <span class="d-icon__wrapper">
        <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
          <div
            class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
            style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
          ></div>
        </div>
        <svg>...</svg>
      </span>
    </div>
  </div>
  <div class="">
    <button class="base-button__button d-btn d-btn--muted" type="button">
        <span class="d-btn__label base-button__label">25</span>
    </button>
  </div>
  <button class="base-button__button d-btn d-btn--muted d-btn--icon-only d-pagination__button d-fc-tertiary" type="button" aria-label="Next page">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <span class="d-icon__wrapper">
        <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
          <div
            class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
            style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
          ></div>
        </div>
        <svg>...</svg>
      </span>
    </span>
  </button>
</nav>
'
vueCode='
<dt-pagination
  :total-pages="25"
  aria-label="Pagination"
  prev-aria-label="Previous page"
  next-aria-label="Next page"
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="pagination" />
