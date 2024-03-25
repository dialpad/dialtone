<template>
  <span>
    <dt-skeleton
      v-if="!loaded"
      :shape-option="{
        size: skeletonSize,
        shape: 'circle',
      }"
      :animate="true"
      :aria-label="ariaLabel"
      class="d-icon__skeleton"
    />
    <component
      :is="icon"
      v-show="loaded"
      data-qa="dt-icon"
      :size="size"
      :aria-label="ariaLabel"
      v-bind="$attrs"
      @loaded="loaded = true"
    />
  </span>
</template>

<script>
import { DtSkeleton } from '../skeleton';
import * as icons from '@dialpad/dialtone-icons/vue3';
import { ICON_SIZE_MODIFIERS, ICON_NAMES, ICON_SKELETON_SIZES } from './icon_constants';
import { defineAsyncComponent } from 'vue';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
 */
export default {
  name: 'DtIcon',

  components: {
    DtSkeleton,
    ...Object.keys(icons).reduce((acc, icon) => {
      acc[icon] = defineAsyncComponent(icons[icon]);
      return acc;
    }, {}),
  },

  inheritAttrs: false,

  props: {
    /**
     * The size of the icon.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The icon name in kebab-case
     */
    name: {
      type: String,
      required: true,
      validator: (name) => ICON_NAMES.includes(name),
    },

    /**
     * The label of the icon as read out by a screenreader. Leave this unset if your icon is purely presentational
     */
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },

  data () {
    return {
      loaded: false,
    };
  },

  computed: {
    skeletonSize () {
      return ICON_SKELETON_SIZES[this.size];
    },

    icon () {
      return `dt-icon-${this.name}`;
    },
  },
};
</script>
