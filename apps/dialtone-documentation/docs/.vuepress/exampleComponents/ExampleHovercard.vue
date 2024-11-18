<template>
  <dt-hovercard placement="bottom-start" content-class="d-wmn332 ">
    <template #anchor>
      <dt-button>
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
  label: { type: String, default: 'Hover for example' },
  content: { type: String, default: 'Content' },
});
</script>
