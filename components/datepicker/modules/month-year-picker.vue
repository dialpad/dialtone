<template>
  <div class="d-datepicker__month-year-picker">
    <div>
      <button
        type="button"
        :aria-label="prevYearLabel"
        @click="changeYear(-1)"
      >
        <dt-icon
          name="chevrons-left"
          size="400"
        />
      </button>
      <button
        type="button"
        :aria-label="prevMonthLabel"
        @click="changeMonth(-1)"
      >
        <dt-icon
          name="chevron-left"
          size="300"
        />
      </button>
    </div>
    <div>
      <p>
        {{ getMonth }}
        {{ selectYear }}
      </p>
    </div>
    <div>
      <button
        type="button"
        :aria-label="nextMonthLabel"
        @click="changeMonth(1)"
      >
        <dt-icon
          name="chevron-right"
          size="300"
        />
      </button>
      <button
        type="button"
        :aria-label="nextYearLabel"
        @click="changeYear(1)"
      >
        <dt-icon
          name="chevrons-right"
          size="300"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { getYear, addMonths, format, getMonth, set, subMonths, getDate } from 'date-fns';
import { getCalendarDays } from '../utils';

export default {
  name: 'DtDatepickerMonthYearPicker',

  components: { DtIcon },

  props: {
    prevMonthLabel: {
      type: String,
      required: true,
    },

    nextMonthLabel: {
      type: String,
      required: true,
    },

    prevYearLabel: {
      type: String,
      required: true,
    },

    nextYearLabel: {
      type: String,
      required: true,
    },

    selectedDate: {
      type: Date,
      required: true,
    },
  },

  emits: [
    /**
     * Will retrieve the calendar days of the given date
     *
     * @event calendar-days
     * @type {Array}
     */
    'calendar-days',
  ],

  data () {
    return {
      selectMonth: getMonth(this.selectedDate),
      selectYear: getYear(this.selectedDate),
      highlightedDay: null,
    };
  },

  computed: {
    // Get days for the currently selected month and year and highlight the selected day
    calendarDays () {
      return getCalendarDays(this.selectMonth, this.selectYear, this.highlightedDay);
    },

    getMonth () {
      return format(new Date(2000, this.selectMonth, 1), 'MMMM');
    },
  },

  watch: {
    selectMonth: {
      handler () {
        this.highlightDay();
        this.$emit('calendar-days', this.calendarDays);
      },

      immediate: true,
    },

    selectYear: {
      handler () {
        this.highlightDay();
        this.$emit('calendar-days', this.calendarDays);
      },

      immediate: true,
    },

  },

  methods: {
    highlightDay () {
      const year = getYear(this.selectedDate);
      const month = getMonth(this.selectedDate);

      if (year !== this.selectYear || month !== this.selectMonth) {
        this.highlightedDay = null;
      } else {
        this.highlightedDay = getDate(this.selectedDate);
      }
    },

    changeMonth (value) {
      const initialDate = set(this.selectedDate, { month: this.selectMonth, year: this.selectYear });
      const date = ++value ? addMonths(initialDate, 1) : subMonths(initialDate, 1);

      this.selectMonth = getMonth(date);
    },

    changeYear (value) {
      this.selectYear = this.selectYear + value;
    },
  },
};
</script>

<style lang="less">
.d-datepicker__month-year-picker{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  margin-bottom: 20px;

  > div {
      display: inline-flex;
    }

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: var(--primary-color);
    display: inline-flex;
    align-items: center;
    padding: 0;
  }

}
</style>
