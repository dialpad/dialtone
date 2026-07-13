<template>
  <!-- Nine legacy --dt-size-* tokens map to nearest --dt-layout-* stops,
       shifting element dimensions 4–16px WHEN a migration swaps the token.
       This can't be shown as a before/after pair: the deprecated size tokens
       still resolve on next, so both branches render the old values. Instead
       this is a single to-scale infographic (hardcoded px from the
       layout-and-spacing-tokens guide table): old bar over new bar, the
       right-edge offset is the sanctioned shift. Captured after-only. -->
  <div
    class="vg-scene"
    style="width:1320px;"
  >
    <p class="vg-heading">
      Size tokens — nearest-neighbor shifts (to scale)
    </p>
    <div style="display:flex;flex-direction:column;gap:18px;">
      <div
        v-for="m in mappings"
        :key="m.old"
        style="display:flex;align-items:center;gap:14px;"
      >
        <span
          class="vg-mono"
          style="width:190px;flex:none;"
        >size-{{ m.old }} → layout-{{ m.new }}</span>
        <div style="flex:none;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div
              :style="{ width: `${m.oldPx}px` }"
              style="height:10px;border-radius:3px;background:#b8b8bd;"
            />
            <span
              class="vg-mono"
              style="flex:none;"
            >{{ m.oldPx }}px</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:3px;">
            <div
              :style="{ width: `${m.newPx}px` }"
              style="height:10px;border-radius:3px;background:#7c52ff;"
            />
            <span
              class="vg-mono"
              style="flex:none;"
            >{{ m.newPx }}px</span>
          </div>
        </div>
        <span
          class="vg-mono"
          :style="{ color: m.newPx > m.oldPx ? '#0d8a4f' : '#c2410c' }"
          style="flex:none;font-weight:700;"
        >{{ m.newPx > m.oldPx ? '+' : '−' }}{{ Math.abs(m.newPx - m.oldPx) }}px</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// From the layout-and-spacing-tokens migration guide's nearest-neighbor table.
const mappings = [
  { old: '825', new: '250', oldPx: 164, newPx: 160 },
  { old: '875', new: '350', oldPx: 216, newPx: 224 },
  { old: '905', new: '400', oldPx: 264, newPx: 256 },
  { old: '925', new: '500', oldPx: 332, newPx: 320 },
  { old: '975', new: '700', oldPx: 464, newPx: 448 },
  { old: '1020', new: '1000', oldPx: 628, newPx: 640 },
  { old: '1040', new: '1200', oldPx: 764, newPx: 768 },
  { old: '1060', new: '1300', oldPx: 828, newPx: 832 },
  { old: '1080', new: '1400', oldPx: 912, newPx: 896 },
];
</script>
