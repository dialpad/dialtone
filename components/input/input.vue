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
          v-if="label"
          ref="label"
          data-qa="dt-input-label"
          :class="[
            'base-input__label-text',
            'd-label',
            labelSizeClasses[size],
          ]"
        >
          {{ label }}
        </div>
      </slot>
      <div
        v-if="$slots.description || description || shouldValidateLength"
        :id="descriptionKey"
        ref="description"
        :class="[
          'base-input__description',
          'd-description',
          'd-fd-column',
          descriptionSizeClasses[size],
        ]"
        data-qa="dt-input-description"
      >
        <div
          v-if="$slots.description || description"
        >
          <!-- @slot slot for description, defaults to description prop -->
          <slot name="description">{{ description }}</slot>
        </div>
        <div
          v-if="shouldValidateLength"
          data-qa="dt-input-length-description"
          :class="[
            'd-mb2',
          ]"
        >
          {{ validationProps.length.description }}
        </div>
      </div>
      <div
        :class="inputWrapperClasses()"
        :read-only="disabled"
      >
        <span
          v-if="$slots.leftIcon"
          :class="inputIconClasses('left')"
          data-qa="dt-input-left-icon-wrapper"
          @focusout="onBlur"
        >
          <!-- @slot Slot for left icon -->
          <slot name="leftIcon" />
        </span>
        <textarea
          v-if="isTextarea"
          ref="input"
          :value="value"
          :name="name"
          :disabled="disabled"
          :class="inputClasses()"
          :maxlength="shouldLimitMaxLength ? validationProps.length.max : null"
          data-qa="dt-input-input"
          v-bind="$attrs"
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
          :maxlength="shouldLimitMaxLength ? validationProps.length.max : null"
          data-qa="dt-input-input"
          v-bind="$attrs"
          v-on="inputListeners"
        >
        <span
          v-if="$slots.rightIcon"
          :class="inputIconClasses('right')"
          data-qa="dt-input-right-icon-wrapper"
          @focusout="onBlur"
        >
          <!-- @slot Slot for right icon -->
          <slot name="rightIcon" />
        </span>
      </div>
    </label>
    <dt-validation-messages
      :validation-messages="validationMessages"
      :show-messages="showMessages"
      :class="messagesClass"
      v-bind="messagesChildProps"
      data-qa="dt-input-messages"
    />
  </div>
</template>

<script>
import { DESCRIPTION_SIZE_TYPES, VALIDATION_MESSAGE_TYPES } from '@/common/constants.js';
import { INPUT_TYPES, INPUT_SIZES } from './input_constants.js';
import {
  getUniqueString,
  getValidationState,
} from '@/common/utils';
import { DtValidationMessages } from '@/components/validation_messages';
import { MessagesMixin } from '@/common/mixins/input.js';

