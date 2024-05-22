<template>
  <component
    :is="illustration"
    v-if="illustration"
    :data-qa="$attrs['data-qa'] ?? 'dt-illustration'"
  />
</template>

<script setup>
import { computed } from 'vue';
import { illustrations } from '@dialpad/dialtone-icons/vue3';
import { ILLUSTRATION_NAMES } from './illustration_constants';

const props = defineProps({
  /**
     * The illustration name in kebab-case
     */
  name: {
    type: String,
    required: true,
    validator: (name) => ILLUSTRATION_NAMES.includes(name),
  },
});

const illustration = computed(() => illustrations[`./src/illustrations/${props.name}.vue`]);
</script>
