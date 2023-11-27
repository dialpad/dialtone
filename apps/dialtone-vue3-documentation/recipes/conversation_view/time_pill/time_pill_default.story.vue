<template>
  <dt-recipe-time-pill
    :date-time="$attrs.dateTime"
    :date-time-display="$attrs.dateTimeDisplay"
  />
</template>

<script>
import { DtRecipeTimePill } from '@dialpad/dialtone-vue';

export default {
  name: 'DtRecipeTimePillDefault',
  components: { DtRecipeTimePill },
};
</script>
