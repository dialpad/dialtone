<template>
  <dt-button
    v-dt-tooltip="'Mark all as read'"
    :aria-label="'Mark all as read'"
    class="d-fc-tertiary d-h24 d-w24"
    importance="clear"
    kind="muted"
    size="sm"
    circle
  >
    <template #icon="{ iconSize }">
      <dt-icon-double-check
        :size="iconSize"
      />
    </template>
  </dt-button>
</template>

<script setup>
import { DtButton } from '@/components/button';
import { DtIconDoubleCheck } from '@dialpad/dialtone-icons/vue3';
</script>
