/**
 * PostCSS plugin that strips CSS cascade layers from token output.
 *
 * Removes `@layer …;` ordering declarations and unwraps `@layer name { … }`
 * blocks so that all rules become unlayered. Internal build-time helper only
 * (mirrors packages/dialtone-css/postcss/postcss-layer-remover.cjs) — used to
 * pre-generate the no-layers token files under dist/css/no-layers/. Not part
 * of the public API; consumers just import the pre-built no-layers CSS.
 */

module.exports = () => ({
  postcssPlugin: 'token-layer-remover',

  AtRule: {
    layer (atRule) {
      if (atRule.nodes) {
        // @layer name { … } — hoist children to parent, drop the @layer wrapper
        atRule.replaceWith(atRule.nodes);
      } else {
        // @layer a, b, c; — ordering declaration, remove entirely
        atRule.remove();
      }
    },
  },
});

module.exports.postcss = true;
