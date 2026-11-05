// Mirrors packages/dialtone-vue/.storybook/preview.js: same CSS in the same
// order, same theme and contrast globals, same dark-mode wiring and parameters.
// Left out: docs (page, container, autodocs tag), Vue's setup() plugins and
// directives, the faker seed (no React story uses faker), and the emoji asset
// setup (add it here once common/emoji is ported).
import '../../dialtone-vue/css/dialtone-globals.less';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import 'overlayscrollbars/overlayscrollbars.css';
// Import layered token CSS files
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';
import type { Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { setMode, setBrand, setContrast, initDialtoneTheme } from '@dialpad/dialtone-tokens/themes/config';
import type { BrandTheme, ContrastTheme, Mode } from '@dialpad/dialtone-tokens/themes/config';
import { createThemeController } from '../../dialtone-vue/.storybook/theme-controller.js';
import { BRAND_IDS, globalTypes } from './shared';
import type { BrandId } from './shared';

// One import per brand in shared.ts (the Record makes a missing one a type
// error). Paths stay literal so Vite can resolve them, and every import starts
// here at module scope, so they load concurrently.
const BRAND_LOADERS: Record<BrandId, () => Promise<unknown>> = {
  'dp': () => import('@dialpad/dialtone-tokens/themes/dp'),
  'tmo': () => import('@dialpad/dialtone-tokens/themes/tmo'),
  'aegean': () => import('@dialpad/dialtone-tokens/themes/aegean'),
  'botany': () => import('@dialpad/dialtone-tokens/themes/botany'),
  'buttercream': () => import('@dialpad/dialtone-tokens/themes/buttercream'),
  'eucalyptus': () => import('@dialpad/dialtone-tokens/themes/eucalyptus'),
  'high-desert': () => import('@dialpad/dialtone-tokens/themes/high-desert'),
  'melon': () => import('@dialpad/dialtone-tokens/themes/melon'),
  'mulberry': () => import('@dialpad/dialtone-tokens/themes/mulberry'),
  'paprika': () => import('@dialpad/dialtone-tokens/themes/paprika'),
  'plum': () => import('@dialpad/dialtone-tokens/themes/plum'),
  'raincloud': () => import('@dialpad/dialtone-tokens/themes/raincloud'),
  'sunflower': () => import('@dialpad/dialtone-tokens/themes/sunflower'),
  'verdant-haze': () => import('@dialpad/dialtone-tokens/themes/verdant-haze'),
  'prota-deuter': () => import('@dialpad/dialtone-tokens/themes/prota-deuter'),
  'trita': () => import('@dialpad/dialtone-tokens/themes/trita'),
};

const BRAND_IMPORTS = BRAND_IDS.map(id => [id, BRAND_LOADERS[id]()] as const);

const highContrastImport = import('@dialpad/dialtone-tokens/themes/high-contrast');

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

const themeController = createThemeController({
  brandImports: BRAND_IMPORTS,
  highContrastImport,
  initialize: (theme: BrandTheme) => initDialtoneTheme(theme, 'light', document.documentElement),
  applyMode: (mode: Mode) => setMode(mode, document.documentElement),
  applyBrand: (theme: BrandTheme) => setBrand(theme, document.documentElement),
  applyContrast: (theme: ContrastTheme | null) => setContrast(theme, document.documentElement),
});

const channel = addons.getChannel();

const updateTheme = (isDark: boolean, isHighContrast: boolean, brandTheme = 'dp') => {
  currentDarkMode = isDark;
  currentContrast = isHighContrast ? 'high' : 'default';
  currentBrandTheme = brandTheme;

  void themeController.update({
    mode: isDark ? 'dark' : 'light',
    brand: brandTheme,
    highContrast: isHighContrast,
  });
};

channel.on(DARK_MODE_EVENT_NAME, (isDark: boolean) => {
  updateTheme(isDark, currentContrast === 'high', currentBrandTheme);
});

// Initialize theme on load with current dark mode state
updateTheme(currentDarkMode, currentContrast === 'high', currentBrandTheme);

const preview: Preview = {
  globalTypes,
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
      // Vue's order verbatim, so both sidebars sort the same way.
      storySort: {
        method: 'alphabetical',
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

    percy: { globalShow: true },
  },
  decorators: [
    (Story, context) => {
      const isHighContrast = context.globals.contrast === 'high';
      const brandTheme = context.globals.theme || 'dp';
      updateTheme(currentDarkMode, isHighContrast, brandTheme);
      return <Story />;
    },
  ],
};

export default preview;
