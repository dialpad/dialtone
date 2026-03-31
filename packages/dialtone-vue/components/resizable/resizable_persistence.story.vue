<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <div>
    <div style="margin-bottom: 16px; display: flex; gap: 8px; align-items: center;">
      <button
        class="d-btn d-btn--primary d-btn--sm"
        @click="clearStorage"
      >
        Clear Saved Layout
      </button>
      <span class="d-fs-100 d-fc-tertiary">
        Resize panels and refresh the page — sizes persist via localStorage.
      </span>
    </div>
    <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
      <dt-resizable
        ref="group"
        direction="row"
        storage-key="storybook-persistence-demo"
      >
        <dt-resizable-panel
          id="sidebar"
          initial-size="25p"
          user-min-size="15p"
          user-max-size="40p"
        >
          <div class="d-d-flex d-ai-center d-jc-center d-h100p d-bgc-purple-100">
            <span class="d-fs-200 d-fw-bold d-fc-purple-400">
              Sidebar (25% default)
            </span>
          </div>
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel id="content">
          <div class="d-d-flex d-ai-center d-jc-center d-h100p d-bgc-gold-100">
            <span class="d-fs-200 d-fw-bold d-fc-gold-400">Content</span>
          </div>
        </dt-resizable-panel>
      </dt-resizable>
    </div>
  </div>
</template>

<script>
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

export default {
  name: 'ResizablePersistenceStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  methods: {
    clearStorage () {
      localStorage.removeItem('storybook-persistence-demo');
      window.location.reload();
    },
  },
};
</script>
