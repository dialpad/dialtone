import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { cx } from '../../common/cx';
import { devWarn } from '../../common/dev';
import { DtStack } from '../Stack';
import { useMonthYearPicker } from './Composables/UseMonthYearPicker';
import type { DatepickerWeekStartsOn } from './DatepickerConstants';
import { Calendar, type CalendarHandle } from './Modules/Calendar';
import { MonthYearPicker, type MonthYearPickerHandle } from './Modules/MonthYearPicker';

export interface DtDatepickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The root element. */
  ref?: Ref<HTMLDivElement>;

  /**
   * Selected date. Read when the datepicker mounts, and whenever it shows another month (to highlight the day).
   * Defaults to today.
   */
  selectedDate?: Date;

  /**
   * Minimum selectable date. Days before this date will be disabled.
   * Must be before or equal to maxDate when both are provided.
   */
  minDate?: Date | null;

  /**
   * Maximum selectable date. Days after this date will be disabled.
   * Must be after or equal to minDate when both are provided.
   */
  maxDate?: Date | null;

  /**
   * Day the week starts on. 0 = Sunday, 1 = Monday, ... 6 = Saturday.
   * @values 0, 1, 2, 3, 4, 5, 6
   */
  weekStartsOn?: DatepickerWeekStartsOn;

  /** Called when a date is selected, with that date. Vue's `selected-date`. */
  onSelectedDate?: (date: Date) => void;

  /** Called when the user presses the Escape key. Vue's `close-datepicker`. */
  onCloseDatepicker?: () => void;
}

/**
 * Vue's maxDate validator, which warns while Vue validates props: in development, on mount and when the bounds change.
 */
function useValidateBounds (minDate: Date | null, maxDate: Date | null) {
  const minTime = minDate ? minDate.getTime() : null;
  const maxTime = maxDate ? maxDate.getTime() : null;
  // The bounds last checked, so StrictMode's second effect run doesn't warn twice.
  const lastChecked = useRef<string | null>(null);
  useEffect(() => {
    const bounds = JSON.stringify([minTime, maxTime]);
    if (lastChecked.current === bounds) return;
    lastChecked.current = bounds;
    if (maxTime !== null && minTime !== null && maxTime < minTime) {
      devWarn('[DtDatepicker]: maxDate must be after or equal to minDate.');
    }
  }, [minTime, maxTime]);
}

/**
 * Datepicker is a calendar for picking a single date: a month and year header with navigation, and a grid of the
 * month's days, all navigable by keyboard.
 * @see https://dialtone.dialpad.com/components/datepicker.html
 */
export function DtDatepicker ({
  ref,
  selectedDate: selectedDateProp,
  minDate = null,
  maxDate = null,
  weekStartsOn = 0,
  onSelectedDate,
  onCloseDatepicker,
  className,
  ...rest
}: DtDatepickerProps) {
  // Vue's default, `() => new Date()`, is created once per instance.
  const [today] = useState(() => new Date());
  const selectedDate = selectedDateProp ?? today;
  const monthYearPickerRef = useRef<MonthYearPickerHandle>(null);
  const calendarRef = useRef<CalendarHandle>(null);

  useValidateBounds(minDate, maxDate);

  const picker = useMonthYearPicker({ selectedDate, minDate, maxDate, weekStartsOn });

  return (
    <DtStack
      ref={ref}
      {...rest}
      className={cx('d-datepicker', className)}
      gap="100"
    >
      <div
        className="d-datepicker__hd"
        data-qa="dt-datepicker-header"
      >
        <MonthYearPicker
          ref={monthYearPickerRef}
          selectMonth={picker.selectMonth}
          selectYear={picker.selectYear}
          changeMonth={picker.changeMonth}
          changeYear={picker.changeYear}
          isPrevMonthDisabled={picker.isPrevMonthDisabled}
          isNextMonthDisabled={picker.isNextMonthDisabled}
          isPrevYearDisabled={picker.isPrevYearDisabled}
          isNextYearDisabled={picker.isNextYearDisabled}
          onFocusFirstDay={() => calendarRef.current?.focusFirstDay()}
          onCloseDatepicker={() => onCloseDatepicker?.()}
        />
      </div>
      <div
        className="d-datepicker__bd"
        data-qa="dt-datepicker-body"
      >
        <Calendar
          ref={calendarRef}
          calendarDays={picker.calendarDays}
          weekStartsOn={weekStartsOn}
          onSelectDate={date => onSelectedDate?.(date)}
          onFocusMonthYearPicker={() => monthYearPickerRef.current?.focusMonthYearPicker()}
          onCloseDatepicker={() => onCloseDatepicker?.()}
          onGoToNextMonth={picker.goToNextMonth}
          onGoToPrevMonth={picker.goToPrevMonth}
        />
      </div>
    </DtStack>
  );
}
