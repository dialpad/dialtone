<template>
  <dt-stack
    class="d-datepicker__month-year"
    direction="row"
    gap="50"
  >
    <dt-stack
      as="nav"
      class="d-datepicker__nav"
      direction="row"
      gap="25"
    >
      <dt-tooltip
        :fallback-placements="['top-start', 'auto']"
        :message="i18n.$t('DIALTONE_DATEPICKER_PREVIOUS_YEAR')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="prevYearButton"
            :ref="el => { if (el) setDayRef(el) }"
            :aria-label="previousYearAriaLabel()"
            :disabled="isPrevYearDisabled"
            kind="muted"
            class="d-datepicker__nav-btn"
            importance="clear"
            size="xs"
            type="button"
            @click="changeYear(-1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevrons-left
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
      <dt-tooltip
        :fallback-placements="['top-start', 'auto']"
        :message="i18n.$t('DIALTONE_DATEPICKER_PREVIOUS_MONTH')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="prevMonthButton"
            :ref="el => { if (el) setDayRef(el) }"
            :aria-label="previousMonthAriaLabel()"
            :disabled="isPrevMonthDisabled"
            class="d-datepicker__nav-btn"
            importance="clear"
            kind="muted"
            size="xs"
            type="button"
            @click="changeMonth(-1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevron-left
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
    <div
      id="calendar-heading"
      class="d-datepicker__month-year-title"
    >
      {{ formattedMonth(selectMonth) }}

      {{ selectYear }}
    </div>
    <dt-stack
      as="nav"
      class="d-datepicker__nav"
      direction="row"
      gap="25"
    >
      <dt-tooltip
        :fallback-placements="['top-end', 'auto']"
        :message="i18n.$t('DIALTONE_DATEPICKER_NEXT_MONTH')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="nextMonthButton"
            :ref="el => { if (el) setDayRef(el) }"
            :aria-label="nextMonthAriaLabel()"
            :disabled="isNextMonthDisabled"
            class="d-datepicker__nav-btn"
            importance="clear"
            kind="muted"
            size="xs"
            type="button"
            @click="changeMonth(1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevron-right
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
      <dt-tooltip
        :fallback-placements="['top-end', 'auto']"
        :message="i18n.$t('DIALTONE_DATEPICKER_NEXT_YEAR')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="nextYearButton"
            :ref="el => { if (el) setDayRef(el) }"
            :aria-label="nextYearAriaLabel()"
            :disabled="isNextYearDisabled"
            class="d-datepicker__nav-btn"
            importance="clear"
            kind="muted"
            size="xs"
            type="button"
            @click="changeYear(1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevrons-right
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import {
  DtIconChevronLeft,
  DtIconChevronsLeft,
  DtIconChevronRight,
  DtIconChevronsRight,
} from '@dialpad/dialtone-icons/vue3';
import { DtStack } from '@/components/stack';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import { onMounted } from 'vue';
import { useMonthYearPicker } from '../composables/useMonthYearPicker.js';
import { DialtoneLocalization } from '@/localization';

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },

  minDate: {
    type: Date,
    default: null,
  },

  maxDate: {
    type: Date,
    default: null,
  },

  weekStartsOn: {
    type: Number,
    default: 0,
    validator: (v) => Number.isInteger(v) && v >= 0 && v <= 6,
  },
});

const emits = defineEmits([
  /**
     * Will retrieve the calendar days of the given date
     *
     * @event calendar-days
     * @type {Array}
     */
  'calendar-days',

  /**
     * Will focus first day in calendar
     *
     * @event focus-first-day
     */
  'focus-first-day',

  /**
     * Will focus last day in calendar
     *
     * @event focus-last-day
     */
  'focus-last-day',

  /**
     * Will close the datepicker
     *
     * @event close-datepicker
     */
  'close-datepicker',
]);

const i18n = new DialtoneLocalization();

const {
  selectMonth,
  selectYear,
  formattedMonth,
  setDayRef,
  focusMonthYearPicker,
  handleKeyDown,
  changeMonth,
  changeYear,
  goToNextMonth,
  goToPrevMonth,
  isPrevMonthDisabled,
  isNextMonthDisabled,
  isPrevYearDisabled,
  isNextYearDisabled,
  previousYearAriaLabel,
  previousMonthAriaLabel,
  nextMonthAriaLabel,
  nextYearAriaLabel,
} = useMonthYearPicker(props, emits);

onMounted(() => {
  focusMonthYearPicker();
});

defineExpose({
  focusMonthYearPicker,
  goToNextMonth,
  goToPrevMonth,
});
</script>
