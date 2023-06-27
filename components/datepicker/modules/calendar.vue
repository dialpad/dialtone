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

<script setup>
import { useCalendar } from '@/components/datepicker/composables/useCalendar.js';

const props = defineProps({
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
