<template>
  <!-- Next replaces pure grays with warm "sandstone" material tints in both
       modes: surfaces, borders, and gray text all pick up a faint warm cast,
       and some grays lighten. Token NAMES are unchanged — only values move. -->
  <div class="vg-scene" style="width:620px;">
    <p class="vg-heading">
      Neutrals — surfaces, borders, text
    </p>

    <p class="vg-label">
      Surfaces
    </p>
    <div style="display:flex;gap:18px;margin-bottom:28px;">
      <div v-for="s in surfaces" :key="s" style="text-align:center;">
        <div
          :style="{ background: `var(--dt-color-surface-${s})` }"
          style="width:104px;
          height:64px;
          border-radius:8px;
          border:1px solid var(--dt-color-border-subtle);"
        />
        <p class="vg-mono" style="margin:8px 0 0;">
          {{ s }}
        </p>
      </div>
    </div>

    <p class="vg-label">
      Borders
    </p>
    <div style="display:flex;gap:18px;margin-bottom:28px;">
      <div v-for="b in borders" :key="b" style="text-align:center;">
        <div
          :style="{ borderColor: `var(--dt-color-border-${b})` }"
          style="width:104px;
          height:44px;
          border-radius:8px;
          border-width:2px;
          border-style:solid;
          background:var(--dt-color-surface-primary);"
        />
        <p class="vg-mono" style="margin:8px 0 0;">
          {{ b }}
        </p>
      </div>
    </div>

    <p class="vg-label">
      Text
    </p>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <p
        v-for="f in foregrounds"
        :key="f"
        :style="{ color: `var(--dt-color-foreground-${f})` }"
        style="margin:0;font-size:15px;"
      >
        Aa — foreground-{{ f }} sample text
      </p>
    </div>
  </div>
</template>

<script setup>
const surfaces = ['primary', 'secondary', 'strong', 'contrast'];
const borders = ['subtle', 'default', 'moderate', 'bold'];
const foregrounds = ['primary', 'secondary', 'placeholder'];
</script>
