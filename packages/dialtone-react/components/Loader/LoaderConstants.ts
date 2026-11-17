export const LOADER_KIND_MODIFIERS = {
  dots: '',
  spinner: 'd-loader--spinner',
} as const;

export type LoaderKind = keyof typeof LOADER_KIND_MODIFIERS;
