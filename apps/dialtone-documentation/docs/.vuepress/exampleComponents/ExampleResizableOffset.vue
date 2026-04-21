<template>
  <dt-box block-size="400" inline-size="100p">
    <dt-resizable offset-element="#doc-demo-toolbar">
      <dt-box
        id="doc-demo-toolbar"
        padding-inline="200"
        surface="secondary-opaque"
        border-width-block-end="100"
        block-size="75"
        class="d-ps-absolute d-t-0 d-l-0 d-r-0 d-zi-base1 d-d-flex d-ai-center d-jc-center
        "
      >
        <dt-text as="p" kind="body" size="200" align="center">
          Fixed Toolbar (48px)
        </dt-text>
      </dt-box>
      <dt-resizable-panel id="exo-left" initial-size="50p" class="d-bgc-success">
        <dt-box block-size="100p" inline-size="100p" class="d-plc-center">
          <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="positive" class="d-fco80">
            Left Panel
          </dt-text>
        </dt-box>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exo-right" initial-size="50p" class="d-bgc-warning-subtle">
        <dt-box block-size="100p" inline-size="100p" class="d-plc-center">
          <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="warning" class="d-fco80">
            Right Panel
          </dt-text>
        </dt-box>
      </dt-resizable-panel>
    </dt-resizable>
  </dt-box>
</template>

<script>
export default { name: 'ExampleResizableOffset' };
</script>
