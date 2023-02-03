<template>
  <div class="root-layout d-root-layout">
    <header
      v-if="hasSlotContent($slots.header)"
      :class="['root-layout__header', headerClass, { 'root-layout__header--sticky': headerSticky }]"
      :style="{ 'height': headerHeight, 'min-height': headerHeight }"
      data-qa="root-layout-header"
    >
      <!-- @slot Slot for header content -->
      <slot name="header" />
    </header>
    <dt-root-layout-body
      :body-class="bodyClass"
      :content-class="contentClass"
      :content-wrap-width-percent="contentWrapWidthPercent"
      :sidebar-class="sidebarClass"
      :sidebar-width="sidebarWidth"
      :sidebar-position="sidebarPosition"
      :header-height="hasSlotContent($slots.header) ? headerHeight : '0px'"
      :footer-height="hasSlotContent($slots.footer) ? footerHeight : '0px'"
      :fixed="fixed"
    >
      <template
        v-if="hasSlotContent($slots.sidebar)"
        #sidebar
      >
        <!-- @slot Slot for the sidebar -->
        <slot name="sidebar" />
      </template>
      <template
        v-if="hasSlotContent($slots.default)"
        #content
      >
        <!-- @slot Slot for main content -->
        <slot name="default" />
      </template>
    </dt-root-layout-body>
    <footer
      v-if="hasSlotContent($slots.footer)"
      :class="['root-layout__footer', footerClass]"
      :style="{ 'height': footerHeight, 'min-height': footerHeight }"
      data-qa="root-layout-footer"
    >
      <!-- @slot Slot for footer content -->
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
import DtRootLayoutBody from './root_layout_body';
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from './root_layout_constants';
import { hasSlotContent } from '@/common/utils';

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
     * When true, the header / footer will be locked in position and the content will
     * be scrollable. When false the header / footer will scroll out of view.
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
     * For responsive layouts. When the main content is at the specified width percentage,
     * the sidebar will display above the content rather than beside it. Please enter a percentage string value
     *
     * ex: '50%', '30%'
     */
    contentWrapWidthPercent: {
      type: String,
      default: '50%',
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
  },

  data () {
    return {
      hasSlotContent,
    };
  },
};
</script>

<style lang="less">
.root-layout__header--sticky {
  position: sticky;
  top: 0;
}
</style>
