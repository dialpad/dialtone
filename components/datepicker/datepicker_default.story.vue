<template>
  <div>
    <p>
      Selected date: {{ date }}
    </p>

    <dt-datepicker
      :locale="locale"
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
  </div>
</template>

<script>
import DtDatepicker from './datepicker.vue';

export default {
  name: 'DtDatepickerDefault',
  components: { DtDatepicker },

  data () {
    return {
      date: new Date(),
    };
  },
};
</script>
