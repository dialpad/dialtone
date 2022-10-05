<!--
  Decorator used for storybook documentation and unit tests.
-->
<template>
  <label>
    <div class="d-radio-group">
      <input
        type="radio"
        class="d-radio"
        :checked="internalChecked"
        :name="internalName"
        :value="value"
        :disabled="internalDisabled"
        :class="[inputValidationClass, inputClass]"
        v-bind="$attrs"
        v-on="inputListeners"
      >
      <span
        class="d-radio__copy d-radio__label"
        :class="labelClass"
        v-bind="labelChildProps"
        data-qa="input-decorator-label"
      >
        <!-- @slot slot for Input Decorator Label -->
        <slot>{{ label }}</slot>
      </span>
    </div>
  </label>
</template>

<script>
import { RADIO_INPUT_VALIDATION_CLASSES } from '../../radio/radio_constants';
import {
  InputMixin,
  GroupableMixin,
} from '@/common/mixins/input';

export default {
  name: 'InputDecorator',

  mixins: [InputMixin, GroupableMixin],

  inheritAttrs: false,

  emits: [
    /**
     * Native input event
     *
     * @event input
     * @type {String}
     */
    'input',
  ],

  computed: {
    inputValidationClass () {
      return RADIO_INPUT_VALIDATION_CLASSES[this.internalValidationState];
    },

    groupValue () {
      return this.groupContext?.value;
    },

    inputListeners () {
      return {
        change: event => this.emitValue(event.target.value),
      };
    },
  },

  watch: {
    groupValue: {
      immediate: true,
      handler (newGroupValue) {
        if (this.hasGroup) {
          // update internal value when the input group value changes
          this.internalChecked = newGroupValue === this.value;
        }
      },
    },
  },

  methods: {
    emitValue (value) {
      if (value !== this.groupValue) {
        // update provided value if injected
        this.setGroupValue(value);

        this.$emit('input', value);
      }
    },
  },
};
</script>
