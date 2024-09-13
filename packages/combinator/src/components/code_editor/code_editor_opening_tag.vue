<template>
  <dtc-code-editor-tag
    :name="name"
  >
    <template #end>
      <slot />
    </template>
  </dtc-code-editor-tag>
</template>

<script setup>
import DtcCodeEditorTag from './code_editor_tag';

defineProps({
  name: {
    type: String,
    required: true,
  },
  selfClosing: {
    type: Boolean,
    default: false,
  },
});
</script>

<script>
export default {
  name: 'DtcCodeEditorOpeningTag',
};
</script>
