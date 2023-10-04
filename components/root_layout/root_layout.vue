<template>
  <div
    :class="['root-layout d-root-layout', { 'd-root-layout--fixed': fixed }, responsiveClass]"
    data-qa="dt-root-layout"
  >
    <header
      :class="['d-root-layout__header', { 'd-root-layout__header--sticky': headerSticky }, headerClass]"
      data-qa="dt-root-layout-header"
    >
      <!-- @slot Slot for header content be sure to set a height on the element inside this
        if you want a fixed height. -->
      <slot name="header" />
    </header>
    <div
      ref="root-layout-body"
      :class="['d-root-layout__body', bodyClasses]"
      data-qa="dt-root-layout-body"
    >
      <aside
        ref="root-layout-sidebar"
        :class="['d-root-layout__sidebar', { 'd-root-layout__sidebar--sticky': fixed }, sidebarClass]"
        :style="{ 'flex-basis': sidebarWidth }"
        data-qa="dt-root-layout-sidebar"
      >
        <!-- @slot Slot for the sidebar -->
        <slot name="sidebar" />
      </aside>
      <main
        ref="root-layout-content"
        :class="['d-root-layout__content', contentClass]"
        data-qa="dt-root-layout-content"
        tabindex="0"
      >
        <!-- @slot Slot for the main content -->
        <slot />
      </main>
    </div>
    <footer
      :class="['d-root-layout__footer', footerClass]"
      data-qa="dt-root-layout-footer"
    >
      <!-- @slot Slot for footer content be sure to set a height on the element inside this
        if you want a fixed height. -->
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
import { ROOT_LAYOUT_SIDEBAR_POSITIONS, ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS } from './root_layout_constants';

/**
 * A root layout provides a standardized group of containers to display content at the root level.
 */
export default {
  name: 'DtRootLayout',

  props: {
    /**
     * When true, the header, footer and sidebar will be locked in position and the content will
     * be scrollable. When false the header, footer and sidebar  will scroll out of view.
     * @values true, false
     */
    fixed: {
      type: Boolean,
      default: true,
    },

    /**
     * Additional class name for the header element
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * DEPRECATED: set the height of the inner element instead.
     */
    headerHeight: {
      type: String,
      default: '64px',
    },

    /**
     * Scroll the header with the page
     * @values true, false
     */
    headerSticky: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional class name for the body
     */
    bodyClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the content element
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the sidebar element
     */
    sidebarClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * The width of the sidebar
     * Possible units rem|px|%|em
     */
    sidebarWidth: {
      type: String,
      default: '256px',
    },

    /**
     * Whether the sidebar is on the left or right side
     * Possible options: 'left', 'right'
     * @values left, right
     */
    sidebarPosition: {
      type: String,
      default: 'left',
      validator: (s) => Object.values(ROOT_LAYOUT_SIDEBAR_POSITIONS).includes(s),
    },

    /**
     * Additional class name for the footer element
     */
    footerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * DEPRECATED: set the height of the inner element instead.
     */
    footerHeight: {
      type: String,
      default: '64px',
    },

    /**
     * Defines the breakpoint when the root layout will change to responsive version
     * @values 'sm', 'md', 'lg', null
     */
    responsiveBreakpoint: {
      type: String,
      default: null,
      validator: (bp) => ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS.includes(bp),
    },
  },

  computed: {
    responsiveClass () {
      if (!this.responsiveBreakpoint) return;
      return `d-root-layout__responsive--${this.responsiveBreakpoint}`;
    },

    bodyClasses () {
      return [
        this.bodyClass,
        { 'd-root-layout__body--invert': this.sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT },
      ];
    },
  },
};
</script>
