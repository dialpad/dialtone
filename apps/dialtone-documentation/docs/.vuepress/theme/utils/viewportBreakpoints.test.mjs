import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getViewportBreakpointMediaQuery,
  isAboveViewportBreakpointName,
  pickViewportValueByBreakpointName,
  resolveActiveViewportBreakpoint,
  VIEWPORT_BREAKPOINTS,
} from './viewportBreakpoints.js';

// Stands in for MediaQueryList.matches: `(min-width: Npx)` matches at N and above.
const matchesAtWidth = (width) => (name) => width >= VIEWPORT_BREAKPOINTS[name];

const activeAtWidth = (width) => resolveActiveViewportBreakpoint(matchesAtWidth(width));

describe('viewportBreakpoints', () => {
  it('builds min-width queries matching the CSS utility scale', () => {
    // sm/md/lg/xl must stay identical to defaultBreakpoints in
    // packages/postcss-responsive-variations, which compiles the `sm:`/`md:`/… prefixes.
    assert.equal(getViewportBreakpointMediaQuery('sm'), '(min-width: 480px)');
    assert.equal(getViewportBreakpointMediaQuery('md'), '(min-width: 640px)');
    assert.equal(getViewportBreakpointMediaQuery('lg'), '(min-width: 960px)');
    assert.equal(getViewportBreakpointMediaQuery('xl'), '(min-width: 1264px)');
  });

  it('treats the boundary width as inside the breakpoint', () => {
    // The whole point of resolving through media queries: at exactly 640px the `md:`
    // utility classes apply, so md must be active here too.
    assert.equal(activeAtWidth(VIEWPORT_BREAKPOINTS.md), 'md');
    assert.equal(activeAtWidth(VIEWPORT_BREAKPOINTS.md - 1), 'sm');
  });

  it('resolves the highest matching breakpoint', () => {
    assert.equal(activeAtWidth(0), '');
    assert.equal(activeAtWidth(VIEWPORT_BREAKPOINTS.xs - 1), '');
    assert.equal(activeAtWidth(VIEWPORT_BREAKPOINTS.xs), 'xs');
    assert.equal(activeAtWidth(1000), 'lg');
    assert.equal(activeAtWidth(VIEWPORT_BREAKPOINTS.xxxxl + 1), 'xxxxl');
  });

  it('short-circuits on the first matching breakpoint, largest first', () => {
    const asked = [];
    const active = resolveActiveViewportBreakpoint((name) => {
      asked.push(name);
      return name === 'lg';
    });

    assert.equal(active, 'lg');
    assert.deepEqual(asked, ['xxxxl', 'xxxl', 'xxl', 'xl', 'lg']);
  });

  it('checks above semantics from an active breakpoint name', () => {
    assert.equal(isAboveViewportBreakpointName('', 'xs'), false);
    assert.equal(isAboveViewportBreakpointName('sm', 'md'), false);
    assert.equal(isAboveViewportBreakpointName('md', 'md'), true);
    assert.equal(isAboveViewportBreakpointName('lg', 'md'), true);
  });

  it('picks the largest matching breakpoint value', () => {
    const value = pickViewportValueByBreakpointName(activeAtWidth(1000), {
      default: '100p',
      xs: '100',
      md: '300',
      lg: '400',
      xl: '500',
    });

    assert.equal(value, '400');
  });

  it('picks the largest matching breakpoint value from an active breakpoint name', () => {
    const value = pickViewportValueByBreakpointName('lg', {
      default: '100p',
      xs: '100',
      md: '300',
      lg: '400',
      xl: '500',
    });

    assert.equal(value, '400');
  });

  it('uses default when no breakpoint value matches', () => {
    const value = pickViewportValueByBreakpointName(activeAtWidth(VIEWPORT_BREAKPOINTS.xs - 1), {
      default: '100p',
      xs: '100',
    });

    assert.equal(value, '100p');
  });

  it('returns undefined when no default or matching breakpoint exists', () => {
    const value = pickViewportValueByBreakpointName(activeAtWidth(VIEWPORT_BREAKPOINTS.xs), {
      sm: '200',
    });

    assert.equal(value, undefined);
  });

  it('throws for unknown breakpoint names', () => {
    assert.throws(
      () => getViewportBreakpointMediaQuery('tablet'),
      /Unknown viewport breakpoint "tablet"/,
    );
    assert.throws(
      () => isAboveViewportBreakpointName('lg', 'tablet'),
      /Unknown viewport breakpoint "tablet"/,
    );
    assert.throws(
      () => pickViewportValueByBreakpointName('lg', { tablet: '400' }),
      /Unknown viewport breakpoint "tablet"/,
    );
    assert.throws(
      () => pickViewportValueByBreakpointName('tablet', { default: '100p' }),
      /Unknown viewport breakpoint "tablet"/,
    );
  });
});
