export const EDITOR_SUPPORTED_LINK_PROTOCOLS = [
  /^https?:\/\//,
  /^http?:\/\//,
  /^ftp?:\/\//,
  /^ftps?:\/\//,
  /^ftps?:\/\//,
  /mailto:([^?]*)/,
];

export const EDITOR_DEFAULT_LINK_PREFIX = 'https://';

export const EDITOR_DEFAULT_FONT_COLOR = '#000000';

export default {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
  EDITOR_DEFAULT_FONT_COLOR,
};
