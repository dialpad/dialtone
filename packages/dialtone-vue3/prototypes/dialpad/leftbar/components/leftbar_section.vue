<template>
  <dt-collapsible
    class="leftbar-section"
    :open="isOpen"
  >
    <template #anchor="{ attrs }">
      <div class="leftbar-section-header__wrapper">
        <dt-button
          v-bind="attrs"
          class="d-bar-pill d-w100p d-lh12 d-headline--sm d-fc-tertiary d-us-none"
          label-class="d-jc-flex-start d-w100p"
          importance="clear"
          kind="muted"
          @click="defaultToggleOpen"
        >
          <dt-icon
            :name=" isOpen ? 'chevron-down' : 'chevron-right'"
            size="300"
          />
          <span class="d-truncate d-w128 d-ta-left">{{ title }}</span>
        </dt-button>
        <div class="leftbar-section-header__action">
          <slot name="action" />
        </div>
      </div>
    </template>
    <template #content>
      <slot name="items" />
    </template>
  </dt-collapsible>
</template>

<script setup>
import { DtCollapsible } from '@/components/collapsible';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { defineProps, ref } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  open: { type: Boolean, default: false },
});

const isOpen = ref(props.open);

const defaultToggleOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style lang="less" scoped>
.leftbar-section-header {
  &__wrapper {
    position: relative;
  }

  &__action {
    position: absolute;
    right: var(--dt-size-300);
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
