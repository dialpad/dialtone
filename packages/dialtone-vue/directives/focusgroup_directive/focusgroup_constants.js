/**
 * Default focusable element selector — all natively focusable elements
 * plus anything with an explicit tabindex, excluding opt-outs.
 */
export const FOCUSABLE_SELECTOR =
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

// Maps string tokens to config key + value
export const TOKEN_MAP = Object.freeze({
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

export const CONFIG_KEYS = ['axis', 'loop', 'memory', 'selector', 'skipDisabled'];
