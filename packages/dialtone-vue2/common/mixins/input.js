import Vue from 'vue';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import { validationMessageValidator } from '@/common/validators';
import { formatMessages } from '@/common/utils';

/**
 * This mixin provides a base set of props, watchers and data attributes that are commonly used in our input components.
 * @displayName Input Mixin
 */
export const InputMixin = {
  inheritAttrs: false,

  props: {
    /**
     * A provided label for the input
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * The name of the input
     */
    name: {
      type: String,
      default: '',
    },

    /**
     * The value of the input
     * @model value
     */
    value: {
      type: [String, Number, Boolean, Object],
      default: null,
    },

    /**
     * Describes the input
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Disables the input
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * The validation state of the input
     */
    validationState: {
      type: String,
      default: '',
      validator: validationState => {
        if (!validationState) {
          return true;
        }

        return Object.values(VALIDATION_MESSAGE_TYPES).includes(validationState);
      },
    },

    /**
     * Used to customize the input element
     */
    inputClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
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
     * A set of props that are passed into the label container
     */
    labelChildProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * A set of props that are passed into the description container
     */
    descriptionChildProps: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      internalDisabled: this.disabled,
      internalValidationState: this.validationState,
    };
  },

  watch: {
    disabled (newDisabled) {
      // update internal disabled when the prop changes
      this.internalDisabled = newDisabled;
    },

    validationState (newValidationState) {
      // update internal validation state when the prop changes
      this.internalValidationState = newValidationState;
    },
  },

  methods: {
    /**
     * @param {Boolean | String} hasLabelOrLabel either a boolean indicating the label exists or the label itself
     * @param {String} ariaLabel the aria-label passed (null/undefined if it's not passed)
     */
    validateInputLabels (hasLabelOrLabel, ariaLabel) {
      if (!hasLabelOrLabel && !ariaLabel) {
        Vue.util.warn(
          'You must provide an aria-label when there is no label passed',
          this,
        );
      }
    },
  },
};

/**
 * This mixin provides common logic shared amongst our checkable inputs.
 *
 * This includes the group context, checked model & prop, internal data attributes as well as a set common computed
 * properties and watchers. It also includes the group name warning logic.
 * @displayName Checkable Mixin
 */
export const CheckableMixin = {
  model: {
    prop: 'checked',
  },

  props: {
    /**
     * Used to set the state of the checkable input
     * @model checked
     */
    checked: {
      type: Boolean,
      default: false,
    },
    /**
     * Indeterminate State, toggling indeterminate checkbox will uncheck
     */
    indeterminate: {
      type: Boolean,
      default: false,
    },
    /**
     * The value of the input
     */
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
  },

  data () {
    return {
      internalChecked: this.checked,
      internalIndeterminate: this.indeterminate,
    };
  },

  watch: {
    checked (newChecked) {
      // update internal checked when the prop changes
      this.internalChecked = newChecked;
    },

    indeterminate (newValue) {
      this.internalIndeterminate = newValue;
    },
  },
};

/**
 * This mixin provides common logic shared amongst our groupable inputs.
 *
 * This includes the group context and internal data attributes as well as a set common computed
 * properties and watchers. It also includes the group name warning logic.
 * @displayName Groupable Mixin
 */
export const GroupableMixin = {
  inject: {
    // Object used to pass data from the group
    groupContext: {
      default: {},
    },

    // Method used to update the group value
    setGroupValue: {
      default: () => { return () => {}; },
    },
  },

  data () {
    return {
      internalValue: this.value,
    };
  },

  computed: {
    hasGroup () {
      return Object.prototype.hasOwnProperty.call(this.groupContext, 'name');
    },

    groupName () {
      return this.groupContext?.name ?? '';
    },

    groupValue () {
      return this.groupContext?.value;
    },

    groupDisabled () {
      return this.groupContext?.disabled ?? false;
    },

    groupValidationState () {
      return this.groupContext?.validationState ?? null;
    },

    internalName () {
      return this.name || this.groupName;
    },
  },

  watch: {
    value (newValue) {
      // update internal value when the prop changes
      this.internalValue = newValue;
    },

    groupValue: {
      immediate: true,
      handler (newGroupValue) {
        if (this.hasGroup) {
          // update internal value when the group disabled changes
          this.internalValue = newGroupValue;
        }
      },
    },

    groupDisabled: {
      immediate: true,
      handler (newGroupDisabled) {
        if (this.hasGroup) {
          // update internal disabled when the group disabled changes
          this.internalDisabled = this.disabled || newGroupDisabled;
        }
      },
    },

    groupValidationState: {
      immediate: true,
      handler (newGroupValidationState) {
        if (this.hasGroup) {
          // update internal validation state when the group validation state changes
          this.internalValidationState = newGroupValidationState || this.validationState;
        }
      },
    },
  },

  created () {
    const hasGroupName = Object.prototype.hasOwnProperty.call(this.groupContext, 'name');
    const reactiveGroupName = this.groupContext?.name;

    if (!!this.name && hasGroupName && reactiveGroupName !== this.name) {
      Vue.util.warn(
        'Component is being used inside a Group. Did you mean to override the name prop value ' +
        `(${reactiveGroupName}) with (${this.name})? It is recommended to only set name at the Group level.`,
        this,
      );
    }
  },
};

/**
 * This mixin provides common logic shared amongst our validation messages inputs.
 * @displayName Messages Mixin
 */
export const MessagesMixin = {
  props: {
    /**
     * Used to customize the validation messages component
     */
    messagesClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * A set of props that are passed into the validation messages component
     */
    messagesChildProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Used to hide / show the validation messages
     * @values true, false
     */
    showMessages: {
      type: Boolean,
      default: true,
    },

    /**
     * Validation messages
     */
    messages: {
      type: Array,
      default: () => [],
      validator: messages => {
        return validationMessageValidator(messages);
      },
    },
  },

  computed: {
    formattedMessages () {
      return formatMessages(this.messages);
    },
  },
};

export default {
  InputMixin,
  CheckableMixin,
  GroupableMixin,
  MessagesMixin,
};
