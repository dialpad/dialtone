// What the React and comparison Storybooks share: the theme and contrast
// toolbars, so both match Vue's. (storySort can't live here: Storybook reads it
// statically from each preview file, so it must be written inline there.)
import type { GlobalTypes } from 'storybook/internal/types';

// Keep in step with BRAND_IMPORTS in Vue's preview.js, so every Storybook
// offers the same themes. preview.tsx needs one import per id (typechecked).
export const BRAND_IDS = [
  'dp',
  'tmo',
  'aegean',
  'botany',
  'buttercream',
  'eucalyptus',
  'high-desert',
  'melon',
  'mulberry',
  'paprika',
  'plum',
  'raincloud',
  'sunflower',
  'verdant-haze',
  'prota-deuter',
  'trita',
] as const;

export type BrandId = (typeof BRAND_IDS)[number];

// Titles that title-casing the id can't derive.
const BRAND_TITLES: Partial<Record<BrandId, string>> = {
  'dp': 'Dialpad',
  'tmo': 'T-Mobile',
  'prota-deuter': 'Protanopia/Deuteranopia',
  'trita': 'Tritanopia',
};

const brandTitle = (id: BrandId) => BRAND_TITLES[id] ??
  id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export const globalTypes: GlobalTypes = {
  theme: {
    description: 'Brand theme',
    defaultValue: 'dp',
    toolbar: {
      title: 'Theme',
      icon: 'paintbrush',
      items: BRAND_IDS.map(value => ({ value, title: brandTitle(value) })),
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
};

// The dark-mode addon keeps its state in this origin's localStorage; reading it
// gives the current mode before the addon's first event arrives.
export function readStoredDarkMode (): boolean {
  try {
    const stored = localStorage.getItem('sb-addon-themes-3');
    return stored ? JSON.parse(stored).current === 'dark' : false;
  } catch {
    return false;
  }
}
