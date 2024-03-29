<template>
  <!-- applies the transition on initial render -->
  <transition
    :name="transition"
    :appear="appear"
    :css="isCSSEnabled"
    v-on="$listeners"
  >
    <div
      v-show="show"
      v-on="$listeners"
    >
      <!-- @slot Slot for main content -->
      <slot v-if="initialized" />
    </div>
  </transition>
</template>

<script>
/**
 * Lazy Show is a utility component that prevents its children from being rendered until the first time it is shown.
 * @see https://dialtone.dialpad.com/components/lazy_show.html
 */
export default {
  name: 'DtLazyShow',

  /******************
   *     PROPS      *
   ******************/
  props: {
    /**
     * Whether the child slot is shown.
     * @values true, false
     */
    show: {
      type: Boolean,
      default: false,
    },

    /**
     * A valid Vue enter/leave CSS transition name.
     */
    transition: {
      type: String,
      default: null,
    },

    /**
     * Enable/Disable transition animation
     * @values true, false
     */
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

  computed: {
    /**
     * Set the css property to false when running tests only.
     * Refer to: https://vuejs.org/guide/built-ins/transition.html#javascript-hooks for details about
     * transition `css` property
     * @returns {boolean}
     */
    isCSSEnabled () {
      return process.env.NODE_ENV !== 'test';
    },
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
