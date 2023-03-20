<template>
  <div
    ref="root-layout-body"
    :class="['root-layout__body', { 'd-of-y-auto': isInMobileMode }, 'd-fl-grow1', bodyClasses]"
    :style="{ 'height': isInMobileMode ? mainHeight : null }"
    data-qa="root-layout-body"
  >
    <aside
      v-if="$slots.sidebar"
      ref="root-layout-sidebar"
      :class="['root-layout__sidebar', { 'd-of-y-auto': !isInMobileMode }, sidebarClass]"
      :style="{ 'flex-basis': sidebarWidth, 'height': !isInMobileMode ? mainHeight : null }"
      data-qa="root-layout-sidebar"
    >
      <!-- @slot Slot for the sidebar -->
      <slot name="sidebar" />
    </aside>
    <main
      v-if="$slots.content"
      ref="root-layout-content"
      :class="['root-layout__content', { 'd-of-y-auto': !isInMobileMode }, contentClass]"
      :style="{ 'min-inline-size': contentWrapWidthPercent, 'height': !isInMobileMode ? mainHeight : null }"
      data-qa="root-layout-content"
      tabindex="0"
    >
      <!-- @slot Slot for the main content -->
      <slot name="content" />
    </main>
  </div>
</template>

<script>
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from '@/components/root_layout/root_layout_constants';

export default {
  name: 'DtRootLayoutBody',
  props: {
    /**
     * Additional class name for the body
     */
    bodyClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * Additional class name for the content element
     */
    contentClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * Additional class name for the sidebar element
     */
    sidebarClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * The width of the sidebar
     * Possible units rem|px|%|em
     */
    sidebarWidth: {
      type: String,
      default: undefined,
    },

    /**
     * Whether the sidebar is on the left or right side
     * Possible options: 'left', 'right'
     */
    sidebarPosition: {
      type: String,
      default: undefined,
    },

    /**
     * For responsive layouts. When the main content is at the specified width percentage,
     * the sidebar will display above the content rather than beside it. Please enter a percentage string value
     *
     * ex: '50%', '30%'
     */
    contentWrapWidthPercent: {
      type: String,
      default: undefined,
    },

    headerHeight: {
      type: String,
      default: undefined,
    },

    footerHeight: {
      type: String,
      default: undefined,
    },

    fixed: {
      type: Boolean,
      default: undefined,
    },
  },

  data () {
    return {
      sidebarTop: null,
      contentTop: null,
      documentHeight: null,
    };
  },

  computed: {
    bodyClasses () {
      return [
        this.bodyClass,
        { 'root-layout__body--invert': this.sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT },
      ];
    },

    mainHeight () {
      if (this.fixed) {
        return `calc(${this.documentHeight} - (${this.headerHeight} + ${this.footerHeight}))`;
      }
      return null;
    },

    // When the sidebar is above the header due to contentWrapWidthPercent it is considered to be in mobile mode.
    isInMobileMode () {
      if (this.contentTop > this.sidebarTop) {
        return true;
      }
      return false;
    },

  },

  mounted () {
    window.addEventListener('resize', this.onResize);
    this.getDocumentHeight();
    this.getElementTops();
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    onResize () {
      this.getDocumentHeight();
      this.getElementTops();
    },

    getElementTops () {
      this.sidebarTop = this.$refs['root-layout-sidebar']?.offsetTop;
      this.contentTop = this.$refs['root-layout-content']?.offsetTop;
    },

    getDocumentHeight () {
      this.documentHeight = window.innerHeight + 'px';
    },
  },
};
</script>

<style lang="less">
.root-layout__body {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  box-shadow: none
}

.root-layout__body--invert {
  flex-direction: row-reverse;
}

.root-layout__sidebar {
  flex-grow: 1;
  box-shadow: none
}

.root-layout__content {
  flex-basis: 0;
  flex-grow: 999;
  box-shadow: none
}
</style>
