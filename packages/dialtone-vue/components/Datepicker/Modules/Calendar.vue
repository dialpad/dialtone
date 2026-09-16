<template>
  <table
    class="d-datepicker__calendar"
    aria-labelledby="calendar-heading"
  >
    <thead>
      <tr>
        <th
          v-for="day in weekDays"
          :key="day"
          scope="col"
          class="d-datepicker__cell d-datepicker__cell--header"
        >
          <span
            class="d-datepicker__weekday"
            :title="day"
            :aria-label="day"
          > {{ day }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(week, indexWeek) in calendarDays"
        :key="indexWeek"
      >
        <td
          v-for="(day, indexDays) in week.days"
          :key="indexWeek + indexDays"
          class="d-datepicker__cell"
          role="listbox"
        >
          <dt-button
            :ref="el => { if (el) setDayRef(el, day) }"
            class="d-datepicker__day"
            :size="200"
            kind="muted"
            importance="clear"
            :disabled="day.disabled"
            :class="{
              'd-datepicker__day--disabled': day.disabled,
              'd-datepicker__day--selected': selectedDay
                ? ((day.text === selectedDay) && !day.disabled)
                : day.selected,
            }"
            type="button"
            :aria-selected="!!selectedDay ? ((day.text === selectedDay) && !day.disabled) : day.selected"
            :aria-label="dayAriaLabel(day)"
            role="option"
            @click="selectDay(day)"
            @keydown="handleKeyDown($event)"
          >
            {{ day.text }}
          </dt-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useCalendar } from '../Composables/UseCalendar.js';
import { DtButton } from '@/components/Button';

const props = defineProps({
  calendarDays: {
    type: Array,
    required: true,
  },

  weekStartsOn: {
    type: Number,
    default: 0,
    validator: (v) => Number.isInteger(v) && v >= 0 && v <= 6,
  },
});

const emits = defineEmits([
  /**
     * Event fired when a date is selected
     *
     * @event select-date
     * @type {Date}
     */
  'select-date',

  /**
     * Will focus the month and year picker
     *
     * @event focus-month-year-picker
     */
  'focus-month-year-picker',

  /**
     * Will close the datepicker
     *
     * @event close-datepicker
     */
  'close-datepicker',

  /**
     * Will go to the next month
     *
     * @event go-to-next-month
     */
  'go-to-next-month',

  /**
     * Will go to the previous month
     *
     * @event go-to-prev-month
     */
  'go-to-prev-month',
]);

const {
  selectedDay,
  weekDays,
  dayAriaLabel,
  setDayRef,
  handleKeyDown,
  focusFirstDay,
  selectDay,
} = useCalendar(props, emits);

defineExpose({
  focusFirstDay,
});
</script>
