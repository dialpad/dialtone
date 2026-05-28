<template>
  <div
    ref="container"
    :class="['d-input__root', { 'd-input--hidden': hidden }, $attrs.class]"
    :style="$attrs.style"
    data-qa="dt-input"
  >
    <label
      class="d-input__label"
      :aria-details="$slots.description || description ? descriptionKey : undefined"
      data-qa="dt-input-label-wrapper"
    >
      <!-- @slot Slot for label, defaults to label prop -->
      <slot name="label">
        <dt-text
          v-if="showLabel && label"
          ref="label"
          data-qa="dt-input-label"
          kind="label"
          :size="resolvedLabelSize"
          :strength="labelStrength"
          tone="secondary"
          :class="['d-input__label-text', labelClass]"
        >
          {{ label }}
        </dt-text>
      </slot>
      <dt-text
        v-if="hasSlotContent($slots.description) || description || shouldValidateLength"
        :id="descriptionKey"
        ref="description"
        kind="body"
        :size="resolvedDescriptionSize"
        tone="tertiary"
        :density="resolvedDescriptionDensity"
        as="div"
        :class="[
          'd-input__description',
          'd-description',
          descriptionClass,
        ]"
        data-qa="dt-input-description"
      >
        <div
          v-if="hasSlotContent($slots.description) || description"
        >
          <!-- @slot Slot for description, defaults to description prop -->
          <slot name="description">{{ description }}</slot>
        </div>
        <div
          v-if="shouldValidateLength"
          data-qa="dt-input-length-description"
          class="d-input__length-description"
        >
          {{ validationProps.length.description }}
        </div>
      </dt-text>
      <div
        :class="inputWrapperClasses()"
        :read-only="disabled === true ? true : undefined"
      >
        <span
          :class="['d-input-icon', 'd-input-icon--left', startIconClass]"
          data-qa="dt-input-left-icon-wrapper"
          @focusout="onBlur"
        >
          <!-- @slot Slot for start icon -->
          <slot
            v-if="$slots.startIcon"
            name="startIcon"
            :icon-size="iconSize"
          />
          <!-- @slot @deprecated Use startIcon -->
          <slot
            v-else
            name="leftIcon"
            :icon-size="iconSize"
          />
        </span>
        <textarea
          v-if="isTextarea"
          ref="input"
          :name="name"
          :disabled="disabled"
          :autocomplete="$attrs.autocomplete ?? 'off'"
          :class="inputClasses()"
          :maxlength="shouldLimitMaxLength ? validationProps.length.max : null"
          :aria-label="!showLabel && label ? label : undefined"
          :aria-invalid="ariaInvalid"
          :aria-describedby="ariaDescribedBy"
          data-qa="dt-input-input"
          v-bind="removeClassStyleAttrs($attrs)"
          v-on="inputListeners"
        />
        <input
          v-else
          ref="input"
          :value="modelValue"
          :name="name"
          :type="type"
          :disabled="disabled"
          :autocomplete="$attrs.autocomplete ?? 'off'"
          :class="inputClasses()"
          :maxlength="shouldLimitMaxLength ? validationProps.length.max : null"
          :aria-label="!showLabel && label ? label : undefined"
          :aria-invalid="ariaInvalid"
          :aria-describedby="ariaDescribedBy"
          data-qa="dt-input-input"
          v-bind="removeClassStyleAttrs($attrs)"
          v-on="inputListeners"
        >
        <span
          :class="['d-input-icon', 'd-input-icon--right', endIconClass]"
          data-qa="dt-input-right-icon-wrapper"
          @focusout="onBlur"
        >
          <!-- @slot Slot for end icon -->
          <slot
            v-if="$slots.endIcon"
            name="endIcon"
            :icon-size="iconSize"
            :clear="clearInput"
          />
          <!-- @slot @deprecated Use endIcon -->
          <slot
            v-else
            name="rightIcon"
            :icon-size="iconSize"
            :clear="clearInput"
          />
        </span>
      </div>
    </label>
    <dt-validation-messages
      v-bind="messagesChildProps"
      :id="messagesId"
      :validation-messages="validationMessages"
      :show-messages="showMessages"
      :class="messagesClass"
      data-qa="dt-input-messages"
    />
  </div>
