<template>
  <dt-box
    v-dt-mode:[mode]
    padding="200"
    surface="secondary"
    border-radius="300"
  >
    <div class="d-d-grid d-g-200 d-rg-400 d-g-cols1 md:d-g-cols2 lg:d-g-cols3">
      <base-color
        v-for="({ stops }, materialName) in materials"
        :key="materialName"
        :color-name="materialName"
        :stops="stops"
        :mode="mode"
        namespace="material"
      />
    </div>
  </dt-box>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import BaseColor from '../baseComponents/BaseColor.vue';
import { makeGetContrastRatio, oklchLightness } from '../common/contrast';
import lightRefs from '@dialpad/dialtone-tokens/tokens/base/refs/default.json';
import darkRefs from '@dialpad/dialtone-tokens/tokens/base/refs/dark.json';

const tokensDocs = inject('tokensDocs');
const props = defineProps({
  mode: {
    type: String,
    default: 'light',
  },
});

// Reuse the same foreground colors as ColorsCatalog so LC contrast is computed
// against the same reference text and reads consistently across both catalogs.
const foregroundPrimaryValue = tokensDocs['--dt-color-foreground-primary'][`dp-${props.mode}`].value;
const foregroundPrimaryInvertedValue = tokensDocs['--dt-color-foreground-primary-inverted'][`dp-${props.mode}`].value;
const getContrastRatio = makeGetContrastRatio(foregroundPrimaryValue, foregroundPrimaryInvertedValue);

const materials = ref(undefined);

// Display order. Default (sandstone) first, then non-default ramps that surface
// in the global Material picker, then the additional named ramps that exist
// only as design tokens (jade, copper).
const MATERIAL_ORDER = [
  'sandstone',
  'steel',
  'graphite',
  'iron',
  'amethyst',
  'jade',
  // 'copper',
];

onMounted(() => {
  const refs = (props.mode === 'dark' ? darkRefs : lightRefs).material;
  const result = {};
  for (const materialName of MATERIAL_ORDER) {
    const ramp = refs[materialName];
    if (!ramp) continue;
    const stops = Object.entries(ramp)
      .map(([stop, { value }]) => {
        const lightness = oklchLightness(value);
        const contrastRatio = getContrastRatio(value);
        return {
          stop,
          value,
          lightness,
          primaryContrast: contrastRatio.primary,
          invertedContrast: contrastRatio.primaryInverted,
        };
      })
      .sort((a, b) => Number(a.stop) - Number(b.stop));
    result[materialName] = { stops };
  }
  materials.value = result;
});
</script>
