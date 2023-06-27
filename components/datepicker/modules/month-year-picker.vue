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
        id="prevMonthButton"
        :ref="el => { if (el) setDayRef(el) }"
        type="button"
        :aria-label="`${changeToLabel} ${prevMonthLabel} ${formattedMonth(selectMonth - 1, MONTH_FORMAT)}`"
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
        {{ formattedMonth(selectMonth, MONTH_FORMAT) }}

        {{ selectYear }}
      </p>
    </div>
    <div>
      <button
        id="nextMonthButton"
        :ref="el => { if (el) setDayRef(el) }"
        type="button"
        :aria-label="`${changeToLabel} ${nextMonthLabel} ${formattedMonth(selectMonth + 1, MONTH_FORMAT)}`"
        @click="changeMonth(1)"
        @keydown="handleKeyDown($event)"
      >
        <dt-icon
          name="chevron-right"
          size="300"
        />
      </button>
      <button
        id="nextYearButton"
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

<script setup>
import { DtIcon } from '@/components/icon/index.js';
import { MONTH_FORMAT } from '../datepicker_constants';
import { onMounted } from 'vue';
import { useMonthYearPicker } from '@/components/datepicker/composables/useMonthYearPicker.js';

const props = defineProps({
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
     * Will focus the day picker
     *
     * @event focus-day
     */
  'focus-day',

  /**
     * Will close the datepicker
     *
     * @event close-datepicker
     */
  'close-datepicker',
]);

const {
  selectMonth,
  selectYear,
  formattedMonth,
  setDayRef,
  focusMonthYearPicker,
  handleKeyDown,
  changeMonth,
  changeYear,
} = useMonthYearPicker(props, emits);

onMounted(() => {
  focusMonthYearPicker();
});

defineExpose({
  focusMonthYearPicker,
});
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
