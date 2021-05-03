import {
  DEFAULT_PREFIX,
  DEFAULT_VALIDATION_MESSAGE_TYPE,
  VALIDATION_MESSAGE_TYPES,
} from './constants';

let UNIQUE_ID_COUNTER = 0;

export function getUniqueString (prefix = DEFAULT_PREFIX) {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

export function formatMessages (messages) {
  if (!messages) {
    return [];
  }

  return messages.map(message => {
    if (typeof message === 'string') {
      return {
        message,
        type: DEFAULT_VALIDATION_MESSAGE_TYPE,
      };
    }

    return message;
  });
}

export function filterFormattedMessages (formattedMessages) {
  const validationState = getValidationState(formattedMessages);

  if (!formattedMessages || !validationState) {
    return [];
  }

  return formattedMessages.filter(message => message.type === validationState);
}

/*
 * The priority order of message types is as flows: 'error' > 'warning' > 'success'.
 * If any message of type 'error' is present in messages, the input state is considered
 * to be 'error', then 'warning' and lastly 'success'.
 */
export function getValidationState (formattedMessages) {
  if (!formattedMessages) {
    return null;
  }

  if (hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.ERROR)) {
    return VALIDATION_MESSAGE_TYPES.ERROR;
  }
  if (hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.WARNING)) {
    return VALIDATION_MESSAGE_TYPES.WARNING;
  }
  if (hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.SUCCESS)) {
    return VALIDATION_MESSAGE_TYPES.SUCCESS;
  }

  return null;
}

export function hasFormattedMessageOfType (formattedMessages, messageType) {
  if (!formattedMessages || !messageType) {
    return false;
  }

  return formattedMessages.some(message => message?.type === messageType);
}

export default {
  getUniqueString,
  formatMessages,
  filterFormattedMessages,
  hasFormattedMessageOfType,
  getValidationState,
};
