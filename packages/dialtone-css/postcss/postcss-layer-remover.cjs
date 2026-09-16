/**
 * PostCSS plugin that strips CSS cascade layers from Dialtone output.
 *
 * Removes `@layer …;` ordering declarations and unwraps `@layer name { … }`
 * blocks so that all rules become unlayered. Used to produce the
 * `dialtone-no-layers.css` build artifact for consumers that manage their own
 * cascade ordering or need to avoid @layer for browser-support reasons.
 */

module.exports = () => ({
  postcssPlugin: 'postcss-layer-remover',

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
