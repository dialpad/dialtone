<template>
  <component
    :is="icon"
    v-if="icon"
    :size="size"
    :aria-label="iconAriaLabel"
    :data-qa="$attrs['data-qa'] ?? 'dt-icon'"
  />
</template>

<script>
import { icons } from '@dialpad/dialtone-icons/vue3';
import { ICON_SIZE_MODIFIERS, ICON_NAMES } from './icon_constants';
// import { DialtoneLocalization } from '@/localization';
// import { toFluentKeyString } from '@/common/utils';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
 */
export default {
  compatConfig: { MODE: 3 },
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
     * The label of the icon as read out by a screen-reader. Leave this unset if your icon is purely presentational
     */
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },

  data () {
    return {
      iconLoaded: false,
      // i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    icon () {
      return icons[`./src/icons/${this.name}.vue`];
    },

    iconAriaLabel () {
      // const fluentKey = toFluentKeyString(this.name);
      // return this.ariaLabel || this.i18n.$t(`DIALTONE_ICON_${fluentKey}`);
      return this.ariaLabel;
    },
  },
};
</script>
