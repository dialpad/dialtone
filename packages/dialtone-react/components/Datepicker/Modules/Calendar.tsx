import { useImperativeHandle, type Ref } from 'react';
import { cx } from '../../../common/cx';
import { DtButton } from '../../Button';
import { useCalendar, type UseCalendarProps } from '../Composables/UseCalendar';

/** What Vue's Calendar exposes. */
export interface CalendarHandle {
  focusFirstDay: () => void;
}

export interface CalendarProps extends UseCalendarProps {
  ref?: Ref<CalendarHandle>;
}

export function Calendar ({ ref, ...props }: CalendarProps) {
  const {
    selectedDay,
    weekDays,
    dayAriaLabel,
    setDayRef,
    handleKeyDown,
    focusFirstDay,
    selectDay,
  } = useCalendar(props);

  useImperativeHandle(ref, () => ({ focusFirstDay }));

  // Each selectable day's position among the selectable ones, for its ref.
  let selectableIndex = 0;

  return (
    <table
      className="d-datepicker__calendar"
      aria-labelledby="calendar-heading"
      data-qa="dt-datepicker-calendar"
    >
      <thead>
        <tr>
          {weekDays.map(day => (
            <th
              key={day}
              scope="col"
              className="d-datepicker__cell d-datepicker__cell--header"
            >
              <span
                className="d-datepicker__weekday"
                data-qa="dt-datepicker-weekday"
                title={day}
                aria-label={day}
              >
                {` ${day}`}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.calendarDays.map((week, indexWeek) => (
          <tr
            key={indexWeek}
            data-qa="dt-datepicker-week"
          >
            {week.days.map((day, indexDays) => {
              const isSelected = selectedDay
                ? ((day.text === selectedDay) && !day.disabled)
                : day.selected;
              return (
                <td
                  key={indexDays}
                  className="d-datepicker__cell"
                  role="listbox"
                >
                  <DtButton
                    ref={day.disabled ? undefined : setDayRef(selectableIndex++)}
                    className={cx('d-datepicker__day', {
                      'd-datepicker__day--disabled': day.disabled,
                      'd-datepicker__day--selected': isSelected,
                    })}
                    size={200}
                    kind="muted"
                    importance="clear"
                    disabled={day.disabled}
                    type="button"
                    aria-selected={isSelected}
                    aria-label={dayAriaLabel(day)}
                    role="option"
                    onClick={() => selectDay(day)}
                    onKeyDown={handleKeyDown}
                  >
                    {day.text}
                  </DtButton>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
