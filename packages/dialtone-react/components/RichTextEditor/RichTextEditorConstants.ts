export const RICH_TEXT_EDITOR_OUTPUT_FORMATS = [
  'text',
  'json',
  'html',
  'markdown',
] as const;

export const RICH_TEXT_EDITOR_AUTOFOCUS_TYPES = [
  'start',
  'end',
  'all',
] as const;

export const RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS = [
  'https',
  'http',
  'ftp',
  'ftps',
  'sftp',
  'mailto',
];

export type RichTextEditorOutputFormat = typeof RICH_TEXT_EDITOR_OUTPUT_FORMATS[number];
export type RichTextEditorAutoFocusType = typeof RICH_TEXT_EDITOR_AUTOFOCUS_TYPES[number];

export default {
  RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
};
