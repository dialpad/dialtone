import { computed, ref, watch, nextTick } from 'vue';
import { getWeekDayNames, calculateNextFocusDate, calculatePrevFocusDate } from '@/components/datepicker/utils.js';
import { MONTH_FORMAT, WEEK_START } from '@/components/datepicker/datepicker_constants.js';
import { format, getYear } from 'date-fns';

export function useCalendar (props, emits) {
  const selectedDay = ref(null);
  const focusDay = ref(0);
  const daysRef = ref([]);

  const weekDays = computed(() => {
    return getWeekDayNames(props.locale, WEEK_START);
  });

  watch(() => props.calendarDays, () => {
    focusDay.value = 0;
    daysRef.value = [];
    selectedDay.value = null;
  });

  function dayAriaLabel (day) {
    return `${props.selectDayLabel} ${day.text} ${format(day.value, MONTH_FORMAT)} ${getYear(day.value)}`;
  }

  function setDayRef (el, day) {
    if (!daysRef.value.some(day => day.el === el) && day.currentMonth) {
      daysRef.value.push({ el, day });
    }
  }

  function handleKeyDown (event) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        focusDay.value -= 7;
        try {
          daysRef.value[focusDay.value].el.$el.focus();
        } catch (error) {
          const prevFocusDate = calculatePrevFocusDate(daysRef.value[focusDay.value + 7].day.value);
          emits('go-to-prev-month');

          nextTick(() => {
            daysRef.value[prevFocusDate - 1].el.$el.focus();
            focusDay.value += prevFocusDate - 1;
          });
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        focusDay.value += 7;
        try {
          daysRef.value[focusDay.value].el.$el.focus();
        } catch (error) {
          const nextFocusDate = calculateNextFocusDate(daysRef.value[focusDay.value - 7].day.value);
          emits('go-to-next-month');

          nextTick(() => {
            daysRef.value[nextFocusDate - 1].el.$el.focus();
            focusDay.value += nextFocusDate - 1;
          });
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (focusDay.value > 0) {
          focusDay.value -= 1;
          daysRef.value[focusDay.value].el.$el.focus();
        } else {
          // if we are on month first day, jump to last day of prev month
          emits('go-to-prev-month');
          focusLastDay();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (focusDay.value < daysRef.value.length - 1) {
          focusDay.value += 1;
          daysRef.value[focusDay.value].el.$el.focus();
        } else {
          // if we are on month last day, jump to first day of next month
          emits('go-to-next-month');

          focusFirstDay();
        }
        break;

      case 'Tab':
        event.preventDefault();
        emits('focus-month-year-picker');
        break;

      case 'Escape':
        emits('close-datepicker');
        break;
    }
  }

  function focusFirstDay () {
    focusDay.value = 0;

    nextTick(() => {
      daysRef.value[focusDay.value].el.$el.focus();
    });
  }

  function focusLastDay () {
    nextTick(() => {
      focusDay.value = daysRef.value.length - 1;
      daysRef.value[focusDay.value].el.$el.focus();
    });
  }

  function selectDay (day) {
    if (!day.currentMonth) { return; }

    // local selectedDay is updated when a day is selected
    selectedDay.value = day.text;
    emits('select-date', day.value);
  }

  return {
    selectedDay,
    weekDays,
    dayAriaLabel,
    setDayRef,
    handleKeyDown,
    focusFirstDay,
    selectDay,
  };
}
