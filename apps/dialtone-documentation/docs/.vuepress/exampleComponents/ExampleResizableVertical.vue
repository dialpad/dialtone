<template>
  <div class="d-w100p" style="height: 300px;">
    <dt-resizable direction="column">
      <dt-resizable-panel id="exv-top" initial-size="40p">
        <dt-stack align="center" justify="center" class="d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-600">Top Panel</span>
        </dt-stack>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exv-bottom">
        <dt-stack align="center" justify="center" class="d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-500">Bottom Panel</span>
        </dt-stack>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
export default { name: 'ExampleResizableVertical' };
</script>
