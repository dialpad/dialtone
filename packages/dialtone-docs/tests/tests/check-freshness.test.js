import { describe, test, expect } from 'vitest';
import { isStale, parseLastVerified } from '@src/generators/check-freshness.mjs';

const TODAY = new Date('2026-04-27');
const THRESHOLD = 90;

// Jan 27, 2026 is exactly 90 days before Apr 27, 2026
// Jan 26, 2026 is exactly 91 days before Apr 27, 2026

describe('parseLastVerified', () => {
  test('YYYY-MM-DD string is returned as-is', () => {
    expect(parseLastVerified('2026-04-27')).toBe('2026-04-27');
  });

  test('Date object is converted to YYYY-MM-DD string', () => {
    expect(parseLastVerified(new Date('2026-04-27T00:00:00.000Z'))).toBe('2026-04-27');
  });

  test('null returns null', () => {
    expect(parseLastVerified(null)).toBeNull();
  });

  test('undefined returns null', () => {
    expect(parseLastVerified(undefined)).toBeNull();
  });
});

describe('isStale', () => {
  test('today is not stale', () => {
    expect(isStale('2026-04-27', TODAY, THRESHOLD)).toBe(false);
  });

  test('exactly 90 days ago is not stale (threshold is > 90, not >= 90)', () => {
    expect(isStale('2026-01-27', TODAY, THRESHOLD)).toBe(false);
  });

  test('91 days ago is stale', () => {
    expect(isStale('2026-01-26', TODAY, THRESHOLD)).toBe(true);
  });

  test('null last_verified is stale', () => {
    expect(isStale(null, TODAY, THRESHOLD)).toBe(true);
  });

  test('undefined last_verified is stale', () => {
    expect(isStale(undefined, TODAY, THRESHOLD)).toBe(true);
  });

  test('Date object 91 days ago is stale', () => {
    expect(isStale(new Date('2026-01-26T00:00:00.000Z'), TODAY, THRESHOLD)).toBe(true);
  });

  test('Date object exactly 90 days ago is not stale', () => {
    expect(isStale(new Date('2026-01-27T00:00:00.000Z'), TODAY, THRESHOLD)).toBe(false);
  });
});
