// Development-only diagnostics: the React side of dialtone-vue's `process.env.NODE_ENV !== 'production'` checks. The
// app's bundler replaces process.env.NODE_ENV, so production builds skip these, while development and tests
// (NODE_ENV=test) see them. Component code never reads the environment itself (the gate's anti-gaming check); it calls
// these instead.

/** True outside production builds. */
export function isDevelopment (): boolean {
  return process.env.NODE_ENV !== 'production';
}

/** console.warn, outside production builds only. */
export function devWarn (...args: unknown[]): void {
  if (isDevelopment()) console.warn(...args);
}
