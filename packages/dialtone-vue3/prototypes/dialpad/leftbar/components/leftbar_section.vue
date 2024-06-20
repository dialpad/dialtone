<template>
  <dt-collapsible
    class="leftbar-section"
    :open="isOpen"
  >
    <template #anchor="{ attrs }">
      <div class="d-ps-relative">
        <dt-button
          v-bind="attrs"
          class="d-bar-pill d-py4 d-w100p d-baw0"
          label-class="d-jc-flex-start d-w100p"
          importance="clear"
          kind="muted"
          @click="defaultToggleOpen"
        >
          <template #icon="{ iconSize }">
            <div class="d-w24 d-d-inline-flex d-ai-center">
              <dt-icon
                :name=" isOpen ? 'chevron-down' : 'chevron-right'"
                :size="iconSize"
              />
            </div>
          </template>
          <span class="d-truncate d-lh12 d-headline--sm d-fc-tertiary d-us-none d-wmx128 d-ta-left">{{ title }}</span>
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
import { ref } from 'vue';

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
.leftbar-section-header__action {
    position: absolute;
    right: var(--dt-size-300);
    top: 50%;
    transform: translateY(-50%);
}
</style>
