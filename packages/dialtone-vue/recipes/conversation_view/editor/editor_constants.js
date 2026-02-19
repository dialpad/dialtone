export const EDITOR_SUPPORTED_LINK_PROTOCOLS = [
  /^https?:\/\//,
  /^http?:\/\//,
  /^ftp?:\/\//,
  /^ftps?:\/\//,
  /^ftps?:\/\//,
  /mailto:([^?]*)/,
];

export const EDITOR_DEFAULT_LINK_PREFIX = 'https://';

export default {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
};
