<template>
  <div>
    <dt-recipe-combobox-with-popover
      ref="combobox"
      label="Icon"
      max-height="320px"
      list-class="d-wmn164 d-hmx216"
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
            <dt-button
              v-if="isModified"
              kind="muted"
              importance="clear"
              size="xs"
              class="d-p2"
              @click.stop="onReset"
            >
              <template #icon>
                <dt-icon-close size="100" />
              </template>
            </dt-button>
            <component
              :is="DtIconChevronsUpDown"
              v-else
              :size="iconSize"
              class="d-fc-muted"
            />
          </template>
        </dtc-control-string>
      </template>
      <template #list="{ listProps }">
        <ul
          class="d-p4"
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
import { DtButton, DtRecipeComboboxWithPopover, DtListItem } from '@dialpad/dialtone-vue';
import { DtIconChevronsUpDown, DtIconClose } from '@dialpad/dialtone-icons/vue';

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
  defaultValue: {
    type: undefined,
    default: () => null,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const searchText = ref(templateToIconName(props.value) ?? '');

watch(() => props.value, (newVal) => {
  searchText.value = templateToIconName(newVal) ?? '';
});

const isModified = computed(() => props.value !== props.defaultValue);

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

function onReset () {
  searchText.value = templateToIconName(props.defaultValue) ?? '';
  emit(VALUE_UPDATE_EVENT, props.defaultValue);
}

function onInputInternal (value, onInput) {
  searchText.value = value;
  if (!value) {
    emit(VALUE_UPDATE_EVENT, null);
  }
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
