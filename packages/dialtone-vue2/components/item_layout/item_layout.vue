<template>
  <component
    :is="as"
    :class="unstyled ? 'd-item-layout--custom' : 'd-item-layout'"
  >
    <section
      v-if="$slots.left"
      data-qa="d-item-layout-left-wrapper"
      class="d-item-layout--left"
    >
      <!-- @slot Slot for left content -->
      <slot name="left" />
    </section>
    <section
      data-qa="d-item-layout-content-wrapper"
      class="d-item-layout--content"
    >
      <div
        v-if="$slots.default"
        data-qa="d-item-layout-title-wrapper"
        class="d-item-layout--title"
      >
        <!-- @slot Slot for main content -->
        <slot />
      </div>
      <div
        v-if="$slots.subtitle"
        data-qa="d-item-layout-subtitle-wrapper"
        :class="['d-item-layout--subtitle', { 'd-item-layout--subtitle--with-title': $slots.default }]"
      >
        <!-- @slot Slot for content below main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="$slots.bottom"
        data-qa="d-item-layout-bottom-wrapper"
        class="d-item-layout--bottom"
      >
        <!-- @slot Slot for content below subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="$slots.right"
      data-qa="d-item-layout-right-wrapper"
      class="d-item-layout--right"
    >
      <!-- @slot Slot for right content -->
      <slot name="right" />
    </section>
    <section
      v-if="$slots.selected"
      data-qa="d-item-layout-selected-wrapper"
      class="d-item-layout--selected"
    >
      <!-- @slot Slot for selected icon -->
      <slot name="selected" />
    </section>
  </component>
</template>

/**
 * Custom layout to enable developer to use list-item like stack.
 * It is used as base for `dt-list-item` component
 * @see https://dialtone.dialpad.com/components/item_layout.html
 */
<script>
export default {
  name: 'DtItemLayout',
  props: {
    /**
     * Set this prop to render layout as a specific HTML element.
     */
    as: {
      type: String,
      default: 'div',
    },

    /**
     * Set this prop to remove the default styling.
     * @values true, false
     */
    unstyled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
