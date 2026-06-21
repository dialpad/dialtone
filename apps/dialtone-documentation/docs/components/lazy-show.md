---
title: Lazy Show
description: Defers rendering child content until it is first shown.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/utilities-lazy-show--default
keywords: ["lazy load","conditional render","d-lazy-show","DtLazyShow","dt-lazy-show"]
combinator: DtLazyShow
---

`DtLazyShow` is essentially a combination of a `v-if` and `v-show`. This means that the child slot will not be rendered/initialized until the first time `show` is `true`, after which the slot will stay in the DOM and be hidden/shown with the `v-show` directive. This is useful to prevent elements which are hidden from being rendered immediately, but keeping them alive when toggled later.

The lazy show wraps the slot in a parent `div` in order to achieve this. It also wraps the `v-show` in a `transition`, so you can pass any valid Vue transition class to control the enter/leave transitions.

```vue demo
<dt-button @click="isShown = !isShown">
  Toggle
</dt-button>
<dt-lazy-show
  transition="fade"
  :show="isShown"
>
  I'm Lazy!
</dt-lazy-show>
```

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
