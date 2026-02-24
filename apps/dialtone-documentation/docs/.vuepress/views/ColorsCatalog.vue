<template>
  <dt-mode-island
    :mode="mode"
    class="d-p16 d-bgc-secondary"
  >
    <dt-stack as="section" gap="500">
      <div class="d-d-grid d-g16 d-rg32 d-g-cols1 md:d-g-cols2">
        <base-color
          v-for="({ stops }, colorName) in colors"
          :key="colorName"
          :color-name="colorName"
          :stops="stops || []"
          :mode="mode"
        />
      </div>
    </dt-stack>
  </dt-mode-island>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import BaseColor from '../baseComponents/BaseColor.vue';
import Color from 'colorjs.io';
import { alphabeticalSorter } from '@utilities';

const tokensDocs = inject('tokensDocs');
const props = defineProps({
  mode: {
    type: String,
    default: 'light',
  },
});
const foregroundPrimaryValue = tokensDocs['--dt-color-foreground-primary'][`dp-${props.mode}`].value;
const foregroundPrimaryInvertedValue = tokensDocs['--dt-color-foreground-primary-inverted'][`dp-${props.mode}`].value;

const colors = ref(undefined);

function colorToRGB (colorValue) {
  const c = new Color(colorValue).to('srgb');
  return {
    r: Math.max(0, Math.min(255, Math.round(c.coords[0] * 255))),
    g: Math.max(0, Math.min(255, Math.round(c.coords[1] * 255))),
    b: Math.max(0, Math.min(255, Math.round(c.coords[2] * 255))),
  };
}

function sRGBtoY (r, g, b) {
  function linearize (val) {
    const v = val / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  return 0.2126729 * linearize(r) + 0.7151522 * linearize(g) + 0.0721750 * linearize(b);
}

function apcaContrast (bgRGB, fgRGB) {
  const bgY = sRGBtoY(bgRGB.r, bgRGB.g, bgRGB.b);
  const fgY = sRGBtoY(fgRGB.r, fgRGB.g, fgRGB.b);

  // Soft clamp
  const bgYc = bgY > 0.022 ? bgY : bgY + Math.pow(0.022 - bgY, 1.414);
  const fgYc = fgY > 0.022 ? fgY : fgY + Math.pow(0.022 - fgY, 1.414);

  let contrast;
  if (bgYc >= fgYc) {
    // Light background
    contrast = (Math.pow(bgYc, 0.56) - Math.pow(fgYc, 0.57)) * 1.14;
  } else {
    // Dark background
    contrast = (Math.pow(bgYc, 0.65) - Math.pow(fgYc, 0.62)) * 1.14;
  }

  if (Math.abs(contrast) < 0.1) return 0;
  return contrast > 0
    ? (contrast - 0.027) * 100
    : (contrast + 0.027) * 100;
}

function getContrastRatio (colorValue) {
  const bgRGB = colorToRGB(colorValue);
  const primaryRGB = colorToRGB(foregroundPrimaryValue);
  const invertedRGB = colorToRGB(foregroundPrimaryInvertedValue);

  return {
    primary: Number(Math.abs(apcaContrast(bgRGB, primaryRGB)).toFixed(1)),
    primaryInverted: Number(Math.abs(apcaContrast(bgRGB, invertedRGB)).toFixed(1)),
  };
}

onMounted(() => {
  colors.value = Object.keys(tokensDocs)
    .filter(tokenName => /--dt-color-\w+-\d{2,4}$/.test(tokenName))
    .sort(alphabeticalSorter)
    .reduce((result, tokenName) => {
      const colorName = tokenName.replace(/--dt-color-(\w+).*/, '$1');
      const colorStop = tokenName.replace(/--dt-color-\w+-(\d{2,4})/, '$1');
      const token = tokensDocs[tokenName][`base-${props.mode}`];
      const colorValue = token?.value;
      const contrastRatio = getContrastRatio(colorValue);

      if (!result[colorName]) {
        result[colorName] = { stops: [] };
      }

      const lightness = new Color(colorValue).to('oklch').coords[0];

      result[colorName].stops.push({
        stop: colorStop,
        value: colorValue,
        lightness,
        primaryContrast: contrastRatio.primary,
        invertedContrast: contrastRatio.primaryInverted,
      });

      return result;
    }, {});
});
</script>
