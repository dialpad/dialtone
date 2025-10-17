import '../css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
import { addons } from '@storybook/preview-api';
import { setTheme, setMode, setBrand, setContrast, initDialtoneTheme } from '@dialpad/dialtone-tokens/themes/config';

// Check if layered tokens are available
const layeredTokensEnabled = (() => {
  try {
    // Try to import layered CSS files
    import('@dialpad/dialtone-tokens/dist/css/layered/tokens-core.css');
    import('@dialpad/dialtone-tokens/dist/css/layered/tokens-base-colors.css');
    import('@dialpad/dialtone-tokens/dist/css/layered/tokens-dp-colors.css');
    return true;
  } catch (e) {
    console.log('Layered tokens not available, falling back to legacy themes');
    return false;
  }
})();

// Layered theme variables (loaded async)
let Core, Dp, Tmo, Aegean, Botany, Buttercream, HighDesert, Melon, Plum, Sunflower, VerdantHaze;
let ProtaDeuter, Trita, Theme101, Theme102, Theme103, Theme137, HighContrast;

// Async load layered themes
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
      // Set correct mode after initialization
      setMode(currentDarkMode ? 'dark' : 'light', document.documentElement);
    }
  })();
}

// Legacy theme imports for fallback
// Theme imports - keep in sync with:
// - packages/dialtone-vue3/.storybook/preview.jsx
// - apps/dialtone-documentation/docs/.vuepress/theme/client.js
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
// import Theme104Light from '@dialpad/dialtone-tokens/themes/104-light';
// import Theme104Dark from '@dialpad/dialtone-tokens/themes/104-dark';
// import Theme105Light from '@dialpad/dialtone-tokens/themes/105-light';
// import Theme105Dark from '@dialpad/dialtone-tokens/themes/105-dark';
// import Theme106Light from '@dialpad/dialtone-tokens/themes/106-light';
// import Theme106Dark from '@dialpad/dialtone-tokens/themes/106-dark';
// import Theme107Light from '@dialpad/dialtone-tokens/themes/107-light';
// import Theme107Dark from '@dialpad/dialtone-tokens/themes/107-dark';
// import Theme108Light from '@dialpad/dialtone-tokens/themes/108-light';
// import Theme108Dark from '@dialpad/dialtone-tokens/themes/108-dark';
// import Theme109Light from '@dialpad/dialtone-tokens/themes/109-light';
// import Theme109Dark from '@dialpad/dialtone-tokens/themes/109-dark';
// import Theme110Light from '@dialpad/dialtone-tokens/themes/110-light';
// import Theme110Dark from '@dialpad/dialtone-tokens/themes/110-dark';
// import Theme111Light from '@dialpad/dialtone-tokens/themes/111-light';
// import Theme111Dark from '@dialpad/dialtone-tokens/themes/111-dark';
// import Theme112Light from '@dialpad/dialtone-tokens/themes/112-light';
// import Theme112Dark from '@dialpad/dialtone-tokens/themes/112-dark';
// import Theme113Light from '@dialpad/dialtone-tokens/themes/113-light';
// import Theme113Dark from '@dialpad/dialtone-tokens/themes/113-dark';
// import Theme114Light from '@dialpad/dialtone-tokens/themes/114-light';
// import Theme114Dark from '@dialpad/dialtone-tokens/themes/114-dark';
// import Theme115Light from '@dialpad/dialtone-tokens/themes/115-light';
// import Theme115Dark from '@dialpad/dialtone-tokens/themes/115-dark';
// import Theme116Light from '@dialpad/dialtone-tokens/themes/116-light';
// import Theme116Dark from '@dialpad/dialtone-tokens/themes/116-dark';
// import Theme117Light from '@dialpad/dialtone-tokens/themes/117-light';
// import Theme117Dark from '@dialpad/dialtone-tokens/themes/117-dark';
// import Theme118Light from '@dialpad/dialtone-tokens/themes/118-light';
// import Theme118Dark from '@dialpad/dialtone-tokens/themes/118-dark';
// import Theme119Light from '@dialpad/dialtone-tokens/themes/119-light';
// import Theme119Dark from '@dialpad/dialtone-tokens/themes/119-dark';
// import Theme120Light from '@dialpad/dialtone-tokens/themes/120-light';
// import Theme120Dark from '@dialpad/dialtone-tokens/themes/120-dark';
// import Theme121Light from '@dialpad/dialtone-tokens/themes/121-light';
// import Theme121Dark from '@dialpad/dialtone-tokens/themes/121-dark';
// import Theme122Light from '@dialpad/dialtone-tokens/themes/122-light';
// import Theme122Dark from '@dialpad/dialtone-tokens/themes/122-dark';
// import Theme123Light from '@dialpad/dialtone-tokens/themes/123-light';
// import Theme123Dark from '@dialpad/dialtone-tokens/themes/123-dark';
// import Theme124Light from '@dialpad/dialtone-tokens/themes/124-light';
// import Theme124Dark from '@dialpad/dialtone-tokens/themes/124-dark';
// import Theme125Light from '@dialpad/dialtone-tokens/themes/125-light';
// import Theme125Dark from '@dialpad/dialtone-tokens/themes/125-dark';
// import Theme126Light from '@dialpad/dialtone-tokens/themes/126-light';
// import Theme126Dark from '@dialpad/dialtone-tokens/themes/126-dark';
// import Theme127Light from '@dialpad/dialtone-tokens/themes/127-light';
// import Theme127Dark from '@dialpad/dialtone-tokens/themes/127-dark';
// import Theme128Light from '@dialpad/dialtone-tokens/themes/128-light';
// import Theme128Dark from '@dialpad/dialtone-tokens/themes/128-dark';
// import Theme129Light from '@dialpad/dialtone-tokens/themes/129-light';
// import Theme129Dark from '@dialpad/dialtone-tokens/themes/129-dark';
// import Theme130Light from '@dialpad/dialtone-tokens/themes/130-light';
// import Theme130Dark from '@dialpad/dialtone-tokens/themes/130-dark';
// import Theme131Light from '@dialpad/dialtone-tokens/themes/131-light';
// import Theme131Dark from '@dialpad/dialtone-tokens/themes/131-dark';
// import Theme132Light from '@dialpad/dialtone-tokens/themes/132-light';
// import Theme132Dark from '@dialpad/dialtone-tokens/themes/132-dark';
// import Theme133Light from '@dialpad/dialtone-tokens/themes/133-light';
// import Theme133Dark from '@dialpad/dialtone-tokens/themes/133-dark';
// import Theme134Light from '@dialpad/dialtone-tokens/themes/134-light';
// import Theme134Dark from '@dialpad/dialtone-tokens/themes/134-dark';
// import Theme135Light from '@dialpad/dialtone-tokens/themes/135-light';
// import Theme135Dark from '@dialpad/dialtone-tokens/themes/135-dark';
// import Theme136Light from '@dialpad/dialtone-tokens/themes/136-light';
// import Theme136Dark from '@dialpad/dialtone-tokens/themes/136-dark';
import Theme137Light from '@dialpad/dialtone-tokens/themes/137-light';
import Theme137Dark from '@dialpad/dialtone-tokens/themes/137-dark';
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
  // '104-light': Theme104Light,
  // '104-dark': Theme104Dark,
  // '105-light': Theme105Light,
  // '105-dark': Theme105Dark,
  // '106-light': Theme106Light,
  // '106-dark': Theme106Dark,
  // '107-light': Theme107Light,
  // '107-dark': Theme107Dark,
  // '108-light': Theme108Light,
  // '108-dark': Theme108Dark,
  // '109-light': Theme109Light,
  // '109-dark': Theme109Dark,
  // '110-light': Theme110Light,
  // '110-dark': Theme110Dark,
  // '111-light': Theme111Light,
  // '111-dark': Theme111Dark,
  // '112-light': Theme112Light,
  // '112-dark': Theme112Dark,
  // '113-light': Theme113Light,
  // '113-dark': Theme113Dark,
  // '114-light': Theme114Light,
  // '114-dark': Theme114Dark,
  // '115-light': Theme115Light,
  // '115-dark': Theme115Dark,
  // '116-light': Theme116Light,
  // '116-dark': Theme116Dark,
  // '117-light': Theme117Light,
  // '117-dark': Theme117Dark,
  // '118-light': Theme118Light,
  // '118-dark': Theme118Dark,
  // '119-light': Theme119Light,
  // '119-dark': Theme119Dark,
  // '120-light': Theme120Light,
  // '120-dark': Theme120Dark,
  // '121-light': Theme121Light,
  // '121-dark': Theme121Dark,
  // '122-light': Theme122Light,
  // '122-dark': Theme122Dark,
  // '123-light': Theme123Light,
  // '123-dark': Theme123Dark,
  // '124-light': Theme124Light,
  // '124-dark': Theme124Dark,
  // '125-light': Theme125Light,
  // '125-dark': Theme125Dark,
  // '126-light': Theme126Light,
  // '126-dark': Theme126Dark,
  // '127-light': Theme127Light,
  // '127-dark': Theme127Dark,
  // '128-light': Theme128Light,
  // '128-dark': Theme128Dark,
  // '129-light': Theme129Light,
  // '129-dark': Theme129Dark,
  // '130-light': Theme130Light,
  // '130-dark': Theme130Dark,
  // '131-light': Theme131Light,
  // '131-dark': Theme131Dark,
  // '132-light': Theme132Light,
  // '132-dark': Theme132Dark,
  // '133-light': Theme133Light,
  // '133-dark': Theme133Dark,
  // '134-light': Theme134Light,
  // '134-dark': Theme134Dark,
  // '135-light': Theme135Light,
  // '135-dark': Theme135Dark,
  // '136-light': Theme136Light,
  // '136-dark': Theme136Dark,
  '137-light': Theme137Light,
  '137-dark': Theme137Dark,
};

// Initialize with default theme based on layered tokens availability
if (!layeredTokensEnabled) {
  setTheme(DpLight);
}

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

  if (layeredTokensEnabled) {
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
  } else {
    // Fallback to legacy theming system
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
  }
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
