<template>
  <!-- MUST-LOOK-IDENTICAL control: border-radius VALUES are unchanged — the
       migration only renames utility classes to logical names. Corner rounding
       should match exactly across the pair (raw radius values, no tokens, so
       nothing else can interfere). -->
  <div class="vg-scene vg-scene--well" style="width:560px;">
    <p class="vg-heading">
      Border-radius scale — values unchanged
    </p>
    <div style="display:flex;gap:22px;align-items:flex-end;">
      <div v-for="r in radii" :key="r.label" style="text-align:center;">
        <div
          :style="{ borderRadius: r.value }"
          style="width:80px;
            height:80px;
            background:var(--dt-color-surface-primary);
            border:1px solid var(--dt-color-border-subtle);"
        />
        <p style="margin:10px 0 0;font-size:11px;color:var(--dt-color-foreground-secondary);">
          {{ r.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const radii = [
  { label: '4px', value: '4px' },
  { label: '8px', value: '8px' },
  { label: '16px', value: '16px' },
  { label: 'full', value: '9999px' },
];
</script>
