<template>
  <time
    data-qa="dt-time-pill"
    :dateTime="dateTime"
    class="dt-time-pill"
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
.dt-time-pill {
  border: var(--dt-size-100) solid;
  border-radius: var(--dt-size-radius-pill);
  border-width: var(--dt-size-100);
  --bco: 100%;
  border-color: var(--dt-color-black-300);
  padding-left: var(--dt-space-500);
  padding-right: var(--dt-space-500);
  padding-top: var(--dt-space-300);
  padding-bottom: var(--dt-space-300);
  font-size: var(--dt-font-size-100);
}
</style>
