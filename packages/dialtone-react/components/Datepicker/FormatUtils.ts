import { DialtoneLocalization } from '../../common/localization';

/**
 * Formats a date into a long format using the specified locale.
 *
 * @param date - The date to format.
 * @param locale - The locale to use for formatting. Defaults to the preferred locale.
 * @returns The formatted date string.
 */
export function formatLong (date: Date, locale: string | null = null): string {
  return new Intl.DateTimeFormat(
    locale || DialtoneLocalization.getPreferredLocale(),
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  ).format(date);
}

/**
 * Formats the given date in medium format.
 *
 * @param date - The date to be formatted.
 * @param locale - The locale to be used for formatting. Defaults to the preferred locale.
 * @returns The formatted date string in medium format.
 */
export function formatMedium (date: Date, locale: string | null = null): string {
  return new Intl.DateTimeFormat(
    locale || DialtoneLocalization.getPreferredLocale(),
    { year: 'numeric', month: 'long', day: 'numeric' },
  ).format(date);
}

/**
 * Formats a date into a short string representation.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting. Defaults to the preferred locale.
 * @param showWeekday - Whether to include the weekday in the formatted string. Defaults to true.
 * @returns The formatted date string.
 */
export function formatShort (date: Date, locale: string | null = null, showWeekday = true): string {
  const options: Intl.DateTimeFormatOptions = showWeekday
    ? { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat(locale || DialtoneLocalization.getPreferredLocale(), options).format(date);
}

/**
 * Formats a date without the year.
 *
 * @param date - The date to format.
 * @param locale - The locale to use for formatting. Defaults to the preferred locale.
 * @param abbreviated - Whether to use abbreviated month names. Defaults to false.
 * @returns The formatted date without the year.
 */
export function formatNoYear (date: Date, locale: string | null = null, abbreviated = false): string {
  const monthFormat = abbreviated ? 'short' : 'long';
  return new Intl.DateTimeFormat(
    locale || DialtoneLocalization.getPreferredLocale(),
    { month: monthFormat, day: 'numeric' },
  ).format(date);
}

/**
 * Formats a date into a numerical string representation.
 *
 * @param date - The date to format.
 * @param locale - The locale to use for formatting. Defaults to the preferred locale.
 * @returns The formatted numerical date string.
 */
export function formatNumerical (date: Date, locale: string | null = null): string {
  return new Intl.DateTimeFormat(
    locale || DialtoneLocalization.getPreferredLocale(),
    { year: '2-digit', month: '2-digit', day: '2-digit' },
  ).format(date);
}

export default {
  formatLong,
  formatMedium,
  formatShort,
  formatNoYear,
  formatNumerical,
};
