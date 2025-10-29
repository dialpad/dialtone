import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { addons } from '@storybook/preview-api';
import { setTheme, setMode, setBrand, setContrast, initDialtoneTheme } from '@dialpad/dialtone-tokens/themes/config';

// Check if layered tokens are available
const layeredTokensEnabled = (() => {
  try {
    // Try to import layered CSS files
    import('@dialpad/dialtone-tokens/layered/tokens-core.css');
    import('@dialpad/dialtone-tokens/layered/tokens-base-colors.css');
    import('@dialpad/dialtone-tokens/layered/tokens-dp-colors.css');
    return true;
  } catch (e) {
    console.log('Layered tokens not available, falling back to legacy themes');
    return false;
  }
})();


// Layered theme imports - only load if layered tokens enabled
let Core, Dp, Tmo, Aegean, Botany, Buttercream, HighDesert, Melon, Plum, Sunflower, VerdantHaze;
let ProtaDeuter, Trita, Theme101, Theme102, Theme103, Theme137, HighContrast;

if (layeredTokensEnabled) {
  (async () => {
    Core = (await import('@dialpad/dialtone-tokens/themes/core')).default;
    Dp = (await import('@dialpad/dialtone-tokens/themes/dp')).default;
    Tmo = (await import('@dialpad/dialtone-tokens/themes/tmo')).default;
    Aegean = (await import('@dialpad/dialtone-tokens/themes/aegean')).default;
    Botany = (await import('@dialpad/dialtone-tokens/themes/botany')).default;
    Buttercream = (await import('@dialpad/dialtone-tokens/themes/buttercream')).default;
    HighDesert = (await import('@dialpad/dialtone-tokens/themes/high-desert')).default;
    Melon = (await import('@dialpad/dialtone-tokens/themes/melon')).default;
    Plum = (await import('@dialpad/dialtone-tokens/themes/plum')).default;
    Sunflower = (await import('@dialpad/dialtone-tokens/themes/sunflower')).default;
    VerdantHaze = (await import('@dialpad/dialtone-tokens/themes/verdant-haze')).default;
    ProtaDeuter = (await import('@dialpad/dialtone-tokens/themes/prota-deuter')).default;
    Trita = (await import('@dialpad/dialtone-tokens/themes/trita')).default;
    Theme101 = (await import('@dialpad/dialtone-tokens/themes/101')).default;
    Theme102 = (await import('@dialpad/dialtone-tokens/themes/102')).default;
    Theme103 = (await import('@dialpad/dialtone-tokens/themes/103')).default;
    Theme137 = (await import('@dialpad/dialtone-tokens/themes/137')).default;
    HighContrast = (await import('@dialpad/dialtone-tokens/themes/high-contrast')).default;

    // Initialize layered theming once themes are loaded
    if (Core && Dp) {
      initDialtoneTheme(Core, Dp, 'light', document.documentElement);
    }
  })();
}
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setup } from '@storybook/vue3';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode, DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import fixDefaultSlot from '../components/plugins/fixDefaultSlot';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji';
import customEmojiJson from '@/common/custom-emoji.json';
import { dialtoneDarkTheme, dialtoneLightTheme } from './dialtone-themes.js';
import { DtTooltipDirective } from '@/directives/tooltip_directive';
import { DtScrollbarDirective } from '@/directives/scrollbar_directive';
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
  } catch (e) {
    // Ignore errors
  }
  return false; // Default to light mode
})();
let currentBrandTheme = 'dp';


const channel = addons.getChannel();

// Function to get layered themes (ensures async imports have completed)
const getLayeredThemes = () => ({
  'dp': Dp,
  'tmo': Tmo,
  'aegean': Aegean,
  'botany': Botany,
  'buttercream': Buttercream,
  'high-desert': HighDesert,
  'melon': Melon,
  'plum': Plum,
  'sunflower': Sunflower,
  'verdant-haze': VerdantHaze,
  'prota-deuter': ProtaDeuter,
  'trita': Trita,
  '101': Theme101,
  '102': Theme102,
  '103': Theme103,
  '137': Theme137,
});

const updateTheme = (isDark, isHighContrast, brandTheme = 'dp') => {
  currentDarkMode = isDark;
  currentContrast = isHighContrast ? 'high' : 'default';
  currentBrandTheme = brandTheme;

  // Use layered theming system with data-dt-mode
  setMode(isDark ? 'dark' : 'light', document.documentElement);

  // Get current layered themes
  const layeredThemes = getLayeredThemes();

  // Wait for layered themes to load
  if (layeredThemes[brandTheme]) {
    setBrand(layeredThemes[brandTheme], document.documentElement);
  } else {
    // Themes might still be loading, try again
    setTimeout(() => {
      const themes = getLayeredThemes();
      if (themes[brandTheme]) {
        setBrand(themes[brandTheme], document.documentElement);
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
          { value: '137', title: 'Theme 137' },
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
