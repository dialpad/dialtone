import '../css/dialtone-globals.less';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { addParameters, app } from '@storybook/vue3';
import { version } from '../package.json';
import theme from './theme';
import fixDefaultSlot from '../components/plugins/fixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '../common/emoji.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);
app.use(fixDefaultSlot);

addParameters({
  docs: {
    theme,
  },
});


export const parameters = {
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
  },
  viewport: {
    viewports: MINIMAL_VIEWPORTS,
  },
  options: {
    storySort: {
      method: 'alphabetical',
      // Make sure the docs come first
      order: [
        `Version ${version}`,
        [
          'Welcome',
        ],
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
    transformSource(src) {
      const match = /^<template>(.*)<\/template>/.exec(src)
      if(match) {
        return match[1]
      }
      return src
    }
  },
};
