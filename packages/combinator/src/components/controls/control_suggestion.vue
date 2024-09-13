<template>
  <div>
    <dt-recipe-combobox-with-popover
      ref="combobox"
      list-aria-label="Valid values"
      max-height="512px"
      @select="e => onUpdate(suggestions[e])"
      @opened="onOpen"
    >
      <template #input="{ inputProps, onInput }">
        <dtc-control-string
          v-bind="inputProps"
          :value="value"
          :warning="warning"
          :disabled="disabled"
          @input="e => onInputInternal(e, onInput)"
        >
          <template #default>
            <slot />
          </template>
          <template #icon>
            <icon-collapse v-if="open" />
            <icon-expand v-else />
          </template>
        </dtc-control-string>
      </template>
      <template #list="{ listProps }">
        <ul
          class="d-p0"
          v-bind="listProps"
        >
          <dt-list-item
            v-for="(item, i) in suggestions"
            :key="item"
            navigation-type="arrow-keys"
            role="option"
            @click="onSelectInternal(i)"
          >
            <slot
              name="item"
              :value="item"
            >
              {{ item }}
            </slot>
          </dt-list-item>
        </ul>
      </template>
    </dt-recipe-combobox-with-popover>
  </div>
</template>

<script setup>
import DtcControlString from './control_string';
import IconExpand from 'dialtone-icons/IconArrowKeyboardDown';
import IconCollapse from 'dialtone-icons/IconArrowKeyboardUp';
import { DtRecipeComboboxWithPopover, DtListItem } from '@dialpad/dialtone-vue';

import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, ref } from 'vue';

const WARNING_MESSAGE = 'Unexpected value';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  suggestions: {
    type: Array,
    required: true,
  },
  warn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const warning = computed(() => {
  return props.warn && !props.suggestions.includes(props.value)
    ? WARNING_MESSAGE
    : undefined;
});

const combobox = ref();

function onSelectInternal (i) {
  combobox.value.onSelect(i);
  combobox.value.closeComboboxList();
}

function onInputInternal (value, onInput) {
  onInput(value);
  onUpdate(value);
}

function onUpdate (value) {
  emit(VALUE_UPDATE_EVENT, value);
}

const open = ref(false);

function onOpen (e) {
  open.value = e;
}
</script>

<script>
/**
 * Control that is used to set a string value while providing a list of suggested valid values.
 */
export default {
  name: 'DtcControlSuggestion',
};
</script>
