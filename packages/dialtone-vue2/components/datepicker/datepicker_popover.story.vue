<template>
  <div>
    <p>
      Selected date: {{ currentSelectedDate }}
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
          :locale="$attrs.locale"
          :prev-month-label="$attrs.prevMonthLabel"
          :next-month-label="$attrs.nextMonthLabel"
          :prev-year-label="$attrs.prevYearLabel"
          :next-year-label="$attrs.nextYearLabel"
          :select-day-label="$attrs.selectDayLabel"
          :change-to-label="$attrs.changeToLabel"
          :selected-date="currentSelectedDate"
          @selected-date="currentSelectedDate = $event; $attrs.onSelectedDate($event)"
          @close-datepicker="$attrs.onCloseDatepicker"
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
      currentSelectedDate: this.$attrs.date,
      datepickerOpened: this.$attrs.opened,
    };
  },

  methods: {
    toggleDatepicker () {
      this.datepickerOpened = !this.datepickerOpened;
    },
  },
};
</script>
