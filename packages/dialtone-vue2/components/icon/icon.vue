<template>
  <span :class="['d-icon', iconSize]">
    <dt-skeleton
      v-show="!iconLoaded && showSkeleton"
      :offset="0"
      :shape-option="{ shape: 'circle', size: '100%' }"
      :aria-label="ariaLabel"
      :class="['d-icon', iconSize]"
    />
    <component
      :is="icon"
      v-show="iconLoaded"
      :size="size"
      :aria-label="ariaLabel"
      :data-qa="$attrs['data-qa'] ?? 'dt-icon'"
      v-bind="$attrs"
      @loaded="iconLoaded = true"
    />
  </span>
</template>

<script>
import { DtSkeleton } from '../skeleton';
import * as icons from '@dialpad/dialtone-icons/vue2';
import { ICON_SIZE_MODIFIERS, ICON_NAMES } from './icon_constants';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
 */
export default {
  name: 'DtIcon',

  components: {
    DtSkeleton,
    ...icons,
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

    /**
     * Shows a skeleton loader while the emoji asset is loading.
     * @values true, false
     */
    showSkeleton: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      iconLoaded: false,
    };
  },

  computed: {
    iconSize () {
      return ICON_SIZE_MODIFIERS[this.size];
    },

    icon () {
      return `dt-icon-${this.name}`;
    },
  },
};
</script>
