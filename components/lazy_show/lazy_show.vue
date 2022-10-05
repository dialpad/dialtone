<template>
  <Transition
    :name="transition"
    :appear="appear"
    v-bind="$attrs"
  >
    <div
      v-show="show"
      v-bind="$attrs"
    >
      <!-- @slot Slot for main content -->
      <slot v-if="initialized" />
    </div>
  </Transition>
</template>

<script>
/**
 * Lazy Show is a utility component that prevents its children from being rendered until the first time it is shown.
 * @see https://dialpad.design/components/lazy_show.html
 */
export default {
  name: 'DtLazyShow',

  inheritAttrs: false,

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
