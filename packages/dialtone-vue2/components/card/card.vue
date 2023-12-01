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
      <!-- @slot slot for header content -->
      <slot name="header" />
    </div>

    <div
      :class="[
        'd-card__content',
        contentClass,
      ]"
      :style="{ 'max-height': maxHeight }"
    >
      <!-- @slot slot for main content -->
      <slot name="content" />
    </div>

    <div
      v-if="$slots.footer"
      :class="[
        'd-card__footer',
        footerClass,
      ]"
    >
      <!-- @slot slot for footer content -->
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
/**
 * A card contains summary content and actions about a single subject.
 * It can be used by itself or within a list, and is generally interactive.
 * @see https://dialpad.design/components/card.html
 */
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
