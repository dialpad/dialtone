<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default); position: relative;">
    <div
      id="demo-toolbar"
      style="
        height: 48px;
        background: var(--dt-color-surface-secondary);
        display: flex;
        align-items: center;
        padding: 0 var(--dt-size-500);
        border-bottom: 1px solid var(--dt-color-border-default);
        font-size: var(--dt-font-size-100);
      "
    >
      Toolbar (48px) — handles offset below this
    </div>
    <dt-resizable>
      <dt-resizable-panel
        id="left"
        initial-size="50p"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">Left Panel</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle
        offset-element="#demo-toolbar"
        :offset-amount="8"
      />
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
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

export default {
  name: 'ResizableOffsetStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },
};
</script>
