import {
  FOCUSGROUP_DEFAULTS,
  FOCUSABLE_SELECTOR,
  ROLE_DEFAULTS_MAP,
  TOKEN_MAP,
  CONFIG_KEYS,
} from './focusgroup_constants.js';

/**
 * Parse a v-dt-focusgroup binding value into a normalized config object.
 *
 * Accepts:
 *   - undefined / null / true  → defaults
 *   - String of space-separated tokens: 'horizontal nomemory skipdisabled'
 *   - Object: { axis: 'horizontal', loop: true, memory: false, selector: '[role="tab"]' }
 *
 * @param {*} value - The directive binding value
 * @returns {{ axis: string, loop: boolean, memory: boolean, selector: string|null, skipDisabled: boolean|null }}
 */
function parseObjectConfig (config, value) {
  for (const key of CONFIG_KEYS) {
    if (value[key] !== undefined) config[key] = value[key];
  }
}

function parseStringConfig (config, value) {
  const tokens = value.split(/\s+/);
  for (const token of tokens) {
    const mapping = TOKEN_MAP[token];
    if (mapping) {
      config[mapping.key] = mapping.value;
    } else if (token && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[DtFocusgroupDirective] Unknown token "${token}". ` +
        `Valid tokens: ${Object.keys(TOKEN_MAP).join(', ')}.`,
      );
    }
  }
}

export function parseConfig (value) {
  const config = { ...FOCUSGROUP_DEFAULTS };

  if (!value || value === true) return config;

  if (typeof value === 'object') {
    parseObjectConfig(config, value);
  } else if (typeof value === 'string') {
    parseStringConfig(config, value);
  }

  return config;
}

/**
 * Shallow comparison of two parsed config objects.
 * Used by the updated hook to avoid teardown/reattach when config is semantically identical.
 */
export function configsEqual (a, b) {
  return CONFIG_KEYS.every(key => a[key] === b[key]);
}

/**
 * Resolve the final item selector for a focusgroup container.
 *
 * Priority: explicit config.selector > role-aware default > fallback (all focusable).
 *
 * @param {HTMLElement} el - The focusgroup container element
 * @param {{ selector: string|null }} config - Parsed focusgroup config
 * @returns {string} CSS selector string
 */
export function resolveSelector (el, config) {
  if (config.selector) return config.selector;

  const role = el.getAttribute('role');
  if (role && ROLE_DEFAULTS_MAP[role]) {
    return ROLE_DEFAULTS_MAP[role].selector;
  }

  return FOCUSABLE_SELECTOR;
}

/**
 * Resolve whether disabled items should be skipped during navigation.
 *
 * Priority: explicit config.skipDisabled > role-aware default > true.
 *
 * @param {HTMLElement} el - The focusgroup container element
 * @param {{ skipDisabled: boolean|null }} config - Parsed focusgroup config
 * @returns {boolean}
 */
export function resolveSkipDisabled (el, config) {
  if (config.skipDisabled !== null) return config.skipDisabled;

  const role = el.getAttribute('role');
  if (role && ROLE_DEFAULTS_MAP[role]) {
    return ROLE_DEFAULTS_MAP[role].skipDisabled;
  }

  return true;
}
