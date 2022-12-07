<template>
  <!-- applies the transition on initial render -->
  <transition
    :appear="appear"
    mode="out-in"
    enter-active-class="enter-active"
    leave-active-class="leave-active"
    v-on="$listeners"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <!-- IMPORTANT:
      Since both elements are the same type, the Vue VDOM cannot
      distinguish between them whenever they mount/unmount.
      This causes the transition to think that they're both referring
      to the same element and as a result the transition animation
      does not apply.

      To differentiate them, we need to add a unique
      key attribute on both instances to let the VDOM know that
      they're both different nodes.

      Only render the element if the slot underneath is defined.
      This prevents unnecessary animation from taking place if
      a particular slot is not defined
    -->
    <component
      :is="elementType"
      v-if="(isExpanded && $slots.contentOnExpanded)"
      key="onOpen"
      v-on="$listeners"
    >
      <!-- @slot slot for Content when collapsible is expanded -->
      <slot name="contentOnExpanded" />
    </component>
    <component
      :is="elementType"
      v-else-if="(!isExpanded && $slots.contentOnCollapsed)"
      key="onClose"
      v-on="$listeners"
    >
      <!-- @slot slot for Content when collapsible is collapsed -->
      <slot name="contentOnCollapsed" />
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
    isExpanded: {
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

  methods: {

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
    transition: height .3s linear;
  }
</style>
