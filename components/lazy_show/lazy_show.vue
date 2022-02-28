<template>
  <!-- applies the transition on initial render -->
  <transition
    :name="transition"
    :appear="appear"
    v-on="$listeners"
  >
    <div
      v-show="show"
      v-on="$listeners"
    >
      <slot v-if="initialized" />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DtLazyShow',

  /******************
   *     PROPS      *
   ******************/
  props: {
    /**
     * Whether the child slot is shown.
     */
    show: Boolean,

    /**
     * A valid Vue enter/leave CSS transition name.
     */
    transition: {
      type: String,
      default: null,
    },

    appear: {
      type: Boolean,
      default: false,
    },
  },

  /******************
   *      DATA      *
   ******************/
  data () {
    return {
      initialized: !!this.show,
    };
  },

  /******************
   *      WATCH     *
   ******************/
  watch: {
    show: function (newValue) {
      if (!newValue || this.initialized) return;

      this.initialized = true;
    },
  },
};
</script>
