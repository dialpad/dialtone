<template>
  <dt-box
    v-dt-mode:[mode]
    padding="200"
    surface="secondary"
    border-radius="300"
  >
    <div class="d-d-grid d-g-200 d-rg-400 d-g-cols1 md:d-g-cols2 lg:d-g-cols3">
      <base-color
        v-for="({ stops }, colorName) in colors"
        :key="colorName"
        :color-name="colorName"
        :stops="stops || []"
        :mode="mode"
      />
    </div>
  </dt-box>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import BaseColor from '../baseComponents/BaseColor.vue';
import { makeGetContrastRatio, oklchLightness } from '../common/contrast';

const tokensDocs = inject('tokensDocs');
const props = defineProps({
  mode: {
    type: String,
    default: 'light',
  },
});
const foregroundPrimaryValue = tokensDocs['--dt-color-foreground-primary'][`dp-${props.mode}`].value;
const foregroundPrimaryInvertedValue = tokensDocs['--dt-color-foreground-primary-inverted'][`dp-${props.mode}`].value;
const getContrastRatio = makeGetContrastRatio(foregroundPrimaryValue, foregroundPrimaryInvertedValue);

const colors = ref(undefined);

// Display order, left → right (red → magenta hue wheel). `black` is intentionally
// omitted — it lives in `MaterialsCatalog` since its values are picker-dependent.
const RAMP_ORDER = [
  'red',
  'coral',
  'gold',
  'olive',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'magenta',
  'berry',
];

onMounted(() => {
  const result = {};
  for (const colorName of RAMP_ORDER) {
    const stops = Object.keys(tokensDocs)
      .filter(t => new RegExp(`^--dt-color-${colorName}-\\d{2,4}$`).test(t))
      .map(tokenName => {
        const stop = tokenName.replace(/.*-(\d{2,4})$/, '$1');
        const value = tokensDocs[tokenName][`base-${props.mode}`]?.value;
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
    if (stops.length) result[colorName] = { stops };
  }
  colors.value = result;
});
</script>
