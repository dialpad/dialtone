/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-dialtone-rem-to-px',
    Declaration (decl) {
      if (decl.value.includes('rem')) {
        const numericValue = parseFloat(decl.value);
        const newValue = numericValue * 10;
        decl.assign({ value: `${newValue}px` });
      }
    },
  };
};

module.exports.postcss = true;
