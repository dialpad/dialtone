export const CODEBLOCK_SIZES = ['100', '200', '300', '400', 'xs', 'sm', 'md', 'lg'] as const;
export const CODEBLOCK_SIZE_DEFAULT = 200;

export type CodeblockSize = (typeof CODEBLOCK_SIZES)[number] | 100 | 200 | 300 | 400;

// Numeric → CSS class suffix mapping (numeric values use the t-shirt class suffix)
export const CODEBLOCK_SIZE_MAP: Record<string, string> = {
  100: 'xs',
  200: 'sm',
  300: 'md',
  400: 'lg',
};
