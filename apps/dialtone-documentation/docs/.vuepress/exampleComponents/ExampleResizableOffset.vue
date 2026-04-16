<template>
  <div class="d-w100p" style="height: 300px;">
    <dt-resizable offset-element="#doc-demo-toolbar">
      <div
        id="doc-demo-toolbar"
        class="d-ps-absolute d-t0 d-l0 d-r0 d-zi-base1 d-d-flex d-ai-center
          d-px16 d-bgc-secondary d-bb d-bc-default d-bgo50"
        style="height: 48px;"
      >
        <span class="d-fs-100">Fixed Toolbar (48px)</span>
      </div>
      <dt-resizable-panel id="exo-left" initial-size="50p" class="d-bgc-purple-100">
        <span class="d-fs-200 d-fw-bold d-fc-purple-600">Left Panel</span>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exo-right" initial-size="50p" class="d-bgc-gold-100">
        <span class="d-fs-200 d-fw-bold d-fc-gold-500">Right Panel</span>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
export default { name: 'ExampleResizableOffset' };
</script>
