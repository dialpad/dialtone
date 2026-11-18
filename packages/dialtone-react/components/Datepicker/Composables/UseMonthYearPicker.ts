import { useState } from 'react';
import { addMonths, endOfMonth, getDate, getMonth, getYear, set, startOfDay, startOfMonth, subMonths } from 'date-fns';
import type { DatepickerWeekStartsOn } from '../DatepickerConstants';
import { getCalendarDays, type CalendarWeek } from '../Utils';

export interface UseMonthYearPickerProps {
  selectedDate: Date;
  minDate: Date | null;
  maxDate: Date | null;
  weekStartsOn: DatepickerWeekStartsOn;
}

export interface MonthYearPickerState {
  /** The month shown, zero-based. */
  selectMonth: number;
  selectYear: number;
  /** The grid of the month shown, as Vue's `calendar-days` event last delivered it. */
  calendarDays: CalendarWeek[];
  isPrevMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
  isPrevYearDisabled: boolean;
  isNextYearDisabled: boolean;
  /** Moves the month shown by one, back (-1) or forward (1), unless that month is outside minDate/maxDate. */
  changeMonth: (value: -1 | 1) => void;
  /** Moves the year shown by one, back (-1) or forward (1), unless that year is outside minDate/maxDate. */
  changeYear: (value: -1 | 1) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
}

interface ViewState {
  month: number;
  year: number;
  /** The selected date's day, when the month shown is the selected date's: Vue's `highlightedDay`. */
  highlightedDay: number | null;
  calendarDays: CalendarWeek[];
  /** The bounds the grid was built with, by value: Vue's minDate/maxDate watchers. */
  minTime: number | null;
  maxTime: number | null;
}

const timeOf = (date: Date | null) => (date ? date.getTime() : null);

function isPrevMonthDisabledFor (month: number, year: number, minDate: Date | null) {
  if (!minDate) return false;
  const prevMonth = subMonths(new Date(year, month, 1), 1);
  return endOfMonth(prevMonth) < startOfDay(minDate);
}

function isNextMonthDisabledFor (month: number, year: number, maxDate: Date | null) {
  if (!maxDate) return false;
  const nextMonth = addMonths(new Date(year, month, 1), 1);
  return startOfMonth(nextMonth) > startOfDay(maxDate);
}

function isPrevYearDisabledFor (month: number, year: number, minDate: Date | null) {
  if (!minDate) return false;
  const prevYearMonth = new Date(year - 1, month, 1);
  return endOfMonth(prevYearMonth) < startOfDay(minDate);
}

function isNextYearDisabledFor (month: number, year: number, maxDate: Date | null) {
  if (!maxDate) return false;
  const nextYearMonth = new Date(year + 1, month, 1);
  return startOfMonth(nextYearMonth) > startOfDay(maxDate);
}

/**
 * The month and year the datepicker shows, and the calendar grid for them: the state half of Vue's
 * useMonthYearPicker. DtDatepicker owns it, where Vue's MonthYearPicker owns it and emits the grid to DtDatepicker,
 * so the grid reaches the calendar in the same render. The focus half lives in Modules/MonthYearPicker.
 *
 * The grid is rebuilt when Vue emits `calendar-days`: when the month or year shown changes, and when minDate or
 * maxDate change. Like Vue's, it isn't rebuilt when only selectedDate or weekStartsOn change.
 */
export function useMonthYearPicker ({
  selectedDate,
  minDate,
  maxDate,
  weekStartsOn,
}: UseMonthYearPickerProps): MonthYearPickerState {
  const highlightedDayFor = (month: number, year: number) =>
    (getYear(selectedDate) !== year || getMonth(selectedDate) !== month ? null : getDate(selectedDate));

  const buildCalendarDays = (month: number, year: number, highlightedDay: number | null) =>
    getCalendarDays(month, year, highlightedDay, minDate, maxDate, weekStartsOn);

  const [view, setView] = useState<ViewState>(() => {
    const month = getMonth(selectedDate);
    const year = getYear(selectedDate);
    const highlightedDay = highlightedDayFor(month, year);
    return {
      month,
      year,
      highlightedDay,
      calendarDays: buildCalendarDays(month, year, highlightedDay),
      minTime: timeOf(minDate),
      maxTime: timeOf(maxDate),
    };
  });

  // Vue's minDate and maxDate watchers: a changed bound rebuilds the grid for the month shown. Compared by value, so a
  // new Date for the same day (one created in the parent's render) doesn't.
  const minTime = timeOf(minDate);
  const maxTime = timeOf(maxDate);
  if (!Object.is(view.minTime, minTime) || !Object.is(view.maxTime, maxTime)) {
    setView({
      ...view,
      minTime,
      maxTime,
      calendarDays: buildCalendarDays(view.month, view.year, view.highlightedDay),
    });
  }

  // Vue's selectMonth and selectYear watchers: a new month or year highlights the selected date's day, if it's in
  // that month, and rebuilds the grid.
  const showMonth = (current: ViewState, month: number, year: number): ViewState => {
    if (current.month === month && current.year === year) return current;
    const highlightedDay = highlightedDayFor(month, year);
    return {
      ...current,
      month,
      year,
      highlightedDay,
      calendarDays: buildCalendarDays(month, year, highlightedDay),
    };
  };

  const changeMonth = (value: -1 | 1) => {
    setView((current) => {
      if (value === -1 && isPrevMonthDisabledFor(current.month, current.year, minDate)) return current;
      if (value === 1 && isNextMonthDisabledFor(current.month, current.year, maxDate)) return current;

      let year = current.year;
      // Adjust year when changing from January to December or vice versa
      if ((current.month === 0 && value === -1) || (current.month === 11 && value === 1)) {
        year += value;
      }

      // Calculate the new date by adding or subtracting months
      const initialDate = set(selectedDate, { month: current.month, year });
      const newDate = value === 1 ? addMonths(initialDate, 1) : subMonths(initialDate, 1);

      return showMonth(current, getMonth(newDate), year);
    });
  };

  const changeYear = (value: -1 | 1) => {
    setView((current) => {
      if (value === -1 && isPrevYearDisabledFor(current.month, current.year, minDate)) return current;
      if (value === 1 && isNextYearDisabledFor(current.month, current.year, maxDate)) return current;
      return showMonth(current, current.month, current.year + value);
    });
  };

  return {
    selectMonth: view.month,
    selectYear: view.year,
    calendarDays: view.calendarDays,
    isPrevMonthDisabled: isPrevMonthDisabledFor(view.month, view.year, minDate),
    isNextMonthDisabled: isNextMonthDisabledFor(view.month, view.year, maxDate),
    isPrevYearDisabled: isPrevYearDisabledFor(view.month, view.year, minDate),
    isNextYearDisabled: isNextYearDisabledFor(view.month, view.year, maxDate),
    changeMonth,
    changeYear,
    goToNextMonth: () => changeMonth(1),
    goToPrevMonth: () => changeMonth(-1),
  };
}
