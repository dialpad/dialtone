<template>
  <dt-recipe-time-pill
    :date-time="dateTime"
    :date-time-display="dateTimeDisplay"
  />
</template>

<script>
import DtRecipeTimePill from './time_pill.vue';

export default {
  name: 'DtRecipeTimePillDefault',
  components: { DtRecipeTimePill },
};
</script>
