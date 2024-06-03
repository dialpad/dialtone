<template>
  <template v-if="illustration">
    <template v-for="i in illustrationSVGs" :key="i">
      <component :is="i" v-if="i" :class="class" />
    </template>
  </template>
  <template v-else>
    <template v-for="svg in svgs" :key="svg">
      <component :is="svg" v-if="svg" :class="class" />
    </template>
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
  /**
   * Class attribute to be added to the component.
   */
  class: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * Whether the svg is an illustration.
   */
  illustration: {
    type: Boolean,
    default: false,
  },
});

const illustrationSVGs = [
  defineAsyncComponent({
    loader: () => import(`../../../node_modules/@dialpad/dialtone-icons/dist/svg/illustrations/${props.name}.svg`),
    onError: () => {},
  }),
];

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
