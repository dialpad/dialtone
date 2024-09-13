<template>
  <span class="dtc-scheme__string">
    <span>"</span>
    <span>
      {{ value }}
    </span>
    <span>"</span>
  </span>
</template>

<script setup>
defineProps({
  value: {
    type: undefined,
    required: true,
  },
});
</script>

<script>
export default {
  name: 'DtcEventConsoleString',
};
</script>
