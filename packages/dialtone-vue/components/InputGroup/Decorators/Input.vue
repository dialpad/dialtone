<!--
  Decorator used for storybook documentation and unit tests.
-->
<template>
  <div>
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
        <dt-text
          kind="label"
          :size="resolvedLabelSize"
          strength="normal"
          :tone="internalDisabled ? 'disabled' : 'primary'"
          class="d-radio__copy d-radio__label"
          :class="labelClass"
          v-bind="labelChildProps"
          data-qa="input-decorator-label"
        >
          <!-- @slot slot for Input Decorator Label -->
          <slot>{{ label }}</slot>
        </dt-text>
      </div>
    </label>
  </div>
</template>

<script>
import { RADIO_INPUT_VALIDATION_CLASSES } from '@/components/Radio';
import {
  InputMixin,
  GroupableMixin,
} from '@/common/mixins/input';
import { DtText, TEXT_SIZE_MODIFIERS } from '@/components/Text';

export default {
  name: 'InputDecorator',

  components: { DtText },

  mixins: [InputMixin, GroupableMixin],

  inheritAttrs: false,

  props: {
    /**
     * Overrides the label text size.
     * @values 100, 200, 300, 400
     */
    labelSize: {
      type: [String, Number],
      default: null,
      validator: (s) => TEXT_SIZE_MODIFIERS.label.includes(String(s)),
    },
  },

  emits: [
    /**
     * Event fired to sync the modelValue prop with the parent component
     *
     * @event update:modelValue
     * @type {String}
     */
    'update:modelValue',
  ],

  computed: {
    resolvedLabelSize () {
      return this.labelSize ?? 300;
    },

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
          this.internalChecked = newGroupValue === this.modelValue;
        }
      },
    },
  },

  methods: {
    emitValue (value) {
      if (value !== this.groupValue) {
        // update provided value if injected
        this.setGroupValue(value);

        this.$emit('update:modelValue', value);
      }
    },
  },
};
</script>
