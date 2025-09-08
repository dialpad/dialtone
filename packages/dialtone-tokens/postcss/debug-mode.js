/* eslint-disable complexity */
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
        decl.assign({ value: '22' });
      } else if (decl.prop.match(/^--dt.*-color.*-s$/)) {
        decl.assign({ value: '100%' });
      } else if (decl.prop.match(/^--dt.*-color.*-l$/)) {
        decl.assign({ value: '50%' });
      } else if (decl.prop.match(/^--dt.*-color.*-a$/)) {
        decl.assign({ value: '100%' });
      } else if ((decl.prop.match(/^--dt.*-color.*$/)) &&
        (decl.prop.match(/^--dt.*-color.*(-h|-s|-l|-a|-hsl|-hsla)$/) === null)) {
        decl.assign({ value: '#ff5c00' });
      }
    },
  };
};
creator.postcss = true;
export default creator;
