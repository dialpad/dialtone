<template>
  <!-- Segmented control is NEW in Next (DLT-413) — captured after-only; there
       is no staging counterpart. -->
  <div class="vg-scene" style="width:520px;">
    <p class="vg-heading">
      Segmented control (new component)
    </p>
    <dt-segmented-control v-model="selected" aria-label="View filter">
      <dt-segmented-control-item value="all">
        All
      </dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">
        Favorites
      </dt-segmented-control-item>
      <dt-segmented-control-item value="recent">
        Recent
      </dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const selected = ref('favorites');
</script>
