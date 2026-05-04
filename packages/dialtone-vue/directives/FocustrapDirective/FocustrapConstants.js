/**
 * Default configuration for v-dt-focustrap directive.
 */
export const FOCUSTRAP_DEFAULTS = Object.freeze({
  active: true,
  initialFocus: 'auto',
  restoreFocus: true,
});

/**
 * Key used to store directive state on the host element.
 * @type {symbol}
 */
export const FOCUSTRAP_STATE_KEY = Symbol('dtFocustrap');
