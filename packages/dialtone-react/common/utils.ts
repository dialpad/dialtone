import { DEFAULT_VALIDATION_MESSAGE_TYPE, VALIDATION_MESSAGE_TYPES, type ValidationMessageType } from './constants';

export interface ValidationMessage {
  message: string;
  type: ValidationMessageType;
}

/** Strings become messages of the default type (critical). */
export function formatMessages (messages?: (string | ValidationMessage)[] | null): ValidationMessage[] {
  if (!messages) return [];
  return messages.map(message => (typeof message === 'string' ? { message, type: DEFAULT_VALIDATION_MESSAGE_TYPE } : message));
}

type Messages = ValidationMessage[] | null | undefined;

/** Highest priority first. */
const PRIORITY = [
  VALIDATION_MESSAGE_TYPES.CRITICAL,
  VALIDATION_MESSAGE_TYPES.WARNING,
  VALIDATION_MESSAGE_TYPES.POSITIVE,
  VALIDATION_MESSAGE_TYPES.INFO,
];

export function hasFormattedMessageOfType (
  formattedMessages: Messages,
  messageType: ValidationMessageType | null | undefined,
): boolean {
  if (!formattedMessages || !messageType) return false;
  return formattedMessages.some(message => message?.type === messageType);
}

/** The highest-priority type present: critical, then warning, positive, info. */
export function getValidationState (formattedMessages: Messages): ValidationMessageType | null {
  if (!formattedMessages) return null;
  for (const type of PRIORITY) {
    if (hasFormattedMessageOfType(formattedMessages, type)) return type;
  }
  return null;
}

/** Only the messages of the highest-priority type, and only those with text. */
export function filterFormattedMessages (formattedMessages: Messages): ValidationMessage[] {
  const validationState = getValidationState(formattedMessages);
  if (!formattedMessages || !validationState) return [];
  return formattedMessages.filter(message => !!message.message && message.type === validationState);
}
