<template>
  <div
    class="d-notice__content"
    data-qa="notice-content"
  >
    <p
      v-if="title || $slots.titleOverride"
      :id="titleId"
      class="d-notice__title"
      data-qa="notice-content-title"
    >
      <slot name="titleOverride">
        {{ title }}
      </slot>
    </p>
    <p
      :id="contentId"
      class="d-notice__message"
      data-qa="notice-content-message"
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
