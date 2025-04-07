/**
 * @displayName Sr-Only close button mixin
 */
export default {
  props: {
    /**
     * If true, a hidden close button is included for screen readers
     * @values true, false
     */
    visuallyHiddenClose: {
      type: Boolean,
      default: false,
    },
  },
};
