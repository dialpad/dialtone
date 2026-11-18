import { devWarn } from '../dev';
import {
  CONFIG_KEYS,
  FOCUSABLE_SELECTOR,
  FOCUSGROUP_DEFAULTS,
  ROLE_DEFAULTS_MAP,
  TOKEN_MAP,
  type FocusgroupConfig,
} from './focusgroup_constants';

/**
 * What `v-dt-focusgroup` accepts as its binding value: `true`, `null` or `undefined` for the defaults, a string of
 * space-separated tokens (`'horizontal nomemory skipdisabled'`), or an object of config keys.
 */
export type FocusgroupValue = string | Partial<FocusgroupConfig> | boolean | null | undefined;

function parseObjectConfig (config: FocusgroupConfig, value: Partial<FocusgroupConfig>) {
  for (const key of CONFIG_KEYS) {
    if (value[key] !== undefined) Object.assign(config, { [key]: value[key] });
  }
}

function parseStringConfig (config: FocusgroupConfig, value: string, unknownTokens: string[]) {
  const tokens = value.split(/\s+/);
  for (const token of tokens) {
    const mapping = Object.hasOwn(TOKEN_MAP, token) ? TOKEN_MAP[token] : undefined;
    if (mapping) {
      Object.assign(config, { [mapping.key]: mapping.value });
    } else if (token) {
      unknownTokens.push(token);
    }
  }
}

/** Logs Vue's warning for a token parseConfig doesn't know. */
export function warnUnknownToken (token: string) {
  devWarn(
    `[DtFocusgroupDirective] Unknown token "${token}". ` +
    `Valid tokens: ${Object.keys(TOKEN_MAP).join(', ')}.`,
  );
}

/**
 * parseConfig without its warnings: the config, and the tokens it didn't know. The hook parses during render, and warns
 * from an effect.
 */
export function parseConfigQuietly (value: FocusgroupValue): { config: FocusgroupConfig; unknownTokens: string[] } {
  const config: FocusgroupConfig = { ...FOCUSGROUP_DEFAULTS };
  const unknownTokens: string[] = [];

  if (!value || value === true) return { config, unknownTokens };

  if (typeof value === 'object') {
    parseObjectConfig(config, value);
  } else if (typeof value === 'string') {
    parseStringConfig(config, value, unknownTokens);
  }

  return { config, unknownTokens };
}

/**
 * Parse a v-dt-focusgroup binding value into a normalized config object.
 *
 * Accepts:
 *   - undefined / null / true  → defaults
 *   - String of space-separated tokens: 'horizontal nomemory skipdisabled'
 *   - Object: { axis: 'horizontal', loop: true, memory: false, selector: '[role="tab"]' }
 *
 * Warns about each unknown token.
 */
export function parseConfig (value: FocusgroupValue): FocusgroupConfig {
  const { config, unknownTokens } = parseConfigQuietly(value);
  unknownTokens.forEach(warnUnknownToken);
  return config;
}

/**
 * Shallow comparison of two parsed config objects.
 * Used to avoid teardown/reattach when config is semantically identical.
 */
export function configsEqual (a: FocusgroupConfig, b: FocusgroupConfig) {
  return CONFIG_KEYS.every(key => a[key] === b[key]);
}

/**
 * Resolve the final item selector for a focusgroup container.
 *
 * Priority: explicit config.selector > role-aware default > fallback (all focusable).
 */
export function resolveSelector (el: Element, config: Pick<FocusgroupConfig, 'selector'>): string {
  if (config.selector) return config.selector;

  const role = el.getAttribute('role');
  if (role && Object.hasOwn(ROLE_DEFAULTS_MAP, role)) {
    return ROLE_DEFAULTS_MAP[role].selector;
  }

  return FOCUSABLE_SELECTOR;
}

/**
 * Resolve whether disabled items should be skipped during navigation.
 *
 * Priority: explicit config.skipDisabled > role-aware default > true.
 */
export function resolveSkipDisabled (el: Element, config: Pick<FocusgroupConfig, 'skipDisabled'>): boolean {
  if (config.skipDisabled !== null) return config.skipDisabled;

  const role = el.getAttribute('role');
  if (role && Object.hasOwn(ROLE_DEFAULTS_MAP, role)) {
    return ROLE_DEFAULTS_MAP[role].skipDisabled;
  }

  return true;
}
