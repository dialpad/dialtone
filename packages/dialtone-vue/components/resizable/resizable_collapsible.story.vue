<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div>
    <div
      style="display: flex; gap: 8px; margin-bottom: 16px;"
    >
      <button
        class="d-btn d-btn--primary d-btn--sm"
        @click="toggleSidebar"
      >
        {{ sidebarCollapsed ? 'Expand' : 'Collapse' }} Sidebar
      </button>
      <button
        class="d-btn d-btn--danger d-btn--sm"
        @click="resetAll"
      >
        Reset All
      </button>
    </div>
    <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
      <dt-resizable
        ref="group"
        @panel-collapse="onPanelCollapse"
      >
        <dt-resizable-panel
          id="sidebar"
          initial-size="25p"
          user-min-size="825"
          collapsible
          :collapsed="sidebarCollapsed"
        >
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
            <span class="d-fs-200 d-fw-bold d-fc-purple-600">
              Sidebar
            </span>
          </div>
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel id="content">
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
            <span class="d-fs-200 d-fw-bold d-fc-gold-500">Content</span>
          </div>
        </dt-resizable-panel>
      </dt-resizable>
    </div>
    <pre
      v-if="panelState"
      style="margin-top: 16px; font-size: 12px; max-height: 120px; overflow: auto;"
    >{{ panelState }}</pre>
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

  computed: {
    panelState () {
      const group = this.$refs.group;
      if (!group?.state?.panels) return null;
      return group.state.panels.map(p => ({
        id: p.id,
        pixelSize: Math.round(p.pixelSize),
        collapsed: p.collapsed,
      }));
    },
  },

  methods: {
    toggleSidebar () {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    onPanelCollapse (panelId, collapsed) {
      if (panelId === 'sidebar') {
        this.sidebarCollapsed = collapsed;
      }
    },

    resetAll () {
      this.sidebarCollapsed = false;
      this.$refs.group?.resetPanels();
    },
  },
};
</script>
