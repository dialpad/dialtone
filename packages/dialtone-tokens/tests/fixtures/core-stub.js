// Stubs the build-generated themes/core.js (absent on clean checkouts) so vitest
// can import themes/config.js without a prior token build. Aliased in vitest.config.js.
export default {
  core: ':root {}',
  baseColors: ':root {}',
};
