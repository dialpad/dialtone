<template>
  <div
    v-if="showMessages && !isFilteredValidationMessagesEmpty"
    class="base-input__messages d-d-flex d-fd-column"
    data-qa="validation-messages-container"
  >
    <div
      v-for="({ message, type }, index) in filteredValidationMessages"
      :key="getMessageKey(type, index)"
      role="status"
      aria-live="polite"
      data-qa="validation-message"
      :class="[
        'base-input__message',
        'd-validation-message',
        messageTypeClass(type),
      ]"
    >
      <p v-html="message" />
    </div>
  </div>
</template>

<script>
import { validationMessageValidator } from '@/common/validators';
import {
  getUniqueString,
  filterFormattedMessages,
  getValidationState,
} from '@/common/utils';

/**
 * Validation messages are used to convey information to the user about the current state of the input element.
 * These messages can have an error, warning or success type.
 * @see https://dialpad.design/components/validation_messages.html
 */
export default {
  name: 'DtValidationMessages',

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
     * @values true, false
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

    messageTypeClass (type) {
      const messageTypesClasses = {
        error: 'base-input__message--error d-validation-message--error',
        warning: 'base-input__message--warning d-validation-message--warning',
        success: 'base-input__message--success d-validation-message--success',
      };

      return messageTypesClasses[type];
    },
  },
};
</script>
