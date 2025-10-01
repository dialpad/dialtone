import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { addons } from '@storybook/preview-api';
import { setTheme } from '@dialpad/dialtone-tokens/themes/config';
import DpLight from '@dialpad/dialtone-tokens/themes/dp-light';
import DpDark from '@dialpad/dialtone-tokens/themes/dp-dark';
import HighContrastLight from '@dialpad/dialtone-tokens/themes/high-contrast-light';
import HighContrastDark from '@dialpad/dialtone-tokens/themes/high-contrast-dark';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode, DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import React from 'react';
import Vue from 'vue';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji';
import customEmojiJson from '@/common/custom-emoji.json';
import { dialtoneDarkTheme, dialtoneLightTheme } from './dialtone-themes.js';
import { DtTooltipDirective } from '@/directives/tooltip_directive';
import { DtScrollbarDirective } from '@/directives/scrollbar_directive';
import { faker } from '@faker-js/faker';

let currentContrast = 'default';
let currentDarkMode = false;

setTheme(DpLight);

const channel = addons.getChannel();

const updateTheme = (isDark, isHighContrast) => {
  currentDarkMode = isDark;
  currentContrast = isHighContrast ? 'high' : 'default';

  const baseTheme = isDark ? DpDark : DpLight;
  const contrastTheme = isHighContrast ? (isDark ? HighContrastDark : HighContrastLight) : null;

  setTheme(baseTheme, document.documentElement, contrastTheme);
};

channel.on(DARK_MODE_EVENT_NAME, (isDark) => {
  updateTheme(isDark, currentContrast === 'high');
});

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);

Vue.use(DtTooltipDirective);
Vue.use(DtScrollbarDirective);

// Fixes method "toJSON" is not defined on click event in Sb 6.5.11
// See https://github.com/storybookjs/storybook/issues/14933#issuecomment-920578274
Vue.prototype.toJSON = () => {};
// global seed, to make sure results are reproducible on percy and don't change on every reload too.
faker.seed(6687422389464139);

export default {
  name: 'StorybookPreview',
  globalTypes: {
    contrast: {
      description: 'Contrast level',
      toolbar: {
        title: 'Contrast',
        icon: 'contrast',
        items: [
          { value: 'default', icon: 'circlehollow', title: 'Default contrast' },
          { value: 'high', icon: 'circle', title: 'High contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    a11y: {
      config: {
        // This is a legitimate color contrast issue that needs to be fixed by the design team in the future.
        rules: [
          {
            id: 'color-contrast',
            reviewOnFail: true,
          },
        ],
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

    backgrounds: { disable: true },
    docs: {
      container: ({ children, ...props }) => {
        const isDark = useDarkMode();
        return <DocsContainer context={props.context} theme={isDark ? dialtoneDarkTheme : dialtoneLightTheme}>
          {children}
        </DocsContainer>;
      },
    },

    percy: { globalShow: true },
  },
  decorators: [
    (story, context) => {
      const isHighContrast = context.globals.contrast === 'high';
      updateTheme(currentDarkMode, isHighContrast);
      return story();
    },
  ],
};
