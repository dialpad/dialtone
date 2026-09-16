import { expect } from 'vitest';
import { clearTokenCache, resolveTokenValue } from './tokens';

describe('tokens', function () {
  afterEach(function () {
    document.documentElement.style.removeProperty('--zi-selected');
    document.documentElement.style.removeProperty('--dt-spacing-100');
    document.documentElement.style.removeProperty('--dt-spacing-100-negative');
    clearTokenCache();
  });

  it('should resolve z-index token values', function () {
    document.documentElement.style.setProperty('--zi-selected', '25');
    clearTokenCache();

    expect(resolveTokenValue('z-index', 'selected')).toBe('25');
  });

  it('should resolve coordinate token values', function () {
    document.documentElement.style.setProperty('--dt-spacing-100', '8px');
    document.documentElement.style.setProperty('--dt-spacing-100-negative', '-8px');
    clearTokenCache();

    expect(resolveTokenValue('coordinate', '100')).toBe('8px');
    expect(resolveTokenValue('coordinate', 'n100')).toBe('-8px');
    expect(resolveTokenValue('coordinate', '50p')).toBe('50%');
    expect(resolveTokenValue('coordinate', 'n100p')).toBe('-100%');
  });
});
