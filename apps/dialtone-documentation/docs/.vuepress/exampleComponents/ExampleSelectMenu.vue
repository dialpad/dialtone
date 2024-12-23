<template>
  <dt-select-menu
    :label="label"
    :options="options"
    :size="size"
    :description="description"
    :messages="messages"
    :show-messages="showMessages"
  >
    <template #label>
      <slot
        name="label"
      />
    </template>
    <template #description>
      <slot
        name="label"
      />
    </template>
  </dt-select-menu>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  size: { type: String, default: 'md' },
  messages: { type: Array, default: () => [] },
  showMessages: { type: Boolean, default: true },
});

const options = [
  { value: ``, label: `Please select one` },
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];
</script>
