/**
 * @type {import('postcss').PluginCreator}
 */
const creator = () => {
  return {
    postcssPlugin: 'postcss-dialtone-rem-to-px',
    Declaration (decl) {
      const root = decl.root();
      const re = /.*?\/css\/tokens-.*?/;
      if (!re.test(root.source.input.file)) return;
      if (decl.value.includes('rem')) {
        const numericValue = parseFloat(decl.value);
        const newValue = numericValue * 10;
        decl.assign({ value: `${newValue}px` });
      }
    },
  };
};
creator.postcss = true;
export default creator;
