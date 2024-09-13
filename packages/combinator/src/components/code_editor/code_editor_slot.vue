<template>
  <dtc-code-editor-indent
    :level="indentLevel"
  >
    <dtc-code-editor-element
      v-if="name !== DEFAULT_SLOT_NAME"
      tag-name="template"
    >
      <template #opening>
        <span>&nbsp;</span>
        <span class="dtc-scheme__class">#{{ name }}</span>
      </template>
      <template #default>
        <dtc-code-editor-indent
          :level="indentLevel"
        >
          <dtc-code-editor-input
            @input="onInput"
          >
            <slot />
          </dtc-code-editor-input>
        </dtc-code-editor-indent>
      </template>
    </dtc-code-editor-element>
    <dtc-code-editor-input
      v-else
      @input="onInput"
    >
      <slot />
    </dtc-code-editor-input>
  </dtc-code-editor-indent>
</template>

<script setup>
import DtcCodeEditorElement from './code_editor_element';
import DtcCodeEditorInput from './code_editor_input';
import { DEFAULT_SLOT_NAME } from '@/src/lib/constants';
import DtcCodeEditorIndent from '@/src/components/code_editor/code_editor_indent';

const props = defineProps({
  /**
   * Name of slot in template tag.
   */
  name: {
    type: String,
    default: DEFAULT_SLOT_NAME,
  },
  /**
   * Indent level of slot.
   */
  indentLevel: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['update:options']);

function onInput (e) {
  emit('update:options', options => {
    options.slots[props.name] = e.target.textContent;
  });
}
</script>

<script>
/**
 * The slot displays the content wrapped by 'template' tags that match the slot name.
 * The default slot is not wrapped by 'template' tags.
 */
export default {
  name: 'DtcCodeEditorSlot',
};
</script>
