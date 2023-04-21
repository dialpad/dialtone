<template>
  <div
    ref="root-layout-body"
    :class="['d-root-layout__body', bodyClasses]"
    data-qa="dt-root-layout-body"
  >
    <aside
      v-if="$slots.sidebar"
      ref="root-layout-sidebar"
      :class="['d-root-layout__sidebar', { 'd-root-layout__sidebar--sticky': fixed }, sidebarClass]"
      :style="{ 'flex-basis': sidebarWidth }"
      data-qa="dt-root-layout-sidebar"
    >
      <!-- @slot Slot for the sidebar -->
      <slot name="sidebar" />
    </aside>
    <main
      v-if="$slots.content"
      ref="root-layout-content"
      :class="['d-root-layout__content', contentClass]"
      data-qa="dt-root-layout-content"
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
     * When true, the sidebar will be locked in position and the content will
     * be scrollable. When false the sidebar will scroll out of view.
     * @values true, false
     */
    fixed: {
      type: Boolean,
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
  },

  computed: {
    bodyClasses () {
      return [
        this.bodyClass,
        { 'd-root-layout__body--invert': this.sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT },
      ];
    },
  },
};
</script>
