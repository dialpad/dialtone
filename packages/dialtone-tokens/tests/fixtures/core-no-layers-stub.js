// Stubs the build-generated themes/core-no-layers.js (absent on clean checkouts) so
// vitest can import themes/config.js without a prior token build. Aliased in
// vitest.config.js. Deliberately distinct content from core-stub.js so tests can assert
// initDialtoneTheme({ layers: false }) is wired to this file and not the layered core.
export default {
  core: ':root { --dt-no-layers-marker: 1; }',
  baseColors: ':root { --dt-no-layers-base-marker: 1; }',
};
