<template>
  <dt-stack
    ref="editor"
    class="dtc-code-editor d-w100p"
    direction="row"
    gap="300"
    align="start"
  >
    <div
      ref="code"
      class="d-fl1"
    >
      <dtc-code-editor-element
        :tag-name="tagName"
        :self-closing="hasSlotContent"
      >
        <template #opening>
          <dtc-code-editor-tag-attributes
            :info-bindings="info.bindings.get()"
            :option-bindings="options.bindings.get()"
            :verbose="verbose"
            :disabled-members="disabledMembers"
          />
        </template>
        <template #default>
          <div>
            <template
              v-for="(value, slot) in options.slots"
              :key="slot"
            >
              <dtc-code-editor-slot
                v-if="value && !disabledMembers.has(slot)"
                :name="slot"
                :bindings="slotBindingsMap[slot]"
                :content="value"
                @update:options="e => emit(OPTIONS_UPDATE_EVENT, e)"
              >
                <span class="dtc-theme-popover">{{ value }}</span>
              </dtc-code-editor-slot>
            </template>
          </div>
        </template>
      </dtc-code-editor-element>
    </div>
    <dt-button
      class="dtc-theme__button d-ps-sticky d-t0 d-r0"
      kind="muted"
      importance="clear"
      size="xs"
      @click="copy"
    >
      <template #default>
        {{ copied ? 'Copied!' : 'Copy' }}
      </template>
      <template #icon="{ iconSize }">
        <component
          :is="copied ? DtIconCheck : DtIconCopy"
          :size="iconSize"
          :class="{ 'd-fc-success': copied }"
        />
      </template>
    </dt-button>
  </dt-stack>
</template>

<script setup>
import DtcCodeEditorTagAttributes from './code_editor_tag_attributes.vue';
import DtcCodeEditorElement from './code_editor_element.vue';
import DtcCodeEditorSlot from './code_editor_slot.vue';
import { DtIconCheck, DtIconCopy } from '@dialpad/dialtone-icons/vue3';
import { DtButton, DtStack } from '@dialpad/dialtone-vue';

import { OPTIONS_UPDATE_EVENT, SETTINGS_INDENT_KEY } from '@/src/lib/constants';
import { ref, computed, provide } from 'vue';
import { paramCase } from 'change-case';

const props = defineProps({
  /**
   * Options data object.
   */
  options: {
    type: Object,
    required: true,
  },
  /**
   * Info data object.
   */
  info: {
    type: Object,
    required: true,
  },
  /**
   * Popover theme setting.
   */
  theme: {
    type: String,
    required: true,
  },
  /**
   * Attributes verbose setting.
   */
  verbose: {
    type: Boolean,
    required: true,
  },
  /**
   * Indent spaces setting.
   */
  indentSpaces: {
    type: Number,
    required: true,
  },
  /**
   * Set of member names that are currently disabled.
   */
  disabledMembers: {
    type: Set,
    default: () => new Set(),
  },
});

const emit = defineEmits([
  OPTIONS_UPDATE_EVENT,
]);

const indent = computed(() => {
  return props.indentSpaces;
});

provide(SETTINGS_INDENT_KEY, indent);

const tagName = computed(() => paramCase(props.info.displayName));

const slotBindingsMap = computed(() => {
  if (!props.info.slots) return {};
  return Object.fromEntries(
    props.info.slots
      .filter(slot => slot.bindings?.length)
      .map(slot => [slot.name, slot.bindings]),
  );
});

const hasSlotContent = computed(() => {
  return props.options.slots
    ? Object.values(props.options.slots).every(slot => !slot)
    : false;
});

const code = ref();
const copied = ref(false);

async function copy () {
  let text = code.value.innerText;

  // Convert nbsp to regular spaces
  text = text.replace(/\xA0/g, ' ');

  // The flex-row indent component causes innerText to put the indent
  // (spaces from nbsp) on its own line, followed by the attribute lines
  // without indent. Fix: treat whitespace-only lines as an indent marker
  // and prepend that indent to all subsequent content lines.
  const lines = text.split('\n');
  const result = [];
  let currentIndent = '';

  for (const line of lines) {
    if (line.length > 0 && line.trim() === '') {
      // Whitespace-only = indent marker from nbsp
      currentIndent = line;
    } else if (line.startsWith('<') || line === '>' || line === '/>') {
      // Tag boundary, output as-is and reset indent
      currentIndent = '';
      result.push(line);
    } else if (line.trim() !== '') {
      // Content line, prepend current indent
      result.push(currentIndent + line);
    }
  }

  await navigator.clipboard.writeText(result.join('\n'));

  copied.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  copied.value = false;
}
</script>

<script>
/**
 * The code editor displays the vue template code required to reproduce
 * the component in its current state in an external project.
 */
export default {
  name: 'DtcCodeEditor',
};
</script>

<style>
.dtc-code-editor {
  font: var(--dt-text-code-sm);
  line-height: var(--dt-font-line-height-400);
}

.dtc-code-editor__margin {
  border-inline-start: var(--dtc-theme-color-background-darken) solid 1px;
}
</style>
