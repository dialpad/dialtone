<template>
  <section class="d-stack16">
    <div class="d-d-grid d-gg24 d-g-cols1 md:d-g-cols2">
      <base-color
        v-for="({ stops }, colorName) in colors"
        :key="colorName"
        :color-name="colorName"
        :stops="stops || []"
        :theme="theme"
      />
    </div>
  </section>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import BaseColor from '../baseComponents/BaseColor.vue';
import tinycolor from 'tinycolor2';
import { alphabeticalSorter } from '@utilities';

const tokensDocs = inject('tokensDocs');
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
});
const foregroundPrimaryValue = tokensDocs['--dt-color-foreground-primary'][`dp-${props.theme}`].value;
const foregroundPrimaryInvertedValue = tokensDocs['--dt-color-foreground-primary-inverted'][`dp-${props.theme}`].value;

const colors = ref(undefined);

function getContrastRatio (hexValue) {
  return {
    primary: tinycolor.readability(hexValue, foregroundPrimaryValue).toFixed(2),
    primaryInverted: tinycolor.readability(hexValue, foregroundPrimaryInvertedValue).toFixed(2),
  };
}

onMounted(() => {
  colors.value = Object.keys(tokensDocs)
    .filter(tokenName => /--dt-color-\w+-\d{2,4}$/.test(tokenName))
    .sort(alphabeticalSorter)
    .reduce((result, tokenName) => {
      const colorName = tokenName.replace(/--dt-color-(\w+).*/, '$1');
      const colorStop = tokenName.replace(/--dt-color-\w+-(\d{2,4})/, '$1');
      const token = tokensDocs[tokenName][`base-${props.theme}`];
      const colorValue = token?.value;
      const contrastRatio = getContrastRatio(colorValue);

      if (!result[colorName]) {
        result[colorName] = { stops: [] };
      }

      result[colorName].stops.push({
        stop: colorStop,
        value: colorValue,
        primaryContrast: contrastRatio.primary,
        invertedContrast: contrastRatio.primaryInverted,
      });

      return result;
    }, {});
});
</script>
