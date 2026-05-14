// Maps logical CSS naming tokens to their LTR-default physical aliases.
// Used by option_bar.vue so consumers can search "top", "bottom", "left", "right",
// "vertical", or "horizontal" and find logical-named props and slots.
//
// Each entry must be self-contained: a compound key like 'block-start' must list
// every alias a *BlockStart prop should match. The tokenizer does NOT fall back
// to the base 'block' entry — that would bleed opposite-edge aliases ('bottom')
// into block-start results.
export const LOGICAL_ALIASES = {
  'block-start': ['top', 'vertical'],
  'block-end': ['bottom', 'vertical'],
  'inline-start': ['left', 'horizontal'],
  'inline-end': ['right', 'horizontal'],
  block: ['top', 'bottom', 'vertical'],
  inline: ['left', 'right', 'horizontal'],
};
