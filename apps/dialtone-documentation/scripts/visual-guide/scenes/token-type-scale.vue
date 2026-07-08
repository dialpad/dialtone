<template>
  <!-- The type scale was rebuilt in Next: shared stops keep their names but
       change value (e.g. font-size-200, the body default, grows 15px → 16px;
       the largest stops shrink). Sizes are measured at runtime so each branch
       labels its own real values. -->
  <div class="vg-scene vg-scene--well" style="width:640px;">
    <p class="vg-heading">
      Type scale — token values
    </p>
    <div style="display:flex;flex-direction:column;gap:18px;">
      <div v-for="stop in stops" :key="stop" style="display:flex;align-items:baseline;gap:16px;">
        <span
          class="vg-mono"
          style="width:150px;
          flex:none;"
        >font-size-{{ stop }}{{ stop === '200' ? ' (body)' : '' }}</span>
        <span
          :data-vg-measure="stop"
          :style="{ fontSize: `var(--dt-font-size-${stop})` }"
          style="color:var(--dt-color-foreground-primary);white-space:nowrap;"
        >The quick brown fox</span>
        <span class="vg-mono">{{ measured[stop] || '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stops = ['100', '200', '300', '400', '500'];
const measured = ref({});

onMounted(() => {
  const out = {};
  document.querySelectorAll('[data-vg-measure]').forEach((el) => {
    out[el.dataset.vgMeasure] = getComputedStyle(el).fontSize;
  });
  measured.value = out;
});
</script>
