<!-- eslint-disable vue/no-v-html -->
<template>
  <kbd
    :class="[
      'd-d-inline-flex',
      'd-ff-custom',
      'd-ai-center',
      'd-jc-center',
      'd-box-border',
      'd-px4',
      'd-ba',
      'd-bar4',
      'd-fs-100',
      inverted ? 'd-bc-black-500' : 'd-bc-black-400',
    ]"
  >
    <span
      v-if="screenReaderText"
      class="sr-only"
    >
      {{ screenReaderText }}
    </span>
    <template
      v-for="(item, i) in formattedShortcutSplit"
    >
      <dt-icon
        v-if="icons[item]"
        :key="`${i}-${item}`"
        :name="icons[item]"
        size="100"
        aria-hidden="true"
        :class="[
          inverted ? 'd-fc-black-300' : 'd-fc-black-600',
          'd-mr2',
        ]"
      />
      <span
        v-else
        :key="`${i}-${item}`"
        aria-hidden="true"
        :class="[
          inverted ? 'd-fc-black-300' : 'd-fc-black-600',
          'd-mr2',
        ]"
        v-html="item"
      />
    </template>
  </kbd>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { SHORTCUTS_ICON_ALIASES, SHORTCUTS_ICON_SEPARATOR } from './keyboard_shortcut_constants';

/**
 * This component displays a visual representation of a keyboard shortcut to the user.
 * @see https://dialpad.design/components/keyboard_shortcut.html
 */
export default {
  name: 'DtKeyboardShortcut',

  components: {
    DtIcon,
  },

  props: {
    /**
     * If true, applies inverted styles.
     * @values true, false
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     * Include any of these tokens in your string to render the corresponding symbol:
     * {cmd} {win} {arrow-right} {arrow-left} {arrow-up} {arrow-down}
     */
    shortcut: {
      type: String,
      required: true,
    },

    /**
     * Text entered here will be read by assistive technology. If null this component will be ignored by AT.
     */
    screenReaderText: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      SHORTCUTS_ICON_ALIASES,
      separator: /\+/gi,
    };
  },

  computed: {
    icons () {
      return { ...SHORTCUTS_ICON_ALIASES, ...SHORTCUTS_ICON_SEPARATOR };
    },

    shortcutWithSeparator () {
      return this.shortcut.replace(this.separator, '{plus}');
    },

    formattedShortcut () {
      return Object.keys(SHORTCUTS_ICON_ALIASES).reduce((result, key) => {
        return result.replace(new RegExp('{' + key + '}', 'gi'), SHORTCUTS_ICON_ALIASES[key]);
      }, this.shortcutWithSeparator);
    },

    // Splits any icon based aliases into their own array items.
    formattedShortcutSplit () {
      const iconAliasString = Object.keys(this.icons).join('|');

      /*
         The regexp splits a given string with icon alias and is filtered by empty strings after:
         if {win} is our delimiter AKA shortcut icon alias
         '{win} + D K + {win}' returned value will be [{win}, ' ', '{plus}', ' D K ', '{plus}', ' ', {win}]
      */
      const regex = new RegExp(`(${iconAliasString})`, 'gi');
      return this.formattedShortcut.split(regex).filter(Boolean);
    },
  },
};
</script>
