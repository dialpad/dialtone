<template>
  <div
    v-if="showMessages && !isFilteredValidationMessagesEmpty"
    class="base-input__messages"
    data-qa="validation-messages-container"
  >
    <div
      v-for="({ message, type }, index) in filteredValidationMessages"
      :key="getMessageKey(type, index)"
      role="status"
      aria-live="polite"
      data-qa="validation-message"
      :class="['base-input__message', 'd-validation-message', `base-input__message--${type}`, `d-validation-message--${type}`]"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { validationMessageValidator } from '../validators';
import {
  getUniqueString,
  filterFormattedMessages,
  getValidationState,
} from '../utils';

export default {
  name: 'HsValidationMessages',

  props: {
    /**
     * The id of the validation message
     */
    id: {
      type: String,
      default () {
        return getUniqueString();
      },
    },

    /**
     * Array of validation messages. Each message has the following structure:
     * `{ message: "Some informative message", type: "error|warning|success"}`
     */
    validationMessages: {
      type: Array,
      default: () => [],
      validator: messages => validationMessageValidator(messages),
    },

    /**
     * Show Validation messages
     */
    showMessages: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isFilteredValidationMessagesEmpty () {
      return this.filteredValidationMessages.length === 0;
    },

    filteredValidationMessages () {
      return filterFormattedMessages(this.validationMessages);
    },

    validationState () {
      return getValidationState(this.validationMessages);
    },
  },

  methods: {
    getMessageKey (type, index) {
      return `validation-message-${type}-${index}-${this.id}`;
    },
  },
};
</script>
