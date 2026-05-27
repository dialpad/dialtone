<!--
  Thumbnail override for DtRichTextEditor.
  The real editor depends on async ProseMirror setup that doesn't finish within
  the harness wait stack. This shows a representative toolbar + content surface
  that reads as a rich-text editor at a glance.
-->
<template>
  <div
    :style="{
      width: '320px',
      border: '1px solid var(--dt-color-border-default)',
      borderRadius: 'var(--dt-size-radius-200)',
      background: 'var(--dt-color-surface-primary)',
      overflow: 'hidden',
    }"
  >
    <div
      :style="{
        display: 'flex',
        gap: '4px',
        padding: '8px',
        borderBottom: '1px solid var(--dt-color-border-default)',
        background: 'var(--dt-color-surface-secondary)',
      }"
    >
      <dt-button size="200" importance="clear" kind="muted">
        B
      </dt-button>
      <dt-button size="200" importance="clear" kind="muted">
        I
      </dt-button>
      <dt-button size="200" importance="clear" kind="muted">
        U
      </dt-button>
    </div>
    <div :style="{ padding: '12px', minHeight: '80px' }">
      <dt-text as="p">
        The quick brown fox jumps over the lazy dog.
      </dt-text>
    </div>
  </div>
</template>
