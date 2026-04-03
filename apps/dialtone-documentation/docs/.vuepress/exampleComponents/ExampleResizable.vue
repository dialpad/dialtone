<template>
  <div class="d-w100p" style="height: 300px;">
    <dt-resizable>
      <dt-resizable-panel id="ex-sidebar" initial-size="25p" user-min-size="825">
        <dt-stack align="center" justify="center" class="d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">Sidebar</span>
        </dt-stack>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="ex-content">
        <dt-stack align="center" justify="center" class="d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-400">Content</span>
        </dt-stack>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
export default { name: 'ExampleResizable' };
</script>
