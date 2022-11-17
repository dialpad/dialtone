<template>
  <div class="dt-default-list-item d-fs-200 d-lh4 d-py4 d-px12 d-d-flex d-ai-center">
    <section
      v-if="$slots.left"
      class="dt-default-list-item--left d-d-inline-flex d-as-flex-start d-d-flex d-ai-center d-pr8"
      data-qa="dt-default-list-item-left-wrapper"
    >
      <!-- @slot Slot for the left content -->
      <slot name="left" />
    </section>
    <section class="d-fl-grow1 d-of-hidden">
      <div v-if="$slots.default">
        <!-- @slot Slot for the main content -->
        <slot />
      </div>
      <div
        v-if="$slots.subtitle"
        data-qa="dt-default-list-item-subtitle-wrapper"
        :class="['d-fs-100 d-fc-black-600', { 'd-mtn2': $slots.default }]"
      >
        <!-- @slot Slot for the content below the main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="$slots.bottom"
        data-qa="dt-default-list-item-bottom-wrapper"
        class="d-mt2"
      >
        <!-- @slot Slot for the content below the subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="$slots.right"
      class="dt-default-list-item--right d-d-inline-flex d-as-flex-start d-d-flex d-ai-center d-pl8"
      data-qa="dt-default-list-item-right-wrapper"
    >
      <!-- @slot Slot for the right content -->
      <slot name="right" />
    </section>
  </div>
</template>

<script>
export default {
  name: 'DefaultListItem',
};
</script>

<style lang="less">
.dt-default-list-item {
  &,
  &--left,
  &--right {
    min-height: 28px;
  }
}
</style>
