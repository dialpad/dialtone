<template>
  <dt-recipe-time-pill
    :date-time="dateTime"
    :date-time-display="dateTimeDisplay"
  />
</template>

<script>
import DtRecipeTimePill from './time_pill';

export default {
  name: 'DtRecipeTimePillDefault',
  components: { DtRecipeTimePill },
};
</script>
