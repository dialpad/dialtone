// Types of messages, also dictates what is the current state of the input.
export const VALIDATION_MESSAGE_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
};

/*
 * Any string message or message object in the messages prop that do not specify
 * a 'type' attributes will default to 'DEFAULT_MESSAGE_TYPE'.
 */
export const DEFAULT_VALIDATION_MESSAGE_TYPE = VALIDATION_MESSAGE_TYPES.ERROR;

// Default prefix used for ids
export const DEFAULT_PREFIX = 'hs';

export default {
  VALIDATION_MESSAGE_TYPES,
  DEFAULT_VALIDATION_MESSAGE_TYPE,
  DEFAULT_PREFIX,
};
