<template>
  <!-- MUST-LOOK-IDENTICAL control: the space → spacing token rename keeps
       exact pixel values for every shared stop. Each bar resolves the legacy
       --dt-space-* token on staging and the renamed --dt-spacing-* token on
       Next (×8 for visibility); measured base values are labeled at runtime.
       Any width difference across the pair is a bug. -->
  <div class="vg-scene vg-scene--well" style="width:560px;">
    <p class="vg-heading">
      Spacing scale — values unchanged (bars ×8)
    </p>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div v-for="s in stops" :key="s" style="display:flex;align-items:center;gap:14px;">
        <span class="vg-mono" style="width:90px;flex:none;">{{ s }}</span>
        <div
          :data-vg-bar="s"
          :style="{ width: `calc(var(--dt-space-${s}, var(--dt-spacing-${s})) * 8)` }"
          style="height:16px;border-radius:4px;background:var(--dt-color-surface-contrast);flex:none;"
        />
        <span class="vg-mono">{{ measured[s] || '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stops = ['300', '400', '450', '500', '550', '600'];
const measured = ref({});

onMounted(() => {
  const out = {};
  document.querySelectorAll('[data-vg-bar]').forEach((el) => {
    out[el.dataset.vgBar] = `${Math.round(el.getBoundingClientRect().width / 8)}px`;
  });
  measured.value = out;
});
</script>
