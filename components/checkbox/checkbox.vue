<template>
  <label>
    <div :class="['d-checkbox-group', { 'd-checkbox-group--disabled': internalDisabled }]">
      <div class="d-checkbox__input">
        <input
          type="checkbox"
          :checked="internalChecked"
          :name="internalName"
          :value="value"
          :disabled="internalDisabled"
          :class="['d-checkbox', inputValidationClass, inputClass]"
          v-bind="$attrs"
          :indeterminate.prop="internalIndeterminate"
          v-on="inputListeners"
        >
      </div>
      <div
        v-if="hasLabelOrDescription"
        class="d-checkbox__copy d-checkbox__label"
        data-qa="checkbox-label-description-container"
      >
        <div
          v-if="hasLabel"
          :class="labelClass"
          v-bind="labelChildProps"
          data-qa="checkbox-label"
        >
          <!-- @slot slot for Checkbox Label -->
          <slot>{{ label }}</slot>
        </div>
        <div
          v-if="hasDescription"
          :class="['d-description', descriptionClass]"
          v-bind="descriptionChildProps"
          data-qa="checkbox-description"
        >
          <!-- @slot slot for Checkbox Description -->
          <slot name="description">{{ description }}</slot>
        </div>
        <dt-validation-messages
          :validation-messages="formattedMessages"
          :show-messages="showMessages"
          :class="messagesClass"
          v-bind="messagesChildProps"
          data-qa="dt-checkbox-validation-messages"
        />
      </div>
    </div>
  </label>
</template>

<script>
// Imports
import {
  InputMixin,
  CheckableMixin,
  GroupableMixin,
  MessagesMixin,
} from '../../common/mixins/input';
import { CHECKBOX_INPUT_VALIDATION_CLASSES } from './checkbox_constants';
import { DtValidationMessages } from '../validation_messages';

/**
 * Checkboxes are control elements that allow the user to make a selection.They are typically used in a
 * Checkbox Group which allows the user to make one or more selections from a list of options.
 * @see https://dialpad.design/components/checkbox.html
 */
export default {
  name: 'DtCheckbox',

  components: { DtValidationMessages },

  mixins: [InputMixin, CheckableMixin, GroupableMixin, MessagesMixin],

  inheritAttrs: false,

  emits: [
    /**
     * Native input event
     *
     * @event input
     * @type {Boolean}
     */
    'input',

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
  ],

  computed: {
    inputValidationClass () {
      return CHECKBOX_INPUT_VALIDATION_CLASSES[this.internalValidationState];
    },

    checkboxGroupValueChecked () {
      return this.groupContext?.selectedValues?.includes(this.value) ?? false;
    },

    hasLabel () {
      return !!(this.$slots.default || this.label);
    },

    hasDescription () {
      return !!(this.$slots.description || this.description);
    },

    hasLabelOrDescription () {
      return this.hasLabel || this.hasDescription;
    },

    inputListeners () {
      return {
        /* TODO
            Check if any usages of this component leverage $listeners and either remove if unused or scope the removal
            and migration prior to upgrading to Vue 3.x
        */
        ...this.$listeners,
        /*
         * Override input listener to as no-op. Prevents parent input listeners from being passed through onto the input
         * element which will result in the hander being called twice (once on the input element and once by the emitted
         * input event by the change listener).
        */
        input: () => {},
        change: event => this.emitValue(event.target),
      };
    },
  },

  watch: {
    checkboxGroupValueChecked: {
      immediate: true,
      handler (newCheckboxGroupValueChecked) {
        if (this.hasGroup) {
          // update internal value when the checkbox group value changes
          this.internalChecked = newCheckboxGroupValueChecked;
        }
      },
    },
  },

  mounted () {
    this.runValidations();
  },

  methods: {
    emitValue (target) {
      let { value, checked } = target;
      // Expected: Indeterminate -> unchecked. We need to manually set DOM property `checked` to false
      // and update this.internalIndeterminate.
      if (this.internalIndeterminate) {
        checked = false;
        this.internalIndeterminate = false;
        target.checked = false;
      }
      // update provided value if injected
      this.setGroupValue(value, checked);

      // emit the state of the checkbox
      this.$emit('input', checked);
    },

    runValidations () {
      this.validateInputLabels(this.hasLabel, this.$attrs['aria-label']);
    },
  },
};
</script>
