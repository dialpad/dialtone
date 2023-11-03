<template>
  <template v-for="svg in svgs" :key="svg">
    <component :is="svg" v-if="svg" />
  </template>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

// render an svg by name
const props = defineProps({
  /**
   * Filename of the svg, without extension.
   */
  name: {
    type: String,
    required: true,
  },
});

const svgs = [
  defineAsyncComponent({
    loader: () => import(`../public/assets/images/${props.name}.svg?component`),
    onError: () => {},
  }),
  defineAsyncComponent({
    loader: () => import(`../public/assets/images/components/${props.name}.svg?component`),
    onError: () => {},
  }),
  defineAsyncComponent({
    loader: () => import(`../public/assets/images/favicons/${props.name}.svg?component`),
    onError: () => {},
  }),
];
</script>
