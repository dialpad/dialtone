/**
 * Default focusable element selector — all natively focusable elements
 * plus anything with an explicit tabindex, excluding opt-outs.
 */
const FOCUSABLE_SELECTOR =
  ':is(button, [href], input, select, textarea, [tabindex]):not([data-dt-focusgroup-skip])';

const MENU_DEFAULTS = Object.freeze({
  selector: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
  skipDisabled: true,
});

/**
 * Default configuration for v-dt-focusgroup.
 * Matches Open UI spec defaults: both axes, loop on, memory on, skip disabled on.
 */
export const FOCUSGROUP_DEFAULTS = Object.freeze({
  axis: 'both',
  loop: true,
  memory: true,
  selector: null,
  skipDisabled: null, // null = use role-aware default
});

/**
 * Role-aware defaults for container roles.
 * Each entry provides a default item selector and skipDisabled behavior
 * matching the WAI-ARIA authoring practices for that pattern.
 */
export const ROLE_DEFAULTS_MAP = Object.freeze({
  tablist: {
    selector: '[role="tab"]',
    skipDisabled: false, // WAI-ARIA Tabs: disabled tabs remain focusable for discoverability
  },
  radiogroup: {
    selector: '[role="radio"]',
    skipDisabled: true,
  },
  listbox: {
    selector: '[role="option"]',
    skipDisabled: true,
  },
  menu: MENU_DEFAULTS,
  menubar: MENU_DEFAULTS,
  toolbar: {
    selector: FOCUSABLE_SELECTOR,
    skipDisabled: true,
  },
});

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
// Maps string tokens to config key + value
const TOKEN_MAP = Object.freeze({
  horizontal: { key: 'axis', value: 'horizontal' },
  vertical: { key: 'axis', value: 'vertical' },
  both: { key: 'axis', value: 'both' },
  loop: { key: 'loop', value: true },
  noloop: { key: 'loop', value: false },
  memory: { key: 'memory', value: true },
  nomemory: { key: 'memory', value: false },
  skipdisabled: { key: 'skipDisabled', value: true },
  noskipdisabled: { key: 'skipDisabled', value: false },
});

const CONFIG_KEYS = ['axis', 'loop', 'memory', 'selector', 'skipDisabled'];

function parseObjectConfig (config, value) {
  for (const key of CONFIG_KEYS) {
    if (value[key] !== undefined) config[key] = value[key];
  }
}

function parseStringConfig (config, value) {
  const tokens = value.split(/\s+/);
  for (const token of tokens) {
    const mapping = TOKEN_MAP[token];
    if (mapping) config[mapping.key] = mapping.value;
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
  return a.axis === b.axis &&
    a.loop === b.loop &&
    a.memory === b.memory &&
    a.selector === b.selector &&
    a.skipDisabled === b.skipDisabled;
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
