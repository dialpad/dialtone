<template>
  <div class="d-d-flex d-ai-center">
    <label
      v-if="$slots.default"
      :class="labelClass"
      :for="id"
      v-bind="labelChildProps"
      data-qa="toggle-label"
    >
      <!-- @slot Slot for the main content -->
      <slot />
    </label>
    <button
      :id="id"
      role="switch"
      type="button"
      :aria-checked="internalChecked.toString()"
      :disabled="disabled"
      :aria-disabled="disabled.toString()"
      :class="toggleClasses"
      v-bind="inputListeners"
    >
      <span class="d-toggle__inner" />
    </button>
  </div>
</template>

<script>
import { warn } from 'vue';
import utils from '@/common/utils';
import { TOGGLE_SIZE_MODIFIERS } from '@/components/toggle/toggle_constants';

/**
 * A toggle (or "switch") is a button control element that allows the user to make a binary (on/off) selection.
 * @see https://dialpad.design/components/toggle.html
 */
export default {

  name: 'DtToggle',

  inheritAttrs: false,

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {

    /**
     * The id of the toggle
     */
    id: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    /**
     * Disables the toggle interactions
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Value of the toggle
     * @model checked
     * @values true, false
     */
    checked: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the toggle.
     * @values sm, md
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(TOGGLE_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
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
  },

  emits: [
    /**
     * Toggle change event
     *
     * @event change
     * @type {Boolean}
     * @model change
     */
    'change',
  ],

  data () {
    return {
      internalChecked: this.checked,
    };
  },

  computed: {
    inputListeners () {
      return {
        ...this.$attrs,
        onClick: _ => this.toggleCheckedValue(),
      };
    },

    toggleClasses () {
      return [
        'd-toggle',
        TOGGLE_SIZE_MODIFIERS[this.size],
        {
          'd-toggle--checked': this.internalChecked,
          'd-toggle--disabled': this.disabled,

        },
      ];
    },
  },

  watch: {
    checked (newChecked) {
      this.internalChecked = newChecked;
    },
  },

  mounted () {
    this.runValidations();
  },

  methods: {
    toggleCheckedValue () {
      this.internalChecked = !this.internalChecked;
      this.$emit('change', this.internalChecked);
    },

    hasSlotLabel () {
      return !!(this.$slots.default);
    },

    runValidations () {
      this.validateInputLabels(this.hasSlotLabel(), this.$attrs['aria-label']);
    },

    validateInputLabels (hasLabel, ariaLabel) {
      if (!hasLabel && !ariaLabel) {
        warn(
          'You must provide an aria-label when there is no label passed',
          this,
        );
      }
    },
  },
};
</script>
