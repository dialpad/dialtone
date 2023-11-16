<template>
  <!-- applies the transition on initial render -->
  <transition
    :appear="appear"
    enter-active-class="enter-active"
    leave-active-class="leave-active"
    :css="isCSSEnabled"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    v-on="$listeners"
  >
    <component
      :is="elementType"
      v-show="show"
      v-on="$listeners"
    >
      <!-- @slot slot for Content within collapsible -->
      <slot v-if="initialized" />
    </component>
  </transition>
</template>

<script>
export default {
  name: 'DtCollapsibleLazyShow',

  /******************
   *     PROPS      *
   ******************/
  props: {
    /**
     * Whether the child slot is shown.
     */
    show: {
      type: Boolean,
      default: null,
    },

    /**
     * Enable/Disable transition animation
     */
    appear: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML element type (tag name) of the content wrapper element.
     */
    elementType: {
      type: String,
      default: 'div',
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
   *    COMPUTED    *
   ******************/
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

  methods: {
    /**
     * @param {HTMLElement} element
     */
    beforeEnter (element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = '0px';
        }

        element.style.display = null;
      });
    },

    /**
     * @param {HTMLElement} element
     */
    enter (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = `${element.scrollHeight}px`;
        });
      });
    },

    /**
     * @param {HTMLElement} element
     */
    afterEnter (element) {
      element.style.height = null;
    },

    /**
     * @param {HTMLElement} element
     */
    beforeLeave (element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = `${element.offsetHeight}px`;
        }
      });
    },

    /**
     * @param {HTMLElement} element
     */
    leave (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = '0px';
        });
      });
    },

    /**
     * @param {HTMLElement} element
     */
    afterLeave (element) {
      element.style.height = null;
    },
  },
};
</script>

<style>
  .enter-active,
  .leave-active {
    overflow: hidden;
    transition: height var(--td300) var(--ttf-quint);
  }
</style>
