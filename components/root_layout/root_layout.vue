<template>
  <div
    :class="['root-layout d-root-layout', { 'd-root-layout--fixed': fixed }, responsiveClass]"
    data-qa="dt-root-layout"
  >
    <header
      v-if="$slots.header"
      :class="['d-root-layout__header', { 'd-root-layout__header--sticky': headerSticky }, headerClass]"
      :style="{ 'height': headerHeight, 'min-height': headerHeight }"
      data-qa="dt-root-layout-header"
    >
      <!-- @slot Slot for header content -->
      <slot name="header" />
    </header>
    <dt-root-layout-body
      :body-class="bodyClass"
      :content-class="contentClass"
      :sidebar-class="sidebarClass"
      :sidebar-width="sidebarWidth"
      :sidebar-position="sidebarPosition"
      :header-height="$slots.header ? headerHeight : '0px'"
      :footer-height="$slots.footer ? footerHeight : '0px'"
      :fixed="fixed"
    >
      <template
        v-if="$slots.sidebar"
        #sidebar
      >
        <!-- @slot Slot for the sidebar -->
        <slot name="sidebar" />
      </template>
      <template
        v-if="$slots.default"
        #content
      >
        <!-- @slot Slot for main content -->
        <slot name="default" />
      </template>
    </dt-root-layout-body>
    <footer
      v-if="$slots.footer"
      :class="['d-root-layout__footer', footerClass]"
      :style="{ 'height': footerHeight, 'min-height': footerHeight }"
      data-qa="dt-root-layout-footer"
    >
      <!-- @slot Slot for footer content -->
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
import DtRootLayoutBody from './root_layout_body';
import { ROOT_LAYOUT_SIDEBAR_POSITIONS, ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS } from './root_layout_constants';

/**
 * A root layout provides a standardized group of containers to display content at the root level.
 */
export default {
  name: 'DtRootLayout',

  components: {
    DtRootLayoutBody,
  },

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
     * The height of the header
     * Possible units rem|px|%|em
     */
    headerHeight: {
      type: String,
      default: '64px',
    },

    /**
     * Additional class name for the body
     */
    bodyClass: {
      type: [String, Array, Object],
      default: '',
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
     * The height of the footer
     * Possible units rem|px|%|em
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
  },
};
</script>
