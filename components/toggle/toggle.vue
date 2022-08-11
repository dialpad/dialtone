<template>
  <div class="d-d-flex d-ai-center">
    <label
      v-if="$slots.default"
      :class="labelClass"
      :for="id"
      v-bind="labelChildProps"
      data-qa="toggle-label"
    >
      <slot />
    </label>
    <button
      :id="id"
      role="switch"
      type="button"
      :aria-checked="internalChecked.toString()"
      :disabled="disabled"
      :aria-disabled="disabled.toString()"
      :class="['d-toggle', {
        'd-toggle--checked': internalChecked,
        'd-toggle--disabled': disabled,
      }]"
      v-bind="inputListeners"
    >
      <span class="d-toggle__inner" />
    </button>
  </div>
</template>

<script>
import { warn } from 'vue';
import utils from '@/common/utils';

export default {

  name: 'DtToggle',

  inheritAttrs: false,

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {

    id: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * @model checked
     */
    checked: {
      type: Boolean,
      default: false,
    },

    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

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
