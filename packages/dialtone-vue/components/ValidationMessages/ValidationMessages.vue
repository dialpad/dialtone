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
      <!-- @slot icon — replaces the default per-type DtIcon. Slot content must be a Dialtone icon (carries
      the `d-icon` class) so the CSS pseudo-element fallback suppresses correctly. Receives { type } scope. -->
      <slot
        name="icon"
        :type="type"
      >
        <component
          :is="iconForType(type)"
          :class="['d-validation-message__icon', iconClass]"
          data-qa="validation-message-icon"
          size="300"
        />
      </slot>
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
import {
  DtIconAlertTriangle,
  DtIconAlertCircle,
  DtIconCheckCircle,
  DtIconInfo,
} from '@dialpad/dialtone-icons/vue';

const kindToIcon = Object.freeze({
  warning: DtIconAlertTriangle,
  critical: DtIconAlertCircle,
  positive: DtIconCheckCircle,
  info: DtIconInfo,
});

/**
 * Validation messages are used to convey information to the user about the current state of the input element.
 * These messages can have a critical, warning, positive, or info type.
 * @see https://dialtone.dialpad.com/components/validation_messages.html
 */
export default {
  name: 'DtValidationMessages',

  components: { DtIconAlertTriangle, DtIconAlertCircle, DtIconCheckCircle, DtIconInfo },

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
     * `{ message: "Some informative message", type: "critical|warning|positive|info"}`
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

    /**
     * Additional class name for the icon wrapper element.
     */
    iconClass: {
      type: [String, Array, Object],
      default: '',
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

    iconForType (type) {
      return kindToIcon[type] ?? null;
    },

    messageTypeClass (type) {
      const messageTypesClasses = {
        critical: 'base-input__message--critical d-validation-message--critical',
        warning: 'base-input__message--warning d-validation-message--warning',
        positive: 'base-input__message--positive d-validation-message--positive',
        info: 'base-input__message--info d-validation-message--info',
      };

      return messageTypesClasses[type];
    },
  },
};
</script>
