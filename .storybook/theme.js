/**
 * For more theme related documentation, please check out:
 * https://storybook.js.org/docs/react/configure/theming
 */
import { create } from '@storybook/theming/create';
import dialpadLogo from '../docs/assets/dialpad_logo_blurple.svg';

export default create({
  base: 'light',
  brandTitle: 'Dialpad storybook',
  brandImage: dialpadLogo,
  fontBase: 'Inter',
  colorPrimary: '#1738FA',
  colorSecondary: '#1111A1',
});
