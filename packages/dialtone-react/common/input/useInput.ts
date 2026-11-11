import type { ReactNode } from 'react';
import type { ClassValue } from '../cx';
import type { ValidationMessageType } from '../constants';

/**
 * Vue's `*ChildProps` objects: props and attributes for a child element or component. Its `className` is
 * merged with the child's own classes, as Vue merges `class`.
 */
export type ChildProps = { className?: ClassValue } & Record<string, unknown>;

/** InputMixin's props. */
export interface InputProps {
  /** A provided label for the input */
  label?: string;
  /** The name of the input */
  name?: string;
  /** The value of the input */
  value?: string | number | boolean | object | null;
  /** Describes the input. Vue's description prop and slot. */
  description?: ReactNode;
  /** Disables the input */
  disabled?: boolean;
  /** The validation state of the input */
  validationState?: ValidationMessageType | '';
  /** Used to customize the input element */
  inputClass?: ClassValue;
  /** Used to customize the label container */
  labelClass?: ClassValue;
  /** Used to customize the description container */
  descriptionClass?: ClassValue;
  /** A set of props that are passed into the label container */
  labelChildProps?: ChildProps;
  /** A set of props that are passed into the description container */
  descriptionChildProps?: ChildProps;
}

/** An input's validation state: its own, or its group's (null when the group has none). */
export type InputValidationState = ValidationMessageType | '' | null;

export interface InputState {
  internalDisabled: boolean;
  internalValidationState: InputValidationState;
  /**
   * Warns when the input has neither a label nor an aria-label.
   * @param hasLabelOrLabel either a boolean indicating the label exists or the label itself
   * @param ariaLabel the aria-label passed (null/undefined if it's not passed)
   */
  validateInputLabels: (hasLabelOrLabel: boolean | string, ariaLabel?: string | null) => void;
}

function validateInputLabels (hasLabelOrLabel: boolean | string, ariaLabel?: string | null) {
  if (!hasLabelOrLabel && !ariaLabel) {
    console.warn('You must provide an aria-label when there is no label passed');
  }
}

/**
 * InputMixin. Vue keeps internal copies of `disabled` and `validationState`, synced by watchers so that
 * GroupableMixin can override them; in React they're derived during render, and useGroupable applies the
 * group's overrides.
 */
export function useInput ({ disabled = false, validationState = '' }: Pick<InputProps, 'disabled' | 'validationState'>): InputState {
  return { internalDisabled: disabled, internalValidationState: validationState, validateInputLabels };
}
