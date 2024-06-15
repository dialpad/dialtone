<template>
  <dt-collapsible
    :anchor-text="title"
    anchor-class="d-bar-pill d-w100p d-truncate d-lh12 d-headline--sm d-fc-tertiary d-us-none"
  >
    <template #content>
      <slot name="items" />
    </template>
    <template #action>
      <slot name="action" />
    </template>
  </dt-collapsible>
</template>

<script setup>
import { DtCollapsible } from '@/components/collapsible';
import { defineProps } from 'vue';

defineProps({
  title: { type: String, required: true },
});
</script>
