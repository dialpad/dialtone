export const PROSE_SIZE_MODIFIERS = {
  100: 'd-prose--size-100',
  200: 'd-prose--size-200',
  300: '',
} as const;

export const PROSE_DENSITY_MODIFIERS = {
  100: 'd-prose--density-100',
  200: '',
  300: 'd-prose--density-300',
} as const;

export type ProseSize = keyof typeof PROSE_SIZE_MODIFIERS | `${keyof typeof PROSE_SIZE_MODIFIERS}`;
export type ProseDensity = keyof typeof PROSE_DENSITY_MODIFIERS | `${keyof typeof PROSE_DENSITY_MODIFIERS}`;

export const PROSE_DISALLOWED_ELEMENTS: readonly string[] = [
  'form', 'input', 'select', 'textarea', 'button',
  'fieldset', 'output', 'datalist', 'progress', 'meter',
  'optgroup', 'option',
];

export const _PROSE_ALLOWED_ATTRIBUTE_PREFIXES: readonly string[] = ['aria-'];

export const _PROSE_URL_ATTRIBUTES: readonly string[] = ['href', 'src', 'cite'];

const UNSAFE_URL_SCHEME = /^\s*(javascript|vbscript|data|blob|file):/i;

export function _isSafeProseUrl (value: string | null | undefined): boolean {
  return !UNSAFE_URL_SCHEME.test(value ?? '');
}

export const PROSE_ALLOWED_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  _global: ['id', 'lang', 'dir', 'translate', 'title', 'role'],
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
