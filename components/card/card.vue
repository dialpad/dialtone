<template>
  <div
    :class="[
      'd-card',
      containerClass,
    ]"
    data-qa="dt-card"
  >
    <div
      v-if="$slots.header"
      :class="[
        'd-card__header',
        headerClass,
      ]"
    >
      <slot name="header" />
    </div>

    <div
      :class="[
        'd-card__content',
        contentClass,
      ]"
      :style="{ 'max-height': maxHeight }"
    >
      <slot name="content" />
    </div>

    <div
      v-if="$slots.footer"
      :class="[
        'd-card__footer',
        footerClass,
      ]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DtCard',
  props: {
    /**
     * The maximum height of the card content.
     * If given, makes content area scrollable.
     */
    maxHeight: {
      type: String,
      default: null,
    },

    /**
     * class for card container.
     */
    containerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * class for card content.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * class for card header.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * class for card footer.
     */
    footerClass: {
      type: [String, Array, Object],
      default: '',
    },
  },
};
</script>
