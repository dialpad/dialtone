<template>
  <dialpad-layout>
    <template #leftbar>
      <dialpad-leftbar />
    </template>
  </dialpad-layout>
</template>

<script setup>
import DialpadLayout from './dialpad_layout.vue';
import DialpadLeftbar from './leftbar/dialpad_leftbar.vue';
</script>
