<template>
  <dt-stack
    ref="editor"
    class="dtc-code-editor d-w100p"
    direction="row"
    gap="300"
    align="start"
  >
    <div
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
    <dt-stack
      direction="row"
      gap="200"
      class="d-ps-sticky d-t0 d-r0"
    >
      <dt-button
        v-if="devMode && hasChanges"
        class="dtc-theme__button"
        kind="muted"
        importance="clear"
        size="xs"
        @click="copyJson"
      >
        <template #default>
          {{ copiedJson ? 'Copied!' : 'Copy&nbsp;JSON' }}
        </template>
        <template #icon="{ iconSize }">
          <component
            :is="copiedJson ? DtIconCheck : DtIconBraces"
            :size="iconSize"
            :class="{ 'd-fc-success': copiedJson }"
          />
        </template>
      </dt-button>
      <dt-button
        class="dtc-theme__button"
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
  </dt-stack>
</template>

<script setup>
import DtcCodeEditorTagAttributes from './code_editor_tag_attributes.vue';
import DtcCodeEditorElement from './code_editor_element.vue';
import DtcCodeEditorSlot from './code_editor_slot.vue';
import { DtIconCheck, DtIconCopy, DtIconBraces } from '@dialpad/dialtone-icons/vue';
import { DtButton, DtStack } from '@dialpad/dialtone-vue';

import { OPTIONS_UPDATE_EVENT, SETTINGS_INDENT_KEY, DEFAULT_SLOT_NAME } from '@/src/lib/constants';
import { stringifyDocValue } from '@/src/lib/parse';
import { ref, computed, provide } from 'vue';
import { paramCase, camelCase } from 'change-case';

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
  devMode: {
    type: Boolean,
    default: false,
  },
  hasChanges: {
    type: Boolean,
    default: false,
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

const copied = ref(false);
const copiedJson = ref(false);

/**
 * Generates plain-text copy of the code from component data.
 * Bypasses DOM/innerText entirely to avoid flex layout indentation issues.
 */
const copyText = computed(() => {
  const pad = ' '.repeat(props.indentSpaces);
  const name = tagName.value;
  const lines = [];

  // Visible bindings (same filter logic as code_editor_tag_attributes)
  const infoBindings = props.info.bindings.get();
  const optionBindings = props.options.bindings.get();
  const visibleBindings = Object.entries(optionBindings)
    .map(([bindingName, value]) => {
      const info = infoBindings.find(b => b.name === bindingName);
      return { ...info, name: bindingName, value };
    })
    .filter(member => {
      if (props.disabledMembers.has(member.name)) return false;
      if (props.verbose) return true;
      return JSON.stringify(member.defaultValue) !== JSON.stringify(member.value);
    });

  // Format each attribute
  const attrLines = visibleBindings.map(member => {
    const v = member.value;
    if (v === true) return pad + member.label;
    const isBind = typeof v !== 'string';
    const prefix = isBind ? ':' : '';
    const str = isBind ? stringifyDocValue(v) : v.toString();
    return pad + prefix + member.label + '="' + str + '"';
  });

  // Visible slots
  const slotEntries = props.options.slots
    ? Object.entries(props.options.slots)
      .filter(([slot, value]) => value && !props.disabledMembers.has(slot))
    : [];

  const hasContent = slotEntries.length > 0;

  // Opening tag
  if (attrLines.length === 0 && !hasContent) {
    lines.push('<' + name + ' />');
  } else if (attrLines.length === 0) {
    lines.push('<' + name + '>');
  } else {
    lines.push('<' + name);
    lines.push(...attrLines);
    lines.push(hasContent ? '>' : '/>');
  }

  // Slot content
  if (hasContent) {
    for (const [slot, value] of slotEntries) {
      if (slot === DEFAULT_SLOT_NAME) {
        lines.push(pad + value);
      } else {
        const slotInfo = props.info.slots?.find(s => s.name === slot);
        const usedBindings = (slotInfo?.bindings || [])
          .map(b => camelCase(b.name))
          .filter(n => value.includes(n));
        const scope = usedBindings.length > 0
          ? '="{ ' + usedBindings.join(', ') + ' }"'
          : '';
        lines.push(pad + '<template #' + slot + scope + '>');
        lines.push(pad + pad + value);
        lines.push(pad + '</template>');
      }
    }
    lines.push('</' + name + '>');
  }

  return lines.join('\n');
});

function serializeAsVariantPreset () {
  const preset = {};
  const memberGroups = ['props', 'slots', 'attributes'];

  for (const group of memberGroups) {
    const infoMembers = props.info[group];
    const optionValues = props.options[group];
    if (!infoMembers || !optionValues) continue;

    for (const member of infoMembers) {
      const value = optionValues[member.name];
      if (props.disabledMembers.has(member.name)) continue;
      if (value === undefined || value === null || value === '') continue;

      if (!preset[group]) preset[group] = {};
      preset[group][member.name] = { initialValue: value };
    }
  }

  return preset;
}

function formatJsValue (value, indent) {
  if (typeof value === 'string') return `'${value.replace(/'/g, '\\\'')}'`;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const inner = entries
      .map(([k, v]) => `${indent}  ${k}: ${formatJsValue(v, indent + '  ')}`)
      .join(',\n');
    return `{\n${inner},\n${indent}}`;
  }
  return String(value);
}

function formatPresetAsJs (preset) {
  const pad = '  ';
  const sections = [];

  for (const [group, members] of Object.entries(preset)) {
    const entries = Object.entries(members)
      .map(([name, obj]) => `${pad}${pad}${pad}${name}: { initialValue: ${formatJsValue(obj.initialValue, pad + pad + pad)} }`)
      .join(',\n');
    sections.push(`${pad}${pad}${group}: {\n${entries},\n${pad}${pad}}`);
  }

  return `\n${pad}'⚡️ UNNAMED PRESET': {\n${sections.join(',\n')},\n${pad}},`;
}

async function copyJson () {
  const preset = serializeAsVariantPreset();
  const text = formatPresetAsJs(preset);
  await navigator.clipboard.writeText(text);
  copiedJson.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  copiedJson.value = false;
}

async function copy () {
  await navigator.clipboard.writeText(copyText.value);

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
