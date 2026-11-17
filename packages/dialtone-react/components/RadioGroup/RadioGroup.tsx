import { useMemo, type ReactNode } from 'react';
import { useControllableState } from '../../common/hooks/useControllableState';
import { InputGroupContext, useInputGroupContext, type SetGroupValue } from '../../common/input';
import { hasContent } from '../../common/slots';
import { DtInputGroup, type DtInputGroupProps } from '../InputGroup';

type RadioGroupValue = string | number;

interface DtRadioGroupOwnProps {
  /**
   * The value of the selected radio. Controlled when set. Vue's `v-model`.
   */
  value?: RadioGroupValue;

  /** The initial value, when `value` isn't set. */
  defaultValue?: RadioGroupValue;

  /** Called with the new value when a radio in the group is selected (Vue's `update:modelValue`). */
  onValueChange?: (value: RadioGroupValue) => void;

  /** A data qa tag for the radio group */
  dataQaGroup?: string;

  /** A data qa tag for the radio group legend */
  dataQaGroupLegend?: string;

  /** A data qa tag for the radio group messages */
  dataQaGroupMessages?: string;

  /** The radios in the group (Vue's default slot). */
  children?: ReactNode;
}

/** Like DtInputGroup, which it extends, every other attribute and handler goes on the root `<fieldset>`, and so does `ref`. */
export interface DtRadioGroupProps extends DtRadioGroupOwnProps,
  Omit<DtInputGroupProps, keyof DtRadioGroupOwnProps> {}

/**
 * Vue's RadioGroup provides `selectedValue` on top of what InputGroup provides. Vue's `extends` has no React
 * counterpart, so the group is built on DtInputGroup and this provider overrides what the radios inside read.
 */
function RadioGroupProvider ({ selectedValue, setGroupValue, children }: {
  selectedValue: RadioGroupValue;
  setGroupValue: SetGroupValue;
  children?: ReactNode;
}) {
  const { groupContext } = useInputGroupContext();
  const contextValue = useMemo(() => {
    // InputGroup's `value` isn't part of RadioGroup's provided object.
    const { value: _value, ...rest } = groupContext;
    return { groupContext: { ...rest, selectedValue }, setGroupValue };
  }, [groupContext, selectedValue, setGroupValue]);

  return <InputGroupContext value={contextValue}>{children}</InputGroupContext>;
}

/**
 * Radio Groups are control elements that allow the user to make a single selection from a list of options.
 * @see https://dialtone.dialpad.com/components/radio_group.html
 */
export function DtRadioGroup ({
  value,
  defaultValue = '',
  onValueChange,
  dataQaGroup = 'radio-group',
  dataQaGroupLegend = 'radio-group-legend',
  dataQaGroupMessages = 'radio-group-messages',
  children,
  ...groupProps
}: DtRadioGroupProps) {
  const [selectedValue, setSelectedValue] = useControllableState<RadioGroupValue>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  // Provided to the radios in the group, which change this value and report it up.
  const setGroupValue: SetGroupValue = newValue => setSelectedValue(newValue as RadioGroupValue);

  // Vue's provider covers the whole component, legend slot included. DtInputGroup renders the legend inside its own
  // context, so non-string legend content gets the radio group provider too (empty legends stay empty).
  const { legend } = groupProps;
  const legendContent = typeof legend !== 'string' && hasContent(legend)
    ? (
        <RadioGroupProvider selectedValue={selectedValue} setGroupValue={setGroupValue}>
          {legend}
        </RadioGroupProvider>
      )
    : legend;

  return (
    <DtInputGroup
      dataQaGroup={dataQaGroup}
      dataQaGroupLegend={dataQaGroupLegend}
      dataQaGroupMessages={dataQaGroupMessages}
      {...groupProps}
      legend={legendContent}
    >
      <RadioGroupProvider
        selectedValue={selectedValue}
        setGroupValue={setGroupValue}
      >
        {children}
      </RadioGroupProvider>
    </DtInputGroup>
  );
}
