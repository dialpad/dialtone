<template>
  <div class="d-d-flex d-ai-center">
    <label
      v-if="hasSlotContent($slots.default)"
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
      :role="toggleRole"
      type="button"
      :aria-checked="internalChecked.toString()"
      :disabled="disabled"
      :aria-disabled="disabled.toString()"
      :class="toggleClasses"
      v-bind="inputListeners"
    >
      <span
        v-if="showIcon"
        class="d-toggle__inner"
      />
    </button>
  </div>
</template>

<script>
import { warn } from 'vue';
import { getUniqueString, hasSlotContent } from '@/common/utils';
import { TOGGLE_CHECKED_VALUES, TOGGLE_SIZE_MODIFIERS } from '@/components/toggle/toggle_constants';

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
      default () { return getUniqueString(); },
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
     * @values true, false, 'mixed'
     */
    checked: {
      type: [Boolean, String],
      default: false,
      validator: (v) => TOGGLE_CHECKED_VALUES.includes(v),
    },

    /**
     * Whether the component toggles on click. If you set this to false it means you will handle the toggling manually
     * via the checked prop or v-model. Change events will still be triggered.
     * @values true, false
     */
    toggleOnClick: {
      type: Boolean,
      default: true,
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
     * Shows the icon
     * @values true, false
     */
    showIcon: {
      type: Boolean,
      default: true,
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
      hasSlotContent,
    };
  },

  computed: {
    inputListeners () {
      return {
        ...this.$attrs,
        onClick: _ => this.toggleCheckedValue(),
      };
    },

    isIndeterminate () {
      return this.internalChecked === 'mixed';
    },

    toggleRole () {
      return this.isIndeterminate ? 'checkbox' : 'switch';
    },

    toggleClasses () {
      return [
        'd-toggle',
        TOGGLE_SIZE_MODIFIERS[this.size],
        {
          'd-toggle--checked': this.internalChecked === true,
          'd-toggle--disabled': this.disabled,
          'd-toggle--indeterminate': this.isIndeterminate,
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
      this.$emit('change', !this.internalChecked);

      if (this.toggleOnClick) {
        this.internalChecked = !this.internalChecked;
      }
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
