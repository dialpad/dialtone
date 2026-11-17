import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { SlotProp } from '../../common/slots';
import { DtButton, type DtButtonIconSlotScope, type DtButtonProps } from '../Button/Button';
import type { ButtonSize } from '../Button/ButtonConstants';
import { useTabGroupContext } from './TabGroupContext';

type TabElement = HTMLButtonElement | HTMLAnchorElement;

interface DtTabOwnProps {
  /** Id of the tab */
  id: string;

  /** Id of the associated content panel */
  panelId: string;

  /** Describes the tab */
  label?: string;

  /**
   * Controls the state of the tab
   * @values true, false
   */
  selected?: boolean;

  /**
   * If true, disables the tab
   * @values true, false
   */
  disabled?: boolean;

  /** Used to customize the tab element */
  tabClass?: ClassValue;

  /** Used to customize the label container */
  labelClass?: ClassValue;

  /** Used to customize the leading container */
  leadingClass?: ClassValue;

  /** Used to customize the trailing container */
  trailingClass?: ClassValue;

  /** default slot, defaults contains dt-button */
  children?: ReactNode;

  /** Icon displayed at the start (aka left) of the tab */
  startIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Icon displayed at the end (aka right) of the tab */
  endIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Content at the start of the tab, before the label */
  leading?: ReactNode;

  /** Content at the end of the tab, after the label */
  trailing?: ReactNode;

  /** Native button focus event */
  onFocus?: (event: FocusEvent<TabElement>) => void;

  /** Native button click event */
  onClick?: (event: MouseEvent<TabElement>) => void;


  /** The tab's `<button>`. */
  ref?: Ref<TabElement>;
}

/**
 * Other attributes go to the tab's DtButton, as Vue's `$attrs` do; the group decides its kind, importance, active
 * state and size.
 */
export type DtTabProps = DtTabOwnProps &
  Omit<DtButtonProps, keyof DtTabOwnProps | 'importance' | 'kind' | 'active' | 'size'>;

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export function DtTab ({
  id,
  panelId,
  label = '',
  selected = false,
  disabled = false,
  tabClass = '',
  labelClass = '',
  leadingClass = '',
  trailingClass = '',
  children,
  startIcon,
  endIcon,
  leading,
  trailing,
  className,
  onFocus,
  onClick,
  ref,
  ...attrs
}: DtTabProps) {
  const { groupContext, setFocus, setSelected } = useTabGroupContext();

  const isDisabled = groupContext.disabled || disabled;
  const isSelected = groupContext.selected === panelId;
  const focusedId = groupContext.focusedTabId;
  const isFocusTarget = focusedId ? focusedId === id : isSelected;
  const buttonSize = groupContext.size === 'default' ? undefined : groupContext.size as ButtonSize;

  const buttonKind = () => {
    if (groupContext.outlined) return groupContext.kind === 'muted' ? 'muted' : 'default';
    if (groupContext.kind === 'muted') return 'muted';
    return isSelected ? 'default' : 'muted';
  };

  const buttonImportance = groupContext.outlined && isSelected ? 'outlined' : 'clear';

  const buttonActive = !groupContext.outlined && groupContext.kind === 'muted' && isSelected;

  // Vue's mounted(): a tab mounted `selected` selects its panel, once per instance. The ref keeps it to the mount, as
  // in Vue: a later change of `selected` or `panelId` doesn't select the panel.
  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (selected) setSelected(panelId);
  }, [selected, panelId, setSelected]);

  // Vue's beforeUnmount(): a removed tab hands back the roving focus.
  const onUnmount = useEffectEvent(() => {
    if (groupContext.focusedTabId === id) setFocus(null);
  });
  useEffect(() => () => onUnmount(), []);

  const handleFocus = (event: FocusEvent<TabElement>) => {
    setFocus(id);
    onFocus?.(event);
  };

  return (
    <DtButton
      id={`dt-tab-${id}`}
      className={cx(
        'd-tablist__item',
        tabClass,
        { 'd-tablist__item--vertical': groupContext.orientation === 'vertical' },
        { 'd-btn--disabled': isDisabled },
        { 'd-tab--is-selected': !groupContext.outlined && groupContext.kind !== 'muted' && isSelected },
        className,
      )}
      importance={buttonImportance}
      kind={buttonKind()}
      active={buttonActive}
      size={buttonSize}
      role="tab"
      aria-selected={`${isSelected}`}
      aria-controls={`dt-panel-${panelId}`}
      aria-label={label}
      aria-disabled={isDisabled ? 'true' : undefined}
      labelClass={labelClass}
      leadingClass={leadingClass}
      trailingClass={trailingClass}
      data-qa="dt-tab"
      tabIndex={isFocusTarget ? 0 : -1}
      startIcon={startIcon}
      endIcon={endIcon}
      leading={leading}
      trailing={trailing}
      {...attrs}
      onFocus={handleFocus}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </DtButton>
  );
}
