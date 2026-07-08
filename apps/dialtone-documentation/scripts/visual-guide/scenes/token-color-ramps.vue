<template>
  <!-- Base color ramps were re-tuned in Next (not just renamed): blue rotates
       toward indigo, green toward emerald, golds deepen. Stop NAMES also moved
       to a uniform 12-stop scale, so this scene detects which build it's
       running against and renders that branch's own canonical ramp — the
       before/after pair compares the two ramps, not individual stop names. -->
  <div class="vg-scene" style="width:660px;">
    <p class="vg-heading">
      Base color ramps
    </p>
    <p style="margin:0 0 22px;font-size:11px;color:var(--dt-color-foreground-secondary);">
      {{ isNext ? 'Next 12-stop scale' : 'Current stop scale' }} — lightest → darkest
    </p>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div v-for="(stops, family) in ramps" :key="family">
        <p class="vg-mono" style="margin:0 0 6px;">
          {{ family }}
        </p>
        <div style="display:flex;gap:4px;">
          <div v-for="stop in stops" :key="stop" style="text-align:center;">
            <div
              :style="{ background: `var(--dt-color-${family}-${stop})` }"
              style="width:42px;
              height:42px;
              border-radius:6px;
              border:1px solid var(--dt-color-border-subtle);"
            />
            <p class="vg-mono" style="margin:4px 0 0;">
              {{ stop }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Canonical stop lists per branch, verified against each branch's token JSON.
const STOPS_BEFORE = {
  purple: ['50', '100', '200', '250', '300', '350', '400', '450', '500', '550', '600', '1000'],
  blue: ['50', '100', '200', '300', '400', '425', '450', '475', '500', '600', '900', '1000'],
  green: ['50', '100', '200', '300', '350', '400', '425', '475', '500', '600', '900', '1000'],
  red: ['50', '100', '200', '300', '350', '400', '450', '500', '600', '700', '900', '1000'],
  gold: ['50', '100', '200', '300', '350', '400', '450', '500', '600', '700', '900', '1000'],
};
const STOPS_AFTER_UNIFORM = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', '1000'];

const isNext = ref(false);
const ramps = computed(() => {
  if (!isNext.value) return STOPS_BEFORE;
  return Object.fromEntries(Object.keys(STOPS_BEFORE).map(f => [f, STOPS_AFTER_UNIFORM]));
});

onMounted(() => {
  // purple-950 only exists on the Next 12-stop scale.
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-purple-950');
  isNext.value = Boolean(probe && probe.trim());
});
</script>
