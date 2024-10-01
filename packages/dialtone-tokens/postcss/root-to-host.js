/**
 * @type {import('postcss').PluginCreator}
 */
const creator = () => {
  return {
    postcssPlugin: 'postcss-dialtone-root-to-host',
    Once (root) {
      const re = /.*?\/css\/tokens-.*?/;
      if (!re.test(root.source.input.file)) return;
      const rootRule = root.last;
      rootRule.selector = ':host';
    },
  };
};
creator.postcss = true;
export default creator;
