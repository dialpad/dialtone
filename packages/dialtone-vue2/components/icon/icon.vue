<template>
  <component
    :is="icon"
    v-if="icon"
    :size="size"
    :aria-label="$t(localizationKey)"
    :data-qa="$attrs['data-qa'] ?? 'dt-icon'"
  />
</template>

<script>
import { icons } from '@dialpad/dialtone-icons/vue2';
import { ICON_SIZE_MODIFIERS, ICON_NAMES } from './icon_constants';
import { DtLocalizationMixin } from '@/common/mixins';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
 */
export default {
  name: 'DtIcon',

  mixins: [DtLocalizationMixin],

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
  },

  computed: {
    icon () {
      return icons[`./src/icons/${this.name}.vue`];
    },

    localizationKey () {
      const fluentKey = this.name
        .replaceAll(/[ -]/g, '_')
        .replaceAll(/\W/g, '')
        .toUpperCase();

      return `DIALTONE_ICON_${fluentKey}`;
    },
  },
};
</script>
