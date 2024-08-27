/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-dialtone-rem-to-px',
    Declaration (decl) {
      if (decl.value.includes('rem')) {
        decl.assign({ value: decl.value.replace('rem', 'px') });
      }
    },
  };
};

module.exports.postcss = true;
