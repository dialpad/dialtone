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
import { returnFirstEl, warnIfUnmounted } from '@/common/utils';
import MonthYearPicker from './modules/month-year-picker.vue';
import Calendar from './modules/calendar.vue';
import { DtStack } from '@/components/stack';

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
