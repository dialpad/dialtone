<template>
  <dt-hovercard placement="bottom-start" content-class="d-wmn-500 ">
    <template #anchor>
      <dt-button kind="muted" importance="outlined" :size="200">
        {{ label }}
      </dt-button>
    </template>
    <template #content>
      <div>{{ content }}</div>
    </template>
    <template #headerContent>
      <div>Header</div>
    </template>
    <template #footerContent>
      <div>Footer</div>
    </template>
  </dt-hovercard>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'Hover me' },
  content: { type: String, default: 'Content' },
});
</script>
