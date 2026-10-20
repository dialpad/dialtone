// Stubs the build-generated themes/materials.js (absent on clean checkouts) so vitest
// can import themes/config.js without a prior token build. Aliased in vitest.config.js.
// Each entry's CSS carries a distinct marker so tests can assert setMaterial() injects
// the correct material's CSS, not just any material's.
function stub(name) {
  return {
    name,
    css: `[data-dt-material="${name}"] { --dt-${name}-marker: 1; }`,
  };
}

export default {
  steel: stub('steel'),
  graphite: stub('graphite'),
  iron: stub('iron'),
  amethyst: stub('amethyst'),
  jade: stub('jade'),
};
