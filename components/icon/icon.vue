<template>
  <component
    :is="currentIcon"
    v-if="currentIcon"
    data-qa="dt-icon"
    :aria-hidden="ariaLabel ? 'false' : 'true'"
    :aria-label="ariaLabel"
    :class="iconSize"
  />
</template>

<script>
import { ICON_SIZE_MODIFIERS, DIALTONE_ICONS } from './icon_constants';
import { kebabCaseToPascalCase } from '@/common/utils';

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

  computed: {
    iconSize () {
      return ICON_SIZE_MODIFIERS[this.size];
    },

    iconName () {
      return kebabCaseToPascalCase(this.name);
    },

    currentIcon () {
      return DIALTONE_ICONS[this.iconName];
    },
  },
};
</script>
