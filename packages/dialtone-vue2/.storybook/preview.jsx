import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { addons } from '@storybook/preview-api';
import { setTheme } from '@dialpad/dialtone-tokens/themes/config';
import DpLight from '@dialpad/dialtone-tokens/themes/dp-light';
import DpDark from '@dialpad/dialtone-tokens/themes/dp-dark';
import TmoLight from '@dialpad/dialtone-tokens/themes/tmo-light';
import TmoDark from '@dialpad/dialtone-tokens/themes/tmo-dark';
import AegeanLight from '@dialpad/dialtone-tokens/themes/aegean-light';
import AegeanDark from '@dialpad/dialtone-tokens/themes/aegean-dark';
import BotanyLight from '@dialpad/dialtone-tokens/themes/botany-light';
import BotanyDark from '@dialpad/dialtone-tokens/themes/botany-dark';
import ButtercreamLight from '@dialpad/dialtone-tokens/themes/buttercream-light';
import ButtercreamDark from '@dialpad/dialtone-tokens/themes/buttercream-dark';
import HighDesertLight from '@dialpad/dialtone-tokens/themes/high-desert-light';
import HighDesertDark from '@dialpad/dialtone-tokens/themes/high-desert-dark';
import MelonLight from '@dialpad/dialtone-tokens/themes/melon-light';
import MelonDark from '@dialpad/dialtone-tokens/themes/melon-dark';
import PlumLight from '@dialpad/dialtone-tokens/themes/plum-light';
import PlumDark from '@dialpad/dialtone-tokens/themes/plum-dark';
import SunflowerLight from '@dialpad/dialtone-tokens/themes/sunflower-light';
import SunflowerDark from '@dialpad/dialtone-tokens/themes/sunflower-dark';
import VerdantHazeLight from '@dialpad/dialtone-tokens/themes/verdant-haze-light';
import VerdantHazeDark from '@dialpad/dialtone-tokens/themes/verdant-haze-dark';
import ProtaDeuterLight from '@dialpad/dialtone-tokens/themes/prota-deuter-light';
import ProtaDeuterDark from '@dialpad/dialtone-tokens/themes/prota-deuter-dark';
import TritaLight from '@dialpad/dialtone-tokens/themes/trita-light';
import TritaDark from '@dialpad/dialtone-tokens/themes/trita-dark';
import Theme101Light from '@dialpad/dialtone-tokens/themes/101-light';
import Theme101Dark from '@dialpad/dialtone-tokens/themes/101-dark';
import Theme102Light from '@dialpad/dialtone-tokens/themes/102-light';
import Theme102Dark from '@dialpad/dialtone-tokens/themes/102-dark';
import Theme103Light from '@dialpad/dialtone-tokens/themes/103-light';
import Theme103Dark from '@dialpad/dialtone-tokens/themes/103-dark';
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
let currentBrandTheme = 'dp';

const themeMap = {
  'dp-light': DpLight,
  'dp-dark': DpDark,
  'tmo-light': TmoLight,
  'tmo-dark': TmoDark,
  'aegean-light': AegeanLight,
  'aegean-dark': AegeanDark,
  'botany-light': BotanyLight,
  'botany-dark': BotanyDark,
  'buttercream-light': ButtercreamLight,
  'buttercream-dark': ButtercreamDark,
  'high-desert-light': HighDesertLight,
  'high-desert-dark': HighDesertDark,
  'melon-light': MelonLight,
  'melon-dark': MelonDark,
  'plum-light': PlumLight,
  'plum-dark': PlumDark,
  'sunflower-light': SunflowerLight,
  'sunflower-dark': SunflowerDark,
  'verdant-haze-light': VerdantHazeLight,
  'verdant-haze-dark': VerdantHazeDark,
  'prota-deuter-light': ProtaDeuterLight,
  'prota-deuter-dark': ProtaDeuterDark,
  'trita-light': TritaLight,
  'trita-dark': TritaDark,
  '101-light': Theme101Light,
  '101-dark': Theme101Dark,
  '102-light': Theme102Light,
  '102-dark': Theme102Dark,
  '103-light': Theme103Light,
  '103-dark': Theme103Dark,
};

setTheme(DpLight);

const channel = addons.getChannel();

const updateTheme = (isDark, isHighContrast, brandTheme = 'dp') => {
  currentDarkMode = isDark;
  currentContrast = isHighContrast ? 'high' : 'default';
  currentBrandTheme = brandTheme;

  const themeKey = `${brandTheme}-${isDark ? 'dark' : 'light'}`;
  const baseTheme = themeMap[themeKey];

  if (!baseTheme) {
    console.warn(`Theme ${themeKey} not found, falling back to dp`);
    const fallbackKey = `dp-${isDark ? 'dark' : 'light'}`;
    const fallbackTheme = themeMap[fallbackKey];
    setTheme(fallbackTheme, document.documentElement, null);
    return;
  }

  const contrastTheme = isHighContrast ? (isDark ? HighContrastDark : HighContrastLight) : null;
  setTheme(baseTheme, document.documentElement, contrastTheme);
};

channel.on(DARK_MODE_EVENT_NAME, (isDark) => {
  updateTheme(isDark, currentContrast === 'high', currentBrandTheme);
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
    theme: {
      description: 'Brand theme',
      defaultValue: 'dp',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'dp', title: 'Dialpad' },
          { value: 'tmo', title: 'T-Mobile' },
          { value: 'aegean', title: 'Aegean' },
          { value: 'botany', title: 'Botany' },
          { value: 'buttercream', title: 'Buttercream' },
          { value: 'high-desert', title: 'High Desert' },
          { value: 'melon', title: 'Melon' },
          { value: 'plum', title: 'Plum' },
          { value: 'sunflower', title: 'Sunflower' },
          { value: 'verdant-haze', title: 'Verdant Haze' },
          { value: 'prota-deuter', title: 'Protanopia/Deuteranopia' },
          { value: 'trita', title: 'Tritanopia' },
          { value: '101', title: 'Theme 101' },
          { value: '102', title: 'Theme 102' },
          { value: '103', title: 'Theme 103' },
        ],
        dynamicTitle: true,
      },
    },
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
      const brandTheme = context.globals.theme || 'dp';
      updateTheme(currentDarkMode, isHighContrast, brandTheme);
      return story();
    },
  ],
};
