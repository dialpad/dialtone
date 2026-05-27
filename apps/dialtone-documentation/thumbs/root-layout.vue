<!--
  Thumbnail override for DtRootLayout.
  The actual root layout fills a full viewport — at 400×225 it would just be
  a single empty region. Show a simplified mock of the layout regions
  (top bar, sidebar, content) at thumbnail scale.
-->
<template>
  <div
    :style="{
      width: '340px',
      height: '180px',
      display: 'grid',
      gridTemplateRows: '32px 1fr',
      gridTemplateColumns: '80px 1fr',
      border: '1px solid var(--dt-color-border-default)',
      borderRadius: 'var(--dt-size-radius-200)',
      background: 'var(--dt-color-surface-primary)',
      overflow: 'hidden',
    }"
  >
    <div
      :style="{
        gridColumn: '1 / -1',
        background: 'var(--dt-color-surface-secondary)',
        borderBottom: '1px solid var(--dt-color-border-default)',
      }"
    />
    <div
      :style="{
        background: 'var(--dt-color-surface-tertiary)',
        borderRight: '1px solid var(--dt-color-border-default)',
      }"
    />
    <div :style="{ padding: '12px' }">
      <dt-text as="p">
        Content
      </dt-text>
    </div>
  </div>
</template>
