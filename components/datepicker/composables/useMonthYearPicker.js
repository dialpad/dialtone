import { computed, ref, watch } from 'vue';
import { addMonths, getDate, getMonth, getYear, set, subMonths } from 'date-fns';
import { formatMonth, getCalendarDays } from '@/components/datepicker/utils.js';

export function useMonthYearPicker (props, emits) {
  const selectMonth = ref(getMonth(props.selectedDate));
  const selectYear = ref(getYear(props.selectedDate));
  const highlightedDay = ref(null);
  const focusPicker = ref(0);
  const focusRefs = ref([]);

  const calendarDays = computed(() => {
    return getCalendarDays(selectMonth.value, selectYear.value, highlightedDay.value);
  });

  const formattedMonth = computed(() => {
    return (month, format) => formatMonth(month, format);
  });

  watch(selectMonth, () => {
    highlightDay();
    emits('calendar-days', calendarDays.value);
  }, { immediate: true });

  watch(selectYear, () => {
    highlightDay();
    emits('calendar-days', calendarDays.value);
  }, { immediate: true });

  function setDayRef (el) {
    if (!focusRefs.value.includes(el)) {
      focusRefs.value.push(el);
    }
  }

  function focusMonthYearPicker () {
    focusRefs.value[0].focus();
  }

  function handleKeyDown (event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (focusPicker.value === 0) {
          focusPicker.value = 3;
          focusRefs.value[focusPicker.value].focus();
        } else {
          focusPicker.value--;
          focusRefs.value[focusPicker.value].focus();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (focusPicker.value === 3) {
          focusPicker.value = 0;
          focusRefs.value[focusPicker.value].focus();
        } else {
          focusPicker.value++;
          focusRefs.value[focusPicker.value].focus();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        emits('focus-day');
        break;

      case 'Tab':
        emits('focus-day');
        break;

      case 'Escape':
        emits('close-datepicker');
        break;
    }
  }

  function highlightDay () {
    const year = getYear(props.selectedDate);
    const month = getMonth(props.selectedDate);

    if (year !== selectYear.value || month !== selectMonth.value) {
      highlightedDay.value = null;
    } else {
      highlightedDay.value = getDate(props.selectedDate);
    }
  }

  function changeMonth (value) {
    const initialDate = set(props.selectedDate, { month: selectMonth.value, year: selectYear.value });
    const date = ++value ? addMonths(initialDate, 1) : subMonths(initialDate, 1);

    selectMonth.value = getMonth(date);
  }

  function changeYear (value) {
    selectYear.value = selectYear.value + value;
  }

  return {
    selectMonth,
    selectYear,
    formattedMonth,
    setDayRef,
    focusMonthYearPicker,
    handleKeyDown,
    changeMonth,
    changeYear,
  };
}
