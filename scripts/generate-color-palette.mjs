/**
 * Dialtone Color Palette Generator
 *
 * Generates standardized OKLCH-based color palettes with:
 * - Consistent 12-stop scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000
 * - Bell-curve chroma distribution (peaks mid-range, tapers at extremes to avoid muddy grays)
 * - Independent light/dark mode tuning (dark = punchier/saturated, light = understated/flatter)
 * - Per-hue parameters with controlled hue shifting across the scale
 *
 * Brand colors (brand.purple, brand.magenta, brand.red, brand.gold) are defined independently
 * in the token system and are NOT part of this algorithmic palette. Semantic tokens should
 * reference brand tokens when brand intent is needed, not palette stops.
 */

// ============================================================================
// OKLCH <-> sRGB Conversion
// ============================================================================

function oklchToOklab(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(hRad), b: C * Math.sin(hRad) };
}

function oklabToLinearSrgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}

function linearToSrgb(c) {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function srgbToLinear(c) {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearSrgbToOklab(r, g, b) {
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

function hexToOklch(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lab = linearSrgbToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));
  return oklabToOklch(lab.L, lab.a, lab.b);
}

function oklchToHex(L, C, H) {
  const lab = oklchToOklab(L, C, H);
  const rgb = oklabToLinearSrgb(lab.L, lab.a, lab.b);
  const r = Math.round(Math.max(0, Math.min(1, linearToSrgb(rgb.r))) * 255);
  const g = Math.round(Math.max(0, Math.min(1, linearToSrgb(rgb.g))) * 255);
  const b = Math.round(Math.max(0, Math.min(1, linearToSrgb(rgb.b))) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function isInGamut(L, C, H) {
  const lab = oklchToOklab(L, C, H);
  const rgb = oklabToLinearSrgb(lab.L, lab.a, lab.b);
  return rgb.r >= -0.002 && rgb.r <= 1.002 && rgb.g >= -0.002 && rgb.g <= 1.002 && rgb.b >= -0.002 && rgb.b <= 1.002;
}

function maxChromaAtLH(L, H) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return lo;
}

// ============================================================================
// Scale Definition
// ============================================================================

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

/**
 * Lightness values for each stop. 50=lightest, 1000=darkest.
 * These are the same for both light and dark mode palette generation.
 * Dark mode reverses which stop maps to which visual role.
 */
const LIGHTNESS = {
  50: 0.975,
  100: 0.945,
  200: 0.890,
  300: 0.800,
  400: 0.700,
  500: 0.600,
  600: 0.500,
  700: 0.400,
  800: 0.300,
  900: 0.210,
  950: 0.150,
  1000: 0.090,
};

const NEUTRAL_LIGHTNESS = {
  50: 0.993,
  100: 0.965,
  200: 0.920,
  300: 0.845,
  400: 0.710,
  500: 0.580,
  600: 0.450,
  700: 0.355,
  800: 0.265,
  900: 0.195,
  950: 0.155,
  1000: 0.000,
};

// ============================================================================
// Bell-Curve Chroma
// ============================================================================

/**
 * Compute chroma using Gaussian bell curve, clamped to sRGB gamut.
 */
function bellCurveChroma(L, peakChroma, peakL, sigma, hue) {
  const gaussian = Math.exp(-Math.pow(L - peakL, 2) / (2 * sigma * sigma));
  const desiredC = peakChroma * gaussian;
  const maxC = maxChromaAtLH(L, hue);
  return Math.min(desiredC, maxC * 0.92); // 92% of gamut max for safety
}

// ============================================================================
// Color Configuration
// ============================================================================

/**
 * Each color has independent light and dark mode config.
 * Dark mode has HIGHER peakChroma and slightly wider sigma for punchier, more saturated feel.
 * Light mode is flatter and more understated.
 *
 * hue: base hue angle in OKLCH
 * hueShift: [lightEnd, darkEnd] - hue delta applied as linear gradient from stop 50 to 1000
 * peakChroma: maximum chroma at bell curve center
 * peakL: lightness where chroma peaks
 * sigma: bell curve width
 */
const COLOR_CONFIG = {
  purple: {
    light: { hue: 295, hueShift: [4, -4], peakChroma: 0.16, peakL: 0.53, sigma: 0.20 },
    dark:  { hue: 293, hueShift: [3, -3], peakChroma: 0.22, peakL: 0.60, sigma: 0.24 },
  },
  blue: {
    light: { hue: 248, hueShift: [8, -4], peakChroma: 0.12, peakL: 0.52, sigma: 0.20 },
    dark:  { hue: 245, hueShift: [8, -4], peakChroma: 0.17, peakL: 0.58, sigma: 0.24 },
  },
  magenta: {
    light: { hue: 348, hueShift: [4, -2], peakChroma: 0.16, peakL: 0.55, sigma: 0.20 },
    dark:  { hue: 350, hueShift: [4, -2], peakChroma: 0.23, peakL: 0.60, sigma: 0.24 },
  },
  gold: {
    light: { hue: 78, hueShift: [8, -8], peakChroma: 0.14, peakL: 0.62, sigma: 0.22 },
    dark:  { hue: 74, hueShift: [8, -6], peakChroma: 0.18, peakL: 0.68, sigma: 0.24 },
  },
  green: {
    // Light mode: emerald/blue-green to pair well with purple
    light: { hue: 158, hueShift: [4, -6], peakChroma: 0.14, peakL: 0.55, sigma: 0.20 },
    // Dark mode: vivid lime-green, punchy and energetic
    dark:  { hue: 145, hueShift: [6, -4], peakChroma: 0.22, peakL: 0.65, sigma: 0.24 },
  },
  red: {
    light: { hue: 25, hueShift: [6, -4], peakChroma: 0.16, peakL: 0.53, sigma: 0.20 },
    dark:  { hue: 22, hueShift: [6, -4], peakChroma: 0.22, peakL: 0.58, sigma: 0.24 },
  },
  berry: {
    light: { hue: 322, hueShift: [3, -3], peakChroma: 0.18, peakL: 0.52, sigma: 0.20 },
    dark:  { hue: 320, hueShift: [3, -3], peakChroma: 0.24, peakL: 0.58, sigma: 0.24 },
  },
  coral: {
    light: { hue: 38, hueShift: [5, -4], peakChroma: 0.14, peakL: 0.56, sigma: 0.20 },
    dark:  { hue: 36, hueShift: [5, -4], peakChroma: 0.20, peakL: 0.62, sigma: 0.24 },
  },
  olive: {
    light: { hue: 108, hueShift: [4, -4], peakChroma: 0.11, peakL: 0.58, sigma: 0.20 },
    dark:  { hue: 105, hueShift: [4, -3], peakChroma: 0.15, peakL: 0.64, sigma: 0.24 },
  },
  teal: {
    light: { hue: 182, hueShift: [4, -4], peakChroma: 0.09, peakL: 0.56, sigma: 0.20 },
    dark:  { hue: 180, hueShift: [4, -3], peakChroma: 0.13, peakL: 0.62, sigma: 0.24 },
  },
  indigo: {
    light: { hue: 262, hueShift: [4, -2], peakChroma: 0.08, peakL: 0.54, sigma: 0.20 },
    dark:  { hue: 260, hueShift: [4, -2], peakChroma: 0.11, peakL: 0.60, sigma: 0.24 },
  },
};

// ============================================================================
// Palette Generation
// ============================================================================

function hueAtStop(stop, config) {
  const t = (stop - 50) / (1000 - 50);
  const shift = config.hueShift[0] * (1 - t) + config.hueShift[1] * t;
  return (config.hue + shift + 360) % 360;
}

function generateChromatic(colorName, mode) {
  const config = COLOR_CONFIG[colorName][mode];
  const palette = {};

  for (const stop of STOPS) {
    const L = LIGHTNESS[stop];
    const H = hueAtStop(stop, config);
    const C = bellCurveChroma(L, config.peakChroma, config.peakL, config.sigma, H);
    palette[stop] = { L, C, H, hex: oklchToHex(L, C, H) };
  }
  return palette;
}

/**
 * Dark mode palette: independently tuned, NOT a simple inversion.
 * Stop 50 = darkest, stop 1000 = lightest (reversed visual role).
 * Uses the dark config's higher chroma for punchier colors.
 */
function generateDarkChromatic(colorName) {
  const config = COLOR_CONFIG[colorName].dark;
  const palette = {};

  // Reverse the lightness: 50 gets darkest (low L), 1000 gets lightest (high L)
  const reversedL = {};
  const reversedStops = [...STOPS].reverse();
  for (let i = 0; i < STOPS.length; i++) {
    reversedL[STOPS[i]] = LIGHTNESS[reversedStops[i]];
  }

  for (const stop of STOPS) {
    const L = reversedL[stop];
    const H = hueAtStop(stop, config);
    const C = bellCurveChroma(L, config.peakChroma, config.peakL, config.sigma, H);
    palette[stop] = { L, C, H, hex: oklchToHex(L, C, H) };
  }
  return palette;
}

function generateNeutral(colorName) {
  const isBlack = colorName === 'black';
  const palette = {};
  for (const stop of STOPS) {
    const L = NEUTRAL_LIGHTNESS[stop];
    const C = isBlack ? 0 : 0.005;
    const H = isBlack ? 0 : 60;
    palette[stop] = { L, C, H, hex: oklchToHex(L, C, H) };
  }
  return palette;
}

function generateDarkNeutral(colorName) {
  const isBlack = colorName === 'black';
  const palette = {};
  const reversedStops = [...STOPS].reverse();
  for (let i = 0; i < STOPS.length; i++) {
    const stop = STOPS[i];
    const L = NEUTRAL_LIGHTNESS[reversedStops[i]];
    const C = isBlack ? 0 : 0.006;
    const H = isBlack ? 0 : 55;
    palette[stop] = { L, C, H, hex: oklchToHex(L, C, H) };
  }
  return palette;
}

// ============================================================================
// Output
// ============================================================================

function generateAll() {
  const light = {};
  const dark = {};

  for (const n of ['black', 'tan']) {
    light[n] = generateNeutral(n);
    dark[n] = generateDarkNeutral(n);
  }

  for (const color of Object.keys(COLOR_CONFIG)) {
    light[color] = generateChromatic(color, 'light');
    dark[color] = generateDarkChromatic(color);
  }

  return { light, dark };
}

function toTokenJson(palette) {
  const result = {};
  for (const stop of STOPS) {
    result[String(stop)] = { value: palette[stop].hex, type: 'color' };
  }
  return result;
}

// ============================================================================
// Analysis: compare brand colors to nearest palette stop
// ============================================================================

function analyzeBrandMapping(lightPalettes) {
  const brands = {
    purple: '#7C52FF',
    magenta: '#FF1BA4',
    red: '#FF1356',
    gold: '#FF9E0E',
  };

  console.log('\n=== BRAND COLOR ANALYSIS ===\n');
  for (const [name, hex] of Object.entries(brands)) {
    const oklch = hexToOklch(hex);
    console.log(`brand.${name}: ${hex} → L=${oklch.L.toFixed(3)} C=${oklch.C.toFixed(3)} H=${oklch.H.toFixed(1)}`);

    // Find nearest stop by lightness
    let nearestStop = 50;
    let nearestDist = Infinity;
    for (const stop of STOPS) {
      const dist = Math.abs(LIGHTNESS[stop] - oklch.L);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestStop = stop;
      }
    }
    console.log(`  Nearest stop by lightness: ${nearestStop} (palette L=${LIGHTNESS[nearestStop].toFixed(3)}, delta=${nearestDist.toFixed(3)})`);
    console.log(`  Palette ${name}-${nearestStop}: ${lightPalettes[name][nearestStop].hex} (C=${lightPalettes[name][nearestStop].C.toFixed(3)})`);
    console.log(`  Brand chroma is ${(oklch.C / lightPalettes[name][nearestStop].C).toFixed(1)}x higher than palette`);
    console.log();
  }
}

// ============================================================================
// Main
// ============================================================================

const { light, dark } = generateAll();

console.log('=== LIGHT MODE PALETTES ===\n');
for (const [name, palette] of Object.entries(light)) {
  console.log(`--- ${name} ---`);
  for (const stop of STOPS) {
    const p = palette[stop];
    console.log(`  ${String(stop).padStart(4)}: ${p.hex}  L=${p.L.toFixed(3)} C=${p.C.toFixed(3)} H=${p.H.toFixed(1)}`);
  }
  console.log();
}

console.log('\n=== DARK MODE PALETTES ===\n');
for (const [name, palette] of Object.entries(dark)) {
  console.log(`--- ${name} ---`);
  for (const stop of STOPS) {
    const p = palette[stop];
    console.log(`  ${String(stop).padStart(4)}: ${p.hex}  L=${p.L.toFixed(3)} C=${p.C.toFixed(3)} H=${p.H.toFixed(1)}`);
  }
  console.log();
}

analyzeBrandMapping(light);

// Output JSON for direct token file integration
console.log('\n=== LIGHT TOKENS JSON ===\n');
const lightTokens = {};
for (const [name, palette] of Object.entries(light)) {
  lightTokens[name] = toTokenJson(palette);
}
console.log(JSON.stringify(lightTokens, null, 2));

console.log('\n=== DARK TOKENS JSON ===\n');
const darkTokens = {};
for (const [name, palette] of Object.entries(dark)) {
  darkTokens[name] = toTokenJson(palette);
}
console.log(JSON.stringify(darkTokens, null, 2));

export { generateAll, toTokenJson, hexToOklch, oklchToHex, STOPS, COLOR_CONFIG };
