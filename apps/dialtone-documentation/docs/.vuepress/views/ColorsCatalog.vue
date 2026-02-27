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

/**
 * APCA — Accessible Perceptual Contrast Algorithm (version 0.0.98G-4g)
 *
 * Replaces WCAG 2.x contrast ratio with a perceptually uniform model that
 * better predicts readability. Instead of a simple luminance ratio, APCA models
 * how the eye perceives lightness differences, producing an "Lc" (Lightness
 * Contrast) value.
 *
 * Pipeline:
 *
 *   1. **Linearize** — convert each sRGB 0-255 channel to linear light using
 *      the IEC 61966-2-1 transfer function (gamma ≈ 2.4 piece-wise curve).
 *
 *   2. **Luminance (Y)** — BT.709 weighted sum of linear R/G/B.
 *
 *   3. **Soft clamp** — push near-black luminances away from zero to prevent
 *      instability in the power curves and exaggerated contrast predictions.
 *
 *   4. **Polarity-aware power curve** — light-bg/dark-fg and dark-bg/light-fg
 *      use different exponent pairs because the eye's contrast sensitivity
 *      is asymmetric between the two. The result is normalized by a
 *      scaling factor.
 *
 *   5. **Offset & scale** — clip near-zero contrasts, then multiply by 100
 *      to produce the final Lc value (range ≈ -108 to +106).
 *
 * Constants below are taken directly from the APCA reference implementation.
 * Do not modify them independently — they are tuned as a set.
 *
 * @see {@link https://github.com/Myndex/SAPC-APCA} — reference implementation
 * @see {@link https://readtech.org/ARC/} — APCA Readability Criterion
 */

// sRGB linearization breakpoint per IEC 61966-2-1
const SRGB_LINEARIZATION_THRESHOLD = 0.04045;
const SRGB_LOW_SLOPE = 12.92;
const SRGB_GAMMA = 2.4;

// BT.709 luminance coefficients for sRGB
const LUMA_R = 0.2126729;
const LUMA_G = 0.7151522;
const LUMA_B = 0.0721750;

// APCA 0.0.98G-4g constants
const SOFT_CLAMP_THRESHOLD = 0.022;
const SOFT_CLAMP_EXPONENT = 1.414;
const LIGHT_BG_EXP = 0.56;
const LIGHT_FG_EXP = 0.57;
const DARK_BG_EXP = 0.65;
const DARK_FG_EXP = 0.62;
const NORMALIZATION = 1.14;
const LOW_CONTRAST_CUTOFF = 0.1;
const OUTPUT_OFFSET = 0.027;

/**
 * Convert sRGB 0-255 channel values to CIE Y (relative luminance).
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {number} Relative luminance in [0, 1]
 */
function sRGBtoY (r, g, b) {
  function linearize (val) {
    const v = val / 255;
    return v <= SRGB_LINEARIZATION_THRESHOLD
      ? v / SRGB_LOW_SLOPE
      : Math.pow((v + 0.055) / 1.055, SRGB_GAMMA);
  }
  return LUMA_R * linearize(r) + LUMA_G * linearize(g) + LUMA_B * linearize(b);
}

/**
 * Calculate the APCA Lc (Lightness Contrast) between a background and foreground.
 * @param {{ r: number, g: number, b: number }} bgRGB - Background color (0-255 per channel)
 * @param {{ r: number, g: number, b: number }} fgRGB - Foreground color (0-255 per channel)
 * @returns {number} Lc value (≈ -108 to +106). Positive = light bg / dark fg,
 *   negative = dark bg / light fg. 0 when contrast is below perceptible threshold.
 */
function apcaContrast (bgRGB, fgRGB) {
  const bgY = sRGBtoY(bgRGB.r, bgRGB.g, bgRGB.b);
  const fgY = sRGBtoY(fgRGB.r, fgRGB.g, fgRGB.b);

  // Soft-clamp luminance to avoid near-black artifacts
  const bgYc = bgY > SOFT_CLAMP_THRESHOLD
    ? bgY
    : bgY + Math.pow(SOFT_CLAMP_THRESHOLD - bgY, SOFT_CLAMP_EXPONENT);
  const fgYc = fgY > SOFT_CLAMP_THRESHOLD
    ? fgY
    : fgY + Math.pow(SOFT_CLAMP_THRESHOLD - fgY, SOFT_CLAMP_EXPONENT);

  // Polarity-dependent exponents account for the human visual system
  // perceiving dark-on-light differently from light-on-dark.
  let contrast;
  if (bgYc >= fgYc) {
    contrast = (Math.pow(bgYc, LIGHT_BG_EXP) - Math.pow(fgYc, LIGHT_FG_EXP)) * NORMALIZATION;
  } else {
    contrast = (Math.pow(bgYc, DARK_BG_EXP) - Math.pow(fgYc, DARK_FG_EXP)) * NORMALIZATION;
  }

  // Clamp near-zero contrasts to 0; offset and scale to Lc percentage
  if (Math.abs(contrast) < LOW_CONTRAST_CUTOFF) return 0;
  return contrast > 0
    ? (contrast - OUTPUT_OFFSET) * 100
    : (contrast + OUTPUT_OFFSET) * 100;
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
