import '../css/dialtone-globals.less';
import '@dialpad/dialtone/lib/dist/css/dialtone.min.css';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setup } from '@storybook/vue3';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode } from "storybook-dark-mode";
import fixDefaultSlot from '../components/plugins/fixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '../common/emoji.js';
import customEmojiJson from '@/common/custom-emoji.json';
import { dialtoneDarkTheme, dialtoneLightTheme } from './dialtone-themes.js';
import { DtTooltipDirective } from "@/directives/tooltip";

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);

setup((app) => {
  app.use(fixDefaultSlot)
  app.use(DtTooltipDirective);
});

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
    backgrounds: { disable: true },
    darkMode: {
      darkClass: 'dialtone-theme-dark',
      lightClass: 'dialtone-theme-light',
      dark: dialtoneDarkTheme,
      light: dialtoneLightTheme,
      stylePreview: true,
    },
    docs: {
      container: ({ children, ...props }) => {
        const isDark = useDarkMode();
        return <DocsContainer context={props.context} theme={isDark ? dialtoneDarkTheme : dialtoneLightTheme}>{children}</DocsContainer>;
      }
    },
    percy: { globalShow: true }
  },
}
