// The comparison's own page only hosts the two frames, so it needs Dialtone's
// CSS for its chrome and the toolbars it forwards to both frames: the same
// theme and contrast globals as Vue's, and the same sidebar order.
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';
import '../compare.css';
import type { Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { initDialtoneTheme, setMode } from '@dialpad/dialtone-tokens/themes/config';
import dp from '@dialpad/dialtone-tokens/themes/dp';
import { globalTypes } from '../../.storybook/shared';
import { readStoredDarkMode } from '../darkMode';

// The chrome follows the dark-mode toggle too, in the default Dialpad theme.
const root = document.documentElement;
initDialtoneTheme(dp, readStoredDarkMode() ? 'dark' : 'light', root);
addons.getChannel().on(DARK_MODE_EVENT_NAME, (isDark: boolean) => setMode(isDark ? 'dark' : 'light', root));

const preview: Preview = {
  globalTypes,
  parameters: {
    layout: 'fullscreen',
    // The args live in the comparison's own controls, under the frames.
    controls: { disable: true },
    options: {
      showPanel: false,
      // Vue's order verbatim (also in ../../.storybook/preview.tsx), so the
      // sidebars sort the same way. Storybook only reads it written inline.
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
  },
};

export default preview;
