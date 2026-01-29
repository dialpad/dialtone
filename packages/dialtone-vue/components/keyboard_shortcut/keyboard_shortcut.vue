<!-- eslint-disable vue/no-v-html -->
<template>
  <kbd
    :class="[
      'd-keyboard-shortcut',
      { 'd-keyboard-shortcut--inverted': inverted },
    ]"
  >
    <span class="d-keyboard-shortcut--sr-only">
      {{ screenReaderText || generatedScreenReaderText }}
    </span>
    <template
      v-for="(item, i) in formattedShortcutSplit"
    >
      <component
        :is="icons[item]"
        v-if="icons[item]"
        :key="`icon-${i}-${item}`"
        size="100"
        aria-hidden="true"
        :class="[
          'd-keyboard-shortcut__icon',
          { 'd-keyboard-shortcut__icon--inverted': inverted },
        ]"
      />
      <span
        v-else-if="item.trim()"
        :key="`text-${i}-${item}`"
        aria-hidden="true"
        :class="[
          'd-keyboard-shortcut__item',
          { 'd-keyboard-shortcut__item--inverted': inverted },
        ]"
        v-html="item"
      />
    </template>
  </kbd>
</template>

<script>
import {
  DtIconLayoutGrid,
  DtIconArrowRight,
  DtIconArrowLeft,
  DtIconArrowUp,
  DtIconArrowDown,
  DtIconCommand,
  DtIconOption,
  DtIconPlus,
} from '@dialpad/dialtone-icons/vue3';

const SHORTCUTS_ICON_ALIASES = {
  '{win}': DtIconLayoutGrid,
  '{arrow-right}': DtIconArrowRight,
  '{arrow-left}': DtIconArrowLeft,
  '{arrow-up}': DtIconArrowUp,
  '{arrow-down}': DtIconArrowDown,
  '{cmd}': DtIconCommand,
  '{opt}': DtIconOption,
};

// Mapping of icon aliases to readable text for accessibility
const ICON_ALIAS_TO_TEXT = {
  '{cmd}': 'Command',
  '{opt}': 'Option',
  '{win}': 'Windows',
  '{arrow-right}': 'Right Arrow',
  '{arrow-left}': 'Left Arrow',
  '{arrow-up}': 'Up Arrow',
  '{arrow-down}': 'Down Arrow',
  '{plus}': 'plus',
};

// Mapping of common key abbreviations to full names for accessibility
const KEY_ABBREVIATIONS = {
  'ctrl': 'Control',
  'alt': 'Alt',
  'esc': 'Escape',
  'del': 'Delete',
  'ins': 'Insert',
  'pgup': 'Page Up',
  'pgdn': 'Page Down',
  'num': 'Number',
  'caps': 'Caps Lock',
};

/**
 * This component displays a visual representation of a keyboard shortcut to the user.
 * @see https://dialtone.dialpad.com/components/keyboard_shortcut.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtKeyboardShortcut',

  components: {
    DtIconLayoutGrid,
    DtIconArrowRight,
    DtIconArrowLeft,
    DtIconArrowUp,
    DtIconArrowDown,
    DtIconCommand,
    DtIconOption,
    DtIconPlus,
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
     * {cmd} {opt} {win} {arrow-right} {arrow-left} {arrow-up} {arrow-down}
     */
    shortcut: {
      type: String,
      required: true,
    },

    /**
     * Optional text to override the auto-generated accessible text for assistive technology.
     * If not provided, accessible text will be automatically generated from the shortcut.
     */
    screenReaderText: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      separator: /\+/gi,
    };
  },

  computed: {
    icons () {
      return {
        ...SHORTCUTS_ICON_ALIASES,
        '{plus}': DtIconPlus,
      };
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

    // Generates accessible text for the keyboard shortcut
    generatedScreenReaderText () {
      return this.formattedShortcutSplit
        .map(item => {
          const trimmedItem = item.trim();

          // Convert icon aliases to readable text
          if (ICON_ALIAS_TO_TEXT[trimmedItem]) {
            return ICON_ALIAS_TO_TEXT[trimmedItem];
          }

          // Convert key abbreviations to full names (case-insensitive)
          const lowerItem = trimmedItem.toLowerCase();
          if (KEY_ABBREVIATIONS[lowerItem]) {
            return KEY_ABBREVIATIONS[lowerItem];
          }

          // Return the key as-is if it's not an alias or abbreviation
          return trimmedItem;
        })
        .filter(item => item) // Remove empty strings
        .join(' ');
    },
  },
};
</script>
