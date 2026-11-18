import { createContext, type Context } from 'react';
import type { ClassValue } from '../../common/cx';

export const SEGMENTED_CONTROL_SIZES = ['100', '200', '300', '400', '500', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
export const SEGMENTED_CONTROL_SIZE_DEFAULT = 200;

export const SEGMENTED_CONTROL_SIZE_MODIFIERS = {
  // Numeric (preferred)
  100: 'd-segmented-control--xs',
  200: 'd-segmented-control--sm',
  300: 'd-segmented-control--md',
  400: 'd-segmented-control--lg',
  500: 'd-segmented-control--xl',
  // T-shirt aliases (deprecated)
  xs: 'd-segmented-control--xs',
  sm: 'd-segmented-control--sm',
  md: 'd-segmented-control--md',
  lg: 'd-segmented-control--lg',
  xl: 'd-segmented-control--xl',
} as const;

export const SEGMENTED_CONTROL_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const SEGMENTED_CONTROL_ORIENTATION_DEFAULT = 'horizontal';

export const SEGMENTED_CONTROL_ACTIVATION_MODES = ['auto', 'manual'] as const;
export const SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT = 'auto';

export const SEGMENTED_CONTROL_SPREADS = ['grow', 'evenly'] as const;
export const SEGMENTED_CONTROL_SPREAD_DEFAULT = 'grow';

export const SEGMENTED_CONTROL_ITEM_SELECTOR = '[role="radio"]';
export const SEGMENTED_CONTROL_DATA_VALUE_ATTR = 'data-value';

/** Vue's `ordinalSizeValidator(SEGMENTED_CONTROL_SIZES)`: a size as a string, or a numeric one as a number. */
export type SegmentedControlSize = typeof SEGMENTED_CONTROL_SIZES[number] | 100 | 200 | 300 | 400 | 500;
export type SegmentedControlOrientation = typeof SEGMENTED_CONTROL_ORIENTATIONS[number];
export type SegmentedControlActivationMode = typeof SEGMENTED_CONTROL_ACTIVATION_MODES[number];
export type SegmentedControlSpread = typeof SEGMENTED_CONTROL_SPREADS[number];

/** What DtSegmentedControl shares with its items: Vue's provided `groupContext`. */
export interface SegmentedControlGroupContext {
  /** The selected value. */
  selected: string;
  /** Whether the whole group is disabled. */
  disabled: boolean;
  size: SegmentedControlSize;
  /** The default label class for every item. */
  labelClass: ClassValue;
}

/** Vue's provided `selectValue`: selects an item's value, as a click on it does. */
export type SegmentedControlSelect = (value: string, options?: { animate?: boolean }) => void;

/** Vue's provided `setFocus`: records the focused item's value, for keyboard navigation. */
export type SegmentedControlFocus = (value: string) => void;

// Vue provides three values under these injection keys. In React each key is a context with the same name, and its
// default is Vue's inject default, so an item outside a group renders as it does in Vue.
export const SEGMENTED_CONTROL_CONTEXT_KEY: Context<SegmentedControlGroupContext> = createContext<
  SegmentedControlGroupContext
>({ selected: '', disabled: false, size: SEGMENTED_CONTROL_SIZE_DEFAULT, labelClass: '' });
SEGMENTED_CONTROL_CONTEXT_KEY.displayName = 'DtSegmentedControlContext';

export const SEGMENTED_CONTROL_SELECT_KEY: Context<SegmentedControlSelect> = createContext<SegmentedControlSelect>(
  () => {},
);
SEGMENTED_CONTROL_SELECT_KEY.displayName = 'DtSegmentedControlSelect';

export const SEGMENTED_CONTROL_FOCUS_KEY: Context<SegmentedControlFocus> = createContext<SegmentedControlFocus>(
  () => {},
);
SEGMENTED_CONTROL_FOCUS_KEY.displayName = 'DtSegmentedControlFocus';

export default {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  SEGMENTED_CONTROL_SIZE_MODIFIERS,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_SPREAD_DEFAULT,
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
};
