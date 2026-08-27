import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
// Import layered token CSS files
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';
import { addons } from 'storybook/preview-api';
import { setMode, setBrand, setContrast, initDialtoneTheme } from '@dialpad/dialtone-tokens/themes/config';

// Storybook shows a representative subset of the full Dialtone theme set, not
// all of it. This list is the only place to edit when that subset changes — the
// toolbar options and the loaded theme map are both derived from it. Paths stay
// literal so Vite can resolve them, and every import starts here at module
// scope, so they load concurrently rather than one after another.
const BRAND_IMPORTS = [
  ['dp', import('@dialpad/dialtone-tokens/themes/dp')],
  ['tmo', import('@dialpad/dialtone-tokens/themes/tmo')],
  ['aegean', import('@dialpad/dialtone-tokens/themes/aegean')],
  ['botany', import('@dialpad/dialtone-tokens/themes/botany')],
  ['buttercream', import('@dialpad/dialtone-tokens/themes/buttercream')],
  ['eucalyptus', import('@dialpad/dialtone-tokens/themes/eucalyptus')],
  ['high-desert', import('@dialpad/dialtone-tokens/themes/high-desert')],
  ['melon', import('@dialpad/dialtone-tokens/themes/melon')],
  ['mulberry', import('@dialpad/dialtone-tokens/themes/mulberry')],
  ['paprika', import('@dialpad/dialtone-tokens/themes/paprika')],
  ['plum', import('@dialpad/dialtone-tokens/themes/plum')],
  ['raincloud', import('@dialpad/dialtone-tokens/themes/raincloud')],
  ['sunflower', import('@dialpad/dialtone-tokens/themes/sunflower')],
  ['verdant-haze', import('@dialpad/dialtone-tokens/themes/verdant-haze')],
  ['prota-deuter', import('@dialpad/dialtone-tokens/themes/prota-deuter')],
  ['trita', import('@dialpad/dialtone-tokens/themes/trita')],
];

// Titles that title-casing the id can't derive.
const BRAND_TITLES = {
  'dp': 'Dialpad',
  'tmo': 'T-Mobile',
  'prota-deuter': 'Protanopia/Deuteranopia',
  'trita': 'Tritanopia',
};

const brandTitle = (id) => BRAND_TITLES[id] ??
  id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const highContrastImport = import('@dialpad/dialtone-tokens/themes/high-contrast');

let layeredThemes = {};
let HighContrast;

(async () => {
  layeredThemes = Object.fromEntries(await Promise.all(
    BRAND_IMPORTS.map(async ([id, module]) => [id, (await module).default]),
  ));
  HighContrast = (await highContrastImport).default;

  // Initialize layered theming once themes are loaded
  if (layeredThemes.dp) {
    initDialtoneTheme(layeredThemes.dp, 'light', document.documentElement);
  }
})();
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import { setup } from '@storybook/vue3-vite';
import React, { useState, useEffect } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import fixDefaultSlot from '../components/Plugins/FixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji';
import customEmojiJson from '@/common/custom-emoji.json';
import { dialtoneDarkTheme, dialtoneLightTheme } from './dialtone-themes.js';
import { DialtoneDocsPage } from './DialtoneDocsPage.js';
import { DtTooltipDirective } from '@/directives/tooltip_directive';
import { DtScrollbarDirective } from '@/directives/scrollbar_directive';
import { DtModeDirective } from '@/directives/mode_directive';
import { DtFocusgroupDirective } from '@/directives/focusgroup_directive';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';
import { DtStack } from '@/components/Stack';
import { faker } from '@faker-js/faker';

let currentContrast = 'default';
// Initialize dark mode from localStorage (storybook-dark-mode stores it there)
let currentDarkMode = (() => {
  try {
    const storedValue = localStorage.getItem('sb-addon-themes-3');
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      return parsed.current === 'dark';
    }
  } catch {
    // Ignore errors
  }
  return false; // Default to light mode
})();
let currentBrandTheme = 'dp';


const channel = addons.getChannel();

const updateTheme = (isDark, isHighContrast, brandTheme = 'dp') => {
  currentDarkMode = isDark;
  currentContrast = isHighContrast ? 'high' : 'default';
  currentBrandTheme = brandTheme;

  // Use layered theming system with data-dt-mode
  setMode(isDark ? 'dark' : 'light', document.documentElement);

  // `layeredThemes` is empty until the imports at the top of this file resolve.
  if (layeredThemes[brandTheme]) {
    setBrand(layeredThemes[brandTheme], document.documentElement);
  } else {
    // Themes might still be loading, try again
    setTimeout(() => {
      if (layeredThemes[brandTheme]) {
        setBrand(layeredThemes[brandTheme], document.documentElement);
      }
    }, 100);
  }

  setContrast(isHighContrast ? HighContrast : null, document.documentElement);
};

channel.on(DARK_MODE_EVENT_NAME, (isDark) => {
  updateTheme(isDark, currentContrast === 'high', currentBrandTheme);
});

// Initialize theme on load with current dark mode state
updateTheme(currentDarkMode, currentContrast === 'high', currentBrandTheme);

setEmojiAssetUrlSmall('https://static.dialpadcdn.com/joypixels/png/unicode/32/', '.png');
setEmojiAssetUrlLarge('https://static.dialpadcdn.com/joypixels/svg/unicode/', '.svg');
setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);

setup((app) => {
  app.use(fixDefaultSlot);
  app.use(DtTooltipDirective);
  app.use(DtScrollbarDirective);
  app.use(DtModeDirective);
  app.use(DtFocusgroupDirective);
  app.use(DtFocustrapDirective);
  app.component('DtStack', DtStack);
  // global seed, to make sure results are reproducible on percy and don't change on every reload too.
  faker.seed(6687422389464139);
});

export default {
  name: 'StorybookPreview',
  globalTypes: {
    theme: {
      description: 'Brand theme',
      defaultValue: 'dp',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: BRAND_IMPORTS.map(([value]) => ({ value, title: brandTitle(value) })),
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
          setMode(isDark ? 'dark' : 'light', document.documentElement);
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
  decorators: [
    (story, context) => {
      const isHighContrast = context.globals.contrast === 'high';
      const brandTheme = context.globals.theme || 'dp';
      updateTheme(currentDarkMode, isHighContrast, brandTheme);
      return story();
    },
  ],

  tags: ['autodocs'],
};
