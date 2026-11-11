import { useState } from 'react';
import { useControllableState } from '../hooks/useControllableState';

/**
 * CheckableMixin's props. Vue's `modelValue` v-model is `checked` / `defaultChecked` / `onCheckedChange`.
 * Its `value` is narrower than InputProps' and replaces it, as CheckableMixin's prop does InputMixin's in Vue (the later
 * mixin wins), so a component with both extends `Omit<InputProps, 'value'>, CheckableProps` (DtCheckbox).
 */
export interface CheckableProps {
  /** Used to set the checked state of the checkable input. Controlled when set. */
  checked?: boolean;
  /** The initial checked state, when `checked` isn't set. */
  defaultChecked?: boolean;
  /** Called with the new checked state (Vue's `update:modelValue`). */
  onCheckedChange?: (checked: boolean) => void;
  /** Indeterminate State, toggling indeterminate checkbox will uncheck */
  indeterminate?: boolean;
  /** The value of the input */
  value?: string | number | boolean | null;
}

export interface CheckableState {
  internalChecked: boolean;
  /** Sets the checked state (when uncontrolled) and calls `onCheckedChange`. */
  setInternalChecked: (checked: boolean) => void;
  internalIndeterminate: boolean;
  /** Overrides `indeterminate` until the prop changes again. */
  setInternalIndeterminate: (indeterminate: boolean) => void;
}

/** CheckableMixin: the checked and indeterminate state of a checkable input. */
export function useCheckable ({
  checked,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
}: CheckableProps): CheckableState {
  const [internalChecked, setInternalChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  // Vue's watcher: the internal copy follows the prop whenever the prop changes, and the input may clear it in between.
  const [internalIndeterminate, setInternalIndeterminate] = useState(indeterminate);
  const [lastIndeterminate, setLastIndeterminate] = useState(indeterminate);
  if (indeterminate !== lastIndeterminate) {
    setLastIndeterminate(indeterminate);
    setInternalIndeterminate(indeterminate);
  }

  return { internalChecked, setInternalChecked, internalIndeterminate, setInternalIndeterminate };
}
