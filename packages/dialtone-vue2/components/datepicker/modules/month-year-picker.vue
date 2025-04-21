<template>
  <dt-stack
    class="d-datepicker__month-year"
    direction="row"
    gap="300"
  >
    <dt-stack
      as="nav"
      class="d-datepicker__nav"
      direction="row"
      gap="200"
    >
      <dt-tooltip
        :fallback-placements="['top-start', 'auto']"
        :message="$t('PREVIOUS_YEAR')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="prevYearButton"
            :ref="refNames[0]"
            :aria-label="previousYearAriaLabel"
            circle
            class="d-datepicker__nav-btn"
            importance="clear"
            kind="muted"
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
        :message="$t('PREVIOUS_MONTH')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="prevMonthButton"
            :ref="refNames[1]"
            :aria-label="previousMonthAriaLabel"
            circle
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
      gap="200"
    >
      <dt-tooltip
        :fallback-placements="['top-end', 'auto']"
        :message="$t('NEXT_MONTH')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="nextMonthButton"
            :ref="refNames[2]"
            :aria-label="nextMonthAriaLabel"
            circle
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
        :message="$t('NEXT_YEAR')"
        placement="top"
      >
        <template #anchor>
          <dt-button
            id="nextYearButton"
            :ref="refNames[3]"
            :aria-label="nextYearAriaLabel"
            circle
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

<script>
import {
  DtIconChevronLeft,
  DtIconChevronsLeft,
  DtIconChevronRight,
  DtIconChevronsRight,
} from '@dialpad/dialtone-icons/vue2';
import { getYear, addMonths, getMonth, set, subMonths, getDate } from 'date-fns';
import { getCalendarDays, formatMonth } from '../utils';
import { INTL_MONTH_FORMAT } from '../datepicker_constants';
import { DtStack } from '@/components/stack';
import { DtTooltip } from '@/components/tooltip';
import { DtButton } from '@/components/button';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'DtDatepickerMonthYearPicker',

  components: {
    DtButton,
    DtTooltip,
    DtStack,
    DtIconChevronLeft,
    DtIconChevronsLeft,
    DtIconChevronRight,
    DtIconChevronsRight,
  },

  mixins: [DtLocalizationMixin],

  props: {
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
  ],

  data () {
    return {
      selectMonth: getMonth(this.selectedDate),
      selectYear: getYear(this.selectedDate),
      highlightedDay: null,
      focusPicker: 0,
      focusRefs: [],
      refNames: ['prevYearButtonRef', 'prevMonthButtonRef', 'nextMonthButtonRef', 'nextYearButtonRef'],
    };
  },

  computed: {
    // Get days for the currently selected month and year and highlight the selected day
    calendarDays () {
      return getCalendarDays(this.selectMonth, this.selectYear, this.highlightedDay);
    },

    formattedMonth () {
      return (month) => formatMonth(month, INTL_MONTH_FORMAT, this.currentLocale);
    },

    previousYearAriaLabel () {
      return `${this.$t('CHANGE_TO')} ${this.$t('PREVIOUS_YEAR')} ${this.selectYear - 1}`;
    },

    previousMonthAriaLabel () {
      return `${this.$t('CHANGE_TO')} ${this.$t('PREVIOUS_MONTH')} ${this.formattedMonth(this.selectMonth - 1)}`;
    },

    nextYearAriaLabel () {
      return `${this.$t('CHANGE_TO')} ${this.$t('NEXT_YEAR')} ${this.selectYear + 1}`;
    },

    nextMonthAriaLabel () {
      return `${this.$t('CHANGE_TO')} ${this.$t('NEXT_MONTH')} ${this.formattedMonth(this.selectMonth + 1)}`;
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
    this.setButtonsRef();
    this.focusMonthYearPicker();
  },

  methods: {
    setButtonsRef () {
      this.focusRefs = this.refNames.map(refName => this.$refs[refName]);
    },

    focusMonthYearPicker () {
      this.focusPicker = 0;
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
          this.$emit('focus-first-day');
          break;

        case 'Tab':
          event.preventDefault();
          this.$emit('focus-first-day');
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
      // Adjust year when changing from January to December or vice versa
      if ((this.selectMonth === 0 && value === -1) || (this.selectMonth === 11 && value === 1)) {
        this.selectYear += value;
      }

      // Calculate the new date by adding or subtracting months
      const initialDate = set(this.selectedDate, { month: this.selectMonth, year: this.selectYear });
      const newDate = value === 1 ? addMonths(initialDate, 1) : subMonths(initialDate, 1);

      // Update the selected month
      this.selectMonth = getMonth(newDate);
    },

    changeYear (value) {
      this.selectYear = this.selectYear + value;
    },

    goToNextMonth () {
      this.changeMonth(1);
    },

    goToPrevMonth () {
      this.changeMonth(-1);
    },
  },
};
</script>
