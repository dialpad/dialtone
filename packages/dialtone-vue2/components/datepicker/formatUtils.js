import { format } from 'date-fns';

export function formatLong (date) {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatMedium (date) {
  return format(date, 'MMMM d, yyyy');
}

export function formatShort (date, showWeekday = true) {
  const formatString = showWeekday ? 'EEE, MMM d, yyyy' : 'MMM d, yyyy';
  return format(date, formatString);
}

export function formatNoYear (date, abbreviated = false) {
  const formatString = abbreviated ? 'MMM d' : 'MMMM d';
  return format(date, formatString);
}

export function formatNumerical (date) {
  return format(date, 'MM/dd/yy');
}
