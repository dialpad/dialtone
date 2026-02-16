 
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
      if (decl.prop.match(/^--dt.*-color.*-h$/)) {
        decl.assign({ value: '54.01' });
      } else if (decl.prop.match(/^--dt.*-color.*-c$/)) {
        decl.assign({ value: '0.25' });
      } else if (decl.prop.match(/^--dt.*-color.*-l$/)) {
        decl.assign({ value: '0.7' });
      } else if (decl.prop.match(/^--dt.*-color.*-a$/)) {
        decl.assign({ value: '1' });
      } else if ((decl.prop.match(/^--dt.*-color.*$/)) &&
        (decl.prop.match(/^--dt.*-color.*(-h|-c|-l|-a|-oklch|-oklcha)$/) === null)) {
        decl.assign({ value: 'oklch(0.7 0.25 54.01)' });
      }
    },
  };
};
creator.postcss = true;
export default creator;
