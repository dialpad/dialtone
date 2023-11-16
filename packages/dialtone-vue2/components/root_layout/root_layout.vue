<template>
  <div
    :class="[
      'root-layout',
      'd-root-layout',
      {
        'd-root-layout--fixed': fixed,
        'd-root-layout--inverted': isInverted,
        [`d-root-layout__responsive--${responsiveBreakpoint}`]: !!responsiveBreakpoint,
      },
    ]"
    data-qa="dt-root-layout"
  >
    <header
      :class="['d-root-layout__header', { 'd-root-layout__header--sticky': headerSticky }, headerClass]"
      data-qa="dt-root-layout-header"
    >
      <!-- @slot Slot for header content, be sure to set a height on the element inside this
        if you want a fixed height. -->
      <slot name="header" />
    </header>
    <aside
      ref="root-layout-sidebar"
      tabindex="0"
      :class="['d-root-layout__sidebar', sidebarClass]"
      data-qa="dt-root-layout-sidebar"
    >
      <!-- @slot Slot for sidebar content, be sure to set a width on the element within this. -->
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
    <footer
      :class="['d-root-layout__footer', footerClass]"
      data-qa="dt-root-layout-footer"
    >
      <!-- @slot Slot for footer content, be sure to set a height on the element inside this
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
     * DEPRECATED: set the width of the inner element instead.
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
    isInverted () {
      return this.sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT;
    },
  },
};
</script>
