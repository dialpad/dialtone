import { getComponentFilesFromDir } from '@/common/storybook_utils';

export default {
  created () {
    // dynamically register all dialtone icon components
    // this should only be used if you need to render any possible
    // icon in dialtone into a component story.
    const requireContext = require.context(
      '../../node_modules/@dialpad/dialtone/lib/dist/vue/icons',
      false,
      /[A-Z]\w+\.(vue|js)$/,
    );

    const files = getComponentFilesFromDir(requireContext);
    files.forEach(file => {
      const componentConfig = requireContext(file.fileName);
      this.$options.components[file.componentName] = componentConfig.default;
    });
  },
};
