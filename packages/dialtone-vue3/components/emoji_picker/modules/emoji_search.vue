<template>
  <div class="d-emoji-picker__search d-emoji-picker__alignment">
    <dt-input
      id="searchInput"
      ref="searchInput"
      :placeholder="searchPlaceholderLabel"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @keydown.up="$emit('focus-tabset')"
      @keydown.down.prevent="$emit('focus-emoji-selector')"
      @keydown.enter="$emit('select-first-emoji')"
    >
      <template #leftIcon>
        <dt-icon-search
          size="200"
        />
      </template>
      <template
        v-if="modelValue.length > 0"
        #rightIcon
      >
        <dt-button
          importance="clear"
          size="xs"
          class="d-mrn4"
          circle
          kind="muted"
          @click="clearSearch"
        >
          <template #icon>
            <dt-icon-close
              size="200"
            />
          </template>
        </dt-button>
      </template>
    </dt-input>
  </div>
</template>

<script setup>
import { DtIconSearch, DtIconXCircle } from '@dialpad/dialtone-icons/vue3';
import { DtInput } from '@/components/input';
import { DtButton } from '@/components/button';
import { onMounted, ref } from 'vue';

defineProps({
  searchPlaceholderLabel: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['update:modelValue', 'focus-emoji-selector', 'focus-tabset', 'select-first-emoji']);

const searchInput = ref(null);

function clearSearch () {
  emits('update:modelValue', '');
  focusSearchInput();
}

function focusSearchInput () {
  searchInput.value.focus();
}
onMounted(() => {
  focusSearchInput();
});

defineExpose({
  focusSearchInput,
});
</script>
