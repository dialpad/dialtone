<template>
  <component
    :is="as"
    class="dt-item-layout"
  >
    <section
      v-if="$slots.left"
      data-qa="dt-item-layout-left-wrapper"
      class="dt-item-layout--left"
    >
      <!-- @slot Slot for left content -->
      <slot name="left" />
    </section>
    <section
      data-qa="dt-item-layout-content-wrapper"
      class="dt-item-layout--content"
    >
      <div
        v-if="$slots.default"
        data-qa="dt-item-layout-title-wrapper"
        class="dt-item-layout--title"
      >
        <!-- @slot Slot for main content -->
        <slot />
      </div>
      <div
        v-if="$slots.subtitle"
        data-qa="dt-item-layout-subtitle-wrapper"
        :class="['dt-item-layout--subtitle', { 'd-mtn2': $slots.default }]"
      >
        <!-- @slot Slot for content below main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="$slots.bottom"
        data-qa="dt-item-layout-bottom-wrapper"
        class="dt-item-layout--bottom"
      >
        <!-- @slot Slot for content below subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="$slots.right"
      data-qa="dt-item-layout-right-wrapper"
      class="dt-item-layout--right"
    >
      <!-- @slot Slot for right content -->
      <slot name="right" />
    </section>
    <section
      v-if="$slots.selected"
      data-qa="dt-item-layout-selected-wrapper"
      class="dt-item-layout--selected"
    >
      <!-- @slot Slot for selected icon -->
      <slot name="selected" />
    </section>
  </component>
</template>

/**
 * Custom layout to enable developer to use list-item like stack.
 * It is used as base for `dt-list-item` component
 * @see https://dialpad.design/components/item_layout.html
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
  },
};
</script>

<style lang="less" scoped>
// Move this to dialtone
.dt-item-layout {
  align-items: stretch;

  &--content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &--selected {
    display: flex;
    align-items: center;
  }
}
</style>
