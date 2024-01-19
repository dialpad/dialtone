export const WYSIWYG_EDITOR_SUPPORTED_LINK_PROTOCOLS = [
  /^https?:\/\//,
  /^http?:\/\//,
  /^ftp?:\/\//,
  /^ftps?:\/\//,
  /^ftps?:\/\//,
  /mailto:([^?]*)/,
];

export const WYSIWYG_EDITOR_DEFAULT_LINK_PREFIX = 'https://';

export default {
  WYSIWYG_EDITOR_DEFAULT_LINK_PREFIX,
  WYSIWYG_EDITOR_SUPPORTED_LINK_PROTOCOLS,
};
