<template>
  <dtc-control-selection
    :value="iconName"
    :valid-values="iconNames"
    :default-value="null"
    :disabled="disabled"
    @update:value="onSelect"
  >
    <slot />
  </dtc-control-selection>
</template>

<script setup>
import DtcControlSelection from './control_selection.vue';
import {
  iconNames,
  iconNameToTemplate,
  templateToIconName,
  hasIconSizeBinding,
} from '@/src/lib/icons';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    default: () => null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  bindings: {
    type: Array,
    default: () => [],
  },
  defaultValue: {
    type: undefined,
    default: () => null,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const iconName = computed(() => templateToIconName(props.value) ?? null);

function onSelect (name) {
  if (name === null) {
    emit(VALUE_UPDATE_EVENT, null);
    return;
  }
  const isScoped = hasIconSizeBinding(props.bindings);
  emit(VALUE_UPDATE_EVENT, iconNameToTemplate(name, isScoped));
}
</script>

<script>
/**
 * Control that displays a searchable icon dropdown for icon slots.
 */
export default {
  name: 'DtcControlIconSlot',
};
</script>
