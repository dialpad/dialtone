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
        v-if="hasSlotContent($slots.leading)"
        :class="['d-chip__leading', leadingClass]"
        data-qa="dt-chip-leading"
      >
        <!-- @slot Optional freeform content at the start of the chip -->
        <slot name="leading" />
      </span>
      <span
        v-if="hasStartIcon()"
        :class="['d-chip__icon', resolvedStartIconClass]"
        data-qa="dt-chip-icon"
      >
        <!-- @slot Slot for start icon -->
        <slot
          v-if="hasSlotContent($slots.startIcon)"
          name="startIcon"
        />
        <!-- @slot @deprecated Use startIcon -->
        <slot
          v-else
          name="icon"
        />
      </span>
      <span
        v-else-if="hasStartAvatar()"
        :class="['d-chip__avatar', resolvedStartAvatarClass]"
        data-qa="dt-chip-avatar"
      >
        <!-- @slot Slot for start avatar -->
        <slot
          v-if="hasSlotContent($slots.startAvatar)"
          name="startAvatar"
        />
        <!-- @slot @deprecated Use startAvatar -->
        <slot
          v-else
          name="avatar"
        />
      </span>
      <span
        v-if="hasLabel()"
        :id="`${id}-content`"
        :class="['d-chip__text', contentClass]"
        data-qa="dt-chip-label"
      >
        <!-- @slot slot for Content within chip -->
        <slot />
      </span>
      <span
        v-if="hasSlotContent($slots.endIcon)"
        :class="['d-chip__end-icon', endIconClass]"
        data-qa="dt-chip-end-icon"
      >
        <!-- @slot Slot for end icon -->
        <slot name="endIcon" />
      </span>
      <span
        v-if="hasSlotContent($slots.trailing)"
        :class="['d-chip__trailing', trailingClass]"
        data-qa="dt-chip-trailing"
      >
        <!-- @slot Optional freeform content at the end of the chip -->
        <slot name="trailing" />
      </span>
    </component>
    <dt-button
      v-if="resolvedShowClose"
      :class="chipCloseButtonClasses()"
      data-qa="dt-chip-close"
      :aria-label="resolvedRemoveButtonAriaLabel"
      :aria-disabled="disabled"
      :title="resolvedRemoveButtonAriaLabel"
      :tabindex="disabled ? -1 : null"
      @click="onClose"
    >
      <template #startIcon>
        <dt-icon-close
          :size="closeButtonIconSize"
        />
      </template>
    </dt-button>
  </span>
</template>

