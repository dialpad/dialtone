<template>
  <dtc-code-editor-tag
    :name="name"
  >
    <template #start>
      <span>/</span>
    </template>
  </dtc-code-editor-tag>
</template>

<script setup>
import DtcCodeEditorTag from './code_editor_tag.vue';

defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<script>
export default {
  name: 'DtcCodeEditorClosingTag',
};
</script>
