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

const UNSAFE_URL_SCHEME = /^(javascript|vbscript|data|blob|file):/i;

// The URL parser trims leading and trailing C0 controls and spaces, and removes every tab, line feed and carriage
// return, so `java&#x09;script:` runs as `javascript:`. A space inside stays, so `data :x` is a relative link.
function withoutIgnoredUrlChars (value: string): string {
  const isTrimmed = (char: string) => char.charCodeAt(0) <= 0x20;
  const chars = Array.from(value);
  let start = 0;
  let end = chars.length;
  while (start < end && isTrimmed(chars[start])) start++;
  while (end > start && isTrimmed(chars[end - 1])) end--;
  return chars.slice(start, end).filter(char => char !== '\t' && char !== '\n' && char !== '\r').join('');
}

export function _isSafeProseUrl (value: string | null | undefined): boolean {
  return !UNSAFE_URL_SCHEME.test(withoutIgnoredUrlChars(value ?? ''));
}

// Only `_global` is guaranteed; any other tag may have no entry, so lookups are `| undefined`.
// Null prototype, so inherited keys such as `constructor` also look up as `undefined`.
export const PROSE_ALLOWED_ATTRIBUTES: Readonly<
  { _global: readonly string[] } & Record<string, readonly string[] | undefined>
> = Object.assign(Object.create(null), {
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
});