<script>
import { DtButton } from '@/components/Button';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import {
  CHIP_VARIANT_MODIFIERS,
  CHIP_EMPHASIS_MODIFIERS,
  CHIP_CLOSE_BUTTON_SIZE_MODIFIERS,
  CHIP_SIZE_MODIFIERS,
  CHIP_ICON_SIZES,
} from './ChipConstants';
import { getUniqueString, hasSlotContent } from '@/common/utils';
import { ordinalSizeValidator } from '@/common/validators';
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
     * The visual classification of the chip.
     * @values default, people
     */
    variant: {
      type: String,
      default: 'default',
      validator: (variant) => Object.keys(CHIP_VARIANT_MODIFIERS).includes(variant),
    },

    /**
     * The visual emphasis of the chip.
     * @values subtle, base, strong
     */
    emphasis: {
      type: String,
      default: 'base',
      validator: (emphasis) => Object.keys(CHIP_EMPHASIS_MODIFIERS).includes(emphasis),
    },

    /**
     * Whether the chip is disabled
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows the close button on the chip
     * @values true, false
     */
    showClose: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the chip. 100 to 500 match DtBadge; 600 and 700 are chip-only.
     * @values 100, 200, 300, 400, 500, 600, 700
     */
    size: {
      type: [String, Number],
      default: 300,
      validator: ordinalSizeValidator(CHIP_SIZE_MODIFIERS),
    },

    /**
     * The interactivity of the chip.
     * Makes chip clickable, apply hover/focus/active style, emit keyboard events etc.
     * @values true, false
     */
    interactive: {
      type: Boolean,
      default: false,
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
     * Label for the managed remove button.
     */
    removeButtonAriaLabel: {
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

    /**
     * Additional class name for the leading wrapper element.
     */
    leadingClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the trailing wrapper element.
     */
    trailingClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the start icon wrapper element.
     */
    startIconClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * Additional class name for the start avatar wrapper element.
     */
    startAvatarClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * Additional class name for the end icon wrapper element.
     */
    endIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the icon wrapper element.
     * @deprecated Use startIconClass instead.
     */
    iconClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * Additional class name for the avatar wrapper element.
     * @deprecated Use startAvatarClass instead.
     */
    avatarClass: {
      type: [String, Array, Object],
      default: undefined,
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
      hasSlotContent,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    chipListeners () {
      if (!this.interactive || this.disabled) return {};

      return {
        click: event => {
          this.$emit('click', event);
        },

        keydown: event => {
          const key = event.key?.toLowerCase();
          const code = event.code?.toLowerCase();

          if (key === 'backspace' || key === 'delete' || code === 'backspace' || code === 'delete') {
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

    resolvedEmphasis () {
      if (this.interactive && this.emphasis === 'subtle') return 'base';
      return this.emphasis;
    },

    resolvedShowClose () {
      return this.interactive && this.showClose;
    },

    closeButtonIconSize () {
      return CHIP_ICON_SIZES[String(this.size)];
    },

    resolvedRemoveButtonAriaLabel () {
      return this.removeButtonAriaLabel || this.i18n.$t('DIALTONE_CHIP_REMOVE_BUTTON_LABEL');
    },

    resolvedStartIconClass () {
      return this.startIconClass ?? this.iconClass;
    },

    resolvedStartAvatarClass () {
      return this.startAvatarClass ?? this.avatarClass;
    },
  },

  created () {
    this.validateProps();
  },

  methods: {
    // $slots is not reactive, so slot-dependent values are methods called at render time, not computed.
    hasStartIcon () {
      return hasSlotContent(this.$slots.startIcon) || hasSlotContent(this.$slots.icon);
    },

    hasStartAvatar () {
      return hasSlotContent(this.$slots.startAvatar) || hasSlotContent(this.$slots.avatar);
    },

    hasLabel () {
      return hasSlotContent(this.$slots.default);
    },

    chipClasses () {
      return [
        this.$attrs['grouped-chip'] ? 'd-chip' : 'd-chip__label',
        CHIP_VARIANT_MODIFIERS[this.variant],
        CHIP_EMPHASIS_MODIFIERS[this.resolvedEmphasis],
        CHIP_SIZE_MODIFIERS[String(this.size)],
        this.labelClass,
        this.disabled && 'd-chip--disabled',
      ];
    },

    chipCloseButtonClasses () {
      return [
        'd-chip__close',
        CHIP_CLOSE_BUTTON_SIZE_MODIFIERS[String(this.size)],
        this.disabled && 'd-chip__close--disabled',
      ];
    },

    onClose () {
      if (this.interactive && !this.disabled) {
        this.$emit('close');
      }
    },

    validateProps () {
      if (process.env.NODE_ENV === 'production') return;

      if (this.showClose && !this.interactive) {
        console.warn('DtChip warning: showClose requires interactive. The remove button will not render.');
      }

      if (this.interactive && this.emphasis === 'subtle') {
        console.warn('DtChip warning: emphasis="subtle" is static only. Rendering emphasis="base".');
      }

      [
        ['icon', 'startIcon'],
        ['avatar', 'startAvatar'],
      ].forEach(([slotName, replacement]) => {
        if (hasSlotContent(this.$slots[slotName])) {
          console.warn(`DtChip warning: ${slotName} slot is deprecated. Use ${replacement} instead.`);
        }
      });

      [
        ['iconClass', 'startIconClass'],
        ['avatarClass', 'startAvatarClass'],
      ].forEach(([propName, replacement]) => {
        if (this[propName] !== undefined) {
          console.warn(`DtChip warning: ${propName} is deprecated. Use ${replacement} instead.`);
        }
      });
    },
  },
};
</script>
