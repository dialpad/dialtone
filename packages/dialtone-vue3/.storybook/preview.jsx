import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import { addons } from '@storybook/preview-api';
import { setTheme } from '@/../../common/themes/config';
import DpLight from '@/../../common/themes/tmo-light.js';
import DpDark from '@/../../common/themes/tmo-dark.js';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setup } from '@storybook/vue3';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode, DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import fixDefaultSlot from '../components/plugins/fixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji';
import customEmojiJson from '@/common/custom-emoji.json';
import { dialtoneDarkTheme, dialtoneLightTheme } from './dialtone-themes.js';
import { DtTooltipDirective } from "@/directives/tooltip";
import { faker } from '@faker-js/faker';
import { DtScrollbarDirective } from "@/directives/scrollbar";

const channel = addons.getChannel();

channel.on(DARK_MODE_EVENT_NAME, (isDark) => {
  setTheme(isDark ? DpDark : DpLight);
});

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);

setup((app) => {
  app.use(fixDefaultSlot)
  app.use(DtTooltipDirective);
  app.use(DtScrollbarDirective);
  // global seed, to make sure results are reproducible on percy and don't change on every reload too.
  faker.seed(6687422389464139);
});

export default {
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
        return <DocsContainer context={props.context} theme={isDark ? dialtoneDarkTheme : dialtoneLightTheme}>{children}</DocsContainer>;
      }
    },
    percy: { globalShow: true }
  },
}
