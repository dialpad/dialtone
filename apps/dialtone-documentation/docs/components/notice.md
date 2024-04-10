---
title: Notice
description: A notice is an informational and assistive message that appears inline with content.
status: ready
thumb: true
image: assets/images/components/notice.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-notice--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8921%3A23341&viewport=145%2C-209%2C0.31&t=xHutRjwo1o5zMTgT-11
---

<code-well-header bgclass="d-bgc-primary">
  <example-notice kind="base" title="Base title (optional)" />
</code-well-header>

<!-- <component-combinator component-name="DtNotice" /> -->

## Usage

A notice delivers informational and assistive messages that inform the user about product or account statuses and related actions. It can suggest an action or dismissed by the user, though neither are required. For time-based notifications, see [Toast](toast.md).

## Variants and examples

### Base Styles

Used in most scenarios when the message should be noticeable but not dominate.

<code-well-header bgclass="d-bgc-primary">
  <example-notice kind="base" title="Base title (optional)" />
  <example-notice kind="error" title="Error title (optional)" />
  <example-notice kind="info" title="Info title (optional)" />
  <example-notice kind="success" title="Success title (optional)" />
  <example-notice kind="warning" title="Warning title (optional)" />
</code-well-header>

<code-example-tabs
htmlCode='
<aside class="d-notice d-notice--base">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Base title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
      <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--info">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Info title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
      <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--error">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Error title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
      <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--success">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Success title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
      <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--warning">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Warning title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
      <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-notice
  title="Base title (optional)"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Info title (optional)"
  kind="info"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Error title (optional)"
  kind="error"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Success title (optional)"
  kind="success"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Warning title (optional)"
  kind="warning"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
'
showHtmlWarning />

### Important

Used occasionally in scenarios when the message needs to dominate.

<code-well-header>
  <example-notice important kind="base" title="Base title (optional)" />
  <example-notice important kind="error" title="Error title (optional)" />
  <example-notice important kind="info" title="Info title (optional)" />
  <example-notice important kind="success" title="Success title (optional)" />
  <example-notice important kind="warning" title="Warning title (optional)" />
</code-well-header>

<code-example-tabs
htmlCode='
<aside class="d-notice d-notice--base d-notice--important">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Base title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
        <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--info d-notice--important">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Info title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
        <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--error d-notice--important">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Error title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
        <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--success d-notice--important">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Success title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
        <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
<aside class="d-notice d-notice--warning d-notice--important">
  <div aria-hidden="true" class="d-notice__icon">
    <span class="d-icon__wrapper">
      <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-400" style="display: none;">
        <div
          class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
          style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
        ></div>
      </div>
      <svg>...</svg>
    </span>
  </div>
  <div class="d-notice__content" role="status">
    <p class="d-notice__title">Warning title (optional)</p>
    <p class="d-notice__message">
      <span> Message body with <a href="#" class="d-link d-link--muted">a link</a>. </span>
    </p>
  </div>
  <div class="d-notice__actions">
    <button type="button" class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--sm">
        <span class="d-btn__label base-button__label"> Action </span>
    </button>
    <button type="button" aria-label="Close" class="base-button__button d-btn d-btn--sm d-btn--circle d-btn--icon-only">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-200" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-notice
  title="Base title (optional)"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Info title (optional)"
  kind="info"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Error title (optional)"
  kind="error"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Success title (optional)"
  kind="success"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Warning title (optional)"
  kind="warning"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      :kind="buttonKind"
      @click="$attrs.onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
'
showHtmlWarning />
## Vue API

<component-vue-api component-name="notice" />

## Classes

<component-class-table component-name="notice" />

## Accessibility

<component-accessible-table component-name="notice" />

<script setup>
  import ExampleNotice from '@exampleComponents/ExampleNotice.vue';
</script>
