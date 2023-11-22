import { addons } from '@storybook/addons';

if (process.env.STORYBOOK_ENV === 'production') {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
}

addons.setConfig({
  showRoots: true,
});
