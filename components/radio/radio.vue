<template>
  <label>
    <div :class="['d-radio-group', { 'd-radio-group--disabled': internalDisabled }]">
      <div class="d-radio__input">
        <input
          :checked="internalChecked"
          :name="internalName"
          :value="value"
          :disabled="internalDisabled"
          type="radio"
          :class="['d-radio', inputValidationClass, inputClass]"
          v-bind="$attrs"
          v-on="inputListeners"
        >
      </div>
      <div
        class="d-radio__copy d-radio__label"
        data-qa="radio-label-description-container"
      >
        <div
          :class="labelClass"
          v-bind="labelChildProps"
          data-qa="radio-label"
        >
          <!-- @slot slot for Radio Label -->
          <slot>{{ label }}</slot>
        </div>
        <div
          v-if="hasSlotContent($slots.description) || description"
          :class="['d-description', descriptionClass]"
          v-bind="descriptionChildProps"
          data-qa="radio-description"
        >
          <!-- @slot slot for Radio Description -->
          <slot name="description">{{ description }}</slot>
        </div>
        <dt-validation-messages
          :validation-messages="formattedMessages"
          :show-messages="showMessages"
          :class="messagesClass"
          v-bind="messagesChildProps"
          data-qa="dt-radio-validation-messages"
        />
      </div>
    </div>
  </label>
</template>

<script>
import {
  InputMixin,
  CheckableMixin,
  GroupableMixin,
  MessagesMixin,
} from '@/common/mixins/input.js';
import { RADIO_INPUT_VALIDATION_CLASSES } from './radio_constants';
import { DtValidationMessages } from '../validation_messages';
import { hasSlotContent } from '@/common/utils';

/**
 * Radios are control elements that allow the user to make a single selection.
 * They are typically used in a Radio Group which allows the user to make a selection from a list of options.
 * @see https://dialpad.design/components/radio.html
 */
export default {
  name: 'DtRadio',

  components: { DtValidationMessages },

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
  },

  emits: [
    /**
     * Native input event
     *
     * @event input
     * @type {String | Number}
     */
    'input',

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

    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  data () {
    return {
      hasSlotContent,
    };
  },

  computed: {
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

  methods: {
    emitValue (value) {
      if (value !== this.radioGroupValue) {
        // update provided value if injected
        this.setGroupValue(value);

        this.$emit('input', value);
      }
    },
  },
};
</script>
