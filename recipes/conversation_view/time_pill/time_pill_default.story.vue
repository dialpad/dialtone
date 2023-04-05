<template>
  <dt-recipe-time-pill
    :date-time="$attrs.dateTime"
    :date-time-display="$attrs.dateTimeDisplay"
  />
</template>

<script>
import DtRecipeTimePill from './time_pill';

export default {
  name: 'DtRecipeTimePillDefault',
  components: { DtRecipeTimePill },
};
</script>
