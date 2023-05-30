<template>
  <div class="d-emoji-picker__search d-emoji-picker__alignment">
    <dt-input
      ref="searchInput"
      :placeholder="searchPlaceholderLabel"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @keydown.up="$emit('focus-tabset')"
      @keydown.down.prevent="$emit('focus-emoji-selector')"
      @keydown.enter="$emit('select-first-emoji')"
    >
      <template #leftIcon>
        <dt-icon name="search" />
      </template>
      <template
        v-if="modelValue.length > 0"
        #rightIcon
      >
        <button
          class="d-emoji-picker__search-button"
          @click="clearSearch"
          @keydown.enter="clearSearch"
        >
          <dt-icon
            name="close"
          />
        </button>
      </template>
    </dt-input>
  </div>
</template>

<script setup>
import DtInput from '@/components/input/input.vue';
import DtIcon from '@/components/icon/icon.vue';
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

<style scoped>
.d-emoji-picker__search {
  position: relative;
  z-index: 1;
  margin: var(--su16) var(--su24) var(--su16) var(--su16);
  background-color: #FFFFFF;
}
.d-emoji-picker__search-button{
    border: none;
    background: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
    outline: none;
    line-height: 0;
}
</style>
