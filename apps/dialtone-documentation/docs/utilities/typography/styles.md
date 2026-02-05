---
title: Text Styles
---

<dt-notice
  kind="warning"
  :hideClose="true"
  class="d-wmx100p d-my24"
>
  <template #default>
    You probably want to use the <router-link class="d-fw-semibold d-link d-link--muted" to="/components/text">
      DtText
    </router-link> component instead of typography styles, which have been moved to <router-link class="d-fw-semibold d-link d-link--muted" to="/design/typography/">Design Language > Typography</router-link>
  </template>
</dt-notice>

Typography styles combine multiple typography properties – e.g. `font-family`, `font-size`, `line-height`,`font-weight` into a single class rather than combine multiple CSS Utilities.

For example, instead of `class="d-fs-200 d-lh-100"` you would apply `class="d-text-body--md"`.
