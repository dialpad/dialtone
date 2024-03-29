import {
  startOfWeek, addDays, getMonth, isEqual,
  addMonths, startOfMonth, getDay, getDate,
  subMonths, endOfMonth,
} from 'date-fns';
import { WEEK_START } from '@/components/datepicker/datepicker_constants.js';

const _parsedGetDate = (value) => (value ? new Date(value) : new Date());

/**
 * Get 7 days from the provided start date, month is used to check
 * whether the date is from the specified month or in the offset
 */
const getWeekDays = (startDay, month, selectedDay) => {
  const startDate = _parsedGetDate(JSON.parse(JSON.stringify(startDay)));
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const next = addDays(startDate, i);
    const isNext = getMonth(next) !== month;
    dates.push({
      text: next.getDate(),
      value: next,
      currentMonth: !isNext,
      isFirstDayOfMonth: next.getDate() === 1 && !isNext,
      // will be selected if the date is the same as the selected day and is from the current month
      selected: selectedDay ? (next.getDate() === selectedDay && !isNext) : false,
    });
  }
  return dates;
};

const isDateEqual = (date, dateToCompare) => {
  if (!date || !dateToCompare) {
    return false;
  }
  return isEqual(date, dateToCompare);
};

/**
 * Get days for the calendar to be displayed in a table grouped by weeks
 */
export const getCalendarDays = (month, year, selectedDay) => {
  const weeks = [];
  const firstDate = _parsedGetDate(new Date(year, month));
  const lastDate = _parsedGetDate(new Date(year, month + 1, 0));

  const weekStartsOn = WEEK_START;

  const firstDateInCalendar = startOfWeek(firstDate, { weekStartsOn });

  const addDaysToWeek = (date) => {
    const days = getWeekDays(date, month, selectedDay);

    weeks.push({ days });

    if (
      !weeks[weeks.length - 1].days.some((day) =>
        isDateEqual(day.value, lastDate),
      )
    ) {
      const nextDate = addDays(date, 7);
      addDaysToWeek(nextDate);
    }
  };

  addDaysToWeek(firstDateInCalendar);

  return weeks;
};

/**
 * Generate week day names based on locale and in order specified in week start
 */
export const getWeekDayNames = (locale, weekStart) => {
  // Get list in order from sun ... sat
  const days = [1, 2, 3, 4, 5, 6, 7].map((day) => {
    return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
      .format(new Date(`2017-01-0${day}T00:00:00+00:00`))
      .slice(0, 2);
  });

  // Get days that are in order before specified week start
  const beforeWeekStart = days.slice(0, weekStart);
  // Get days that are in order after specified week start
  const afterWeekStart = days.slice(weekStart + 1, days.length);

  // return them in correct order
  return [days[weekStart]].concat(...afterWeekStart).concat(...beforeWeekStart);
};

export const formatMonth = (month, monthFormat, locale) => {
  return new Intl.DateTimeFormat(locale, { month: monthFormat }).format(new Date(2000, month, 1));
};

export const calculateNextFocusDate = (currentDate) => {
  const date = new Date(currentDate);
  const currentWeekday = getDay(date);
  const nextMonthDate = addMonths(date, 1);
  const nextMonthStart = startOfMonth(nextMonthDate);
  const nextMonthStartWeekday = getDay(nextMonthStart);

  const dayDifference = (currentWeekday - nextMonthStartWeekday + 7) % 7;

  // Add the difference in days to the first day of the next month
  const focusDate = addDays(nextMonthStart, dayDifference);

  // Returns only the day of the month
  return getDate(focusDate);
};

export const calculatePrevFocusDate = (currentDate) => {
  const date = new Date(currentDate);
  const currentWeekday = getDay(date);

  // Move to the last day of the previous month
  const lastDayOfPrevMonth = endOfMonth(subMonths(date, 1));
  let focusDate = lastDayOfPrevMonth;

  // Adjust to the same weekday in the last week of the previous month
  while (getDay(focusDate) !== currentWeekday) {
    focusDate = addDays(focusDate, -1);
  }

  // Returns only the day of the month
  return getDate(focusDate);
};
