export function formatLong (date, locale = 'default') {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function formatMedium (date, locale = 'default') {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function formatShort (date, locale = 'default', showWeekday = true) {
  const options = showWeekday ? { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' } : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatNoYear (date, locale = 'default', abbreviated = false) {
  const monthFormat = abbreviated ? 'short' : 'long';
  return new Intl.DateTimeFormat(locale, { month: monthFormat, day: 'numeric' }).format(date);
}

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
