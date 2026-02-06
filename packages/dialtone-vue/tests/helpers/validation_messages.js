/*
 * The following file contains test helper methods which interact with the validation messages interface which is used
 * by several components.
 */

export function setFormattedValidationMessages (messageType, message) {
  return [{
    message,
    type: messageType,
  }];
}

export function addFormattedValidationMessage (validationMessages, messageType, message) {
  return [
    ...validationMessages,
    {
      message,
      type: messageType,
    },
  ];
}

export default {
  setFormattedValidationMessages,
  addFormattedValidationMessage,
};