</template>

<script>
/* eslint-disable max-lines */
import { DESCRIPTION_SIZE_TYPES, VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import {
  INPUT_TYPES,
  INPUT_SIZES,
  INPUT_SIZE_CLASSES,
  INPUT_ICON_SIZES,
  INPUT_STATE_CLASSES,
} from './InputConstants';
import {
  getUniqueString,
  getValidationState,
  hasSlotContent,
  removeClassStyleAttrs,
} from '@/common/utils';
import { DtValidationMessages } from '@/components/ValidationMessages';
import { DtText, TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '@/components/Text';
import { MessagesMixin } from '@/common/mixins/input';

/**
 * An input field is an input control that allows users to enter alphanumeric information.
 * It can have a range of options and supports single line and multi-line lengths,
 * as well as varying formats, including numbers, masked passwords, etc.
 * @property {Boolean} placeholder attribute
 * @see https://dialtone.dialpad.com/components/input.html
 */
export default {
  name: 'DtInput',

  components: { DtValidationMessages, DtText },

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
     * Type of the input.
     * When `textarea` a `<textarea>` element will be rendered instead of an `<input>` element.
     * @values text, password, email, number, textarea, date, time, file, tel, search, color
     * @default 'text'
     */
    type: {
      type: String,
      default: INPUT_TYPES.TEXT,
      validator: (t) => Object.values(INPUT_TYPES).includes(t),
    },

    /**
     * Value of the input
     */
    modelValue: {
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
     * Label for the input.
     * Can also be overridden with a slot of the same name.
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Determines visibility of input label.
     * @values true, false
     */
    showLabel: {
      type: Boolean,
      default: true,
    },

    /**
     * Description for the input
     */
    description: {
      type: String,
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
     * Size of the input.
     * @values 100, 200, 300, 400, 500
     */
    size: {
      type: [String, Number],
      default: 300,
      validator: (t) => Object.keys(INPUT_ICON_SIZES).includes(String(t)),
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
     * Can accept all of: String, Object, and Array, i.e. has the
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
     * Whether the input will continue to display a warning validation message even if the input has lost focus.
     */
    retainWarning: {
      type: Boolean,
      default: false,
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

    /**
     * hidden allows to use input without the element visually present in DOM
     */
    hidden: {
      type: Boolean,
      default: false,
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

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the start icon container
     */
    startIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the end icon container
     */
    endIconClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: [
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
     * Event fired to sync the modelValue prop with the parent component
     * @event update:modelValue
     * @type {String | Number}
     */
    'update:modelValue',

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
      isInputFocused: false,
      isInvalid: false,
      defaultLength: 0,
      hasSlotContent,
      isComposing: false,
      justEndedComposition: false,
      messagesId: getUniqueString(),
    };
  },

  computed: {

    isTextarea () {
      return this.type === INPUT_TYPES.TEXTAREA;
    },

    isDefaultSize () {
      return String(this.size) === INPUT_SIZES.DEFAULT || String(this.size) === '300';
    },

    iconSize () {
      return INPUT_ICON_SIZES[String(this.size)];
    },

    isValidSize () {
      return Object.keys(INPUT_ICON_SIZES).includes(String(this.size));
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
        compositionstart: () => {
          this.isComposing = true;
        },

        compositionend: () => {
          this.isComposing = false;
          this.justEndedComposition = true;
          const val = this.$refs.input.value;
          this.$emit('update:modelValue', val);
          // Clear the flag after the current synchronous event processing so
          // Firefox's post-compositionend input event is skipped, but the
          // next real user input (a separate browser task) is not.
          Promise.resolve().then(() => { this.justEndedComposition = false; });
        },

        input: async event => {
          if (this.isComposing) return;
          if (this.justEndedComposition) return;
          let val = event.target.value;
          if (this.type === INPUT_TYPES.FILE) {
            const files = Array.from(event.target.files);
            val = files.map(file => file.name);
          }
          this.$emit('update:modelValue', val);
        },

        blur: event => {
          this.isInputFocused = false;
          this.onBlur(event);
        },

        focus: event => {
          this.isInputFocused = true;
          this.$emit('focus', event);
        },

        focusin: event => this.$emit('focusin', event),
        focusout: event => this.$emit('focusout', event),
      };
    },

    descriptionKey () {
      return `input-description-${getUniqueString()}`;
    },

    inputState () {
      return getValidationState(this.validationMessages);
    },

    ariaInvalid () {
      return this.inputState === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
    },

    ariaDescribedBy () {
      return this.showMessages && this.validationMessages.length > 0 ? this.messagesId : undefined;
    },

    defaultLengthCalculation () {
      return this.calculateLength(this.modelValue);
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
      } else if (this.inputLength <= this.validationProps.length.max) {
        return this.validationProps.length.warn ? VALIDATION_MESSAGE_TYPES.WARNING : null;
      } else {
        return VALIDATION_MESSAGE_TYPES.CRITICAL;
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
        (this.retainWarning || this.isInputFocused || this.isInvalid)
      );
    },

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

    sizeModifierClass () {
      if (this.isDefaultSize || !this.isValidSize) {
        return '';
      }

      return INPUT_SIZE_CLASSES[this.inputComponent][String(this.size)];
    },

    stateClass () {
      return [INPUT_STATE_CLASSES[this.inputState]];
    },
  },

  watch: {
    isInvalid (val) {
      this.$emit('update:invalid', val);
    },

    modelValue: {
      immediate: true,
      handler (newValue) {
        if (this.shouldValidateLength) {
          this.validateLength(this.inputLength);
        }

        if (this.currentLength == null) {
          this.$emit('update:length', this.calculateLength(newValue));
        }

        // Set textarea value programmatically to avoid attribute binding
        // Skip during IME composition to avoid interrupting in-progress input
        if (this.isTextarea && !this.isComposing && this.$refs.input && this.$refs.input.value !== newValue) {
          this.$refs.input.value = newValue;
        }
      },
    },
  },

  mounted () {
    // Set initial textarea value programmatically
    if (this.isTextarea && this.$refs.input) {
      this.$refs.input.value = this.modelValue;
    }
    this.runValidations();
  },

  methods: {
    removeClassStyleAttrs,
    inputClasses () {
      return [
        'd-input__input',
        this.inputComponent === 'input' ? 'd-input' : 'd-textarea',
        {
          [this.stateClass]: this.showInputState,
          'd-input-icon--left': this.$slots.startIcon || this.$slots.leftIcon,
          'd-input-icon--right': this.$slots.endIcon || this.$slots.rightIcon,
        },
        this.sizeModifierClass,
        this.inputClass,
      ];
    },

    inputWrapperClasses () {
      if (this.hidden) {
        return [];
      }
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

    onBlur (e) {
      // Do not emit a blur event if the target element is a child of this component
      if (!this.$refs.container?.contains(e.relatedTarget)) {
        this.$emit('blur', e);
      }
    },

    emitClearEvents () {
      this.$emit('clear');
      this.$emit('update:modelValue', '');
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

    clearInput () {
      this.$refs.input.value = '';
      this.$refs.input.focus();
      this.emitClearEvents();
    },

    runValidations () {
      if (!this.label && !this.$attrs['aria-label']) {
        console.info(
          '[Dialtone] A label is required for accessibility. Provide a label prop and use show-label="false" to hide it visually.',
        );
      }
    },
  },
};
</script>
