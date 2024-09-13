<template>
  <div
    v-if="!isEmpty"
    class="dtc-code-editor__margin"
  >
    <dtc-code-editor-indent>
      <div>
        <template
          v-for="[name, { value, label }] in bindingMap"
          :key="name"
        >
          <div>
            <span v-if="useBindOperator(value)">:</span>
            <span class="dtc-scheme__class">
              {{ label }}
            </span>
            <span v-if="!useShortSyntax(value)">
              <span>=</span>
              <span class="dtc-scheme__string">"</span>
              <span
                :class="{
                  'dtc-scheme__string': !useBindOperator(value),
                  'dtc-scheme__value': useBindOperator(value),
                }"
              >
                {{ stringifyValue(value) }}
              </span>
              <span class="dtc-scheme__string">"</span>
            </span>
          </div>
        </template>
      </div>
    </dtc-code-editor-indent>
  </div>
</template>

<script setup>
import DtcCodeEditorIndent from './code_editor_indent';

import { computed } from 'vue';
import { stringifyDocValue } from '@/src/lib/parse';

const props = defineProps({
  /**
   * Info data object.
   */
  infoBindings: {
    type: Array,
    required: true,
  },
  /**
   * Binding members to be displayed as attributes.
   */
  optionBindings: {
    type: Object,
    required: true,
  },
  /**
   * Show all bindings regardless of default value.
   */
  verbose: {
    type: Boolean,
    default: false,
  },
});

/**
 * Merges binding info with the actual binding values to conditionally
 * display them in the tag.
 *
 * @type {ComputedRef<object>}
 */
const bindingMap = computed(() => {
  return Object.entries(props.optionBindings).map(([bindingName, value]) => {
    const bindingInfo = props.infoBindings.find(infoBinding => infoBinding.name === bindingName);
    return [bindingName, {
      ...bindingInfo,
      value,
    }];
  }).filter(([name, member]) => isMemberVisible(name, member));
});

/**
 * Determines if the member is visible.
 * Compares the current value of the member to the default value.
 * All members are considered visible if the verbose setting is on.
 *
 * @param name - The member name.
 * @param member - The member info.
 * @returns {boolean} If the member is visible.
 */
function isMemberVisible (name, member) {
  if (props.verbose) { return true; }

  const defaultString = JSON.stringify(member.defaultValue);
  const valueString = JSON.stringify(member.value);

  return defaultString !== valueString;
}

/**
 * If the value is boolean it should only show the member and not the value.
 *
 * @param value - The member value.
 * @returns {boolean} - If the member should be displayed using short syntax.
 */
function useShortSyntax (value) {
  return value === true;
}

/**
 * If the value is not a string it should use the ':' operator
 * to indicate the true value is being passed in.
 *
 * @param value - The member value.
 * @returns {boolean} If the member should be displayed using the bind operator.
 */
function useBindOperator (value) {
  return !useShortSyntax(value) && typeof value !== 'string';
}

function stringifyValue (value) {
  if (!value) { return `${value}`; }
  return useBindOperator(value)
    ? stringifyDocValue(value)
    : value.toString();
}

const isEmpty = computed(() => {
  return bindingMap.value.length <= 0;
});
</script>

<script>
/**
 * This component generates all the attribute fields to be included on the element tag.
 */
export default {
  name: 'DtcCodeEditorTagAttributes',
};
</script>
