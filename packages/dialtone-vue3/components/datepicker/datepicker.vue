<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <dt-stack
    class="d-datepicker"
    gap="400"
  >
    <div class="d-datepicker__hd">
      <month-year-picker
        ref="monthYearPicker"
        :prev-month-label="prevMonthLabel"
        :next-month-label="nextMonthLabel"
        :prev-year-label="prevYearLabel"
        :next-year-label="nextYearLabel"
        :change-to-label="changeToLabel"
        :selected-date="selectedDate"
        @calendar-days="updateCalendarDays"
        @focus-first-day="$refs.calendar.focusFirstDay()"
        @focus-last-day="$refs.calendar.focusLastDay()"
        @close-datepicker="$emit('close-datepicker')"
      />
    </div>
    <div class="d-datepicker__bd">
      <calendar
        ref="calendar"
        :locale="locale"
        :calendar-days="calendarDays"
        :select-day-label="selectDayLabel"
        @select-date="$emit('selected-date', $event)"
        @focus-month-year-picker="$refs.monthYearPicker.focusMonthYearPicker()"
        @close-datepicker="$emit('close-datepicker')"
        @go-to-next-month="$refs.monthYearPicker.goToNextMonth()"
        @go-to-prev-month="$refs.monthYearPicker.goToPrevMonth()"
      />
    </div>
  </dt-stack>
</template>

<script setup>
import MonthYearPicker from './modules/month-year-picker.vue';
import Calendar from './modules/calendar.vue';
import { DtStack } from '@/components/stack';

import { ref } from 'vue';

defineProps({
  /**
     * Label for the previous month button
     *
     * @type {String}
     * @example 'Previous month'
     */
  prevMonthLabel: {
    type: String,
    required: true,
  },

  /**
     * Label for the next month button
     *
     * @type {String}
     * @example 'Next month'
     */
  nextMonthLabel: {
    type: String,
    required: true,
  },

  /**
     * Label for the previous year button
     *
     * @type {String}
     * @example 'Previous year'
     */
  prevYearLabel: {
    type: String,
    required: true,
  },

  /**
     * Label for the next year button
     *
     * @type {String}
     * @example 'Next year'
     */
  nextYearLabel: {
    type: String,
    required: true,
  },

  /**
     * Label for the select day button
     *
     * @type {String}
     * @example 'Select day'
     */
  selectDayLabel: {
    type: String,
    required: true,
  },

  /**
     * Label for the change to button
     *
     * @type {String}
     * @example 'Change to'
     */
  changeToLabel: {
    type: String,
    required: true,
  },

  /**
     * Locale for the calendar
     *
     * @type {String}
     */
  locale: {
    type: String,
    default: 'en-US',
  },

  /**
     * Selected date
     *
     * @type {Date}
     */
  selectedDate: {
    type: Date,
    default: () => (new Date()),
  },
});

defineEmits([
  /**
     * Event fired when a date is selected
     *
     * @event selected-date
     * @type {Date}
     */
  'selected-date',

  /**
     * Event fired when user presses the esc key
     *
     * @event close-datepicker
     */
  'close-datepicker',
]);

const calendarDays = ref([]);

function updateCalendarDays (days) {
  calendarDays.value = days;
}
</script>
