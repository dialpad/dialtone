<template>
  <div
    ref="container"
    class="base-input"
    data-qa="dt-input"
  >
    <!-- @slot slot for Icon -->
    <slot name="icon" />
    <label
      class="base-input__label"
      :aria-details="$slots.description || description ? descriptionKey : undefined"
      data-qa="dt-input-label"
    >
      <!-- @slot slot for label, defaults to label prop -->
      <slot name="labelSlot">
        <div :class="['base-input__label-text', 'd-label', 'd-margin-bottom2', labelSizeModifierClass]">
          {{ label }}
        </div>
      </slot>
      <div
        v-if="$slots.description || description"
        :id="descriptionKey"
        :class="['d-description', 'd-margin-bottom2', descriptionSizeModifierClass]"
        data-qa="dt-input-description"
      >
        <!-- @slot slot for description, defaults to description prop -->
        <slot name="description">{{ description }}</slot>
      </div>
      <div class="d-d-flex d-ai-center">
        <div
          v-if="$slots.innerLeft"
          class="d-p-absolute d-z-index--base1 d-ml8 d-pl2 d-lh-none"
          @focusout="onBlur"
        >
          <slot name="innerLeft" />
        </div>
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
        <div class="d-p-relative">
          <div
            v-if="$slots.innerRight"
            class="d-z-index--base1 d-p0 d-m0 d-lh-none d-p-absolute d-ln24 d-tn8"
            @focusout="onBlur"
          >
            <slot name="innerRight" />
          </div>
        </div>
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
import { INPUT_TYPES, INPUT_SIZE_TYPES } from './input_constants.js';
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
     * Size of the input, one of `xs`, `sm`, `''`, `lg`, `xl`
     */
    size: {
      type: String,
      default: '',
      validator: (t) => Object.values(INPUT_SIZE_TYPES).includes(t),
    },
  },

  emits: ['blur', 'input', 'clear'],

  computed: {

    isTextarea () {
      return this.type === INPUT_TYPES.TEXTAREA;
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
      if (!this.size || !Object.values(INPUT_SIZE_TYPES).includes(this.size)) {
        return '';
      }

      return `d-${this.inputComponent}--${this.size}`;
    },

    labelSizeModifierClass () {
      if (!this.size || !Object.values(INPUT_SIZE_TYPES).includes(this.size)) {
        return '';
      }
      return `d-label--${this.size}`;
    },

    descriptionSizeModifierClass () {
      if (!this.size || !Object.values(INPUT_SIZE_TYPES).includes(this.size)) {
        return '';
      }
      return `d-description--${this.size}`;
    },

  },

  methods: {
    inputClasses () {
      return [
        `d-${this.inputComponent}`,
        { [`d-${this.inputComponent}--${this.inputState} base-input__input--${this.inputState}`]: this.showInputState },
        { 'd-pl32': this.$slots.innerLeft },
        { 'd-pr32': this.$slots.innerRight },
        this.sizeModifierClass,
        'base-input__input',
      ];
    },

    onBlur (e) {
      // Do not emit a blur event if the target element is a child of this component
      if (!this.$refs.container.contains(e.relatedTarget)) {
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
.base-input .base-button__icon {
  margin: 0;
}
</style>
