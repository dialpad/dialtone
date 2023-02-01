<template>
  <div
    :class="['root-layout__body', 'd-fl-grow1', bodyClasses]"
    data-qa="root-layout-body"
  >
    <aside
      v-if="hasSlotContent($slots.sidebar)"
      :class="['root-layout__sidebar', sidebarClass]"
      :style="{ 'flex-basis': sidebarWidth }"
      data-qa="root-layout-sidebar"
    >
      <!-- @slot Slot for the sidebar -->
      <slot name="sidebar" />
    </aside>
    <main
      v-if="hasSlotContent($slots.content)"
      :class="['root-layout__content', contentClass]"
      :style="{ 'min-inline-size': contentWrapWidthPercent }"
      data-qa="root-layout-content"
    >
      <!-- @slot Slot for the main content -->
      <slot name="content" />
    </main>
  </div>
</template>

<script>
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from '@/components/root_layout/root_layout_constants';
import { hasSlotContent } from '@/common/utils';

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
  },

  data () {
    return {
      hasSlotContent,
    };
  },

  computed: {
    bodyClasses () {
      return [
        this.bodyClass,
        {
          'root-layout__body--invert': this.sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT,
        },
      ];
    },
  },
};
</script>

<style lang="less">
.root-layout__body {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.root-layout__body--invert {
  flex-direction: row-reverse;
}

.root-layout__sidebar {
  flex-grow: 1;
}

.root-layout__content {
  flex-basis: 0;
  flex-grow: 999;
}
</style>
