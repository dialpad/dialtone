<template>
  <dt-datepicker
    :prev-month-label="prevMonthLabel"
    :next-month-label="nextMonthLabel"
    :prev-year-label="prevYearLabel"
    :next-year-label="nextYearLabel"
    :selected-date="date"
    @selected-date="date = $event; onSelectedDate($event)"
  />
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
