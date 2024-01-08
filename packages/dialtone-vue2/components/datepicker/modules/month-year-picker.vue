<template>
  <dt-stack
    direction="row"
    class="d-datepicker__month-year"
    gap="300"
  >
    <dt-stack
      as="nav"
      direction="row"
      gap="200"
      class="d-datepicker__nav"
    >
      <dt-tooltip
        :message="prevYearLabel"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="prevYearButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            class="d-btn--icon-only d-datepicker__nav-btn"
            type="button"
            :aria-label="`${changeToLabel} ${prevYearLabel} ${selectYear - 1}`"
            @click="changeYear(-1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon
              name="chevrons-left"
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
      <dt-tooltip
        :message="prevMonthLabel"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="prevMonthButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            class="d-btn--icon-only d-datepicker__nav-btn"
            type="button"
            :aria-label="`${changeToLabel} ${prevMonthLabel} ${formattedMonth(selectMonth - 1, MONTH_FORMAT)}`"
            @click="changeMonth(-1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon
              name="chevron-left"
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
      {{ formattedMonth(selectMonth, MONTH_FORMAT) }}

      {{ selectYear }}
    </div>
    <dt-stack
      as="nav"
      direction="row"
      gap="200"
      class="d-datepicker__nav"
    >
      <dt-tooltip
        :message="nextMonthLabel"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="nextMonthButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            class="d-btn--icon-only d-datepicker__nav-btn"
            type="button"
            :aria-label="`${changeToLabel} ${nextMonthLabel} ${formattedMonth(selectMonth + 1, MONTH_FORMAT)}`"
            @click="changeMonth(1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon
              name="chevron-right"
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
      <dt-tooltip
        :message="nextYearLabel"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="nextYearButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"

            importance="clear"
            class="d-btn--icon-only d-datepicker__nav-btn"
            type="button"
            :aria-label="`${changeToLabel} ${nextYearLabel} ${selectYear + 1}`"
            @click="changeYear(1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon
              name="chevrons-right"
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { getYear, addMonths, getMonth, set, subMonths, getDate } from 'date-fns';
import { getCalendarDays, formatMonth } from '../utils';
import { MONTH_FORMAT } from '../datepicker_constants';
import DtStack from '@/components/stack/stack.vue';
import DtTooltip from '@/components/tooltip/tooltip.vue';
import DtButton from '@/components/button/button.vue';

export default {
  name: 'DtDatepickerMonthYearPicker',

  components: { DtButton, DtTooltip, DtStack, DtIcon },

  props: {
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
  },

  emits: [
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
  ],

  data () {
    return {
      selectMonth: getMonth(this.selectedDate),
      selectYear: getYear(this.selectedDate),
      highlightedDay: null,
      focusPicker: 0,
      focusRefs: [],
    };
  },

  computed: {
    // Get days for the currently selected month and year and highlight the selected day
    calendarDays () {
      return getCalendarDays(this.selectMonth, this.selectYear, this.highlightedDay);
    },

    formattedMonth () {
      return (month, format) => formatMonth(month, format);
    },

    MONTH_FORMAT () {
      return MONTH_FORMAT;
    },
  },

  watch: {
    selectMonth: {
      handler () {
        this.highlightDay();
        this.$emit('calendar-days', this.calendarDays);
      },

      immediate: true,
    },

    selectYear: {
      handler () {
        this.highlightDay();
        this.$emit('calendar-days', this.calendarDays);
      },

      immediate: true,
    },

  },

  mounted () {
    this.focusMonthYearPicker();
  },

  methods: {
    setDayRef (el) {
      if (!this.focusRefs.includes(el)) {
        this.focusRefs.push(el);
      }
    },

    focusMonthYearPicker () {
      this.focusRefs[0].$el.focus();
    },

    handleKeyDown (event) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (this.focusPicker === 0) {
            this.focusPicker = 3;
            this.focusRefs[this.focusPicker].$el.focus();
          } else {
            this.focusPicker--;
            this.focusRefs[this.focusPicker].$el.focus();
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (this.focusPicker === 3) {
            this.focusPicker = 0;
            this.focusRefs[this.focusPicker].$el.focus();
          } else {
            this.focusPicker++;
            this.focusRefs[this.focusPicker].$el.focus();
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.$emit('focus-day');
          break;

        case 'Tab':
          this.$emit('focus-day');
          break;

        case 'Escape':
          this.$emit('close-datepicker');
          break;
      }
    },

    highlightDay () {
      const year = getYear(this.selectedDate);
      const month = getMonth(this.selectedDate);

      if (year !== this.selectYear || month !== this.selectMonth) {
        this.highlightedDay = null;
      } else {
        this.highlightedDay = getDate(this.selectedDate);
      }
    },

    changeMonth (value) {
      const initialDate = set(this.selectedDate, { month: this.selectMonth, year: this.selectYear });
      const date = ++value ? addMonths(initialDate, 1) : subMonths(initialDate, 1);

      this.selectMonth = getMonth(date);
    },

    changeYear (value) {
      this.selectYear = this.selectYear + value;
    },
  },
};
</script>
