/**
 * constraintResolver unit tests
 *
 * Tests the dual constraint hierarchy: user limits (drag boundaries)
 * vs system limits (viewport scaling range).
 */

import { describe, it, expect } from 'vitest';
import {
  calculateConstraintHierarchy,
  resolveUserConstraints,
  resolveSystemConstraints,
  clampSystemMin,
  clampSystemMax,
} from './ConstraintResolver';

// ─── resolveUserConstraints ─────────────────────────────────────────────────

describe('resolveUserConstraints', () => {
  it('returns undefined when no constraints are set', () => {
    const result = resolveUserConstraints({ id: 'a' }, 1000);
    expect(result.userMinSizePixels).toBeUndefined();
    expect(result.userMaxSizePixels).toBeUndefined();
  });

  it('resolves userMinSize token to pixels', () => {
    const result = resolveUserConstraints({ id: 'a', userMinSize: '200' }, 1000);
    expect(result.userMinSizePixels).toBe(128);
  });

  it('resolves userMaxSize percentage to pixels', () => {
    const result = resolveUserConstraints({ id: 'a', userMaxSize: '50p' }, 1000);
    expect(result.userMaxSizePixels).toBe(500);
  });

  it('resolves both userMinSize and userMaxSize together', () => {
    const result = resolveUserConstraints({ id: 'a', userMinSize: '200', userMaxSize: '500' }, 1000);
    expect(result.userMinSizePixels).toBe(128);
    expect(result.userMaxSizePixels).toBe(320);
  });
});

// ─── clampSystemMin / clampSystemMax ────────────────────────────────────────

describe('clampSystemMin', () => {
  it('returns systemMin when greater than userMin', () => {
    expect(clampSystemMin(200, 100)).toBe(200);
  });

  it('clamps systemMin up to userMin when systemMin is less', () => {
    expect(clampSystemMin(50, 100)).toBe(100);
  });

  it('returns undefined when systemMin is undefined', () => {
    expect(clampSystemMin(undefined, 100)).toBeUndefined();
  });

  it('returns systemMin unchanged when userMin is undefined', () => {
    expect(clampSystemMin(200, undefined)).toBe(200);
  });
});

describe('clampSystemMax', () => {
  it('returns systemMax when less than userMax', () => {
    expect(clampSystemMax(200, 500)).toBe(200);
  });

  it('clamps systemMax down to userMax when systemMax exceeds it', () => {
    expect(clampSystemMax(600, 500)).toBe(500);
  });

  it('returns undefined when systemMax is undefined', () => {
    expect(clampSystemMax(undefined, 500)).toBeUndefined();
  });

  it('returns systemMax unchanged when userMax is undefined', () => {
    expect(clampSystemMax(200, undefined)).toBe(200);
  });
});

// ─── resolveSystemConstraints ───────────────────────────────────────────────

describe('resolveSystemConstraints', () => {
  it('falls back to userMin when systemMinSize not specified', () => {
    const result = resolveSystemConstraints({ id: 'a' }, 1000, 128, undefined);
    expect(result.systemMinSizePixels).toBe(128);
  });

  it('falls back to userMax when systemMaxSize not specified', () => {
    const result = resolveSystemConstraints({ id: 'a' }, 1000, undefined, 500);
    expect(result.systemMaxSizePixels).toBe(500);
  });

  it('resolves systemMinSize from prop when specified', () => {
    const result = resolveSystemConstraints({ id: 'a', systemMinSize: '20p' }, 1000, 100, undefined);
    expect(result.systemMinSizePixels).toBe(200);
  });

  it('clamps systemMin to userMin when systemMin would be less', () => {
    const result = resolveSystemConstraints({ id: 'a', systemMinSize: '8px' }, 1000, 100, undefined);
    // '8px' = 8px, userMin = 100px → clamped to 100
    expect(result.systemMinSizePixels).toBe(100);
  });

  it('clamps systemMax to userMax when systemMax would exceed', () => {
    const result = resolveSystemConstraints({ id: 'a', systemMaxSize: '90p' }, 1000, undefined, 500);
    // 90% of 1000 = 900px, userMax = 500px → clamped to 500
    expect(result.systemMaxSizePixels).toBe(500);
  });
});

// ─── calculateConstraintHierarchy (integration) ─────────────────────────────

describe('calculateConstraintHierarchy', () => {
  it('returns all undefined for unconstrained panel', () => {
    const result = calculateConstraintHierarchy({ id: 'a' }, 1000);
    expect(result.userMinSizePixels).toBeUndefined();
    expect(result.userMaxSizePixels).toBeUndefined();
    expect(result.systemMinSizePixels).toBeUndefined();
    expect(result.systemMaxSizePixels).toBeUndefined();
    expect(result.collapseSizePixels).toBeUndefined();
  });

  it('resolves full constraint hierarchy from all props', () => {
    const result = calculateConstraintHierarchy(
      {
        id: 'a',
        userMinSize: '200',
        userMaxSize: '500',
        systemMinSize: '20p',
        systemMaxSize: '30p',
        collapseSize: '1200',
      },
      1000,
    );
    expect(result.userMinSizePixels).toBe(128);
    expect(result.userMaxSizePixels).toBe(320);
    expect(result.systemMinSizePixels).toBe(200);
    expect(result.systemMaxSizePixels).toBe(300);
    expect(result.collapseSizePixels).toBe(768);
  });

  it('collapseSize is not clamped to container', () => {
    const result = calculateConstraintHierarchy(
      { id: 'a', collapseSize: '1600' },
      500,
    );
    // '1600' = 1024px, container is 500px — should NOT clamp
    expect(result.collapseSizePixels).toBe(1024);
  });

  it('does not include legacy minSizePixels/maxSizePixels fields', () => {
    const result = calculateConstraintHierarchy(
      { id: 'a', userMinSize: '200', userMaxSize: '500' },
      1000,
    );
    expect(result).not.toHaveProperty('minSizePixels');
    expect(result).not.toHaveProperty('maxSizePixels');
  });
});
