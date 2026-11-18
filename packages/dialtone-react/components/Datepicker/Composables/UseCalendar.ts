import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useI18n } from '../../../common/localization';
import { INTL_MONTH_FORMAT, type DatepickerWeekStartsOn } from '../DatepickerConstants';
import {
  calculateNextFocusDate,
  calculatePrevFocusDate,
  formatDate,
  getWeekDayNames,
  type CalendarDay,
  type CalendarWeek,
} from '../Utils';

export interface UseCalendarProps {
  calendarDays: CalendarWeek[];
  weekStartsOn: DatepickerWeekStartsOn;
  onSelectDate?: (date: Date) => void;
  onFocusMonthYearPicker?: () => void;
  onCloseDatepicker?: () => void;
  onGoToNextMonth?: () => void;
  onGoToPrevMonth?: () => void;
}

/**
 * A focus Vue's calendar defers to its nextTick, after a month change has rendered:
 * - `current`: the day at the focus index (focusFirstDay).
 * - `last`: the last selectable day (focusLastDay).
 * - `date`: the selectable day at index `date - 1`, which moves the focus index by `date - 1` (the arrow up and down
 *   cases that change the month).
 */
type PendingFocus = { type: 'current' } | { type: 'last' } | { type: 'date', date: number };

/** The days Vue's `daysRef` holds: every day but the disabled ones, in order. */
const selectableDaysOf = (calendarDays: CalendarWeek[]) =>
  calendarDays.flatMap(week => week.days).filter(day => !day.disabled);

export function useCalendar ({
  calendarDays,
  weekStartsOn,
  onSelectDate,
  onFocusMonthYearPicker,
  onCloseDatepicker,
  onGoToNextMonth,
  onGoToPrevMonth,
}: UseCalendarProps) {
  const i18n = useI18n();
  // The index of the focused day among the selectable ones: Vue's `focusDay`. It isn't rendered, and Vue's handlers
  // read and write it between renders, so it's a ref.
  const focusDay = useRef(0);
  // The selectable days' buttons, in order: Vue's `daysRef`.
  const dayButtons = useRef<(HTMLElement | null)[]>([]);
  const [pendingFocus, setPendingFocus] = useState<PendingFocus | null>(null);
  // The day selected here since the grid was last delivered: Vue's local `selectedDay`, which its calendarDays watcher
  // resets. Kept with the grid it belongs to, so a new grid has none.
  const [selection, setSelection] = useState<{ days: CalendarWeek[], text: number } | null>(null);
  const selectedDay = selection?.days === calendarDays ? selection.text : null;

  const weekDays = getWeekDayNames(i18n.currentLocale, weekStartsOn);
  const selectableDays = selectableDaysOf(calendarDays);

  // Vue's calendarDays watcher resets the focus index before the nextTick that applies a deferred focus, so this runs
  // first. On mount it's already 0.
  const focusedCalendarDays = useRef(calendarDays);
  useLayoutEffect(() => {
    if (focusedCalendarDays.current !== calendarDays) {
      focusedCalendarDays.current = calendarDays;
      focusDay.current = 0;
    }
    if (!pendingFocus) return;
    setPendingFocus(null);
    const buttons = dayButtons.current;
    switch (pendingFocus.type) {
      case 'current':
        buttons[focusDay.current]?.focus();
        break;
      case 'last':
        focusDay.current = selectableDaysOf(calendarDays).length - 1;
        buttons[focusDay.current]?.focus();
        break;
      case 'date': {
        const button = buttons[pendingFocus.date - 1];
        // Vue throws here, before moving the focus index, when that day isn't selectable (minDate/maxDate).
        if (!button) break;
        button.focus();
        focusDay.current += pendingFocus.date - 1;
        break;
      }
    }
  }, [calendarDays, pendingFocus]);

  function dayAriaLabel (day: CalendarDay) {
    return i18n.$t('DIALTONE_DATEPICKER_SELECT_DAY') +
      ` ${formatDate(day.value, INTL_MONTH_FORMAT, i18n.currentLocale)}`;
  }

  /** The ref callback for the selectable day at `index`. */
  function setDayRef (index: number) {
    return (el: HTMLElement | null) => {
      dayButtons.current[index] = el;
    };
  }

  function focusFirstDay () {
    focusDay.current = 0;
    setPendingFocus({ type: 'current' });
  }

  function focusLastDay () {
    setPendingFocus({ type: 'last' });
  }

  /** Focuses the selectable day at `index`, if there's one. Vue reaches it with an exception when there isn't. */
  function focusDayAt (index: number) {
    const button = selectableDays[index] ? dayButtons.current[index] : null;
    button?.focus();
    return !!button;
  }

  function handleKeyDown (event: KeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault();
        focusDay.current -= 7;
        if (focusDayAt(focusDay.current)) break;
        // No day a week before in this month: the same weekday in the previous month's last week.
        const from = selectableDays[focusDay.current + 7];
        if (!from) break;
        const prevFocusDate = calculatePrevFocusDate(from.value);
        onGoToPrevMonth?.();
        setPendingFocus({ type: 'date', date: prevFocusDate });
        break;
      }

      case 'ArrowDown': {
        event.preventDefault();
        focusDay.current += 7;
        if (focusDayAt(focusDay.current)) break;
        // No day a week after in this month: the same weekday in the next month's first week.
        const from = selectableDays[focusDay.current - 7];
        if (!from) break;
        const nextFocusDate = calculateNextFocusDate(from.value);
        onGoToNextMonth?.();
        setPendingFocus({ type: 'date', date: nextFocusDate });
        break;
      }

      case 'ArrowLeft':
        event.preventDefault();
        if (focusDay.current > 0) {
          focusDay.current -= 1;
          focusDayAt(focusDay.current);
        } else {
          // if we are on month first day, jump to last day of prev month
          onGoToPrevMonth?.();
          focusLastDay();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (focusDay.current < selectableDays.length - 1) {
          focusDay.current += 1;
          focusDayAt(focusDay.current);
        } else {
          // if we are on month last day, jump to first day of next month
          onGoToNextMonth?.();
          focusFirstDay();
        }
        break;

      case 'Tab':
        event.preventDefault();
        onFocusMonthYearPicker?.();
        break;

      case 'Escape':
        onCloseDatepicker?.();
        break;
    }
  }

  function selectDay (day: CalendarDay) {
    if (day.disabled) { return; }

    // local selectedDay is updated when a day is selected
    setSelection({ days: calendarDays, text: day.text });
    onSelectDate?.(day.value);
  }

  return {
    selectedDay,
    weekDays,
    dayAriaLabel,
    setDayRef,
    handleKeyDown,
    focusFirstDay,
    selectDay,
  };
}
