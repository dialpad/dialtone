<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable>
      <dt-resizable-panel
        id="sidebar"
        initial-size="25p"
        user-min-size="825"
        collapsible
        :collapsed="isCollapsed"
        peek-enabled
        peek-trigger="hover"
        peek-when-manual
        peek-width="25p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">
            Sidebar
          </span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="content">
        <div class="d-d-flex d-fd-column d-w100p d-h100p d-bgc-gold-100">
          <div class="d-d-flex d-ai-center d-px16 d-py8 d-bb d-bc-default">
            <button
              class="d-btn d-btn--sm"
              @click="isCollapsed = !isCollapsed"
            >
              {{ isCollapsed ? 'Expand sidebar' : 'Collapse sidebar' }}
            </button>
            <span
              v-if="isCollapsed"
              class="d-ml8 d-fs-100 d-fc-tertiary"
            >
              Hover on the left edge to peek
            </span>
          </div>
          <div class="d-d-flex d-ai-center d-jc-center d-fl1">
            <span class="d-fs-200 d-fw-bold d-fc-gold-400">Content</span>
          </div>
        </div>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
import DtResizable from './resizable.vue';
import DtResizablePanel from './resizable_panel.vue';
import DtResizableHandle from './resizable_handle.vue';

export default {
  name: 'ResizablePeekHoverStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  data () {
    return { isCollapsed: true };
  },
};
</script>
