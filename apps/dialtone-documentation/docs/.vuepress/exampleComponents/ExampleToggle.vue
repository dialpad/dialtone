<template>
  <div class="d-toggle-copy">
    <label
      class="d-toggle-label"
      :for="id"
      v-text="label"
    />
  </div>
  <div class="d-toggle-button">
    <button
      :id="id"
      class="d-toggle"
      :class="toggleClasses"
      :aria-checked="toggleAriaChecked"
      :disabled="disabled"
      type="button"
      :role="toggleRole"
      @click="toggleState"
    >
      <span class="d-toggle__inner" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ExampleToggle',
  props: {
    id: {
      type: String,
      default: 'Dialtone-Toggle',
    },

    label: {
      type: String,
      default: '',
    },

    checked: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    indeterminate: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      isChecked: this.checked,
      isIndeterminate: this.indeterminate,
    };
  },

  computed: {
    toggleClasses () {
      return [
        {
          'd-toggle--checked': this.isChecked,
          'd-toggle--indeterminate': this.isIndeterminate,
          [`d-toggle--${this.size}`]: this.size,
        },
      ];
    },

    toggleRole () {
      return this.isIndeterminate ? 'checkbox' : 'switch';
    },

    toggleAriaChecked () {
      return this.isIndeterminate ? 'mixed' : this.isChecked;
    },
  },

  methods: {
    toggleState () {
      this.isIndeterminate = null;
      this.isChecked = !this.isChecked;
    },
  },
};
</script>
