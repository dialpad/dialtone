<template>
  <div>
    <p>
      Selected date: {{ currentSelectedDate }}
    </p>
    <br>
    <br>
    <table>
      <tr>
        <th>Format</th>
        <th>Result</th>
      </tr>
      <tr>
        <td>formatLong</td>
        <td>{{ formatLong(currentSelectedDate) }}</td>
      </tr>
      <tr>
        <td>formatMedium</td>
        <td>{{ formatMedium(currentSelectedDate) }}</td>
      </tr>
      <tr>
        <td>formatShort</td>
        <td>{{ formatShort(currentSelectedDate) }}</td>
      </tr>
      <tr>
        <td>formatShort (no weekday)</td>
        <td>{{ formatShort(currentSelectedDate, false) }}</td>
      </tr>
      <tr>
        <td>formatNoYear</td>
        <td>{{ formatNoYear(currentSelectedDate) }}</td>
      </tr>
      <tr>
        <td>formatNoYear (abbreviated)</td>
        <td>{{ formatNoYear(currentSelectedDate, true) }}</td>
      </tr>
      <tr>
        <td>formatNumerical</td>
        <td>{{ formatNumerical(currentSelectedDate) }}</td>
      </tr>
    </table>
    <br>
    <br>

    <dt-datepicker
      :locale="locale"
      :prev-month-label="prevMonthLabel"
      :next-month-label="nextMonthLabel"
      :prev-year-label="prevYearLabel"
      :next-year-label="nextYearLabel"
      :select-day-label="selectDayLabel"
      :change-to-label="changeToLabel"
      :selected-date="currentSelectedDate"
      @selected-date="currentSelectedDate = $event; onSelectedDate($event)"
      @close-datepicker="onCloseDatepicker"
    />
  </div>
</template>

<script>
import DtDatepicker from './DtDatepicker.vue';
import { formatLong, formatMedium, formatShort, formatNoYear, formatNumerical } from './formatUtils.js';

export default {
  name: 'DtDatepickerDefault',

  components: { DtDatepicker },

  data () {
    return {
      currentSelectedDate: this.date,
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

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
</style>
