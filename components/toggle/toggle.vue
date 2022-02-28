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
      v-bind="$attrs"
      v-on="inputListeners"
    >
      <span class="d-toggle__inner" />
    </button>
  </div>
</template>

<script>
import Vue from 'vue';
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

  emits: ['change'],

  data () {
    return {
      internalChecked: this.checked,
    };
  },

  computed: {

    inputListeners () {
      return {
        // eslint-disable-next-line vue/no-deprecated-dollar-listeners-api
        ...this.$listeners,
        click: _ => this.toggleCheckedValue(),
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
        Vue.util.warn(
          'You must provide an aria-label when there is no label passed',
          this,
        );
      }
    },
  },
};
</script>
