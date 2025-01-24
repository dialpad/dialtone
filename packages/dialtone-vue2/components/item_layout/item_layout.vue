<template>
  <component
    :is="as"
    :class="unstyled ? 'd-item-layout--custom' : 'd-item-layout'"
    :style="unstyled && dynamicGridTemplateColumns()"
  >
    <section
      v-if="$slots.left"
      data-qa="dt-item-layout-left-wrapper"
      :class="[leftClass, 'd-item-layout__left']"
    >
      <!-- @slot Slot for left content -->
      <slot name="left" />
    </section>
    <section
      data-qa="dt-item-layout-content-wrapper"
      :class="[contentClass, 'd-item-layout__content']"
    >
      <div
        v-if="$slots.default"
        data-qa="dt-item-layout-title-wrapper"
        :class="[titleClass, 'd-item-layout__title']"
      >
        <!-- @slot Slot for main content -->
        <slot />
      </div>
      <div
        v-if="$slots.subtitle"
        data-qa="dt-item-layout-subtitle-wrapper"
        :class="[subtitleClass, 'd-item-layout__subtitle', { 'd-item-layout__subtitle-with-title': $slots.default }]"
      >
        <!-- @slot Slot for content below main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="$slots.bottom"
        data-qa="dt-item-layout-bottom-wrapper"
        :class="[bottomClass, 'd-item-layout__bottom']"
      >
        <!-- @slot Slot for content below subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="$slots.right"
      data-qa="dt-item-layout-right-wrapper"
      :class="[rightClass, 'd-item-layout__right']"
    >
      <!-- @slot Slot for right content -->
      <slot name="right" />
    </section>
    <section
      v-if="$slots.selected"
      data-qa="dt-item-layout-selected-wrapper"
      :class="[selectedClass, 'd-item-layout__selected']"
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

    /**
     * Set the class for the left section.
     */
    leftClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the content section.
     */
    contentClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the title section.
     */
    titleClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the subtitle section.
     */
    subtitleClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the bottom section.
     */
    bottomClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the right section.
     */
    rightClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the selected section.
     */
    selectedClass: {
      type: String,
      default: '',
    },
  },

  methods: {
    /**
     * Generate dynamic grid template columns
     */
    dynamicGridTemplateColumns () {
      const leftContentColumn = this.$slots.left ? 'auto' : '';
      const rightContentColumn = this.$slots.right ? 'auto' : '';
      const selectedContentColumn = this.$slots.selected ? 'auto' : '';

      return `
        grid-template-columns: ${leftContentColumn} 1fr ${rightContentColumn} ${selectedContentColumn};
      `;
    },
  },
};
</script>
