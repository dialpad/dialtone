import '../css/dialtone-globals.less';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setup } from '@storybook/vue3';
import fixDefaultSlot from '../components/plugins/fixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '../common/emoji.js';
import customEmojiJson from '@/common/custom-emoji.json';
import dialtoneTheme from './dialtone-theme.js';

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);

setup((app) => { app.use(fixDefaultSlot) });

export default {
  parameters: {
    a11y: {
      config: {
        // This is a legitimate color contrast issue that needs to be fixed by the design team in the future.
        rules: [{
          id: 'color-contrast',
          reviewOnFail: true,
        }],
      },
    },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
    options: {
      showPanel: 'bottom',
      storySort: {
        method: 'alphabetical',
        // Make sure the docs come first
        order: [
          'Welcome',
          'Docs',
          [
            'Component Driven Development',
            [
              'Yeoman Generator',
              'Unit Tests',
            ],
            'Storybook',
            [
              'Getting Started',
              'File Structure',
              'Writing Stories',
              'Addons',
              'Writing Documentation',
            ],
            'Templates',
            [
              'Component',
              'SFC Component Story Template',
              'Stories',
              'MDX Documentation',
              'Unit Tests',
              'Pull Request',
            ],
          ],
        ],
      },
    },
    docs: {
      theme: dialtoneTheme
    },
  },
}
