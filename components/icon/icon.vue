<template>
  <component
    :is="icon"
    v-if="icon"
    :id="id"
    data-qa="dt-icon"
    :aria-hidden="ariaLabel ? 'false' : 'true'"
    :aria-label="ariaLabel"
    :class="iconSize"
  />
</template>

<script>
import { ICON_SIZE_MODIFIERS } from './icon_constants';
import { defineAsyncComponent } from 'vue';
import { getUniqueString } from '@/common/utils.js';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialpad.design/components/icon.html
 */
export default {
  name: 'DtIcon',

  props: {
    /**
     * DtIcon identifier
     */
    id: {
      type: String,
      default () {
        return getUniqueString();
      },
    },

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
    },

    /**
     * The label of the icon as read out by a screenreader. Leave this unset if your icon is purely presentational
     */
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },

  computed: {
    iconSize () {
      return ICON_SIZE_MODIFIERS[this.size];
    },

    icon () {
      const name = this.name;
      return defineAsyncComponent(() =>
        import(`../../node_modules/@dialpad/dialtone-icons/dist/svg/${name}.svg`),
      );
    },
  },
};
</script>
