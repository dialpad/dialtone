<template>
  <div class="d-datepicker__calendar">
    <div
      class="d-datepicker__week-day"
    >
      <div
        v-for="day in weekDays"
        :key="day"
      >
        <p>
          {{ day }}
        </p>
      </div>
    </div>
    <div
      v-for="(week, indexWeek) in calendarDays"
      :key="indexWeek"
      class="d-datepicker__week"
    >
      <button
        v-for="(day, indexDays) in week.days"
        :key="indexWeek + indexDays"
        :ref="el => { if (el) setDayRef(el, day.currentMonth) }"
        class="d-datepicker__day"
        :class="{
          'd-datepicker__day--disabled': !day.currentMonth,
          'd-datepicker__day--selected': selectedDay ? ((day.text === selectedDay) && day.currentMonth) : day.selected,
        }"
        type="button"
        :aria-label="dayAriaLabel(day)"
        @click="selectDay(day)"
        @keydown="handleKeyDown($event)"
      >
        {{ day.text }}
      </button>
    </div>
  </div>
</template>

<script>
import { getWeekDayNames } from '@/components/datepicker/utils.js';
import { WEEK_START, MONTH_FORMAT } from '@/components/datepicker/datepicker_constants.js';
import { format, getYear } from 'date-fns';

export default {
  name: 'DtDatepickerCalendar',

  props: {
    calendarDays: {
      type: Array,
      required: true,
    },

    locale: {
      type: String,
      required: true,
    },

    selectDayLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
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
  ],

  data () {
    return {
      // local selectedDay to override the received by props calendarDays
      selectedDay: null,
      focusDay: 0,
      daysRef: [],
    };
  },

  computed: {
    weekDays () {
      return getWeekDayNames(this.locale, WEEK_START);
    },
  },

  watch: {
    calendarDays () {
      // on calendarDays update, reset our local variables
      this.focusDay = 0;
      this.daysRef = [];
      this.selectedDay = null;
    },
  },

  methods: {
    dayAriaLabel (day) {
      return `${this.selectDayLabel} ${day.text} ${format(day.value, MONTH_FORMAT)} ${getYear(day.value)}`;
    },

    setDayRef (el, currentMonth) {
      if (!this.daysRef.includes(el) && currentMonth) {
        this.daysRef.push(el);
      }
    },

    handleKeyDown (event) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          this.focusDay -= 7;
          try {
            this.daysRef[this.focusDay].focus();
          } catch (error) {
            this.$emit('focus-month-year-picker');
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.focusDay += 7;
          try {
            this.daysRef[this.focusDay].focus();
          } catch (error) {
            this.$emit('focus-month-year-picker');
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (this.focusDay > 0) {
            this.focusDay -= 1;
            this.daysRef[this.focusDay].focus();
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (this.focusDay < this.daysRef.length - 1) {
            this.focusDay += 1;
            this.daysRef[this.focusDay].focus();
          }
          break;

        case 'Tab':
          event.preventDefault();
          this.$emit('focus-month-year-picker');
          break;

        case 'Escape':
          this.$emit('close-datepicker');
          break;
      }
    },

    focusFirstDay () {
      this.focusDay = 0;
      this.daysRef[this.focusDay].focus();
    },

    selectDay (day) {
      if (!day.currentMonth) { return; }

      // local selectedDay is updated when a day is selected
      this.selectedDay = day.text;
      this.$emit('select-date', day.value);
    },
  },
};
</script>

<style lang="less">
.d-datepicker{
  &__week-day{
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    > div{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;

      p{
        color: var(--black-600);
        margin: 0;
      }
    }
  }

  &__week{
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__day{
    border: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    font-size: 12px;
    border-radius: 50px;

    &--disabled{
      color: var(--black-300);
    }
    &--selected{
     color: #ffffff;
     background: #7C52FF;
    }

    &:focus{
     box-shadow: var(--bs-focus-ring);
    }
  }
}
</style>
