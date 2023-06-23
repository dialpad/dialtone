<template>
  <div class="d-datepicker">
    <div class="d-datepicker--header">
      <month-year-picker
        ref="monthYearPicker"
        :prev-month-label="prevMonthLabel"
        :next-month-label="nextMonthLabel"
        :prev-year-label="prevYearLabel"
        :next-year-label="nextYearLabel"
        :change-to-label="changeToLabel"
        :selected-date="selectedDate"
        @calendar-days="updateCalendarDays"
        @focus-day="$refs.calendar.focusFirstDay()"
        @close-datepicker="$emit('close-datepicker')"
      />
    </div>
    <div class="d-datepicker--body">
      <calendar
        ref="calendar"
        :locale="locale"
        :calendar-days="calendarDays"
        :select-day-label="selectDayLabel"
        @select-date="$emit('selected-date', $event)"
        @focus-month-year-picker="$refs.monthYearPicker.focusMonthYearPicker()"
        @close-datepicker="$emit('close-datepicker')"
      />
    </div>
  </div>
</template>

<script>
import MonthYearPicker from './modules/month-year-picker.vue';
import Calendar from './modules/calendar.vue';

export default {
  name: 'DtDatepicker',

  components: { MonthYearPicker, Calendar },

  props: {
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
  },

  emits: [
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
  ],

  data () {
    return {
      calendarDays: [],
    };
  },

  methods: {
    updateCalendarDays (days) {
      this.calendarDays = days;
    },
  },
};
</script>

<style lang="less">
.d-datepicker{
  width: 308px;
  padding: 16px;

  p{
    font-family: inherit;
    margin: 0;
    display: flex;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
  }

  &--body{
    padding: 0 8px;
  }
}
</style>
