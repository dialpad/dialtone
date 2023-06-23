<template>
  <div>
    <p>
      Selected date: {{ date }}
    </p>

    <dt-popover
      :open="datepickerOpened"
      initial-focus-element="#prevYearButton"
      padding="none"
      @opened="(open) => { datepickerOpened = open }"
    >
      <template #anchor>
        <dt-button
          size="sm"
          circle
          importance="clear"
          aria-label="Open datepicker"
          @click="toggleDatepicker"
        >
          <template #icon>
            <dt-icon
              name="calendar"
              size="300"
            />
          </template>
        </dt-button>
      </template>
      <template #content>
        <dt-datepicker
          :prev-month-label="prevMonthLabel"
          :next-month-label="nextMonthLabel"
          :prev-year-label="prevYearLabel"
          :next-year-label="nextYearLabel"
          :select-day-label="selectDayLabel"
          :change-to-label="changeToLabel"
          :selected-date="date"
          @selected-date="date = $event; onSelectedDate($event)"
          @close-datepicker="onCloseDatepicker"
        />
      </template>
    </dt-popover>
  </div>
</template>

<script>
import DtDatepicker from './datepicker.vue';
import DtPopover from '@/components/popover/popover.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';

export default {
  name: 'DtDatepickerPopover',
  components: { DtIcon, DtButton, DtPopover, DtDatepicker },

  data () {
    return {
      date: new Date(),
      datepickerOpened: false,
    };
  },

  methods: {
    toggleDatepicker () {
      this.datepickerOpened = !this.datepickerOpened;
    },
  },
};
</script>
