<template>
  <div class="d-datepicker__month-year-picker">
    <div>
      <button
        id="prevYearButton"
        :ref="el => { if (el) setDayRef(el) }"
        type="button"
        :aria-label="`${changeToLabel} ${prevYearLabel} ${selectYear - 1}`"
        @click="changeYear(-1)"
        @keydown="handleKeyDown($event)"
      >
        <dt-icon
          name="chevrons-left"
          size="400"
        />
      </button>
      <button
        :ref="el => { if (el) setDayRef(el) }"
        type="button"
        :aria-label="`${changeToLabel} ${prevMonthLabel} ${formatMonth(selectMonth - 1, 'MMMM')}`"
        @click="changeMonth(-1)"
        @keydown="handleKeyDown($event)"
      >
        <dt-icon
          name="chevron-left"
          size="300"
        />
      </button>
    </div>
    <div>
      <p>
        {{ formattedMonth }}
        {{ selectYear }}
      </p>
    </div>
    <div>
      <button
        :ref="el => { if (el) setDayRef(el) }"
        type="button"
        :aria-label="`${changeToLabel} ${nextMonthLabel} ${formatMonth(selectMonth + 1, 'MMMM')}`"
        @click="changeMonth(1)"
        @keydown="handleKeyDown($event)"
      >
        <dt-icon
          name="chevron-right"
          size="300"
        />
      </button>
      <button
        :ref="el => { if (el) setDayRef(el) }"
        type="button"
        :aria-label="`${changeToLabel} ${nextYearLabel} ${selectYear + 1}`"
        @click="changeYear(1)"
        @keydown="handleKeyDown($event)"
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

    changeToLabel: {
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
      focusPicker: 0,
      focusRefs: [],
    };
  },

  computed: {
    // Get days for the currently selected month and year and highlight the selected day
    calendarDays () {
      return getCalendarDays(this.selectMonth, this.selectYear, this.highlightedDay);
    },

    formattedMonth () {
      return this.formatMonth(this.selectMonth, 'MMMM');
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

  mounted () {
    this.focusMonthYearPicker();
  },

  methods: {
    formatMonth (month, monthFormat) {
      return format(new Date(2000, month, 1), monthFormat);
    },

    setDayRef (el) {
      if (!this.focusRefs.includes(el)) {
        this.focusRefs.push(el);
      }
    },

    focusMonthYearPicker () {
      this.focusRefs[0].focus();
    },

    handleKeyDown (event) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (this.focusPicker === 0) {
            this.focusPicker = 3;
            this.focusRefs[this.focusPicker].focus();
          } else {
            this.focusPicker--;
            this.focusRefs[this.focusPicker].focus();
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (this.focusPicker === 3) {
            this.focusPicker = 0;
            this.focusRefs[this.focusPicker].focus();
          } else {
            this.focusPicker++;
            this.focusRefs[this.focusPicker].focus();
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.$emit('focus-day');
          break;

        case 'Tab':
          this.$emit('focus-day');
          break;

        case 'Escape':
          this.$emit('close-datepicker');
          break;
      }
    },

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
