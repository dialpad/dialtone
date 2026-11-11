import { useEffect, useRef } from 'react';
import type { ValidationMessageType } from '../constants';
import { useInputGroupContext, type GroupContext, type SetGroupValue } from './InputGroupContext';
import type { InputState, InputValidationState } from './useInput';

export interface GroupableState {
  groupContext: GroupContext;
  setGroupValue: SetGroupValue;
  hasGroup: boolean;
  groupName: string;
  groupValue: unknown;
  groupDisabled: boolean;
  groupValidationState: ValidationMessageType | null;
  /** The input's own name, or else its group's. */
  internalName: string;
  /** The input's value, or its group's while in one. */
  internalValue: unknown;
  /** useInput's, or also disabled by the group while in one. */
  internalDisabled: boolean;
  /** useInput's, unless the group has one while in one. */
  internalValidationState: InputValidationState;
}

/**
 * GroupableMixin: the group context an input group provides, and the input state the group overrides.
 * Vue's watchers write the group's values into InputMixin's data while in a group; here they're derived from
 * `input` (useInput's result) during render. So in a group the result always combines both sides, where Vue's is
 * whichever side changed last (after an input's own `disabled` goes from true to false, Vue enables it in a disabled
 * group). And InputGroupContext is a context of its own: in Vue, DtTabGroup also provides `groupContext` (without
 * `name` or `setGroupValue`), so an input in its TabPanel stops reading its input group while still writing to it.
 */
export function useGroupable (
  { name = '', value = null }: { name?: string; value?: unknown },
  input: Pick<InputState, 'internalDisabled' | 'internalValidationState'>,
): GroupableState {
  const { groupContext, setGroupValue } = useInputGroupContext();
  const hasGroup = Object.hasOwn(groupContext, 'name');
  const groupName = groupContext.name ?? '';
  const groupValue = groupContext.value;
  const groupDisabled = groupContext.disabled ?? false;
  const groupValidationState = groupContext.validationState ?? null;

  // Vue checks once, in created(). The ref keeps it to the first run: neither a later change of name nor StrictMode's
  // second mount warns again.
  const checkedName = useRef(false);
  useEffect(() => {
    if (checkedName.current) return;
    checkedName.current = true;
    if (!!name && hasGroup && groupName !== name) {
      console.warn(
        'Component is being used inside a Group. Did you mean to override the name prop value ' +
        `(${groupName}) with (${name})? It is recommended to only set name at the Group level.`,
      );
    }
  }, [name, hasGroup, groupName]);

  return {
    groupContext,
    setGroupValue,
    hasGroup,
    groupName,
    groupValue,
    groupDisabled,
    groupValidationState,
    internalName: name || groupName,
    internalValue: hasGroup ? groupValue : value,
    internalDisabled: hasGroup ? input.internalDisabled || groupDisabled : input.internalDisabled,
    internalValidationState: hasGroup
      ? groupValidationState || input.internalValidationState
      : input.internalValidationState,
  };
}
