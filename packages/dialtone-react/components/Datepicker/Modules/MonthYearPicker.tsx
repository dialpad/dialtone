import { useEffect, useImperativeHandle, useRef, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import type { Placement } from 'tippy.js';
import { useI18n } from '../../../common/localization';
import { DtIconChevronLeft, DtIconChevronRight, DtIconChevronsLeft, DtIconChevronsRight } from '../../../icons';
import { DtButton, type DtButtonIconSlotScope } from '../../Button';
import { DtStack } from '../../Stack';
import { DtTooltip } from '../../Tooltip';
import type { MonthYearPickerState } from '../Composables/UseMonthYearPicker';
import { INTL_MONTH_FORMAT } from '../DatepickerConstants';
import { formatMonth } from '../Utils';

/** What Vue's MonthYearPicker exposes, besides goToNextMonth and goToPrevMonth, which DtDatepicker owns here. */
export interface MonthYearPickerHandle {
  focusMonthYearPicker: () => void;
}

export interface MonthYearPickerProps extends Pick<MonthYearPickerState,
  'selectMonth' | 'selectYear' | 'changeMonth' | 'changeYear' |
  'isPrevMonthDisabled' | 'isNextMonthDisabled' | 'isPrevYearDisabled' | 'isNextYearDisabled'> {
  ref?: Ref<MonthYearPickerHandle>;
  /** Vue's `focus-first-day`. */
  onFocusFirstDay?: () => void;
  /** Vue's `close-datepicker`. */
  onCloseDatepicker?: () => void;
}

const START_FALLBACK_PLACEMENTS: Placement[] = ['top-start', 'auto'];
const END_FALLBACK_PLACEMENTS: Placement[] = ['top-end', 'auto'];

interface NavButtonProps {
  id: string;
  index: number;
  message: string;
  ariaLabel: string;
  disabled: boolean;
  fallbackPlacements: Placement[];
  icon: (scope: DtButtonIconSlotScope) => ReactNode;
  onClick: () => void;
}

export function MonthYearPicker ({
  ref,
  selectMonth,
  selectYear,
  changeMonth,
  changeYear,
  isPrevMonthDisabled,
  isNextMonthDisabled,
  isPrevYearDisabled,
  isNextYearDisabled,
  onFocusFirstDay,
  onCloseDatepicker,
}: MonthYearPickerProps) {
  const i18n = useI18n();
  // The four navigation buttons, in order: Vue's `focusRefs`. Disabled ones included, as in Vue.
  const focusRefs = useRef<(HTMLElement | null)[]>([]);
  // The index of the focused navigation button: Vue's `focusPicker`.
  const focusPicker = useRef(0);

  function formattedMonth (month: number) {
    return formatMonth(month, INTL_MONTH_FORMAT, i18n.currentLocale);
  }

  function focusMonthYearPicker () {
    focusRefs.current[0]?.focus();
  }

  useImperativeHandle(ref, () => ({ focusMonthYearPicker }));

  // Vue's onMounted.
  useEffect(() => {
    focusRefs.current[0]?.focus();
  }, []);

  function handleKeyDown (event: KeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        focusPicker.current = focusPicker.current === 0 ? 3 : focusPicker.current - 1;
        focusRefs.current[focusPicker.current]?.focus();
        break;

      case 'ArrowRight':
        event.preventDefault();
        focusPicker.current = focusPicker.current === 3 ? 0 : focusPicker.current + 1;
        focusRefs.current[focusPicker.current]?.focus();
        break;

      case 'ArrowDown':
        event.preventDefault();
        onFocusFirstDay?.();
        break;

      case 'Tab':
        event.preventDefault();
        onFocusFirstDay?.();
        break;

      case 'Escape':
        onCloseDatepicker?.();
        break;
    }
  }

  const changeTo = i18n.$t('DIALTONE_DATEPICKER_CHANGE_TO');
  const previousYear = i18n.$t('DIALTONE_DATEPICKER_PREVIOUS_YEAR');
  const previousMonth = i18n.$t('DIALTONE_DATEPICKER_PREVIOUS_MONTH');
  const nextMonth = i18n.$t('DIALTONE_DATEPICKER_NEXT_MONTH');
  const nextYear = i18n.$t('DIALTONE_DATEPICKER_NEXT_YEAR');

  const navButton = ({
    id, index, message, ariaLabel, disabled, fallbackPlacements, icon, onClick,
  }: NavButtonProps) => (
    <DtTooltip
      fallbackPlacements={fallbackPlacements}
      message={message}
      placement="top"
      anchor={(
        <DtButton
          id={id}
          ref={(el: HTMLElement | null) => { focusRefs.current[index] = el; }}
          aria-label={ariaLabel}
          disabled={disabled}
          kind="muted"
          className="d-datepicker__nav-btn"
          importance="clear"
          size={100}
          type="button"
          onClick={onClick}
          onKeyDown={handleKeyDown}
          icon={icon}
        />
      )}
    />
  );

  return (
    <DtStack
      className="d-datepicker__month-year"
      direction="row"
      gap="50"
    >
      <DtStack
        as="nav"
        className="d-datepicker__nav"
        direction="row"
        gap="25"
      >
        {navButton({
          id: 'prevYearButton',
          index: 0,
          message: previousYear,
          ariaLabel: `${changeTo} ${previousYear} ${selectYear - 1}`,
          disabled: isPrevYearDisabled,
          fallbackPlacements: START_FALLBACK_PLACEMENTS,
          icon: ({ iconSize }) => <DtIconChevronsLeft size={iconSize} />,
          onClick: () => changeYear(-1),
        })}
        {navButton({
          id: 'prevMonthButton',
          index: 1,
          message: previousMonth,
          ariaLabel: `${changeTo} ${previousMonth} ${formattedMonth(selectMonth - 1)}`,
          disabled: isPrevMonthDisabled,
          fallbackPlacements: START_FALLBACK_PLACEMENTS,
          icon: ({ iconSize }) => <DtIconChevronLeft size={iconSize} />,
          onClick: () => changeMonth(-1),
        })}
      </DtStack>
      <div
        id="calendar-heading"
        className="d-datepicker__month-year-title"
        data-qa="dt-datepicker-heading"
      >
        {`${formattedMonth(selectMonth)} ${selectYear}`}
      </div>
      <DtStack
        as="nav"
        className="d-datepicker__nav"
        direction="row"
        gap="25"
      >
        {navButton({
          id: 'nextMonthButton',
          index: 2,
          message: nextMonth,
          ariaLabel: `${changeTo} ${nextMonth} ${formattedMonth(selectMonth + 1)}`,
          disabled: isNextMonthDisabled,
          fallbackPlacements: END_FALLBACK_PLACEMENTS,
          icon: ({ iconSize }) => <DtIconChevronRight size={iconSize} />,
          onClick: () => changeMonth(1),
        })}
        {navButton({
          id: 'nextYearButton',
          index: 3,
          message: nextYear,
          ariaLabel: `${changeTo} ${nextYear} ${selectYear + 1}`,
          disabled: isNextYearDisabled,
          fallbackPlacements: END_FALLBACK_PLACEMENTS,
          icon: ({ iconSize }) => <DtIconChevronsRight size={iconSize} />,
          onClick: () => changeYear(1),
        })}
      </DtStack>
    </DtStack>
  );
}
