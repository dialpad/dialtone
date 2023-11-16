import { computed, ref, watch } from 'vue';
import { getWeekDayNames } from '@/components/datepicker/utils.js';
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

  function setDayRef (el, currentMonth) {
    if (!daysRef.value.includes(el) && currentMonth) {
      daysRef.value.push(el);
    }
  }

  function handleKeyDown (event) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        focusDay.value -= 7;
        try {
          daysRef.value[focusDay.value].focus();
        } catch (error) {
          emits('focus-month-year-picker');
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        focusDay.value += 7;
        try {
          daysRef.value[focusDay.value].focus();
        } catch (error) {
          emits('focus-month-year-picker');
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (focusDay.value > 0) {
          focusDay.value -= 1;
          daysRef.value[focusDay.value].focus();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (focusDay.value < daysRef.value.length - 1) {
          focusDay.value += 1;
          daysRef.value[focusDay.value].focus();
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
    daysRef.value[focusDay.value].focus();
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
