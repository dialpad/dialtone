<template>
  <template v-for="svg in svgs" :key="svg">
    <component :is="svg" v-if="svg" :class="class" />
  </template>
</template>

<script setup>
import { defineAsyncComponent, defineProps } from 'vue';

// render an svg by name
const props = defineProps({
  /**
   * Filename of the svg, without extension.
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * Class attribute to be added to the component.
   */
  class: {
    type: String,
    default: '',
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
  defineAsyncComponent({
    loader: () => import(`../../../node_modules/@dialpad/dialtone-css/lib/dist/svg/spot/${props.name}.svg?component`),
    onError: () => {},
  }),
];
</script>
