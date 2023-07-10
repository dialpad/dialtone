<template>
  <div>
    <p>
      Selected date: {{ date }}
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
        <td>{{ formatLong(date) }}</td>
      </tr>
      <tr>
        <td>formatMedium</td>
        <td>{{ formatMedium(date) }}</td>
      </tr>
      <tr>
        <td>formatShort</td>
        <td>{{ formatShort(date) }}</td>
      </tr>
      <tr>
        <td>formatShort (no weekday)</td>
        <td>{{ formatShort(date, false) }}</td>
      </tr>
      <tr>
        <td>formatNoYear</td>
        <td>{{ formatNoYear(date) }}</td>
      </tr>
      <tr>
        <td>formatNoYear (abbreviated)</td>
        <td>{{ formatNoYear(date, true) }}</td>
      </tr>
      <tr>
        <td>formatNumerical</td>
        <td>{{ formatNumerical(date) }}</td>
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
      :selected-date="date"
      @selected-date="date = $event; onSelectedDate($event)"
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
      date: new Date(),
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
