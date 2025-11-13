<template>
  <template v-if="illustration">
    <template v-for="i in illustrationSVGs" :key="i">
      <component
        :is="i"
        v-if="i"
        v-bind="$attrs"
        :ref="el => setIllustrationRef(el)"
      />
    </template>
  </template>
  <template v-else>
    <template v-for="(svg, index) in svgs" :key="svg">
      <component
        :is="svg"
        v-if="svg"
        v-bind="$attrs"
        :ref="el => setSvgRef(el, index)"
      />
    </template>
  </template>
</template>

<script setup>
// TODO: Move all the svg files that are being used here from the "public" directory to another directory outside "public" to remove the vuepress warnings
import { defineAsyncComponent } from 'vue';

defineOptions({
  inheritAttrs: false,
});

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

const svgPaths = [
  `assets/images/${props.name}.svg`,
  `assets/images/components/${props.name}.svg`,
  `assets/images/favicons/${props.name}.svg`,
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

// Ref callbacks to add data-svg-source attribute to rendered SVG elements
const setIllustrationRef = (el) => {
  if (el?.$el) {
    el.$el.setAttribute(
      'data-svg-source',
      `@dialpad/dialtone-icons/dist/svg/illustrations/${props.name}.svg`,
    );
  }
};

const setSvgRef = (el, index) => {
  if (el?.$el) {
    el.$el.setAttribute('data-svg-source', svgPaths[index]);
  }
};
</script>
