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
      :locale="$attrs.locale"
      :prev-month-label="$attrs.prevMonthLabel"
      :next-month-label="$attrs.nextMonthLabel"
      :prev-year-label="$attrs.prevYearLabel"
      :next-year-label="$attrs.nextYearLabel"
      :select-day-label="$attrs.selectDayLabel"
      :change-to-label="$attrs.changeToLabel"
      :selected-date="date"
      @selected-date="date = $event; $attrs.onSelectedDate($event)"
      @close-datepicker="$attrs.onCloseDatepicker"
    />
  </div>
</template>

<script setup>
import DtDatepicker from './DtDatepicker.vue';
import { formatLong, formatMedium, formatShort, formatNoYear, formatNumerical } from './formatUtils.js';
import { ref } from 'vue';

const date = ref(new Date());
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
