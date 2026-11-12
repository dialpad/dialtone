import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ValidationMessageType } from '../constants';
import type { ClassValue } from '../cx';
import { useControllableState } from '../hooks/useControllableState';
import type { InputGroupContextValue, SetGroupValue } from '../input/InputGroupContext';
import type { ChildProps } from '../input/useInput';
import type { MessagesProps } from '../input/useMessages';
import { formatMessages, getValidationState, type ValidationMessage } from '../utils';

/** The value of an input group: Vue's `value` prop, whose type the mixin declares. */
export type InputGroupValue = string | number | boolean | object | null;

/**
 * InputGroupMixin's props, for a component's props to extend. `messages`, `showMessages`, `messagesClass` and
 * `messagesChildProps` are MessagesProps', as the mixin declares them the same way.
 */
export interface InputGroupProps extends MessagesProps {
  /** The id of the input group. Defaults to a generated one. */
  id?: string;
  /**
   * The value of the input group. Controlled when set. Vue's `value` prop, which the mixin's `update:modelValue`
   * event reports back.
   */
  value?: InputGroupValue;
  /** The initial value, when `value` isn't set. */
  defaultValue?: InputGroupValue;
  /** Called with the new value when an input in the group reports one (Vue's `update:modelValue`). */
  onValueChange?: (value: InputGroupValue) => void;
  /** The name of the input group */
  name: string;
  /** The legend of the input group. Vue's `legend` prop and slot. */
  legend?: ReactNode;
  /** Disables the input group */
  disabled?: boolean;
  /** Used to customize the legend element */
  legendClass?: ClassValue;
  /** A set of props that are passed into the legend element */
  legendChildProps?: ChildProps;
}

export interface InputGroupState {
  /** `id`, or the generated one. */
  id: string;
  /** The group's value, as the inputs in it see it. */
  internalValue: InputGroupValue;
  /** Vue's `setGroupValue`: sets the value (when uncontrolled) and calls `onValueChange`. */
  setGroupValue: SetGroupValue;
  /** What the group provides to its inputs: pass it to `InputGroupContext.Provider`. */
  contextValue: InputGroupContextValue;
  /** `messages` with strings turned into messages of the default type (critical). */
  formattedMessages: ValidationMessage[];
  /** The highest-priority type among the messages, or null. */
  validationState: ValidationMessageType | null;
}

/**
 * InputGroupMixin: the context an input group provides to its inputs, and its validation state.
 *
 * Vue's `provideObj` is data the watchers keep current, and `internalValue` is the component's data that
 * `setGroupValue` writes. Here both are derived in render, and the value is state the hook owns, as for any v-model.
 * `name` is the exception: Vue's `provideObj.name` is set once and no watcher follows the prop, so it's kept as it was
 * on first render.
 *
 * @param props the component's props.
 * @param attrs `ariaLabel` is the aria-label the component passes on, which the mount-time warning looks for.
 */
export function useInputGroup (
  { id, value, defaultValue = null, onValueChange, name, legend, disabled = false, messages }: InputGroupProps,
  { ariaLabel }: { ariaLabel?: string } = {},
): InputGroupState {
  const generatedId = useId();
  const [internalValue, setGroupValue] = useControllableState<InputGroupValue>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  // Stable for as long as the group is, since every input in it reads the context.
  const stableSetGroupValue = useCallback<SetGroupValue>(
    newValue => setGroupValue(newValue as InputGroupValue),
    [setGroupValue],
  );

  const formattedMessages = useMemo(() => formatMessages(messages), [messages]);
  const validationState = getValidationState(formattedMessages);

  // Vue's provideObj.name is never updated after creation.
  const [providedName] = useState(name);
  const contextValue = useMemo<InputGroupContextValue>(() => ({
    groupContext: { name: providedName, disabled, validationState, value: internalValue },
    setGroupValue: stableSetGroupValue,
  }), [providedName, disabled, validationState, internalValue, stableSetGroupValue]);

  // Vue checks once, in mounted(). The ref keeps it to the first run: neither a later change of props nor StrictMode's
  // second mount warns again. `legend` is Vue's prop and slot in one: an empty string is the absent prop, and
  // `false` an empty slot that was passed.
  const checked = useRef(false);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    if ((legend == null || legend === '') && !ariaLabel) {
      console.warn('It is expected that an aria-label is provided when there is no legend.');
    }
  }, [legend, ariaLabel]);

  return {
    id: id ?? generatedId,
    internalValue,
    setGroupValue: stableSetGroupValue,
    contextValue,
    formattedMessages,
    validationState,
  };
}
