export const EDITOR_SUPPORTED_LINK_PROTOCOLS = [
  /^https?:\/\//,
  /^http?:\/\//,
  /^ftp?:\/\//,
  /^ftps?:\/\//,
  /^ftps?:\/\//,
  /mailto:([^?]*)/,
];

export const EDITOR_DEFAULT_LINK_PREFIX = 'https://';

export const AVAILABLE_FONT_STYLES = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Courier New', value: 'Courier New' },
];

export default {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
  AVAILABLE_FONT_STYLES,
};
