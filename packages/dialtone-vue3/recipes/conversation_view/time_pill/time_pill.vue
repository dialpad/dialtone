<template>
  <time
    data-qa="dt-time-pill"
    :dateTime="dateTime"
    class="d-ba d-bar-pill d-baw1 d-bc-black-300 d-px16 d-py4 d-fs-100"
  >
    {{ dateTimeDisplay }}
  </time>
</template>

<script>
import {} from './time_pill_constants';

export default {
  name: 'DtRecipeTimePill',

  props: {
    /**
     * Date time display value
     */
    dateTimeDisplay: {
      type: String,
      required: true,
    },

    /**
     * Machine-readable attribute
     * Accepts a string value of YYYY-MM-DD or YYYY-MM-DDThh:mm:ssTZD
     */
    dateTime: {
      type: String,
      required: true,
      validator: (t) => {
        // Since this will only ever be used in the context of a date, we're rejecting non date inputs
        const x = new Date(t);
        if (x instanceof Date && !isNaN(x)) {
          return true;
        }
        return false;
      },
    },
  },
};
</script>

<style lang="less">

</style>
