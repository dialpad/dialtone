<template>
  <component
    :is="currentIcon"
    data-qa="dt-icon"
    :aria-hidden="ariaLabel ? 'false' : 'true'"
    :aria-label="ariaLabel"
    :class="iconSize"
  />
</template>

<script>
import { ICON_SIZE_MODIFIERS } from './icon_constants';
import { kebabCaseToPascalCase } from '@/common/utils';
import * as dialtoneIcons from '@dialpad/dialtone-icons';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialpad.design/components/icon.html
 */
export default {
  name: 'DtIcon',

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
      dialtoneIcons,
    };
  },

  computed: {
    iconSize () {
      return ICON_SIZE_MODIFIERS[this.size];
    },

    iconName () {
      return kebabCaseToPascalCase(this.name);
    },

    currentIcon () {
      return this.dialtoneIcons[this.iconName];
    },
  },
};
</script>
