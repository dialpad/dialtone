// The parts of dialtone-vue's components/Popover/PopoverConstants.js that DtTooltip uses. Popover ports the rest.

export const POPOVER_APPEND_TO_VALUES = ['parent', 'body', 'root'] as const;

export type PopoverAppendTo = typeof POPOVER_APPEND_TO_VALUES[number];
