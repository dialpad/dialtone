<template>
  <div
    class="d-notice__content d-fw-wrap"
  >
    <h1
      v-if="title || this.$slots.titleOverride"
      :id="titleId"
      class="d-notice__title"
    >
      <slot name="titleOverride">
        {{ title }}
      </slot>
    </h1>
    <p
      :id="contentId"
      class="d-notice__message"
    >
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  name: 'DtNoticeContent',

  props: {
    title: {
      type: String,
      default: '',
    },
    titleId: {
      type: String,
      default: undefined,
    },
    contentId: {
      type: String,
      default: undefined,
    },
  },
};
</script>
