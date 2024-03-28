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
            :ref="`buttonRef_${indexWeek}_${indexDays}`"
            class="d-datepicker__day"
            :circle="true"
            size="sm"
            importance="clear"
            :disabled="!day.currentMonth"
            :class="{
              'd-datepicker__day--disabled': !day.currentMonth,
              'd-datepicker__day--selected': selectedDay
                ? ((day.text === selectedDay) && day.currentMonth)
                : day.selected,
            }"
            type="button"
            :aria-selected="!!selectedDay ? ((day.text === selectedDay) && day.currentMonth) : day.selected"
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

<script>
import { getWeekDayNames, calculateNextFocusDate, calculatePrevFocusDate } from '@/components/datepicker/utils';
import { WEEK_START, MONTH_FORMAT } from '@/components/datepicker/datepicker_constants.js';
import { format, getYear } from 'date-fns';
import DtButton from '@/components/button/button.vue';

export default {
  name: 'DtDatepickerCalendar',
  components: { DtButton },

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
      this.selectedDay = null;

      this.daysRef = [];

      this.$nextTick(() => {
        this.daysRef = [];
        this.setDayRef();
      });
    },
  },

  methods: {
    dayAriaLabel (day) {
      return `${this.selectDayLabel} ${day.text} ${format(day.value, MONTH_FORMAT)} ${getYear(day.value)}`;
    },

    setDayRef (el, day) {
      this.calendarDays.forEach((week, weekIndex) => {
        week.days.forEach((day, dayIndex) => {
          const refKey = `buttonRef_${weekIndex}_${dayIndex}`;
          const dayButton = this.$refs[refKey];
          if (dayButton && day.currentMonth) {
            this.daysRef.push({ el: dayButton[0], day });
          }
        });
      });
    },

    handleKeyDown (event) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          this.focusDay -= 7;
          try {
            this.daysRef[this.focusDay].el.$el.focus();
          } catch (error) {
            const prevFocusDate = calculatePrevFocusDate(this.daysRef[this.focusDay + 7].day.value);
            this.$emit('go-to-prev-month');
            this.$nextTick(() => {
              this.setDayRef();
              this.daysRef[prevFocusDate - 1].el.$el.focus();
              this.focusDay += prevFocusDate - 1;
            });
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.focusDay += 7;
          try {
            this.daysRef[this.focusDay].el.$el.focus();
          } catch (error) {
            const nextFocusDate = calculateNextFocusDate(this.daysRef[this.focusDay - 7].day.value);
            this.$emit('go-to-next-month');
            this.$nextTick(() => {
              this.setDayRef();
              this.daysRef[nextFocusDate - 1].el.$el.focus();
              this.focusDay += nextFocusDate - 1;
            });
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (this.focusDay > 0) {
            this.focusDay -= 1;
            this.daysRef[this.focusDay].el.$el.focus();
          } else {
            // if we are on month first day, jump to last day of prev month
            this.$emit('go-to-prev-month');
            this.$nextTick(() => {
              this.focusLastDay();
            });
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (this.focusDay < this.daysRef.length - 1) {
            this.focusDay += 1;
            this.daysRef[this.focusDay].el.$el.focus();
          } else {
            // if we are on month last day, jump to first day of next month
            this.$emit('go-to-next-month');
            this.$nextTick(() => {
              this.focusFirstDay();
            });
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
      this.$nextTick(() => {
        this.daysRef[this.focusDay].el.$el.focus();
      });
    },

    focusLastDay () {
      this.$nextTick(() => {
        this.focusDay = this.daysRef.length - 1;
        this.daysRef[this.focusDay].el.$el.focus();
      });
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
