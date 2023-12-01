import Vue from 'vue';
import { DtValidationMessages } from '@/components/validation_messages';
import { validationMessageValidator } from '../validators';
import {
  getUniqueString,
  formatMessages,
  getValidationState,
} from '@/common/utils';

/**
 * This mixin provides a base provide obj and set of components, props, computed, watchers and data attributes that are
 * commonly used in our input group components.
 * @displayName Input Group Mixin
 */
export const InputGroupMixin = {
  components: { DtValidationMessages },

  // provide data to slotted components
  provide () {
    return {
      groupContext: this.provideObj,
      setGroupValue: this.setGroupValue,
    };
  },

  props: {
    /**
     * The id of the input group
     */
    id: {
      type: String,
      default () {
        return getUniqueString();
      },
    },

    /**
     * The value of the input group
     */
    value: {
      type: [String, Number, Boolean, Object],
      default: null,
    },

    /**
     * The name of the input group
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * The legend of the input group
     */
    legend: {
      type: String,
      default: '',
    },

    /**
     * Disables the input group
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Validation messages
     */
    messages: {
      type: Array,
      default: () => [],
      validator: messages => validationMessageValidator(messages),
    },

    /**
     * Show validation messages
     * @values true, false
     */
    showMessages: {
      type: Boolean,
      default: true,
    },

    /**
     * Used to customize the legend element
     */
    legendClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the messages container
     */
    messagesClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * A set of props that are passed into the legend element
     */
    legendChildProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * A set of props that are passed into the messages container
     */
    messagesChildProps: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    const formattedMessages = formatMessages(this.messages);

    return {
      // wrap values in object to make reactive
      provideObj: {
        name: this.name,
        disabled: this.disabled,
        validationState: getValidationState(formattedMessages),
      },
    };
  },

  computed: {
    formattedMessages () {
      return formatMessages(this.messages);
    },

    validationState () {
      return getValidationState(this.formattedMessages);
    },
  },

  watch: {
    disabled (newDisabled) {
      this.provideObj.disabled = newDisabled;
    },

    validationState (newValidationState) {
      this.provideObj.validationState = newValidationState;
    },
  },

  methods: {
    /*
     * provided value to support 2 way binding for slotted input components.
     * slotted input components will change this value and need to emit new value up.
     */
    setGroupValue (newValue) {
      this.internalValue = newValue;
      this.$emit('input', newValue);
    },
  },

  mounted () {
    if (!this.legend && !this.$slots.legend && !this.$attrs['aria-label']) {
      Vue.util.warn('It is expected that an aria-label is provided when there is no legend.', this);
    }
  },
};

export default {
  InputGroupMixin,
};
