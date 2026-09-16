 
/**
 * PostCSS plugin to set all color tokens to a single color
 * @type {import('postcss').PluginCreator}
 */
const creator = () => {
  return {
    postcssPlugin: 'postcss-dialtone-debug-mode',
    Declaration (decl) {
      const root = decl.root();
      const re = /.*?\/css\/tokens-.*?/;
      if (!re.test(root.source.input.file)) return;
      if (decl.prop.match(/^--dt.*-color.*$/)) {
        decl.assign({ value: 'oklch(0.7 0.25 54.01)' });
      }
    },
  };
};
creator.postcss = true;
export default creator;
