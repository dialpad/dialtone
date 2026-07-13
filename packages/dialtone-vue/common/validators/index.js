import {
  VALIDATION_MESSAGE_TYPES,
} from '@/common/constants';

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

/**
 * Builds a `size`-prop validator for components on an ordinal size scale
 * (numeric keys, optionally with deprecated t-shirt aliases), accepting
 * either a modifiers map (`{ 100: '...' }`) or a plain array of valid values.
 * Coerces the incoming value to a string so both `size="300"` and
 * `:size="300"` validate against the same set.
 */
export function ordinalSizeValidator (validSizes) {
  const keys = Array.isArray(validSizes) ? validSizes.map(String) : Object.keys(validSizes);
  return (size) => keys.includes(String(size));
}

export default {
  validationMessageValidator,
  ordinalSizeValidator,
};
