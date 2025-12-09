<template>
  <span class="d-chip">
    <component
      :is="interactive ? 'button' : 'span'"
      :id="id"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabel ? undefined : `${id}-content`"
      :aria-disabled="disabled"
      :class="chipClasses()"
      :type="interactive && 'button'"
      data-qa="dt-chip"
      :tabindex="disabled ? -1 : null"
      v-on="chipListeners"
    >
      <span
        v-if="$slots.icon"
        class="d-chip__icon"
        data-qa="dt-chip-icon"
      >
        <!-- @slot slot for Chip icon -->
        <slot name="icon" />
      </span>
      <span
        v-else-if="$slots.avatar"
        data-qa="dt-chip-avatar"
      >
        <!-- @slot slot for Chip avatar -->
        <slot name="avatar" />
      </span>
      <span
        v-if="$slots.default"
        :id="`${id}-content`"
        :class="['d-chip__text', contentClass]"
        data-qa="dt-chip-label"
      >
        <!-- @slot slot for Content within chip -->
        <slot />
      </span>
    </component>
    <dt-button
      v-if="!hideClose"
      :class="chipCloseButtonClasses()"
      data-qa="dt-chip-close"
      :aria-label="closeButtonTitle"
      :aria-disabled="disabled"
      :title="closeButtonTitle"
      :tabindex="disabled ? -1 : null"
      @click="$emit('close')"
    >
      <template #icon>
        <dt-icon-close
          :size="closeButtonIconSize"
        />
      </template>
    </dt-button>
  </span>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import {
  CHIP_CLOSE_BUTTON_SIZE_MODIFIERS,
  CHIP_SIZE_MODIFIERS,
  CHIP_ICON_SIZES,
} from './chip_constants';
import { getUniqueString } from '@/common/utils';
import { DialtoneLocalization } from '@/localization';

/**
 * A chip is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word. It is important a button is identifiable, consistent, and
 * communicates its actions clearly, and is appropriately sized to its action.
 * @see https://dialtone.dialpad.com/components/chip.html
 */
export default {
  name: 'DtChip',

  components: {
    DtButton,
    DtIconClose,
  },

  props: {
    /**
     * Whether the chip is disabled
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Hides the close button on the chip
     * @values true, false
     */
    hideClose: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the chip.
     * @values xs, sm, md
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(CHIP_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The interactivity of the chip.
     * Makes chip clickable, apply hover/focus/active style, emit keyboard events etc.
     * @values true, false
     */
    interactive: {
      type: Boolean,
      default: true,
    },

    /**
     * Id to use for the dialog's aria-labelledby.
     */
    id: {
      type: String,
      default: function () { return getUniqueString(); },
    },

    /**
     * Descriptive label for the chip content.
     * If this prop is unset the content in the default slot will be used as an aria-label.
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * Additional class name for the chip element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the span element.
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: [
    /**
     * Native chip click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Close button click event
     *
     * @event close
     */
    'close',

    /**
     * Native chip key up event
     *
     * @event keyup
     * @type {KeyboardEvent}
     */
    'keyup',

    /**
     * Native chip key down event
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',
  ],

  data () {
    return {
      isActive: false,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    chipListeners () {
      return {
        ...this.$listeners,
        click: event => {
          if (this.interactive) this.$emit('click', event);
        },

        keydown: event => {
          if (event.code?.toLowerCase() === 'delete') {
            this.onClose();
          } else {
            this.$emit('keydown', event);
          }
        },

        keyup: event => {
          this.$emit('keyup', event);
        },
      };
    },

    closeButtonIconSize () {
      return CHIP_ICON_SIZES[this.size];
    },

    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
  },

  methods: {
    chipClasses () {
      return [
        this.$attrs['grouped-chip'] ? 'd-chip' : 'd-chip__label',
        CHIP_SIZE_MODIFIERS[this.size],
        this.labelClass,
        this.disabled && 'd-chip--disabled',
      ];
    },

    chipCloseButtonClasses () {
      return [
        'd-chip__close',
        CHIP_CLOSE_BUTTON_SIZE_MODIFIERS[this.size],
        this.disabled && 'd-chip__close--disabled',
      ];
    },

    onClose () {
      if (!this.hideClose) {
        this.$emit('close');
      }
    },
  },
};
</script>
