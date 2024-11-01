<template>
  <span :class="`dtc-scheme__${displayClass}`">
    {{ displayValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    required: true,
  },
});

const displayValue = computed(() => {
  return props.value === null
    ? 'null'
    : props.value;
});

const displayClass = computed(() => {
  return props.value === null
    ? 'identifier'
    : 'value';
});
</script>

<script>
export default {
  name: 'DtcEventConsoleValue',
};
</script>
