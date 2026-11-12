import type { FocusTrapOptions } from './useFocusTrap';

/**
 * Default configuration for the focus trap (Vue's v-dt-focustrap directive).
 */
export const FOCUSTRAP_DEFAULTS: Readonly<Required<FocusTrapOptions>> = Object.freeze({
  active: true,
  initialFocus: 'auto',
  restoreFocus: true,
});

/**
 * Key used to store the trap's state on the host element.
 */
export const FOCUSTRAP_STATE_KEY: unique symbol = Symbol('dtFocustrap');
