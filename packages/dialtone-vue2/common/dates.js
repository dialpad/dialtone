import {
  format,
  formatDuration,
  intervalToDuration,
  formatDistance,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
} from 'date-fns';
import { capitalizeFirstLetter } from './utils';

let dialtoneLocale;

// Base functions just wrap core date-fns functions, but this allows us to do checks and set default options.

function _baseFormat (date, formatString) {
  _checkLocaleSet();
  return format(date, formatString, {
    locale: dialtoneLocale,
  });
}

function _baseFormatDuration (duration, formatString) {
  _checkLocaleSet();
  return formatDuration(duration, {
    locale: dialtoneLocale,
    format: formatString,
  });
}

function _baseFormatDistance (date, baseDate) {
  _checkLocaleSet();
  return formatDistance(date, baseDate, {
    locale: dialtoneLocale,
  });
}

function _isLocaleSet () {
  return dialtoneLocale !== undefined;
}

function _checkLocaleSet () {
  if (!_isLocaleSet()) {
    throw new Error('Locale not set, please call setDateLocale(locale) and pass ' +
    'in a datefns locale object as the locale param before calling this function');
  }
}

/**
 * Sets the locale for date-fns. This should be called before any date-fns functions are called.
 * @param {Locale} locale A date-fns locale object
 */
export function setDateLocale (locale) {
  dialtoneLocale = locale;
}

/**
 * This formats a date to the Dialtone standard medium date format as shown here:
 * https://dialpad.design/guides/writing-guidelines/#formats-by-length
 * @param {Date} date A javascript date object
 * @returns {string} A string in the format of 'September 2, 2022'
 */
export function getDateMedium (date) {
  return _baseFormat(date, 'MMMM d, y');
}

/**
 * Converts a call duration in total number of seconds to a human readable string
 * such as 'less than a minute' or '4 hours 34 minutes'.
 * @param {number} durationInSeconds The duration of the call in seconds
 * @returns {string} A human readable string representing the duration of the call
 */
export function durationInHHMM (durationInSeconds) {
  if (durationInSeconds < 60) {
    // returns 'less than a minute', we're doing it like this instead of returning a string
    // so datefns handles i18n.
    return _baseFormatDistance(0, 29 * 1000);
  }
  const duration = intervalToDuration({
    start: 0,
    end: durationInSeconds * 1000,
  });
  return _baseFormatDuration(duration, ['hours', 'minutes']);
}

/**
 * gets the human readable name of the day relative to the current time. For example, if you pass in -1 it will
 * say "Yesterday" if you pass in 0 it will say "Today", if you pass in 1 it will say "Tomorrow".
 * @param {number} days The number of days relative to the current time
 * @returns {string} A human readable string representing the distance between the date and now
 */
function _getRelativeDaysText (days) {
  const rtl = new Intl.RelativeTimeFormat(dialtoneLocale.code, { numeric: 'auto' });
  return capitalizeFirstLetter(rtl.formatToParts(days, 'day')[0].value, dialtoneLocale.code);
}

/**
 * Returns the distance between the passed in date and now in a human readable format, typically used
 * when showing a history of items in a log such as a feed list.
 *
 * datefns does not support 'today' and 'yesterday' without showing time so we use Intl for these cases.
 *
 * examples below to explain
 * the different potential formats:
 *
 * If current day:
 * Today
 *
 * If previous day:
 * Yesterday
 *
 * Older than yesterday, but in the same calendar week:
 * Monday
 *
 * Older than the most recent calendar week, but in the same year:
 * Monday, October 14
 *
 * older than a calendar year:
 * October 14, 2022
 *
 *
 * @param {Date} date The timestamp of the item's date
 * @returns {string} A human readable string representing the distance between the date and now
 */
export function relativeDate (date) {
  if (isToday(date)) {
    return _getRelativeDaysText(0);
  } else if (isYesterday(date)) {
    return _getRelativeDaysText(-1);
  } else if (isThisWeek(date)) {
    return _baseFormat(date, 'EEEE');
  } else if (isThisYear(date)) {
    return _baseFormat(date, 'EEEE, MMMM d');
  } else {
    return _baseFormat(date, 'MMMM d, y');
  }
}
