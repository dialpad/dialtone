<template>
  <div>
    <dtc-code-editor-opening-tag
      :name="tagName"
    >
      <slot name="opening" />
      <span v-if="selfClosing"> /</span>
    </dtc-code-editor-opening-tag>
    <div
      class="dtc-code-editor__margin"
    >
      <slot />
    </div>
    <dtc-code-editor-closing-tag
      v-if="!selfClosing"
      :name="tagName"
    />
  </div>
</template>

<script setup>
import DtcCodeEditorOpeningTag from './code_editor_opening_tag';
import DtcCodeEditorClosingTag from './code_editor_closing_tag';

defineProps({
  tagName: {
    type: String,
    required: true,
  },
  /**
   * Exclude closing tag and append a '/' to end of opening tag.
   */
  selfClosing: {
    type: Boolean,
    default: false,
  },
});
</script>

<script>
export default {
  name: 'DtcCodeEditorElement',
};
</script>
