/* TODO: Move and sort these in a constants directory

Example:
  constants/
    forms.js
    defaults.js
    ...
*/

// Types of messages, also dictates what is the current state of the input.
export const VALIDATION_MESSAGE_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
};

// Description size variants
export const DESCRIPTION_SIZE_TYPES = {
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
};

// Description size variants
export const DESCRIPTION_SIZE_MODIFIERS = {
  xs: '',
  sm: '',
  md: '',
  lg: 'd-description--lg',
  xl: 'd-description--xl',
};

// Label size variants
export const LABEL_SIZE_MODIFIERS = {
  xs: 'd-label--xs',
  sm: 'd-label--sm',
  md: '',
  lg: 'd-label--lg',
  xl: 'd-label--xl',
};

export const EVENT_KEYNAMES = {
  esc: 'Esc',
  escape: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: 'Space',
  spacebar: 'Spacebar',
  up: 'Up',
  arrowup: 'ArrowUp',
  left: 'Left',
  arrowleft: 'ArrowLeft',
  right: 'Right',
  arrowright: 'ArrowRight',
  down: 'Down',
  arrowdown: 'ArrowDown',
  home: 'Home',
  end: 'End',
};

/*
 * Any string message or message object in the messages prop that do not specify
 * a 'type' attributes will default to 'DEFAULT_MESSAGE_TYPE'.
 */
export const DEFAULT_VALIDATION_MESSAGE_TYPE = VALIDATION_MESSAGE_TYPES.ERROR;

// Default prefix used for ids
export const DEFAULT_PREFIX = 'dt';

export default {
  VALIDATION_MESSAGE_TYPES,
  DESCRIPTION_SIZE_TYPES,
  DEFAULT_VALIDATION_MESSAGE_TYPE,
  DEFAULT_PREFIX,
};
