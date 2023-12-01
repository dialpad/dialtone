import {
  VALIDATION_MESSAGE_TYPES,
} from './constants';

export function validationMessageValidator (rawMessages) {
  if (!rawMessages) {
    return true;
  }

  return rawMessages.every(message => {
    if (typeof message === 'string') {
      return true;
    }

    if (typeof message === 'object') {
      return Object.values(VALIDATION_MESSAGE_TYPES).includes(message?.type);
    }

    return false;
  });
}

export default {
  validationMessageValidator,
};
