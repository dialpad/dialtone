<template>
  <span
    class="dtc-code-editor-input d-ws-pre-wrap"
    spellcheck="false"
    contenteditable
    @input="onInput"
  >
    <slot />
  </span>
</template>

<script setup>
import { nextTick } from 'vue';

const emit = defineEmits(['input']);

function getCaretOffset (element) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return 0;
  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(element);
  range.setEnd(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset);
  return range.toString().length;
}

function setCaretOffset (element, offset) {
  const sel = window.getSelection();
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let node;
  while ((node = walker.nextNode())) {
    if (currentOffset + node.textContent.length >= offset) {
      range.setStart(node, offset - currentOffset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    currentOffset += node.textContent.length;
  }
}

function onInput (e) {
  const offset = getCaretOffset(e.target);
  emit('input', e);
  nextTick(() => {
    setCaretOffset(e.target, offset);
  });
}
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
