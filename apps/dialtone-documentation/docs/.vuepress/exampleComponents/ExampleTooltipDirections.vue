<template>
  <div
    class="d-d-grid d-g-100 d-g-cols3"
  >
    <dt-tooltip
      v-for="direction in directions"
      :key="direction"
      :placement="direction"
      message="This is a simple tooltip. The tooltip can be positioned in different directions."
    >
      <template #anchor>
        <dt-button
          importance="outlined"
          class="d-w-200"
        >
          {{ direction }}
        </dt-button>
      </template>
    </dt-tooltip>
  </div>
</template>

<script setup>
defineProps({
  directions: { type: Array, default: () => [] },
});
</script>
