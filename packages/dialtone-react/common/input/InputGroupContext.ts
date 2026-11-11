import { createContext, useContext } from 'react';
import type { ValidationMessageType } from '../constants';

/**
 * What an input group shares with the inputs inside it: Vue's `groupContext`, InputGroupMixin's `provideObj`.
 * An input is in a group when the context has a `name` key, even an empty one.
 */
export interface GroupContext {
  /** The group's name, used as the name of the inputs that don't set their own. */
  name?: string;
  /** Disables every input in the group. */
  disabled?: boolean;
  /** The group's validation state, from its messages. It overrides each input's own. */
  validationState?: ValidationMessageType | null;
  /** InputGroup: the group's value. */
  value?: unknown;
  /** CheckboxGroup: the values of the checked checkboxes. */
  selectedValues?: unknown[];
  /** RadioGroup: the value of the checked radio. */
  selectedValue?: unknown;
}

/**
 * Vue's `setGroupValue`: an input reports its value to its group. CheckboxGroup's also takes whether the
 * checkbox is now checked; InputGroup's and RadioGroup's take the value only.
 */
export type SetGroupValue = (value: unknown, checked?: boolean) => void;

/** What InputGroupMixin provides, under the same keys. */
export interface InputGroupContextValue {
  groupContext: GroupContext;
  setGroupValue: SetGroupValue;
}

/** Provided by input groups (InputGroup, CheckboxGroup, RadioGroup). The default is GroupableMixin's inject defaults: no group. */
export const InputGroupContext = createContext<InputGroupContextValue>({
  groupContext: {},
  setGroupValue: () => {},
});

export function useInputGroupContext (): InputGroupContextValue {
  return useContext(InputGroupContext);
}
