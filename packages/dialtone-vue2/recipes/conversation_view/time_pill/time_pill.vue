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
  color: var(--dt-color-foreground-primary);
  border-radius: var(--dt-size-radius-pill);
  line-height: var(--dt-font-line-height-300);
  font-size: var(--dt-font-size-100);
  border: var(--dt-size-border-100) solid var(--dt-color-border-default);
  background-color: var(--dt-color-surface-primary);
  padding: var(--dt-space-300) var(--dt-space-500);
}
</style>
