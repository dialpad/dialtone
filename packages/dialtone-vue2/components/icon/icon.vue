<template>
  <component
    :is="icon"
    v-if="icon"
    :size="size"
    :aria-label="ariaLabel"
    :data-qa="$attrs['data-qa'] ?? 'dt-icon'"
  />
</template>

<script>
import { icons } from '@dialpad/dialtone-icons/vue2';
import { ICON_SIZE_MODIFIERS, ICON_NAMES } from './icon_constants';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
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

  computed: {
    icon () {
      return icons[`./src/icons/${this.name}.vue`];
    },
  },
};
</script>
