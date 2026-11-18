// Modal style modifiers
export const MODAL_KIND_MODIFIERS = {
  default: '',
  critical: 'd-modal--critical',
} as const;

export const MODAL_BANNER_KINDS = {
  critical: 'd-modal__banner--critical',
  info: 'd-modal__banner--info',
  positive: 'd-modal__banner--positive',
  warning: 'd-modal__banner--warning',
  base: 'd-modal__banner--general',
} as const;

export type ModalKind = keyof typeof MODAL_KIND_MODIFIERS;
export type ModalBannerKind = keyof typeof MODAL_BANNER_KINDS;
