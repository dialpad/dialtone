<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default); position: relative;">
    <div
      id="demo-toolbar"
      style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        z-index: 10;
        background: var(--dt-color-surface-secondary);
        display: flex;
        align-items: center;
        padding: 0 var(--dt-size-500);
        border-bottom: 1px solid var(--dt-color-border-default);
        font-size: var(--dt-font-size-100);
      "
    >
      Fixed Toolbar (48px) — handles and panel content offset below
    </div>
    <dt-resizable offset-element="#demo-toolbar">
      <dt-resizable-panel
        id="left"
        initial-size="50p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">Left Panel</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel
        id="right"
        initial-size="50p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-400">Right Panel</span>
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
  name: 'ResizableOffsetStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },
};
</script>
