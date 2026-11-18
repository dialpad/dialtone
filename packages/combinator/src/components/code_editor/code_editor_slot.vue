<template>
  <dtc-code-editor-indent
    :level="indentLevel"
  >
    <dtc-code-editor-element
      :show-tags="showTemplate"
      tag-name="template"
    >
      <template #opening>
        <span>&nbsp;</span>
        <span class="dtc-scheme__class">#{{ name }}<template v-if="scopeString">="{{ scopeString }}"</template></span>
      </template>
      <template #default>
        <dtc-code-editor-indent
          :level="showTemplate ? indentLevel : 0"
        >
          <dtc-code-editor-input
            @input="onInput"
          >
            <slot />
          </dtc-code-editor-input>
        </dtc-code-editor-indent>
      </template>
    </dtc-code-editor-element>
  </dtc-code-editor-indent>
</template>

<script setup>
import DtcCodeEditorElement from './code_editor_element.vue';
import DtcCodeEditorInput from './code_editor_input.vue';
import { DEFAULT_SLOT_NAME } from '@/src/lib/constants';
import DtcCodeEditorIndent from '@/src/components/code_editor/code_editor_indent.vue';
import { computed } from 'vue';
import { getSlotScope } from '@/src/lib/code_copy';

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
  /**
   * Slot bindings from component documentation.
   */
  bindings: {
    type: Array,
    default: undefined,
  },
  scopeName: {
    type: String,
    default: '',
  },
  /**
   * The slot's template content string.
   */
  content: {
    type: String,
    default: '',
  },
});

const scopeString = computed(() => getSlotScope(props, props.content));
const showTemplate = computed(() => props.name !== DEFAULT_SLOT_NAME || Boolean(scopeString.value));

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
 * Default slots are wrapped only when their content uses documented slot scope.
 */
export default {
  name: 'DtcCodeEditorSlot',
};
</script>
