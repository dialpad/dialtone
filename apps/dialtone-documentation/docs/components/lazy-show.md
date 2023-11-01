---
title: Lazy show
description: Lazy show is a utility component that prevents its children from being rendered until the first time it is shown.
status: ready
thumb: true
image: assets/images/components/lazy-show.png
storybook: https://vue.dialpad.design/?path=/story/utilities-lazy-show--default
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
