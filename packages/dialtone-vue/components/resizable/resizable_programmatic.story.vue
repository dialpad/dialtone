<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <div>
    <div
      style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;"
    >
      <button
        class="d-btn d-btn--primary d-btn--sm"
        @click="collapseSidebar"
      >
        Collapse Sidebar
      </button>
      <button
        class="d-btn d-btn--primary d-btn--sm"
        @click="expandSidebar"
      >
        Expand Sidebar
      </button>
      <button
        class="d-btn d-btn--outlined d-btn--sm"
        @click="lockContent"
      >
        Lock Content
      </button>
      <button
        class="d-btn d-btn--outlined d-btn--sm"
        @click="unlockContent"
      >
        Unlock Content
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
        direction="row"
      >
        <dt-resizable-panel
          id="sidebar"
          initial-size="25p"
          user-min-size="10p"
          collapsible
        >
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
            <span class="d-fs-200 d-fw-bold d-fc-purple-400">
              Sidebar
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
    <pre
      v-if="panelState"
      style="margin-top: 16px; font-size: 12px; max-height: 120px; overflow: auto;"
    >{{ panelState }}</pre>
  </div>
</template>

<script>
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

export default {
  name: 'ResizableProgrammaticStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  computed: {
    panelState () {
      const group = this.$refs.group;
      if (!group?.state?.panels) return null;
      return group.state.panels.map(p => ({
        id: p.id,
        pixelSize: Math.round(p.pixelSize),
        collapsed: p.collapsed,
        locked: p.locked,
      }));
    },
  },

  methods: {
    collapseSidebar () {
      this.$refs.group?.collapsePanel('sidebar', true);
    },

    expandSidebar () {
      this.$refs.group?.collapsePanel('sidebar', false);
    },

    lockContent () {
      this.$refs.group?.lockPanel('content');
    },

    unlockContent () {
      this.$refs.group?.unlockPanel('content');
    },

    resetAll () {
      this.$refs.group?.resetPanels();
    },
  },
};
</script>
