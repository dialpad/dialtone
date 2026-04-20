<template>
  <dt-box block-size="400" inline-size="100p">
    <dt-resizable direction="column">
      <dt-resizable-panel id="exv-top" initial-size="40p">
        <dt-box block-size="100p" inline-size="100p" surface="positive" class="d-plc-center">
          <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="muted">
            Top Panel
          </dt-text>
        </dt-box>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exv-bottom">
        <dt-box block-size="100p" inline-size="100p" surface="warning-subtle" class="d-plc-center">
          <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="muted">
            Bottom Panel
          </dt-text>
        </dt-box>
      </dt-resizable-panel>
    </dt-resizable>
  </dt-box>
</template>

<script>
export default { name: 'ExampleResizableVertical' };
</script>
