<template>
  <div class="d-w100p" style="height: 300px;">
    <dt-resizable>
      <dt-resizable-panel id="ex3-sidebar" initial-size="20p" user-min-size="825">
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">Sidebar</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="ex3-content">
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-400">Content</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="ex3-details" initial-size="25p" user-min-size="825">
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-green-100">
          <span class="d-fs-200 d-fw-bold d-fc-green-400">Details</span>
        </div>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
export default { name: 'ExampleResizableThreePanel' };
</script>
