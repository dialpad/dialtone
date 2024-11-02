<template>
  <div class="dtc-theme__canvas d-d-flex d-ai-stretch d-pl12">
    <h1 class="d-headline32 d-as-center">
      {{ component.name }}
    </h1>
    <div class="d-fl-grow1 d-ml12 d-bl">
      <div class="d-d-flex d-ai-center dtc-header__variant d-h100p">
        <div class="d-pl6 d-pt2 d-fl-grow1">
          <dt-select-menu
            class="d-ba-none"
            select-class="dtc-header__select"
            label="Select target component variant"
            label-class="d-vi-visible-sr"
            name="select-menu"
            :value="selectedVariant"
            :options="variantOptions"
            size="xl"
            @input="e => emit('update:variant', e)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DtSelectMenu } from '@dialpad/dialtone-vue';
import { computed } from 'vue';
import { capitalCase } from 'change-case';

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
  selectedVariant: {
    type: String,
    required: true,
  },
  variants: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:variant']);

const variantOptions = computed(() => {
  const variants = {
    default: {},
    ...props.variants,
  };
  return Object.keys(variants).map(variant => {
    return { value: variant, label: capitalCase(variant) };
  });
});

</script>

<script>
export default {
  name: 'DtcHeader',
};
</script>

<style lang="less">
  .dtc-header__select > select {
    color: var(--dtc-theme-color-foreground) !important;
    background-color: transparent !important;
  }

  .dtc-header__select > select:focus {
    outline: initial !important;
    box-shadow: initial !important;
  }

  .dtc-header__select::before, .dtc-header__select::after {
    border-color: var(--dtc-theme-color-foreground) transparent !important;
  }

  .dtc-header__variant {
    background-color: var(--dtc-theme-color-background-darken);
  }
</style>
