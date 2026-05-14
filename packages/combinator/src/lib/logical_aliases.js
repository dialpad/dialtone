// Maps logical CSS naming tokens to their LTR-default physical aliases.
// Used by option_bar.vue so consumers can search "top", "bottom", "left", "right",
// "vertical", or "horizontal" and find logical-named props and slots.
export const LOGICAL_ALIASES = {
  'block-start': ['top'],
  'block-end': ['bottom'],
  'inline-start': ['left'],
  'inline-end': ['right'],
  block: ['top', 'bottom', 'vertical'],
  inline: ['left', 'right', 'horizontal'],
};
