<template>
  <div>
    <p>
      Selected date: {{ currentSelectedDate }}
    </p>
    <br>
    <br>
    <table class="d-table">
      <tr>
        <th>Format</th>
        <th>Result</th>
      </tr>
      <tr>
        <td>formatLong</td>
        <td>{{ formatLong(currentSelectedDate, $attrs.locale) }}</td>
      </tr>
      <tr>
        <td>formatMedium</td>
        <td>{{ formatMedium(currentSelectedDate, $attrs.locale) }}</td>
      </tr>
      <tr>
        <td>formatShort</td>
        <td>{{ formatShort(currentSelectedDate, $attrs.locale) }}</td>
      </tr>
      <tr>
        <td>formatShort (no weekday)</td>
        <td>{{ formatShort(currentSelectedDate, $attrs.locale, false) }}</td>
      </tr>
      <tr>
        <td>formatNoYear</td>
        <td>{{ formatNoYear(currentSelectedDate, $attrs.locale) }}</td>
      </tr>
      <tr>
        <td>formatNoYear (abbreviated)</td>
        <td>{{ formatNoYear(currentSelectedDate, $attrs.locale, true) }}</td>
      </tr>
      <tr>
        <td>formatNumerical</td>
        <td>{{ formatNumerical(currentSelectedDate, $attrs.locale) }}</td>
      </tr>
    </table>
    <br>
    <br>
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
  </div>
</template>

<script>
import DtDatepicker from './datepicker.vue';
import { formatLong, formatMedium, formatShort, formatNoYear, formatNumerical } from './formatUtils.js';

export default {
  name: 'DtDatepickerDefault',

  components: { DtDatepicker },

  data () {
    return {
      currentSelectedDate: this.$attrs.date,
    };
  },

  methods: {
    formatLong,
    formatMedium,
    formatShort,
    formatNoYear,
    formatNumerical,
  },
};
</script>
