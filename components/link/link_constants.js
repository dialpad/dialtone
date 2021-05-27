const LINK_CLASS = 'd-link';

export const DANGER = 'danger';
export const WARNING = 'warning';
export const SUCCESS = 'success';
export const MUTED = 'muted';
export const INVERTED = 'inverted';
export const LINK_VARIANTS = ['', DANGER, WARNING, SUCCESS, MUTED, INVERTED];

export const LINK_VARIANTS_CLASSES = {
  [DANGER]: `${LINK_CLASS}--${DANGER}`,
  [WARNING]: `${LINK_CLASS}--${WARNING}`,
  [SUCCESS]: `${LINK_CLASS}--${SUCCESS}`,
  [MUTED]: `${LINK_CLASS}--${MUTED}`,
  [INVERTED]: `${LINK_CLASS}--${INVERTED}`,
};
