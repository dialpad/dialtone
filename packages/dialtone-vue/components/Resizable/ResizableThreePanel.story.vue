<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable direction="row">
      <dt-resizable-panel
        id="sidebar"
        initial-size="20p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-600">Sidebar</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="content">
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-500">Content</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel
        id="details"
        initial-size="25p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-green-100">
          <span class="d-fs-200 d-fw-bold d-fc-green-500">Details</span>
        </div>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
import DtResizable from './Resizable.vue';
import DtResizablePanel from './ResizablePanel.vue';
import DtResizableHandle from './ResizableHandle.vue';

export default {
  name: 'ResizableThreePanelStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },
};
</script>
