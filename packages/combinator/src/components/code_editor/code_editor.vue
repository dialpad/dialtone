<template>
  <div
    ref="editor"
    class="dtc-code-editor d-d-flex d-fl-grow1"
  >
    <div
      ref="code"
      class="d-fl-grow1"
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
          />
        </template>
        <template #default>
          <div>
            <template
              v-for="(value, slot) in options.slots"
              :key="slot"
            >
              <dtc-code-editor-slot
                v-if="value"
                :name="slot"
                @update:options="e => emit(OPTIONS_UPDATE_EVENT, e)"
              >
                <span class="dtc-theme-popover">{{ value }}</span>
              </dtc-code-editor-slot>
            </template>
          </div>
        </template>
      </dtc-code-editor-element>
    </div>
    <dt-popover
      :class="[
        `dtc-theme--${theme}`,
        'd-ps-sticky',
        'd-t0',
      ]"
      content-class="dtc-theme__popover"
      transition="pop"
      :modal="false"
      :open="showCopyPopover"
    >
      <template #anchor="{ attrs }">
        <dt-button
          class="dtc-theme__button d-ps-sticky d-t0"
          v-bind="attrs"
          importance="clear"
          size="lg"
          @click="copy"
        >
          <template #default>
            Copy
          </template>
          <template #icon>
            <IconCopy />
          </template>
        </dt-button>
      </template>
      <template #content>
        <span>Copied to clipboard</span>
      </template>
    </dt-popover>
  </div>
</template>

<script setup>
import DtcCodeEditorTagAttributes from './code_editor_tag_attributes';
import DtcCodeEditorElement from './code_editor_element';
import DtcCodeEditorSlot from './code_editor_slot';
import IconCopy from 'dialtone-icons/IconContentCopy';
import { DtButton, DtPopover } from '@dialpad/dialtone-vue';

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
});

const emit = defineEmits([
  OPTIONS_UPDATE_EVENT,
]);

const indent = computed(() => {
  return props.indentSpaces;
});

provide(SETTINGS_INDENT_KEY, indent);

const tagName = computed(() => paramCase(props.info.displayName));

const hasSlotContent = computed(() => {
  return props.options.slots
    ? Object.values(props.options.slots).every(slot => !slot)
    : false;
});

const code = ref();
const showCopyPopover = ref(false);

async function copy () {
  let text = code.value.innerText;

  // Remove nbsp char
  text = text.replace(/\xA0/g, '');

  // Remove empty lines
  text = text.replace(/^\s*[\r\n]/gm, '');

  await navigator.clipboard.writeText(text);

  showCopyPopover.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  showCopyPopover.value = false;
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
.dtc-code-editor__margin {
  border-left: var(--dtc-theme-color-background-darken) solid 1px;
}
</style>
