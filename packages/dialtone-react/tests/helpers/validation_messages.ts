// dialtone-vue's tests/helpers/validation_messages.js: build the formatted messages several components take.
import type { ValidationMessageType } from '../../common/constants';
import type { ValidationMessage } from '../../common/utils';

export function setFormattedValidationMessages (
  messageType: ValidationMessageType,
  message: string,
): ValidationMessage[] {
  return [{ message, type: messageType }];
}

export function addFormattedValidationMessage (
  validationMessages: ValidationMessage[],
  messageType: ValidationMessageType,
  message: string,
): ValidationMessage[] {
  return [...validationMessages, { message, type: messageType }];
}
