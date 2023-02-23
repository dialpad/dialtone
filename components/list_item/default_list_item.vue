<template>
  <div class="dt-default-list-item d-fs-200 d-lh-300 d-py4 d-px8 d-d-flex d-ai-center">
    <section
      v-if="hasSlotContent($slots.left)"
      class="dt-default-list-item--left d-d-inline-flex d-as-flex-start d-d-flex d-ai-center d-pr8"
      data-qa="dt-default-list-item-left-wrapper"
    >
      <!-- @slot Slot for the left content -->
      <slot name="left" />
    </section>
    <section class="d-fl-grow1 d-of-hidden">
      <div v-if="hasSlotContent($slots.default)">
        <!-- @slot Slot for the main content -->
        <slot />
      </div>
      <div
        v-if="hasSlotContent($slots.subtitle)"
        data-qa="dt-default-list-item-subtitle-wrapper"
        :class="['d-fs-100 d-fc-black-600', { 'd-mtn2': $slots.default }]"
      >
        <!-- @slot Slot for the content below the main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="hasSlotContent($slots.bottom)"
        data-qa="dt-default-list-item-bottom-wrapper"
        class="d-mt2"
      >
        <!-- @slot Slot for the content below the subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="hasSlotContent($slots.right)"
      class="dt-default-list-item--right d-d-inline-flex d-as-flex-start d-d-flex d-ai-center d-pl8"
      data-qa="dt-default-list-item-right-wrapper"
    >
      <!-- @slot Slot for the right content -->
      <slot name="right" />
    </section>
    <slot name="selected" />
  </div>
</template>

<script>
import { hasSlotContent } from '@/common/utils';

export default {
  name: 'DtDefaultListItem',

  data () {
    return {
      hasSlotContent,
    };
  },
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
