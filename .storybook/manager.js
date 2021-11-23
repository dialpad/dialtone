import '../css/dialtone-globals.less';
import { addons } from '@storybook/addons';
import theme from './theme';

addons.setConfig({
  sidebar: {
    showRoots: true
  },
  theme,
});
