<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable>
      <dt-resizable-panel
        id="sidebar"
        initial-size="25p"
        user-min-size="300"
        user-max-size="50p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-600">
            Sidebar (min 192px, max 50%)
          </span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel
        id="content"
        user-min-size="30p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-500">
            Content (min 30%)
          </span>
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
  name: 'ResizableConstraintsStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },
};
</script>
