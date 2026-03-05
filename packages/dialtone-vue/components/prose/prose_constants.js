export const PROSE_DISALLOWED_ELEMENTS = [
  'form', 'input', 'select', 'textarea', 'button',
  'fieldset', 'output', 'datalist', 'progress', 'meter',
  'optgroup', 'option',
];

export const PROSE_ALLOWED_ATTRIBUTES = {
  _global: ['id', 'lang', 'dir', 'translate', 'title'],
  a: ['href', 'target', 'rel', 'hreflang'],
  img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
  th: ['scope', 'colspan', 'rowspan', 'headers'],
  td: ['colspan', 'rowspan', 'headers'],
  ol: ['start', 'reversed', 'type'],
  blockquote: ['cite'],
  q: ['cite'],
  ins: ['cite'],
  del: ['cite'],
  time: ['datetime'],
  abbr: ['title'],
  input: ['type', 'checked', 'disabled'],
  details: ['open'],
  table: ['summary'],
  col: ['span'],
  colgroup: ['span'],
};
