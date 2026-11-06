<template>
  <div>
    <dtc-code-editor-opening-tag
      v-if="showTags"
      :name="tagName"
    >
      <slot name="opening" />
      <span v-if="selfClosing"> /</span>
    </dtc-code-editor-opening-tag>
    <div
      :class="{ 'dtc-code-editor__margin': showTags }"
    >
      <slot />
    </div>
    <dtc-code-editor-closing-tag
      v-if="showTags && !selfClosing"
      :name="tagName"
    />
  </div>
</template>

<script setup>
import DtcCodeEditorOpeningTag from './code_editor_opening_tag.vue';
import DtcCodeEditorClosingTag from './code_editor_closing_tag.vue';

defineProps({
  /** Keep editable content mounted when its slot scope appears or disappears. */
  showTags: {
    type: Boolean,
    default: true,
  },
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
