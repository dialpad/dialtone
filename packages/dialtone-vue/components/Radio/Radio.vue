<template>
  <div
    :class="$attrs.class"
    :style="$attrs.style"
  >
    <label :class="['d-radio-group', { 'd-radio-group--disabled': internalDisabled }]">
      <div class="d-radio__input">
        <input
          :checked="internalChecked"
          :name="internalName"
          :value="value"
          :disabled="internalDisabled"
          type="radio"
          :class="['d-radio', inputValidationClass, inputClass]"
          :aria-label="!showLabel && label ? label : undefined"
          v-bind="removeClassStyleAttrs($attrs)"
          v-on="inputListeners"
        >
      </div>
      <dt-text
        v-if="hasLabel"
        as="div"
        kind="label"
        :size="resolvedLabelSize"
        :strength="labelStrength ?? 'normal'"
        :tone="internalDisabled ? 'disabled' : 'primary'"
        :class="[labelClass, 'd-radio__copy d-radio__label']"
        v-bind="labelChildProps"
        data-qa="radio-label"
      >
        <!-- @slot slot for Radio Label -->
        <slot>{{ label }}</slot>
      </dt-text>
    </label>
    <div
      v-if="$slots.description || description || hasMessages"
      class="d-radio__messages"
      data-qa="radio-description-messages"
    >
      <dt-text
        v-if="$slots.description || description"
        kind="body"
        :size="200"
        tone="tertiary"
        as="div"
        :class="['d-description', descriptionClass]"
        v-bind="descriptionChildProps"
        data-qa="radio-description"
      >
        <!-- @slot slot for Radio Description -->
        <slot name="description">
          {{ description }}
        </slot>
      </dt-text>
      <dt-validation-messages
        :validation-messages="formattedMessages"
        :show-messages="showMessages"
        :class="messagesClass"
        v-bind="messagesChildProps"
        data-qa="dt-radio-validation-messages"
      />
    </div>
  </div>
</template>

<script>
import {
  InputMixin,
  CheckableMixin,
  GroupableMixin,
  MessagesMixin,
} from '@/common/mixins/Input';
import { RADIO_INPUT_VALIDATION_CLASSES } from './RadioConstants';
import { DtValidationMessages } from '../ValidationMessages';
import { DtText, TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '@/components/Text';
import { hasSlotContent, removeClassStyleAttrs } from '@/common/Utils';

/**
 * Radios are control elements that allow the user to make a single selection.
 * They are typically used in a Radio Group which allows the user to make a selection from a list of options.
 * @see https://dialtone.dialpad.com/components/radio.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtRadio',

  components: { DtValidationMessages, DtText },

  mixins: [InputMixin, CheckableMixin, GroupableMixin, MessagesMixin],

  inheritAttrs: false,

  props: {
    /**
     * A provided value for the radio
     */
    value: {
      type: [String, Number],
      default: '',
    },

    /**
     * Determines visibility of radio label.
     * @values true, false
     */
    showLabel: {
      type: Boolean,
      default: true,
    },

    /**
     * Overrides the label text size.
     * @values 100, 200, 300, 400
     */
    labelSize: {
      type: [String, Number],
      default: null,
      validator: (s) => TEXT_SIZE_MODIFIERS.label.includes(String(s)),
    },

    /**
     * Overrides the label font weight.
     * @values bold, semibold, medium, normal
     */
    labelStrength: {
      type: String,
      default: null,
      validator: (s) => Object.keys(TEXT_STRENGTH_MODIFIERS).includes(s),
    },
  },

  emits: [
    /**
     * Event fired to sync the modelValue prop with the parent component
     *
     * @event update:modelValue
     * @type {String | Number}
     */
    'update:modelValue',

    /**
     * Native input focus event
     *
     * @event focus
     * @type {FocusEvent}
     */
    'focus',

    /**
     * Native input focusin event
     *
     * @event focusin
     * @property {FocusEvent}
     */
    'focusin',

    /**
     * Native input focusout event
     *
     * @event focusout
     * @property {FocusEvent}
     */
    'focusout',
  ],

  data () {
    return {
      hasSlotContent,
    };
  },

  computed: {
    hasLabelContent () {
      return !!(this.$slots.default || this.label);
    },

    hasLabel () {
      return this.showLabel && this.hasLabelContent;
    },

    resolvedLabelSize () {
      return this.labelSize ?? 300;
    },

    inputValidationClass () {
      return RADIO_INPUT_VALIDATION_CLASSES[this.internalValidationState];
    },

    radioGroupValue () {
      return this.groupContext?.selectedValue;
    },

    inputListeners () {
      return {
        /*
         * Override input listener to as no-op. Prevents parent input listeners from being passed through onto the input
         * element which will result in the handler being called twice
         * (once on the input element and once by the emitted input event by the change listener).
        */
        input: () => {},
        focusin: event => this.$emit('focusin', event),
        focusout: event => this.$emit('focusout', event),
        change: event => this.emitValue(event.target.value),
      };
    },

    hasMessages () {
      return this.formattedMessages.length && this.showMessages;
    },
  },

  watch: {
    radioGroupValue: {
      immediate: true,
      handler (newRadioGroupValue) {
        if (this.hasGroup) {
          // update internal value when the radio group value changes
          this.internalChecked = newRadioGroupValue === this.value;
        }
      },
    },
  },

  mounted () {
    this.runValidations();
  },

  methods: {
    removeClassStyleAttrs,

    runValidations () {
      if (!this.hasLabelContent && !this.$attrs['aria-label']) {
        console.info(
          '[Dialtone] A label is required for accessibility. Provide a label prop and use show-label="false" to hide it visually.',
        );
      }
    },

    emitValue (value) {
      if (value !== this.radioGroupValue) {
        // update provided value if injected
        this.setGroupValue(value);
        this.$emit('update:modelValue', value);
      }
    },
  },
};
</script>
