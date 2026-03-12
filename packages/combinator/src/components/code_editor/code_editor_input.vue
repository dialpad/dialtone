<template>
  <span
    class="dtc-code-editor-input d-ws-pre-wrap"
    spellcheck="false"
    contenteditable
    @input="e => emit('input', e)"
  >
    <slot />
  </span>
</template>

<script setup>
const emit = defineEmits(['input']);
</script>

<script>
export default {
  name: 'DtcCodeEditorInput',
};
</script>

<style lang="less">
.dtc-code-editor-input {
  border: solid var(--dt-spacing-1) transparent;
  background-color: transparent;
  outline: none;
  &:hover {
    border-color: var(--dt-color-border-moderate);
  }
}
</style>
