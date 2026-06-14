import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isAboveViewportBreakpoint,
  pickViewportValue,
  VIEWPORT_BREAKPOINTS,
} from './viewportBreakpoints.js';

describe('viewportBreakpoints', () => {
  it('uses strict greater-than breakpoint semantics', () => {
    assert.equal(isAboveViewportBreakpoint(VIEWPORT_BREAKPOINTS.md, 'md'), false);
    assert.equal(isAboveViewportBreakpoint(VIEWPORT_BREAKPOINTS.md + 1, 'md'), true);
  });

  it('picks the largest matching breakpoint value', () => {
    const value = pickViewportValue(1000, {
      default: '100p',
      xs: '100',
      md: '300',
      lg: '400',
      xl: '500',
    });

    assert.equal(value, '400');
  });

  it('uses default when no breakpoint value matches', () => {
    const value = pickViewportValue(320, {
      default: '100p',
      xs: '100',
    });

    assert.equal(value, '100p');
  });

  it('returns undefined when no default or matching breakpoint exists', () => {
    const value = pickViewportValue(320, {
      sm: '200',
    });

    assert.equal(value, undefined);
  });

  it('throws for unknown breakpoint names', () => {
    assert.throws(
      () => isAboveViewportBreakpoint(1000, 'tablet'),
      /Unknown viewport breakpoint "tablet"/,
    );
    assert.throws(
      () => pickViewportValue(1000, { tablet: '400' }),
      /Unknown viewport breakpoint "tablet"/,
    );
  });
});
