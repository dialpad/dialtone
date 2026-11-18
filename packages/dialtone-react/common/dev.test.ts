import { afterEach, describe, expect, it, vi } from 'vitest';
import { devWarn, isDevelopment } from './dev';

describe('dev', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('warns outside production builds', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    devWarn('message', 1);
    expect(isDevelopment()).toBe(true);
    expect(warn).toHaveBeenCalledWith('message', 1);
  });

  it('stays quiet in production builds', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    devWarn('message');
    expect(isDevelopment()).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });
});
