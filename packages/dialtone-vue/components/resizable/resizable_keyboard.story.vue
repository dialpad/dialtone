<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable>
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
    <div
      style="
        margin-top: var(--dt-size-500);
        padding: var(--dt-size-450);
        background: var(--dt-color-surface-secondary);
        border-radius: var(--dt-size-radius-400);
        font-size: var(--dt-font-size-100);
        line-height: 1.5;
      "
    >
      <strong>Keyboard Controls</strong>
      <ul style="margin: var(--dt-size-300) 0 0; padding-left: var(--dt-size-550);">
        <li><kbd>Ctrl/Cmd + E</kbd> — Toggle edit mode</li>
        <li><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> — Navigate handles</li>
        <li><kbd>Arrow keys</kbd> — Resize (8px)</li>
        <li><kbd>Shift + Arrow</kbd> — Large resize (24px)</li>
        <li><kbd>Ctrl/Cmd + Arrow</kbd> — Fine resize (1px)</li>
        <li><kbd>R</kbd> — Reset current handle</li>
        <li><kbd>Ctrl/Cmd + R</kbd> — Reset all panels</li>
        <li><kbd>Escape</kbd> — Exit edit mode</li>
      </ul>
    </div>
  </div>
</template>

<script>
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

export default {
  name: 'ResizableKeyboardStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },
};
</script>
