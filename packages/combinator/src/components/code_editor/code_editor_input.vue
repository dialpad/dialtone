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
  padding: var(--dt-space-200) var(--dt-space-300) var(--dt-space-200) var(--dt-space-300);
  border-radius: var(--dt-space-350);
  border: solid var(--dt-space-100);
  border-color: var(--dtc-theme-color-background-lighten);
  background-color: var(--dtc-theme-color-background-darken);
  outline: none;
}
</style>
