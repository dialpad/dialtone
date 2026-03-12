<template>
  <div>
    <dt-recipe-combobox-with-popover
      ref="combobox"
      label="Icon"
      max-height="320px"
      list-class="d-w216"
      size="xs"
      @select="e => onSelect(filteredIcons[e])"
      @opened="onOpen"
    >
      <template #input="{ inputProps, onInput }">
        <dtc-control-string
          v-bind="inputProps"
          :value="searchText"
          :disabled="disabled"
          @input="e => onInputInternal(e, onInput)"
        >
          <template #default>
            <slot />
          </template>
          <template #icon="{ iconSize }">
            <component
              :is="DtIconChevronsUpDown"
              :size="iconSize"
            />
          </template>
        </dtc-control-string>
      </template>
      <template #list="{ listProps }">
        <ul
          class="d-p0"
          v-bind="listProps"
        >
          <dt-list-item
            v-for="(item, i) in filteredIcons"
            :key="item"
            navigation-type="arrow-keys"
            role="option"
            @click="onSelectInternal(i)"
          >
            {{ item }}
          </dt-list-item>
        </ul>
      </template>
    </dt-recipe-combobox-with-popover>
  </div>
</template>

<script setup>
import DtcControlString from './control_string.vue';
import { DtRecipeComboboxWithPopover, DtListItem } from '@dialpad/dialtone-vue';
import { DtIconChevronDown, DtIconChevronRight } from '@dialpad/dialtone-icons/vue3';

import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, ref, watch } from 'vue';
import {
  iconNames,
  iconNameToTemplate,
  templateToIconName,
  hasIconSizeBinding,
} from '@/src/lib/icons';

const NONE_OPTION = '(none)';

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
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const searchText = ref(templateToIconName(props.value) ?? '');

watch(() => props.value, (newVal) => {
  searchText.value = templateToIconName(newVal) ?? '';
});

const allIcons = computed(() => [NONE_OPTION, ...iconNames]);

const filteredIcons = computed(() => {
  const query = searchText.value.toLowerCase();
  if (!query) return allIcons.value;
  return allIcons.value.filter(name =>
    name.toLowerCase().includes(query),
  );
});

const combobox = ref();
const open = ref(false);

function onOpen (e) {
  open.value = e;
}

function onSelectInternal (i) {
  combobox.value.onSelect(i);
  combobox.value.closeComboboxList();
}

function onSelect (iconName) {
  if (iconName === NONE_OPTION) {
    searchText.value = '';
    emit(VALUE_UPDATE_EVENT, null);
    return;
  }
  searchText.value = iconName;
  const isScoped = hasIconSizeBinding(props.bindings);
  emit(VALUE_UPDATE_EVENT, iconNameToTemplate(iconName, isScoped));
}

function onInputInternal (value, onInput) {
  searchText.value = value;
  onInput(value);
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
