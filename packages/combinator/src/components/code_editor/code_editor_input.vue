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
  padding: var(--dt-spacing-25) var(--dt-spacing-50) var(--dt-spacing-25) var(--dt-spacing-50);
  border-radius: var(--dt-spacing-75);
  border: solid var(--dt-spacing-1);
  border-color: var(--dtc-theme-color-background-lighten);
  background-color: var(--dtc-theme-color-background-darken);
  outline: none;
}
</style>
