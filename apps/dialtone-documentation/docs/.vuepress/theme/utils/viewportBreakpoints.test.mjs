import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getActiveViewportBreakpoint,
  isAboveViewportBreakpoint,
  isAboveViewportBreakpointName,
  pickViewportValue,
  pickViewportValueByBreakpointName,
  VIEWPORT_BREAKPOINTS,
} from './viewportBreakpoints.js';

describe('viewportBreakpoints', () => {
  it('uses strict greater-than breakpoint semantics', () => {
    assert.equal(isAboveViewportBreakpoint(VIEWPORT_BREAKPOINTS.md, 'md'), false);
    assert.equal(isAboveViewportBreakpoint(VIEWPORT_BREAKPOINTS.md + 1, 'md'), true);
  });

  it('resolves the active breakpoint using strict greater-than semantics', () => {
    assert.equal(getActiveViewportBreakpoint(0), '');
    assert.equal(getActiveViewportBreakpoint(VIEWPORT_BREAKPOINTS.xs), '');
    assert.equal(getActiveViewportBreakpoint(VIEWPORT_BREAKPOINTS.xs + 1), 'xs');
    assert.equal(getActiveViewportBreakpoint(VIEWPORT_BREAKPOINTS.md), 'sm');
    assert.equal(getActiveViewportBreakpoint(VIEWPORT_BREAKPOINTS.md + 1), 'md');
    assert.equal(getActiveViewportBreakpoint(VIEWPORT_BREAKPOINTS.xxxxl + 1), 'xxxxl');
  });

  it('checks above semantics from an active breakpoint name', () => {
    assert.equal(isAboveViewportBreakpointName('', 'xs'), false);
    assert.equal(isAboveViewportBreakpointName('sm', 'md'), false);
    assert.equal(isAboveViewportBreakpointName('md', 'md'), true);
    assert.equal(isAboveViewportBreakpointName('lg', 'md'), true);
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
      () => isAboveViewportBreakpointName('lg', 'tablet'),
      /Unknown viewport breakpoint "tablet"/,
    );
    assert.throws(
      () => pickViewportValue(1000, { tablet: '400' }),
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
