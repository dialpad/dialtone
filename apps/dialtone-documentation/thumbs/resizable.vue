<!--
  Thumbnail override for DtResizablePanel.
  A standalone panel doesn't render anything visible — it only makes sense
  inside a DtResizable parent with siblings. This composes the full layout.
-->
<template>
  <dt-resizable>
    <dt-resizable-panel id="left" initial-size="33p">
      <dt-box padding="300" inline-size="100p" block-size="100p" surface="secondary-opaque" class="d-plc-center">
        <dt-text kind="body" tone="tertiary" as="p" align="center" size="200">
          Sidebar
        </dt-text>
      </dt-box>
    </dt-resizable-panel>
    <dt-resizable-handle style="background: var(--dt-color-border-focus)" />
    <dt-resizable-panel id="right">
      <dt-box padding="300" inline-size="100p" block-size="100p" surface="secondary-opaque" class="d-plc-center">
        <dt-text kind="body" tone="tertiary" as="p" align="center" size="200">
          Main Content
        </dt-text>
      </dt-box>
    </dt-resizable-panel>
  </dt-resizable>
</template>
