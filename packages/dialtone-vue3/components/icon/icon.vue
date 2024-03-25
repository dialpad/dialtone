<template>
  <span :class="['d-icon', iconSize]">
    <dt-skeleton
      v-if="!loaded"
      :offset="0"
      :shape-option="{ shape: 'circle', size: '100%' }"
      :aria-label="ariaLabel"
      :class="['d-icon__skeleton', 'd-icon', iconSize]"
    />
    <component
      :is="icon"
      v-show="loaded"
      :size="size"
      :aria-label="ariaLabel"
      :data-qa="$attrs['data-qa'] ?? 'dt-icon'"
      v-bind="$attrs"
      @loaded="loaded = true"
    />
  </span>
</template>

<script>
import { DtSkeleton } from '../skeleton';
import * as icons from '@dialpad/dialtone-icons/vue3';
import { ICON_SIZE_MODIFIERS, ICON_NAMES } from './icon_constants';
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
    iconSize () {
      return ICON_SIZE_MODIFIERS[this.size];
    },

    icon () {
      return `dt-icon-${this.name}`;
    },
  },
};
</script>
