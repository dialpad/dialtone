<template>
  <div class="d-emoji-picker__search d-emoji-picker__alignment">
    <dt-input
      :placeholder="searchPlaceholderLabel"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
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
        >
          <dt-icon
            name="close"
            @click="$emit('update:modelValue', '')"
          />
        </button>
      </template>
    </dt-input>
  </div>
</template>

<script setup>
import DtInput from '@/components/input/input.vue';
import DtIcon from '@/components/icon/icon.vue';

defineEmits(['update:modelValue']);
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
