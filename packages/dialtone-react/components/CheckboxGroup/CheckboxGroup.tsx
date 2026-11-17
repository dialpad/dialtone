import { useMemo, type ReactNode } from 'react';
import { useControllableState } from '../../common/hooks/useControllableState';
import { InputGroupContext, useInputGroupContext, type SetGroupValue } from '../../common/input';
import { DtInputGroup, type DtInputGroupProps } from '../InputGroup';

type CheckboxGroupValue = unknown[];

interface DtCheckboxGroupOwnProps {
  /**
   * The values of the checked checkboxes. Controlled when set. Vue's `v-model` (an array).
   */
  value?: CheckboxGroupValue;

  /** The initial values, when `value` isn't set. */
  defaultValue?: CheckboxGroupValue;

  /** Called with the selected values when a checkbox in the group is checked or unchecked (Vue's `update:modelValue`). */
  onValueChange?: (value: CheckboxGroupValue) => void;

  /** A data qa tag for the checkbox group */
  dataQaGroup?: string;

  /** A data qa tag for the checkbox group legend */
  dataQaGroupLegend?: string;

  /** A data qa tag for the checkbox group messages */
  dataQaGroupMessages?: string;

  /** The checkboxes in the group (Vue's default slot). */
  children?: ReactNode;
}

/** Like DtInputGroup, which it extends, every other attribute and handler goes on the root `<fieldset>`, and so does `ref`. */
export interface DtCheckboxGroupProps extends DtCheckboxGroupOwnProps,
  Omit<DtInputGroupProps, keyof DtCheckboxGroupOwnProps> {}

/**
 * Vue's CheckboxGroup provides `selectedValues` on top of what InputGroup provides, and its own `setGroupValue`,
 * which also takes whether the checkbox is now checked. Vue's `extends` has no React counterpart, so the group is
 * built on DtInputGroup and this provider overrides what the checkboxes inside read.
 */
function CheckboxGroupProvider ({ selectedValues, setGroupValue, children }: {
  selectedValues: CheckboxGroupValue;
  setGroupValue: SetGroupValue;
  children?: ReactNode;
}) {
  const { groupContext } = useInputGroupContext();
  const contextValue = useMemo(() => {
    // InputGroup's `value` isn't part of CheckboxGroup's provided object.
    const { value: _value, ...rest } = groupContext;
    return { groupContext: { ...rest, selectedValues }, setGroupValue };
  }, [groupContext, selectedValues, setGroupValue]);

  return <InputGroupContext value={contextValue}>{children}</InputGroupContext>;
}

/**
 * Checkbox Groups are convenience components for a grouping of related Checkboxes.
 * While each Checkbox within the group is independent, the `value` on the group provides
 * a convenient interface for determining which Checkboxes within the group are checked.
 * @see https://dialtone.dialpad.com/components/checkbox_group.html
 */
export function DtCheckboxGroup ({
  value,
  defaultValue = [],
  onValueChange,
  dataQaGroup = 'checkbox-group',
  dataQaGroupLegend = 'checkbox-group-legend',
  dataQaGroupMessages = 'checkbox-group-messages',
  children,
  ...groupProps
}: DtCheckboxGroupProps) {
  const [selectedValues, setSelectedValues] = useControllableState<CheckboxGroupValue>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  // Provided to the checkboxes in the group, which change this value and report it up.
  const setGroupValue: SetGroupValue = (checkboxValue, checked) => {
    if (!checked) {
      setSelectedValues(selectedValues.filter(checkedValue => checkedValue !== checkboxValue));
    } else if (!selectedValues.includes(checkboxValue)) {
      setSelectedValues([...selectedValues, checkboxValue]);
    } else {
      // Already selected: Vue still emits the (unchanged) values.
      setSelectedValues(selectedValues);
    }
  };

  return (
    <DtInputGroup
      dataQaGroup={dataQaGroup}
      dataQaGroupLegend={dataQaGroupLegend}
      dataQaGroupMessages={dataQaGroupMessages}
      {...groupProps}
    >
      <CheckboxGroupProvider
        selectedValues={selectedValues}
        setGroupValue={setGroupValue}
      >
        {children}
      </CheckboxGroupProvider>
    </DtInputGroup>
  );
}
