---
title: Lazy show
description: Lazy show is a utility component that prevents its children from being rendered until the first time it is shown.
status: ready
thumb: true
image: assets/images/components/lazy-show.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/utilities-lazy-show--default
---

<code-well-header>
  <dt-button @click="isShown = !isShown">
    Toggle
  </dt-button>
  <dt-lazy-show
    transition="fade"
    :show="isShown"
  >
    I'm Lazy!
  </dt-lazy-show>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="base-button__button d-btn d-btn--primary" type="button">
  <span class="d-btn__label base-button__label">
    Toggle
  </span>
</button>
<div>
  Im Lazy!
</div>
'
vueCode='
<dt-button @click="isShown = !isShown">
  Toggle
</dt-button>
<dt-lazy-show
  transition="fade"
  :show="isShown"
>
  Im Lazy!
</dt-lazy-show>
'
showHtmlWarning />

<script>
export default {
  data() {
    return {
      isShown: false,
    }
  },
}
</script>

## Vue API

<component-vue-api component-name="lazyshow" />
