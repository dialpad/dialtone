/**
 * For more theme related documentation, please check out:
 * https://storybook.js.org/docs/react/configure/theming
 */
import { create } from '@storybook/theming/create';

const _baseThemeVariables = {
  brandTitle: 'Dialpad storybook',
  brandUrl: 'https://dialpad.design',
  brandImage: 'https://static.dialpadcdn.com/dialtone/dialpad_logo.svg',
  fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
}

export const dialtoneDarkTheme = create({
  base: 'dark',
  ..._baseThemeVariables,
  appBg: '#1B1B1B', // --dt-color-surface-secondary
  appContentBg: '#080808', // --dt-color-surface-primary

  textColor: '#FFFFFF', // --dt-color-foreground-primary
  textInverseColor: '#000000', // --dt-color-foreground-primary-inverted

  barBg: '#1B1B1B', // --dt-color-surface-secondary

  colorSecondary: '#AB7EFF', // --dt-color-purple-400
});
export const dialtoneLightTheme = create({
  base: 'light',
  ..._baseThemeVariables,
  appBg: '#F9F9F9', // --dt-color-surface-secondary
  appContentBg: '#FFFFFF', // --dt-color-surface-primary

  textColor: '#000000', // --dt-color-foreground-primary
  textInverseColor: '#FFFFFF', // --dt-color-foreground-primary-inverted

  barBg: '#F9F9F9', // --dt-color-surface-secondary

  colorSecondary: '#7C52FF', // --dt-color-purple-400
});
