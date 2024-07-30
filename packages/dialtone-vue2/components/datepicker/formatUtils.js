/**
 * Formats a date into a long format using the specified locale.
 *
 * @param {Date} date - The date to format.
 * @param {string} [locale='default'] - The locale to use for formatting. Defaults to 'default'.
 * @returns {string} The formatted date string.
 */
export function formatLong (date, locale = 'default') {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

/**
 * Formats the given date in medium format.
 *
 * @param {Date} date - The date to be formatted.
 * @param {string} [locale='default'] - The locale to be used for formatting. Defaults to 'default'.
 * @returns {string} The formatted date string in medium format.
 */
export function formatMedium (date, locale = 'default') {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

/**
 * Formats a date into a short string representation.
 * @param {Date} date - The date to format.
 * @param {string} [locale='default'] - The locale to use for formatting. Defaults to 'default'.
 * @param {boolean} [showWeekday=true] - Whether to include the weekday in the formatted string. Defaults to true.
 * @returns {string} The formatted date string.
 */
export function formatShort (date, locale = 'default', showWeekday = true) {
  const options = showWeekday ? { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' } : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a date without the year.
 *
 * @param {Date} date - The date to format.
 * @param {string} [locale='default'] - The locale to use for formatting. Defaults to 'default'.
 * @param {boolean} [abbreviated=false] - Whether to use abbreviated month names. Defaults to false.
 * @returns {string} The formatted date without the year.
 */
export function formatNoYear (date, locale = 'default', abbreviated = false) {
  const monthFormat = abbreviated ? 'short' : 'long';
  return new Intl.DateTimeFormat(locale, { month: monthFormat, day: 'numeric' }).format(date);
}

/**
 * Formats a date into a numerical string representation.
 *
 * @param {Date} date - The date to format.
 * @param {string} [locale='default'] - The locale to use for formatting. Defaults to 'default'.
 * @returns {string} The formatted numerical date string.
 */
export function formatNumerical (date, locale = 'default') {
  return new Intl.DateTimeFormat(locale, { year: '2-digit', month: '2-digit', day: '2-digit' }).format(date);
}

export default {
  formatLong,
  formatMedium,
  formatShort,
  formatNoYear,
  formatNumerical,
};
