<template>
  <div
    ref="container"
    class="base-input"
    data-qa="dt-input"
  >
    <label
      class="base-input__label"
      :aria-details="$slots.description || description ? descriptionKey : undefined"
      data-qa="dt-input-label-wrapper"
    >
      <!-- @slot slot for label, defaults to label prop -->
      <slot name="labelSlot">
        <div
          data-qa="dt-input-label"
          :class="[
            'base-input__label-text',
            'd-label',
            { [`d-label--${size}`]: (!isDefaultSize && isValidSize) },
          ]"
        >
          {{ label }}
        </div>
      </slot>
      <div
        v-if="$slots.description || description"
        :id="descriptionKey"
        :class="[
          'base-input__description',
          'd-description',
          { [`d-description--${size}`]: (!isDefaultSize && isValidDescriptionSize) },
        ]"
        data-qa="dt-input-description"
      >
        <!-- @slot slot for description, defaults to description prop -->
        <slot name="description">{{ description }}</slot>
      </div>
      <div class="d-input__wrapper">
        <span
          v-if="$slots.leftIcon"
          :class="inputIconClasses('left')"
          data-qa="dt-input-left-icon-wrapper"
          @focusout="onBlur"
        >
          <slot name="leftIcon" />
        </span>
        <textarea
          v-if="isTextarea"
          ref="input"
          :value="value"
          :name="name"
          :disabled="disabled"
          :class="inputClasses()"
          v-bind="$attrs"
          data-qa="dt-input-input"
          v-on="inputListeners"
        />
        <input
          v-else
          ref="input"
          :value="value"
          :name="name"
          :type="type"
          :disabled="disabled"
          :class="inputClasses()"
          v-bind="$attrs"
          data-qa="dt-input-input"
          v-on="inputListeners"
        >
        <span
          v-if="$slots.rightIcon"
          :class="inputIconClasses('right')"
          data-qa="dt-input-right-icon-wrapper"
          @focusout="onBlur"
        >
          <slot name="rightIcon" />
        </span>
      </div>
    </label>
    <dt-validation-messages
      :validation-messages="formattedMessages"
      :show-messages="showMessages"
      :class="messagesClass"
      v-bind="messagesChildProps"
      data-qa="dt-input-messages"
    />
  </div>
</template>

<script>
import { DESCRIPTION_SIZE_TYPES } from '../constants.js';
import { INPUT_TYPES, INPUT_SIZES } from './input_constants.js';
import {
  getUniqueString,
  getValidationState,
} from '../utils';
import { DtValidationMessages } from '../validation_messages';
import { MessagesMixin } from '../mixins/input.js';

export default {
  name: 'DtInput',

  components: { DtValidationMessages },

  mixins: [MessagesMixin],

  inheritAttrs: false,

  props: {
    /**
     * Name property of the input element
     */
    name: {
      type: String,
      default: '',
    },

    /**
     * Type of the input, one of `text`, `password`, `email`, `number`, `textarea`.
     * When `textarea` a `<textarea>` element will be rendered instead of an `<input>` element.
     */
    type: {
      type: String,
      default: INPUT_TYPES.TEXT,
      validator: (t) => Object.values(INPUT_TYPES).includes(t),
    },

    /**
     * Value of the input
     */
    value: {
      type: [String, Number],
      default: '',
    },

    /**
     * Disables the input
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Label for the input
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Description for the input
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Size of the input, one of `xs`, `sm`, `md`, `lg`, `xl`
     */
    size: {
      type: String,
      default: INPUT_SIZES.DEFAULT,
      validator: (t) => Object.values(INPUT_SIZES).includes(t),
    },
  },

  emits: ['blur', 'input', 'clear'],

  computed: {

    isTextarea () {
      return this.type === INPUT_TYPES.TEXTAREA;
    },

    isDefaultSize () {
      return this.size === INPUT_SIZES.DEFAULT;
    },

    isValidSize () {
      return Object.values(INPUT_SIZES).includes(this.size);
    },

    isValidDescriptionSize () {
      return Object.values(DESCRIPTION_SIZE_TYPES).includes(this.size);
    },

    inputComponent () {
      if (this.isTextarea) {
        return 'textarea';
      }

      return 'input';
    },

    inputListeners () {
      return {
        /* TODO
            Check if any usages of this component leverage $listeners and either remove if unused or scope the removal
            and migration prior to upgrading to Vue 3.x
        */
        ...this.$listeners,
        input: event => this.$emit('input', event.target.value),
        blur: event => this.onBlur(event),
      };
    },

    descriptionKey () {
      return `input-description-${getUniqueString()}`;
    },

    inputState () {
      return getValidationState(this.formattedMessages);
    },

    showInputState () {
      return this.showMessages && this.inputState;
    },

    sizeModifierClass () {
      if (this.isDefaultSize || !this.isValidSize) {
        return '';
      }

      return `d-${this.inputComponent}--${this.size}`;
    },
  },

  methods: {
    inputClasses () {
      return [
        'base-input__input',
        `d-${this.inputComponent}`,
        {
          [`d-${this.inputComponent}--${this.inputState} base-input__input--${this.inputState}`]: this.showInputState,
          'd-input-icon--left': this.$slots.leftIcon,
          'd-input-icon--right': this.$slots.rightIcon,
        },
        this.sizeModifierClass,
      ];
    },

    inputIconClasses (side) {
      return [
        `base-input__icon--${side}`,
        'd-input-icon',
        `d-input-icon--${side}`,
        { [`d-input-icon--${this.size}`]: !this.isDefaultSize },
      ];
    },

    onBlur (e) {
      // Do not emit a blur event if the target element is a child of this component
      if (!this.$refs.container?.contains(e.relatedTarget)) {
        this.$emit('blur', e);
      }
    },

    clear () {
      this.$emit('input', '');
      this.$emit('clear');
    },

    blur () {
      this.$refs.input.blur();
    },

    focus () {
      this.$refs.input.focus();
    },

    select () {
      this.$refs.input.select();
    },

    getMessageKey (type, index) {
      return `message-${type}-${index}`;
    },
  },
};
</script>

<style lang="less">
</style>
