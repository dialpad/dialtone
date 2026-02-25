<template>
  <component
    :is="as"
    :class="unstyled ? 'd-item-layout--custom' : 'd-item-layout'"
    :style="unstyled && dynamicGridTemplateColumns()"
  >
    <section
      v-if="hasSlotContent($slots.start) || hasSlotContent($slots.left)"
      data-qa="dt-item-layout-left-wrapper"
      :class="[resolvedStartClass, 'd-item-layout__left']"
    >
      <!-- @slot Slot for start content -->
      <slot name="start">
        <!-- @slot @deprecated Use start -->
        <slot name="left" />
      </slot>
    </section>
    <section
      data-qa="dt-item-layout-content-wrapper"
      :class="[contentClass, 'd-item-layout__content']"
    >
      <div
        v-if="hasSlotContent($slots.default)"
        data-qa="dt-item-layout-title-wrapper"
        :class="[titleClass, 'd-item-layout__title']"
      >
        <!-- @slot Slot for main content -->
        <slot />
      </div>
      <div
        v-if="hasSlotContent($slots.subtitle)"
        data-qa="dt-item-layout-subtitle-wrapper"
        :class="[
          subtitleClass,
          'd-item-layout--subtitle',
          { 'd-item-layout--subtitle--with-title': hasSlotContent($slots.default) },
        ]"
      >
        <!-- @slot Slot for content below main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="hasSlotContent($slots.bottom)"
        data-qa="dt-item-layout-bottom-wrapper"
        :class="[bottomClass, 'd-item-layout__bottom']"
      >
        <!-- @slot Slot for content below subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="hasSlotContent($slots.end) || hasSlotContent($slots.right)"
      data-qa="dt-item-layout-right-wrapper"
      :class="[resolvedEndClass, 'd-item-layout__right']"
    >
      <!-- @slot Slot for end content -->
      <slot name="end">
        <!-- @slot @deprecated Use end -->
        <slot name="right" />
      </slot>
    </section>
    <section
      v-if="hasSlotContent($slots.selected)"
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
import { hasSlotContent } from '@/common/utils';

export default {
  compatConfig: { MODE: 3 },
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
     * Set the class for the start section.
     */
    startClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the start section.
     * @deprecated Use startClass
     */
    leftClass: {
      type: String,
      default: undefined,
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
     * Set the class for the end section.
     */
    endClass: {
      type: String,
      default: '',
    },

    /**
     * Set the class for the end section.
     * @deprecated Use endClass
     */
    rightClass: {
      type: String,
      default: undefined,
    },

    /**
     * Set the class for the selected section.
     */
    selectedClass: {
      type: String,
      default: '',
    },
  },

  computed: {
    resolvedStartClass () {
      return this.leftClass ?? this.startClass;
    },

    resolvedEndClass () {
      return this.rightClass ?? this.endClass;
    },
  },

  methods: {
    /**
     * Generate dynamic grid template columns
     */
    dynamicGridTemplateColumns () {
      const leftContentColumn = (this.$slots.start || this.$slots.left) ? 'auto' : '';
      const rightContentColumn = (this.$slots.end || this.$slots.right) ? 'auto' : '';
      const selectedContentColumn = this.$slots.selected ? 'auto' : '';

      return `
        grid-template-columns: ${leftContentColumn} 1fr ${rightContentColumn} ${selectedContentColumn};
      `;
    },

    hasSlotContent,
  },
};
</script>
