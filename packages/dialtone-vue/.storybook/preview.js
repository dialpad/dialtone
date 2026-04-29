import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { addons } from 'storybook/preview-api';
import { setTheme } from '@dialpad/dialtone-tokens/themes/config';
import DpLight from '@dialpad/dialtone-tokens/themes/dp-light';
import DpDark from '@dialpad/dialtone-tokens/themes/dp-dark';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import { setup } from '@storybook/vue3-vite';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import React, { useState, useEffect } from 'react';
import fixDefaultSlot from '../components/plugins/fixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji';
import customEmojiJson from '@/common/custom-emoji.json';
import { dialtoneDarkTheme, dialtoneLightTheme } from './dialtone-themes.js';
import { DialtoneDocsPage } from './DialtoneDocsPage.js';
import { DtTooltipDirective } from '@/directives/tooltip_directive';
import { DtScrollbarDirective } from '@/directives/scrollbar_directive';
import { DtStack } from '@/components/stack';
import { faker } from '@faker-js/faker';

setTheme(DpLight);

const channel = addons.getChannel();

channel.on(DARK_MODE_EVENT_NAME, (isDark) => {
  setTheme(isDark ? DpDark : DpLight);
});

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);

setup((app) => {
  app.use(fixDefaultSlot);
  app.use(DtTooltipDirective);
  app.use(DtScrollbarDirective);
  app.component('DtStack', DtStack);
  // global seed, to make sure results are reproducible on percy and don't change on every reload too.
  faker.seed(6687422389464139);
});

export default {
  name: 'StorybookPreview',

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
      options: MINIMAL_VIEWPORTS,
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

    backgrounds: { disabled: true },
    docs: {
      page: DialtoneDocsPage,
      container: ({ children, ...props }) => {
        const [isDark, setDark] = useState(false);
        const channel = addons.getChannel();

        channel.on(DARK_MODE_EVENT_NAME, (isDark) => {
          setTheme(isDark ? DpDark : DpLight);
        });

        useEffect(() => {
          channel.on(DARK_MODE_EVENT_NAME, setDark);
          return () => {
            channel.off(DARK_MODE_EVENT_NAME, setDark);
          };
        }, [channel, setDark]);

        return React.createElement(
          DocsContainer,
          { theme: isDark ? dialtoneDarkTheme : dialtoneLightTheme, context: props.context },
          children,
        );
      },
    },

    percy: { globalShow: true },
  },

  tags: ['autodocs'],
};
