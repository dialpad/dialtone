/**
 * @type {import('postcss').PluginCreator}
 */
const creator = () => {
  return {
    postcssPlugin: 'postcss-dialtone-root-to-host',
    Once (root) {
      // Only process dialtone token files
      if (!root.source?.input?.file || !/tokens-.*?\.css/.test(root.source.input.file)) {
          return;
      }

      const lastRule = root.last;
      // Only modify if it's a rule with a selector
      if (lastRule && lastRule.type === 'rule' && lastRule.selector === ':root') {
          lastRule.selector = ':host';
      }
    },
  };
};
creator.postcss = true;
export default creator;
