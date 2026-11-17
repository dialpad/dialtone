export const BUTTON_GROUP_ALIGNMENT = {
  start: 'd-btn-group--start',
  end: 'd-btn-group--end',
  'space-between': 'd-btn-group--space-between',
} as const;

export type ButtonGroupAlignment = keyof typeof BUTTON_GROUP_ALIGNMENT;
