import { useContext, type FocusEvent, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { SlotProp } from '../../common/slots';
import { DtButton, type DtButtonIconSlotScope, type DtButtonProps } from '../Button';
import {
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
} from './SegmentedControlConstants';

type ItemElement = HTMLButtonElement | HTMLAnchorElement;

interface DtSegmentedControlItemOwnProps {
  /** Unique value for this item, used for selection matching with the group's `value`. */
  value: string;

  /**
   * Accessible label for the button (aria-label).
   * Visible text comes from children, not this prop.
   * Required for icon-only items.
   */
  label?: string;

  /** Disables this individual item. */
  disabled?: boolean;

  /**
   * Custom class for this item's label container.
   * Overrides the parent's labelClass when provided.
   */
  labelClass?: ClassValue;

  /** Label text content */
  children?: ReactNode;

  /** Icon displayed at the inline-start (aka left) of the label. Receives `{ iconSize }`. */
  startIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Icon displayed at the inline-end (aka right) of the label. Receives `{ iconSize }`. */
  endIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Content rendered before the label (e.g. badges, indicators). */
  leading?: ReactNode;

  /** Content rendered after the label (e.g. badges, counts). */
  trailing?: ReactNode;

  /** Native button click event. */
  onClick?: (event: MouseEvent<ItemElement>) => void;

  /** Native button focus event. */
  onFocus?: (event: FocusEvent<ItemElement>) => void;

  /** The rendered button. */
  ref?: Ref<ItemElement>;
}

/** Own props, plus DtButton's (Vue's `$attrs`, bound to the button): `trailingClass`, `leadingClass` and so on. */
export type DtSegmentedControlItemProps = DtSegmentedControlItemOwnProps &
  Omit<DtButtonProps, keyof DtSegmentedControlItemOwnProps>;

/**
 * One option of a DtSegmentedControl: a DtButton with the radio role, whose state comes from the group.
 * @see https://dialtone.dialpad.com/components/segmented-control.html
 */
export function DtSegmentedControlItem ({
  value,
  label,
  disabled = false,
  labelClass,
  children,
  startIcon,
  endIcon,
  leading,
  trailing,
  className,
  onClick,
  onFocus,
  ref,
  ...attrs
}: DtSegmentedControlItemProps) {
  const groupContext = useContext(SEGMENTED_CONTROL_CONTEXT_KEY);
  const selectValue = useContext(SEGMENTED_CONTROL_SELECT_KEY);
  const setFocus = useContext(SEGMENTED_CONTROL_FOCUS_KEY);

  const isSelected = groupContext.selected === value;
  const isDisabled = groupContext.disabled || disabled;

  const handleClick = (event: MouseEvent<ItemElement>) => {
    if (!isDisabled) selectValue(value);
    onClick?.(event);
  };

  const handleFocus = (event: FocusEvent<ItemElement>) => {
    setFocus(value);
    onFocus?.(event);
  };

  return (
    <DtButton
      className={cx('d-segmented-control__item', className)}
      role="radio"
      aria-checked={String(isSelected) as 'true' | 'false'}
      tabIndex={isSelected && !isDisabled ? 0 : -1}
      active={isSelected}
      disabled={isDisabled}
      aria-disabled={isDisabled ? 'true' : undefined}
      aria-label={label}
      labelClass={['d-segmented-control__item-label', labelClass ?? groupContext.labelClass]}
      data-value={value}
      kind="muted"
      importance="clear"
      size={groupContext.size}
      data-qa="dt-segmented-control-item"
      startIcon={startIcon}
      endIcon={endIcon}
      leading={leading}
      trailing={trailing}
      {...attrs}
      onClick={handleClick}
      onFocus={handleFocus}
      ref={ref}
    >
      {children}
    </DtButton>
  );
}
