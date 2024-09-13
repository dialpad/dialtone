<template>
  <dtc-control-iterable
    :value="value"
    :disabled="disabled"
    :generate-item="generateItem"
    @update:value="e => emit(VALUE_UPDATE_EVENT, e)"
  >
    <template #default>
      <slot />
    </template>
    <template #prefix>
      [
    </template>
    <template #item="{ item, update }">
      <div
        data-qa="dtc-control-array-item"
      >
        <dtc-control-dynamic
          :value="serializeControlValue(item)"
          :disabled="disabled"
          @update:value="e => update(deserializeControlValue(e))"
        />
      </div>
    </template>
    <template #suffix>
      ]
    </template>
  </dtc-control-iterable>
</template>

<script setup>
import DtcControlIterable from './control_iterable';
import DtcControlDynamic from './control_dynamic';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { serializeControlValue, deserializeControlValue } from '@/src/lib/control';

defineProps({
  value: {
    type: Array,
    default: () => ([]),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

function generateItem () {
  return undefined;
}
</script>

<script>
/**
 * Control that is used to provide functionality to manipulate arrays.
 */
export default {
  name: 'DtcControlArray',
};
</script>
