<template>
  <dt-box block-size="400" inline-size="100p">
    <dt-resizable>
      <dt-resizable-panel id="ex-sidebar" initial-size="25p" user-min-size="300">
        <dt-box block-size="100p" inline-size="100p" surface="positive" class="d-plc-center">
          <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="muted">
            Sidebar
          </dt-text>
        </dt-box>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="ex-content">
        <dt-box block-size="100p" inline-size="100p" surface="warning-subtle" class="d-plc-center">
          <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="muted">
            Content
          </dt-text>
        </dt-box>
      </dt-resizable-panel>
    </dt-resizable>
  </dt-box>
</template>

<script>
export default { name: 'ExampleResizable' };
</script>
