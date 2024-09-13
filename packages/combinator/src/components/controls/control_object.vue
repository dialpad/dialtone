<template>
  <dtc-control-iterable
    :value="entries"
    :disabled="disabled"
    :generate-item="generateItem"
    @update:value="updateValue"
  >
    <template #default>
      <slot />
    </template>
    <template #prefix>
      {
    </template>
    <template #item="{ item, update }">
      <div class="d-d-grid d-g-cols2">
        <div
          class="d-d-flex"
          data-qa="dtc-control-object-item-key"
        >
          <dtc-control-string
            :value="item[0]"
            :disabled="disabled"
            @update:value="e => updateKey(e, item[1], update)"
          />
          <span class="d-px6 d-ps-relative d-t6">:</span>
        </div>
        <div
          class="dtc-control-object__contents"
          data-qa="dtc-control-object-item-value"
        >
          <dtc-control-dynamic
            class="dtc-control-object__contents"
            input-class="d-gc-full"
            :value="serializeControlValue(item[1])"
            :disabled="disabled"
            @update:value="e => updateEntry(item[0], deserializeControlValue(e), update)"
          />
        </div>
      </div>
    </template>
    <template #suffix>
      }
    </template>
  </dtc-control-iterable>
</template>

<script setup>
import DtcControlString from './control_string';
import DtcControlIterable from './control_iterable';
import DtcControlDynamic from './control_dynamic';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';
import { serializeControlValue, deserializeControlValue } from '@/src/lib/control';
import { OrderedObject } from '@/src/lib/ordered_object';

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const entries = computed(() => {
  return props.value ? Object.entries(props.value) : [];
});

const keys = computed(() => {
  return entries.value.map(([key]) => key);
});

let currentId = 0;
function generateNextId () {
  while (keys.value.includes(currentId.toString())) {
    currentId++;
  }

  return currentId.toString();
}

function generateItem () {
  return [generateNextId(), undefined];
}

function updateKey (key, value, updateItem) {
  if (keys.value.includes(key)) {
    const id = generateNextId();
    console.log(`Object cannot contain duplicate key '${key}', key set to '${id}'`);
    key = id;
  }

  updateEntry(key, value, updateItem);
}

function updateEntry (key, value, updateItem) {
  updateItem([key, value]);
}

function updateValue (e) {
  const orderedObject = OrderedObject.fromEntries(e);

  emit(VALUE_UPDATE_EVENT, orderedObject);
}
</script>

<script>
/**
 * Control that is used to provide functionality to manipulate objects.
 */
export default {
  name: 'DtcControlObject',
};
</script>

<style>
.dtc-control-object__contents {
  display: contents;
}
</style>
