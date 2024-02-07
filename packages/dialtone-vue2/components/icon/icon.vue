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
import { getUniqueString } from '@/common/utils.js';
import iconNames from '@dialpad/dialtone-icons/icons.json';
import { icons } from '@dialpad/dialtone-icons';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
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
      validator: (name) => iconNames.includes(name),
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
      return icons[`./${this.name}`]?.default;
    },
  },
};
</script>
