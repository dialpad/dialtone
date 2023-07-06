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
    <!-- @slot Slot for selected icon -->
    <slot name="selected" />
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

<style lang="less">
.dt-item-layout {
  min-height: calc(var(--size-550) + var(--size-300));
  padding: var(--space-300) var(--space-400);
  font-size: var(--fs-200);
  line-height: var(--lh-300);

  &--content {
    flex-grow: 1;
  }

  &--subtitle {
    color: var(--fc-tertiary);
    font-size: var(--fs-100);
  }

  &,
  &--right,
  &--left {
    display: flex;
    align-items: center;
    min-width: var(--size-600);
  }

  &--right {
    padding-left: var(--space-400);
  }

  &--left {
    justify-content: flex-end;
    padding-right: var(--space-400);
  }

  &--bottom {
    margin-top: var(--space-200);
  }
}
</style>
