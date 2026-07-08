<template>
  <!-- Nine legacy --dt-size-* tokens have no exact equivalent in the new
       --dt-layout-* scale; a correct migration maps them to the nearest stop,
       shifting element dimensions 4-16px. Each bar resolves the old token on
       staging and falls back to the mapped new token on Next; widths are
       measured at runtime. These small diffs are sanctioned. -->
  <div class="vg-scene vg-scene--well" style="width:1020px;">
    <p class="vg-heading">
      Size tokens — nearest-neighbor shifts (4–16px, by design)
    </p>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div v-for="m in mappings" :key="m.old" style="display:flex;align-items:center;gap:14px;">
        <span class="vg-mono" style="width:250px;flex:none;">size-{{ m.old }} → layout-{{ m.new }}</span>
        <div
          :data-vg-bar="m.old"
          :style="{ width: `var(--dt-size-${m.old}, var(--dt-layout-${m.new}))` }"
          style="height:18px;border-radius:4px;background:var(--dt-color-surface-contrast);flex:none;"
        />
        <span class="vg-mono">{{ measured[m.old] || '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// From the layout-and-spacing-tokens migration guide's nearest-neighbor table.
const mappings = [
  { old: '825', new: '250' }, // 164px → 160px
  { old: '875', new: '350' }, // 216px → 224px
  { old: '905', new: '400' }, // 264px → 256px
  { old: '925', new: '500' }, // 332px → 320px
  { old: '975', new: '700' }, // 464px → 448px
  { old: '1020', new: '1000' }, // 628px → 640px
];
const measured = ref({});

onMounted(() => {
  const out = {};
  document.querySelectorAll('[data-vg-bar]').forEach((el) => {
    out[el.dataset.vgBar] = `${Math.round(el.getBoundingClientRect().width)}px`;
  });
  measured.value = out;
});
</script>
