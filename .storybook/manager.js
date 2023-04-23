import { addons } from '@storybook/addons';
import dialtoneTheme from './dialtone-theme.js';

const CSS_TO_HIDE_TEST_SECTION_FROM_SIDEBAR = `
#visual-testing,
*[data-parent-id*="visual-testing"],
*[title*="Visual Testing"] {
  display: none !important;
}
`;

if (process.env.STORYBOOK_ENV === 'production') {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
  style.appendChild(
    document.createTextNode(CSS_TO_HIDE_TEST_SECTION_FROM_SIDEBAR)
  );
}

addons.setConfig({
  showRoots: true,
  theme: dialtoneTheme,
});
