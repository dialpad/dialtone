<template>
  <dt-button
    v-dt-tooltip="'Mark all as read'"
    :aria-label="'Mark all as read'"
    class="d-fc-tertiary"
    importance="clear"
    kind="muted"
    size="sm"
    circle
  >
    <template #icon="{ iconSize }">
      <dt-icon
        name="double-check"
        :size="iconSize"
      />
    </template>
  </dt-button>
</template>

<script setup>
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
</script>
