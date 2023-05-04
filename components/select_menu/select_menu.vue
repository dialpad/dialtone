<template>
  <div>
    <label>
      <div
        v-if="$slots.label || label"
        :aria-details="labelAriaDetails"
        :class="[
          'd-label',
          LABEL_SIZE_MODIFIERS[size],
          labelClass,
        ]"
        v-bind="labelChildProps"
        data-qa="dt-select-label"
      >
        <!-- @slot Slot for label, defaults to label prop -->
        <slot name="label">{{ label }}</slot>
      </div>
      <div
        v-if="$slots.description || description"
        :id="descriptionKey"
        :class="[
          'd-description',
          DESCRIPTION_SIZE_MODIFIERS[size],
          descriptionClass,
        ]"
        v-bind="descriptionChildProps"
        data-qa="dt-select-description"
      >
        <!-- @slot Slot for description, defaults to description prop -->
        <slot name="description">{{ description }}</slot>
      </div>
      <div
        :class="[
          'd-select',
          SELECT_SIZE_MODIFIERS[size],
          selectClass,
          { 'd-select--disabled': disabled },
        ]"
        data-qa="dt-select-wrapper"
      >
        <select
          :class="[
            'd-select__input',
            SELECT_STATE_MODIFIERS[state],
          ]"
          v-bind="$attrs"
          data-qa="dt-select"
          :disabled="disabled"
          v-on="selectListeners"
        >
          <!-- @slot Slot for select menu options, defaults to options prop -->
          <slot>
            <option
              v-for="option in options"
              :key="getOptionKey(option.value)"
              :value="option.value"
              :class="optionClass"
              v-bind="optionChildProps"
            >
              {{ option.label }}
            </option>
          </slot>
        </select>
      </div>
    </label>
    <dt-validation-messages
      :validation-messages="formattedMessages"
      :show-messages="showMessages"
      :class="messagesClass"
      v-bind="messagesChildProps"
      data-qa="dt-select-messages"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import {
  LABEL_SIZE_MODIFIERS,
  DESCRIPTION_SIZE_MODIFIERS,
} from '@/common/constants';
import {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
} from './select_menu_constants';
import {
  getUniqueString,
  getValidationState,
} from '@/common/utils';
import { MessagesMixin } from '../../common/mixins/input.js';
import { optionsValidator } from './select_menu_validators.js';
import { DtValidationMessages } from '../validation_messages';

/**
 * A select menu is an input control that allows users to choose one option from a list.
 * @property {Boolean} disabled attribute
 * @property {String} name attribute
 * @property {String} value attribute
 * @see https://dialpad.design/components/select.html
 */
export default {
  name: 'DtSelectMenu',

  components: { DtValidationMessages },

  mixins: [MessagesMixin],

  inheritAttrs: false,

  props: {
    /**
     * Label for the select
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Description for the select
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Select Menu Options, overridden by default slot. Each option has the following structure:
     * `{ index: number (optional), value: number || string (required), label: string (required) }`
     * @param {Object[]} options - Optional - A list that can be used to create a list of select menu options
     * @param {number} options[].index - Optional - The index of the option
     * @param {number|string} options[].value - Required - The option value
     * @param {string} options[].label - Required - The option Label
     */
    options: {
      type: Array,
      default: () => [],
      validator: options => optionsValidator(options),
    },

    /**
     * Controls the size of the select
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(SELECT_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the description container
     */
    descriptionClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the select
     */
    selectClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize each option, should options be provided via prop
     */
    optionClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * A set of props that are passed into the label container
     */
    labelChildProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * A set of props that are passed into the description container
     */
    descriptionChildProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * A set of props that are passed into each option, should options be provided via prop
     */
    optionChildProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Disabled state of the select
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
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
     * Native change event
     *
     * @event change
     * @type {String | Number}
     */
    'change',
  ],

  data () {
    return {
      LABEL_SIZE_MODIFIERS,
      DESCRIPTION_SIZE_MODIFIERS,
      SELECT_SIZE_MODIFIERS,
      SELECT_STATE_MODIFIERS,
    };
  },

  computed: {
    selectListeners () {
      return {
        /* TODO
            Check if any usages of this component leverage $listeners and either remove if unused or scope the removal
            and migration prior to upgrading to Vue 3.x
        */
        ...this.$listeners,
        /*
         * Override input listener to as no-op. Prevents parent input listeners from being passed through onto the input
         * element which will result in the hander being called twice (once on the select element and once by the
         * emitted input event by the change listener).
        */
        input: () => {},
        change: event => this.emitValue(event.target.value),
      };
    },

    state () {
      return getValidationState(this.formattedMessages);
    },

    selectKey () {
      return getUniqueString();
    },

    descriptionKey () {
      return `select-${this.selectKey}-description`;
    },

    labelAriaDetails () {
      if (this.$slots.description || this.description) {
        return this.descriptionKey;
      }

      return this.$attrs['aria-details'];
    },
  },

  mounted () {
    this.validateOptionsPresence();
  },

  beforeUpdate () {
    this.validateOptionsPresence();
  },

  methods: {
    emitValue (value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },

    getOptionKey (value) {
      return `select-${this.selectKey}-option-${value}`;
    },

    validateOptionsPresence () {
      if (this.options?.length < 1 && !this.$slots.default) {
        Vue.util.warn('Options are expected to be provided via prop or slot', this);
      }
    },
  },
};
</script>
