// sm/md/lg/xl mirror the canonical scale in packages/postcss-responsive-variations
// (defaultBreakpoints) and must stay in sync with it — there is no shared breakpoint
// token yet. xs/xxl/xxxl are docs-only extensions with no CSS-utility counterpart.

/**
 * @typedef {'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl'} ViewportBreakpointName
 */

/**
 * @template T
 * @typedef {Partial<Record<ViewportBreakpointName, T>> & { default?: T }} ViewportPickValues
 */

/** @type {Readonly<Record<ViewportBreakpointName, number>>} */
export const VIEWPORT_BREAKPOINTS = Object.freeze({
  xs: 320,
  sm: 480,
  md: 640,
  lg: 960,
  xl: 1264,
  xxl: 1536,
  xxxl: 1764,
  xxxxl: 2048,
});

/** @type {Readonly<ViewportBreakpointName[]>} */
export const VIEWPORT_BREAKPOINT_NAMES = Object.freeze(Object.keys(VIEWPORT_BREAKPOINTS));

// Largest → smallest, so pickViewportValue returns the highest matching breakpoint.
const VIEWPORT_BREAKPOINT_NAMES_DESC = [...VIEWPORT_BREAKPOINT_NAMES].reverse();

const PICK_DEFAULT_KEY = 'default';

/**
 * @param {string} name
 * @returns {void}
 */
const assertKnownBreakpoint = (name) => {
  if (Object.hasOwn(VIEWPORT_BREAKPOINTS, name)) return;

  throw new Error(`Unknown viewport breakpoint "${name}"`);
};

/**
 * @template T
 * @param {ViewportPickValues<T>} values
 * @returns {void}
 */
export const assertKnownViewportValueKeys = (values) => {
  Object.keys(values).forEach((key) => {
    if (key === PICK_DEFAULT_KEY) return;

    assertKnownBreakpoint(key);
  });
};

/**
 * @param {number} width
 * @param {ViewportBreakpointName} name
 * @returns {boolean}
 */
export const isAboveViewportBreakpoint = (width, name) => {
  assertKnownBreakpoint(name);

  return width > VIEWPORT_BREAKPOINTS[name];
};

/**
 * @template T
 * @param {number} width
 * @param {ViewportPickValues<T>} values
 * @returns {T | undefined}
 */
export const pickViewportValue = (width, values) => {
  assertKnownViewportValueKeys(values);

  for (const name of VIEWPORT_BREAKPOINT_NAMES_DESC) {
    if (Object.hasOwn(values, name) && isAboveViewportBreakpoint(width, name)) {
      return values[name];
    }
  }

  return values[PICK_DEFAULT_KEY];
};
