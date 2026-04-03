<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable @panel-collapse="onPanelCollapse">
      <dt-resizable-panel
        id="sidebar"
        initial-size="25p"
        user-min-size="825"
        collapsible
        :collapsed="isCollapsed"
        peek-enabled
        peek-trigger="button"
        peek-when-manual
        peek-width="25p"
      >
        <template #peek-trigger="{ togglePeek, isPeeking }">
          <button
            class="d-btn d-btn--sm"
            style="position: absolute; inset-inline-start: 0; top: 50%; transform: translateY(-50%); z-index: 10;"
            @click="togglePeek"
          >
            {{ isPeeking ? 'Hide' : 'Peek' }}
          </button>
        </template>
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
              Click "Peek" button on the left edge
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
  name: 'ResizablePeekButtonStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  data () {
    return { isCollapsed: true };
  },

  methods: {
    onPanelCollapse (panelId, collapsed) {
      if (panelId === 'sidebar') {
        this.isCollapsed = collapsed;
      }
    },
  },
};
</script>
