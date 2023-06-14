<template>
  <div class="dt-default-list-item">
    <section
      v-if="hasSlotContent($slots.left)"
      data-qa="dt-default-list-item-left-wrapper"
      class="dt-default-list-item--left"
    >
      <!-- @slot Slot for the left content -->
      <slot name="left" />
    </section>
    <section
      data-qa="dt-default-list-item-content-wrapper"
      class="dt-default-list-item--content"
    >
      <div
        v-if="hasSlotContent($slots.default)"
        data-qa="dt-default-list-item-title-wrapper"
        class="dt-default-list-item--title"
      >
        <!-- @slot Slot for the main content -->
        <slot />
      </div>
      <div
        v-if="hasSlotContent($slots.subtitle)"
        data-qa="dt-default-list-item-subtitle-wrapper"
        :class="['dt-default-list-item--subtitle', { 'd-mtn2': $slots.default }]"
      >
        <!-- @slot Slot for the content below the main content -->
        <slot name="subtitle" />
      </div>
      <div
        v-if="hasSlotContent($slots.bottom)"
        data-qa="dt-default-list-item-bottom-wrapper"
        class="dt-default-list-item--bottom"
      >
        <!-- @slot Slot for the content below the subtitle -->
        <slot name="bottom" />
      </div>
    </section>
    <section
      v-if="hasSlotContent($slots.right)"
      data-qa="dt-default-list-item-right-wrapper"
      class="dt-default-list-item--right"
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
  min-height: 28px;
  font-size: var(--fs-200);
  line-height: var(--lh-300);
  padding: var(--space-300) var(--space-400);

  &--content {
    flex-grow: 1;
  }

  &--subtitle {
    font-size: var(--fs-100);
    color: var(--fc-tertiary);
  }

  &,
  &--right,
  &--left {
    display: flex;
    align-items: center;
    min-width: 32px;
  }

  &--right {
    padding-left: var(--space-400);
    align-self: flex-start;
  }

  &--left {
    padding-right: var(--space-400);
    justify-content: flex-end;
    align-self: flex-start;
  }

  &--bottom {
    margin-top: var(--space-200);
  }
}
</style>
