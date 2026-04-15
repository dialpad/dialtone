<template>
  <div
    :class="$attrs.class"
    :style="$attrs.style"
  >
    <label>
      <dt-text
        v-if="showLabel && (hasSlotContent($slots.label) || label)"
        kind="label"
        :size="resolvedLabelSize"
        :strength="labelStrength"
        tone="secondary"
        as="div"
        :aria-details="labelAriaDetails"
        :class="['d-select__label-text', labelClass]"
        v-bind="labelChildProps"
        data-qa="dt-select-label"
      >
        <!-- @slot Slot for label, defaults to label prop -->
        <slot name="label">{{ label }}</slot>
      </dt-text>
      <dt-text
        v-if="hasSlotContent($slots.description) || description"
        :id="descriptionKey"
        kind="body"
        :size="resolvedDescriptionSize"
        tone="tertiary"
        :density="resolvedDescriptionDensity"
        as="div"
        :class="[
          'd-description',
          descriptionClass,
        ]"
        v-bind="descriptionChildProps"
        data-qa="dt-select-description"
      >
        <!-- @slot Slot for description, defaults to description prop -->
        <slot name="description">{{ description }}</slot>
      </dt-text>
      <div
        :class="[
          'd-select',
          SELECT_SIZE_MODIFIERS[String(size)],
          selectClass,
          { 'd-select--disabled': disabled },
        ]"
        data-qa="dt-select-wrapper"
      >
        <select
          ref="selectElement"
          :class="[
            'd-select__input',
            SELECT_STATE_MODIFIERS[state],
          ]"
          :aria-label="!showLabel && label ? label : undefined"
          v-bind="removeClassStyleAttrs($attrs)"
          data-qa="dt-select"
          :disabled="disabled"
          :value="modelValue"
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
import { warn } from 'vue';
import { DtText, TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '@/components/text';
import {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
} from './select_menu_constants';
import {
  getUniqueString,
  getValidationState,
  hasSlotContent,
  removeClassStyleAttrs,
} from '@/common/utils';
import { MessagesMixin } from '@/common/mixins/input';
import { optionsValidator } from './select_menu_validators.js';
import { DtValidationMessages } from '../validation_messages';

/**
 * A select menu is an input control that allows users to choose one option from a list.
 * @property {Boolean} disabled attribute
 * @property {String} name attribute
 * @property {String} value attribute
 * @see https://dialtone.dialpad.com/components/select.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtSelectMenu',

  components: { DtValidationMessages, DtText },

  mixins: [MessagesMixin],

  inheritAttrs: false,

  props: {
    /**
     * Label for the select.
     * Can also be overridden with a slot of the same name.
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Determines visibility of select label.
     * @values true, false
     */
    showLabel: {
      type: Boolean,
      default: true,
    },

    /**
     * Description for the select.
     * Can also be overridden with a slot of the same name.
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Select Menu Options, overridden by default slot. Each option has the following structure:
     * `{ value: number || string (required), label: string (required) }`
     * @param {Object[]} options - Optional - A list that can be used to create a list of select menu options
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
     * @values 100, 200, 300, 400, 500
     */
    size: {
      type: [String, Number],
      default: 300,
      validator: (s) => Object.keys(SELECT_SIZE_MODIFIERS).includes(String(s)),
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

    /**
     * The value of the select menu
     */
    modelValue: {
      type: [String, Number],
      default: '',
    },

    /**
     * Overrides the label text size. When not provided, the label size
     * is derived from the component size prop.
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
     * Native input event
     *
     * @event input
     * @type {String | Number}
     */
    'input',

    /**
     * Event fired to sync the modelValue prop with the parent component
     *
     * @event input
     * @type {String | Number}
     */
    'update:modelValue',

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
      SELECT_SIZE_MODIFIERS,
      SELECT_STATE_MODIFIERS,
      hasSlotContent,
    };
  },

  computed: {
    resolvedLabelSize () {
      if (this.labelSize != null) return this.labelSize;
      const sizeStr = String(this.size);
      // xl/500 exceeds label's max size — cap at lg/400
      if (sizeStr === 'xl' || sizeStr === '500') return sizeStr === '500' ? '400' : 'lg';
      return this.size;
    },

    resolvedDescriptionSize () {
      const map = {
        100: 'xs', 200: 'xs', 300: 'sm', 400: 'sm', 500: 'md',
        xs: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'md',
      };
      return map[String(this.size)] || 'sm';
    },

    resolvedDescriptionDensity () {
      const sizeStr = String(this.size);
      return (sizeStr === 'xl' || sizeStr === '500') ? '300' : undefined;
    },

    selectListeners () {
      return {
        /*
         * Override input listener to as no-op. Prevents parent input listeners from being passed through onto the input
         * element which will result in the handler being called twice (once on the select element and once by the
         * emitted input event by the change listener).
        */
        input: () => {},
        change: event => this.emitValue(event.target.value, event),
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
    this.runValidations();
  },

  beforeUpdate () {
    this.validateOptionsPresence();
  },

  methods: {
    removeClassStyleAttrs,
    emitValue (value, event) {
      this.$emit('update:modelValue', value, event);
      this.$emit('input', value, event);
      this.$emit('change', value, event);
    },

    getOptionKey (value) {
      return `select-${this.selectKey}-option-${value}`;
    },

    validateOptionsPresence () {
      if (this.options?.length < 1 && !this.$slots.default) {
        warn('Options are expected to be provided via prop or slot', this);
      }
    },

    runValidations () {
      const hasLabel = !!(this.$slots.label || this.label);
      if (!hasLabel && !this.$attrs['aria-label']) {
        console.info(
          '[Dialtone] A label is required for accessibility. Provide a label prop and use show-label="false" to hide it visually.',
        );
      }
    },
  },
};
</script>
