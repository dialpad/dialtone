<template>
  <div>
    <span>{{ name }}</span>
    <slot name="separator">
      <span>:&nbsp;</span>
    </slot>
    <span v-if="value !== undefined">
      <component
        :is="component"
        :value="value"
      />
    </span>
  </div>
</template>

<script setup>
import DtcEventConsoleElement from './event_console_element';
import DtcEventConsoleFunction from './event_console_function';
import DtcEventConsoleArray from './event_console_array';
import DtcEventConsoleObject from './event_console_object';
import DtcEventConsoleString from './event_console_string';
import DtcEventConsoleValue from './event_console_value';

import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: undefined,
    default: undefined,
  },
});

/**
 * Component to render based on the 'value' prop.
 *
 * @type {ComputedRef<object>}
 */
const component = computed(() => {
  const value = props.value;

  if (value === null) { return DtcEventConsoleValue; }
  if (value instanceof Element) { return DtcEventConsoleElement; }

  switch (typeof value) {
    case 'function': return DtcEventConsoleFunction;
    case 'object': {
      return Array.isArray(value)
        ? DtcEventConsoleArray
        : DtcEventConsoleObject;
    }
    case 'string': return DtcEventConsoleString;
    default: return DtcEventConsoleValue;
  }
});
</script>

<script>
/**
 * The pair represents a key-value pair and allows recursive exploration of objects.
 * A pair contains a name (key) and a value.
 * Based on the data type of the value it will display a component to represent a value.
 */
export default {
  name: 'DtcEventConsolePair',
};
</script>
