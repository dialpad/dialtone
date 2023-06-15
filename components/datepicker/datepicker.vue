<template>
  <div class="d-datepicker">
    <div class="d-datepicker--header">
      <month-year-picker
        :prev-month-label="prevMonthLabel"
        :next-month-label="nextMonthLabel"
        :prev-year-label="prevYearLabel"
        :next-year-label="nextYearLabel"
        :selected-date="selectedDate"
        @calendar-days="updateCalendarDays"
      />
    </div>
    <div class="d-datepicker--body">
      <calendar
        :locale="locale"
        :calendar-days="calendarDays"
        @select-date="$emit('selected-date', $event)"
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
     */
    prevMonthLabel: {
      type: String,
      required: true,
    },

    /**
     * Label for the next month button
     *
     * @type {String}
     */
    nextMonthLabel: {
      type: String,
      required: true,
    },

    /**
     * Label for the previous year button
     *
     * @type {String}
     */
    prevYearLabel: {
      type: String,
      required: true,
    },

    /**
     * Label for the next year button
     *
     * @type {String}
     */
    nextYearLabel: {
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
