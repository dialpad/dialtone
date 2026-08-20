// sm/md/lg/xl mirror the canonical scale in packages/postcss-responsive-variations
// (defaultBreakpoints) and must stay in sync with it — there is no shared breakpoint
// token yet. xs/xxl/xxxl/xxxxl are docs-only extensions with no CSS-utility counterpart.
//
// Breakpoints resolve through `(min-width: Npx)` media queries — the same form those
// CSS utility prefixes compile to — so a breakpoint is active here exactly when its
// `lg:`-style classes are active in the stylesheet, boundary width included. Anything
// that compares widths by hand will disagree with CSS by a pixel; go through
// getViewportBreakpointMediaQuery instead.

/**
 * @typedef {'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl'} ViewportBreakpointName
 */

/**
 * @typedef {ViewportBreakpointName | ''} ActiveViewportBreakpointName
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

// Largest → smallest, so resolveActiveViewportBreakpoint and
// pickViewportValueByBreakpointName return the highest matching breakpoint.
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
 * @param {ActiveViewportBreakpointName} activeName
 * @returns {void}
 */
const assertKnownActiveBreakpoint = (activeName) => {
  if (activeName === '') return;

  assertKnownBreakpoint(activeName);
};

/**
 * @template T
 * @param {ViewportPickValues<T>} values
 * @returns {void}
 */
const assertKnownViewportValueKeys = (values) => {
  Object.keys(values).forEach((key) => {
    if (key === PICK_DEFAULT_KEY) return;

    assertKnownBreakpoint(key);
  });
};

/**
 * The media query a breakpoint is active for.
 *
 * @param {ViewportBreakpointName} name
 * @returns {string}
 */
export const getViewportBreakpointMediaQuery = (name) => {
  assertKnownBreakpoint(name);

  return `(min-width: ${VIEWPORT_BREAKPOINTS[name]}px)`;
};

/**
 * Highest breakpoint whose media query currently matches, or '' when none do
 * (i.e. narrower than the smallest breakpoint).
 *
 * Takes a predicate rather than a width so the caller owns the matching — the live
 * path asks MediaQueryList.matches, and tests can answer without a DOM.
 *
 * @param {(name: ViewportBreakpointName) => boolean} isMatch
 * @returns {ActiveViewportBreakpointName}
 */
export const resolveActiveViewportBreakpoint = (isMatch) => {
  for (const name of VIEWPORT_BREAKPOINT_NAMES_DESC) {
    if (isMatch(name)) return name;
  }

  return '';
};

/**
 * @param {ActiveViewportBreakpointName} activeName
 * @param {ViewportBreakpointName} name
 * @returns {boolean}
 */
export const isAboveViewportBreakpointName = (activeName, name) => {
  assertKnownBreakpoint(name);
  if (activeName === '') return false;

  assertKnownActiveBreakpoint(activeName);

  return VIEWPORT_BREAKPOINTS[activeName] >= VIEWPORT_BREAKPOINTS[name];
};

/**
 * @template T
 * @param {ActiveViewportBreakpointName} activeName
 * @param {ViewportPickValues<T>} values
 * @returns {T | undefined}
 */
export const pickViewportValueByBreakpointName = (activeName, values) => {
  assertKnownActiveBreakpoint(activeName);
  assertKnownViewportValueKeys(values);

  for (const name of VIEWPORT_BREAKPOINT_NAMES_DESC) {
    if (Object.hasOwn(values, name) && isAboveViewportBreakpointName(activeName, name)) {
      return values[name];
    }
  }

  return values[PICK_DEFAULT_KEY];
};
