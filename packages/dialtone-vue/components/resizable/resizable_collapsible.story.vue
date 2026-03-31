<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <div>
    <div style="margin-bottom: 16px;">
      <button
        class="d-btn d-btn--primary d-btn--sm"
        @click="toggleSidebar"
      >
        {{ sidebarCollapsed ? 'Expand' : 'Collapse' }} Sidebar
      </button>
    </div>
    <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
      <dt-resizable
        ref="group"
        direction="row"
      >
        <dt-resizable-panel
          id="sidebar"
          initial-size="25p"
          user-min-size="20p"
          collapsible
          :collapsed="sidebarCollapsed"
        >
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
            <span class="d-fs-200 d-fw-bold d-fc-purple-400">
              Collapsible Sidebar
            </span>
          </div>
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel id="content">
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
            <span class="d-fs-200 d-fw-bold d-fc-gold-400">Content</span>
          </div>
        </dt-resizable-panel>
      </dt-resizable>
    </div>
  </div>
</template>

<script>
import DtResizable from './resizable.vue';
import DtResizablePanel from './resizable_panel.vue';
import DtResizableHandle from './resizable_handle.vue';

export default {
  name: 'ResizableCollapsibleStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  data () {
    return {
      sidebarCollapsed: false,
    };
  },

  methods: {
    toggleSidebar () {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
  },
};
</script>
