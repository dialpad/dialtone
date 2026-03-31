<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable>
      <dt-resizable-panel
        id="sidebar"
        initial-size="925"
        collapsible
        :collapsed="true"
        peek-enabled
        peek-trigger="hover"
        peek-when-manual
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">Sidebar (hover to peek)</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel
        id="main"
        initial-size="50p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-400">Main Content</span>
        </div>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

export default {
  name: 'ResizablePeekHoverStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },
};
</script>
