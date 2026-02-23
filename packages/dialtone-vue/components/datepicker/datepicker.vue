<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <dt-stack
    class="d-datepicker"
    gap="400"
  >
    <div class="d-datepicker__hd">
      <month-year-picker
        ref="monthYearPicker"
        :selected-date="selectedDate"
        :min-date="minDate"
        :max-date="maxDate"
        @calendar-days="updateCalendarDays"
        @focus-first-day="$refs.calendar.focusFirstDay()"
        @focus-last-day="$refs.calendar.focusLastDay()"
        @close-datepicker="$emit('close-datepicker')"
      />
    </div>
    <div class="d-datepicker__bd">
      <calendar
        ref="calendar"
        :calendar-days="calendarDays"
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
import { returnFirstEl, warnIfUnmounted } from '@/common/utils';
import { onMounted, ref, getCurrentInstance } from 'vue';

defineProps({
  /**
     * Selected date
     *
     * @type {Date}
     */
  selectedDate: {
    type: Date,
    default: () => (new Date()),
  },

  /**
     * Minimum selectable date. Days before this date will be disabled.
     * Must be before or equal to maxDate when both are provided.
     *
     * @type {Date}
     */
  minDate: {
    type: Date,
    default: null,
  },

  /**
     * Maximum selectable date. Days after this date will be disabled.
     * Must be after or equal to minDate when both are provided.
     *
     * @type {Date}
     */
  maxDate: {
    type: Date,
    default: null,
    validator: (value, props) => {
      if (value && props.minDate && value < props.minDate) {
        console.warn('[DtDatepicker]: maxDate must be after or equal to minDate.');
        return false;
      }
      return true;
    },
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

onMounted(() => {
  const instance = getCurrentInstance();
  warnIfUnmounted(returnFirstEl(instance.proxy.$el), 'datepicker');
});
</script>
