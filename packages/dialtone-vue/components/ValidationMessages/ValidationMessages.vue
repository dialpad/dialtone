<template>
  <div
    v-if="showMessages && !isFilteredValidationMessagesEmpty"
    class="base-input__messages d-validation-message__container"
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
 * These messages can have a critical, warning or positive type.
 * @see https://dialtone.dialpad.com/components/validation_messages.html
 */
export default {
  compatConfig: { MODE: 3 },
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
     * `{ message: "Some informative message", type: "critical|warning|positive"}`
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
        critical: 'base-input__message--critical d-validation-message--critical',
        warning: 'base-input__message--warning d-validation-message--warning',
        positive: 'base-input__message--positive d-validation-message--positive',
      };

      return messageTypesClasses[type];
    },
  },
};
</script>