/**
 * An input field is an input control that allows users to enter alphanumeric information.
 * It can have a range of options and supports single line and multi-line lengths,
 * as well as varying formats, including numbers, masked passwords, etc.
 * @property {Boolean} placeholder attribute
 * @see https://dialpad.design/components/input.html
 */
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
     * Type of the input, one of: `text`, `password`, `email`, `number`, `textarea`.
     * When `textarea` a `<textarea>` element will be rendered instead of an `<input>` element.
     * @values text, password, email, number, textarea.
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
     * @values true, false
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
     * @values null, xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: null,
      validator: (t) => Object.values(INPUT_SIZES).includes(t),
    },

    /**
     * Size of the icon. One of `xs`, `sm`, `md`, `lg`, `xl`. If you do not set this the icon will size relative
     * to the input size
     * @values null, xs, sm, md, lg, xl
     */
    iconSize: {
      type: String,
      default: null,
      validator: (t) => Object.values(INPUT_SIZES).includes(t),
    },

    /**
     * Additional class name for the input element.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    inputClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Additional class name for the input wrapper element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    inputWrapperClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * The current character length that the user has entered into the input.
     * This will only need to be used if you are using `validate.length` and
     * the string contains abnormal characters.
     * For example, an emoji could take up many characters in the input, but should only count as 1 character.
     * If no number is provided, a built-in length calculation will be used for the length validation.
     */
    currentLength: {
      type: Number,
      default: null,
    },

    /**
     * Validation for the input. Supports maximum length validation with the structure:
     * `{ "length": {"description": string, "max": number, "warn": number, "message": string,
     * "limitMaxLength": boolean }}`
     */
    validate: {
      type: Object,
      default: null,
    },
  },

  emits: [
    /**
     * Native input event
     *
     * @event input
     * @type {String}
     */
    'input',

    /**
     * Native input blur event
     *
     * @event blur
     * @type {FocusEvent}
     */
    'blur',

    /**
     * Input clear event
     *
     * @event clear
     */
    'clear',

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
     * @type {FocusEvent}
     */
    'focusin',

    /**
     * Native input focusout event
     *
     * @event focusout
     * @type {FocusEvent}
     */
    'focusout',

    /**
     * Length of the input when currentLength prop is not passed
     *
     * @event update:length
     * @type {Number}
     */
    'update:length',

    /**
     * Result of the input validation
     *
     * @event update:invalid
     * @type {Boolean}
     */
    'update:invalid',
  ],

  data () {
    return {
      descriptionSizeClasses: {
        lg: 'd-description--lg',
        xl: 'd-description--xl',
      },

      labelSizeClasses: {
        xs: 'd-label--xs',
        sm: 'd-label--sm',
        md: 'd-label--md',
        lg: 'd-label--lg',
        xl: 'd-label--xl',
      },

      isInputFocused: false,

      isInvalid: false,

      defaultLength: 0,
    };
  },

  computed: {

    isTextarea () {
      return this.type === INPUT_TYPES.TEXTAREA;
    },

    isDefaultSize () {
      return this.size === INPUT_SIZES.DEFAULT;
    },

    isDefaultIconSize () {
      return this.iconSizeComputed === INPUT_SIZES.DEFAULT;
    },

    iconSizeComputed () {
      return this.iconSize ? this.iconSize : this.size;
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
        focus: event => {
          this.isInputFocused = true;
          this.$emit('focus', event);
        },

        blur: event => {
          this.isInputFocused = false;
          this.onBlur(event);
        },
      };
    },

    descriptionKey () {
      return `input-description-${getUniqueString()}`;
    },

    inputState () {
      return getValidationState(this.validationMessages);
    },

    defaultLengthCalculation () {
      return this.calculateLength(this.value);
    },

    validationProps () {
      return {
        length: {
          description: this?.validate?.length?.description,
          max: this?.validate?.length?.max,
          warn: this?.validate?.length?.warn,
          message: this?.validate?.length?.message,
          limitMaxLength: this?.validate?.length?.limitMaxLength ? this.validate.length.limitMaxLength : false,
        },
      };
    },

    validationMessages () {
      // Add length validation message if exists
      if (this.showLengthLimitValidation) {
        return this.formattedMessages.concat([this.inputLengthErrorMessage()]);
      }

      return this.formattedMessages;
    },

    showInputState () {
      return this.showMessages && this.inputState;
    },

    inputLength () {
      return this.currentLength ? this.currentLength : this.defaultLengthCalculation;
    },

    inputLengthState () {
      if (this.inputLength < this.validationProps.length.warn) {
        return null;
      } else if (this.inputLength < this.validationProps.length.max) {
        return this.validationProps.length.warn ? VALIDATION_MESSAGE_TYPES.WARNING : null;
      } else {
        return VALIDATION_MESSAGE_TYPES.ERROR;
      }
    },

    shouldValidateLength () {
      return !!(
        this.validationProps.length.description &&
        this.validationProps.length.max
      );
    },

    shouldLimitMaxLength () {
      return this.shouldValidateLength && this.validationProps.length.limitMaxLength;
    },

    showLengthLimitValidation () {
      return (
        this.shouldValidateLength &&
        this.inputLengthState !== null &&
        this.validationProps.length.message &&
        (this.isInputFocused || this.isInvalid)
      );
    },

    sizeModifierClass () {
      if (this.isDefaultSize || !this.isValidSize) {
        return '';
      }

      const sizeClasses = {
        input: {
          xs: 'd-input--xs',
          sm: 'd-input--sm',
          lg: 'd-input--lg',
          xl: 'd-input--xl',
        },

        textarea: {
          xs: 'd-textarea--xs',
          sm: 'd-textarea--sm',
          lg: 'd-textarea--lg',
          xl: 'd-textarea--xl',
        },
      };

      return sizeClasses[this.inputComponent][this.size];
    },

    stateClass () {
      const inputStateClasses = {
        input: {
          error: 'd-input--error base-input__input--error',
          warning: 'd-input--warning base-input__input--warning',
          success: 'd-input--success base-input__input--success',
        },

        textarea: {
          error: 'd-textarea--error base-input__input--error',
          warning: 'd-textarea--warning base-input__input--warning',
          success: 'd-textarea--success base-input__input--success',
        },
      };
      return [inputStateClasses[this.inputComponent][this.inputState]];
    },
  },

  watch: {
    isInvalid (val) {
      this.$emit('update:invalid', val);
    },

    value: {
      immediate: true,
      handler (newValue) {
        if (this.shouldValidateLength) {
          this.validateLength(this.inputLength);
        }

        if (this.currentLength == null) {
          this.$emit('update:length', this.calculateLength(newValue));
        }
      },
    },
  },

  methods: {
    inputClasses () {
      return [
        'base-input__input',
        this.inputComponent === 'input' ? 'd-input' : 'd-textarea',
        {
          [this.stateClass]: this.showInputState,
          'd-input-icon--left': this.$slots.leftIcon,
          'd-input-icon--right': this.$slots.rightIcon,
        },
        this.sizeModifierClass,
        this.inputClass,
      ];
    },

    inputWrapperClasses () {
      return [
        'd-input__wrapper',
        { [this.stateClass]: this.showInputState },
        this.inputWrapperClass,
      ];
    },

    calculateLength (value) {
      if (typeof value !== 'string') {
        return 0;
      }

      return [...value].length;
    },

    inputLengthErrorMessage () {
      return {
        message: this.validationProps.length.message,
        type: this.inputLengthState,
      };
    },

    inputIconClasses (side) {
      const iconSizeClasses = {
        xs: 'd-input-icon--xs',
        sm: 'd-input-icon--sm',
        lg: 'd-input-icon--lg',
        xl: 'd-input-icon--xl',
      };
      const iconOrientationClasses = {
        left: 'base-input__icon--left d-input-icon--left',
        right: 'base-input__icon--right d-input-icon--right',
      };

      return [
        iconOrientationClasses[side],
        'd-input-icon',
        { [iconSizeClasses[this.iconSizeComputed]]: !this.isDefaultIconSize },
        this.sizeModifierClass,
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

    validateLength (length) {
      this.isInvalid = (length > this.validationProps.length.max);
    },
  },
};
</script>
