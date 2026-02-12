export const AVATAR_SIZE_MODIFIERS = {
  // 11-size system: 100-500 support presence, 600-900 do not
  100: 'd-avatar--size-100',
  150: 'd-avatar--size-150',
  200: 'd-avatar--size-200',
  250: 'd-avatar--size-250',
  300: 'd-avatar--size-300',
  400: 'd-avatar--size-400',
  500: 'd-avatar--size-500',
  600: 'd-avatar--size-600',
  700: 'd-avatar--size-700',
  800: 'd-avatar--size-800',
  900: 'd-avatar--size-900',
  // T-shirt sizes (deprecated aliases)
  xs: 'd-avatar--xs',
  sm: 'd-avatar--sm',
  md: 'd-avatar--md',
  lg: 'd-avatar--lg',
  xl: 'd-avatar--xl',
};

export const AVATAR_KIND_MODIFIERS = {
  default: '',
  icon: 'd-avatar__icon',
  initials: 'd-avatar__initials',
};

export const AVATAR_PRESENCE_SIZE_MODIFIERS = {
  // 11-size system: Only sizes 100-500 support presence
  100: 'd-avatar__presence--100',
  150: 'd-avatar__presence--150',
  200: 'd-avatar__presence--200',
  250: 'd-avatar__presence--250',
  300: 'd-avatar__presence--300',
  400: 'd-avatar__presence--400',
  500: 'd-avatar__presence--500',
  // T-shirt sizes (deprecated)
  md: 'd-avatar__presence--md',
  lg: 'd-avatar__presence--lg',
};

export const AVATAR_PRESENCE_STATES = {
  NONE: '',
  BUSY: 'busy',
  AWAY: 'away',
  OFFLINE: 'offline',
  ACTIVE: 'active',
};

export const AVATAR_ICON_SIZES = {
  // 11-size system icon mappings
  100: '100',
  150: '100',
  200: '200',
  250: '200',
  300: '300',
  400: '500',
  500: '600',
  600: '600',
  700: '700',
  800: '800',
  900: '800',
  // T-shirt sizes (deprecated aliases)
  xs: '100',
  sm: '200',
  md: '300',
  lg: '500',
  xl: '600',
};

// OKLCH Lightness scale (L) for avatar variants 0-9
// Progresses from dark (0.45) to light (0.85)
export const AVATAR_LIGHTNESS = [
  0.45, // variant 0
  0.49, // variant 1
  0.54, // variant 2
  0.59, // variant 3
  0.64, // variant 4
  0.69, // variant 5
  0.74, // variant 6
  0.78, // variant 7
  0.82, // variant 8
  0.85, // variant 9
];

// OKLCH Chroma scale (C) for avatar variants 0-9
// Bell curve: lower at extremes, peak in middle for best saturation
export const AVATAR_CHROMA = [
  0.08, // variant 0
  0.12, // variant 1
  0.15, // variant 2
  0.17, // variant 3
  0.18, // variant 4
  0.17, // variant 5
  0.15, // variant 6
  0.12, // variant 7
  0.10, // variant 8
  0.08, // variant 9
];

// Hue offsets for each family (1-12), 30° apart around the color wheel
export const AVATAR_HUE_OFFSETS = {
  1: 0,    // Red
  2: 30,   // Orange
  3: 60,   // Amber/Gold
  4: 90,   // Yellow-Green
  5: 120,  // Green
  6: 150,  // Teal
  7: 180,  // Cyan
  8: 210,  // Blue
  9: 240,  // Indigo
  10: 270, // Purple
  11: 300, // Magenta
  12: 330, // Pink/Rose
};

// Number of families and variants
export const AVATAR_FAMILY_COUNT = 12;
export const AVATAR_VARIANT_COUNT = 10;

export const AVATAR_GROUP_VALIDATOR = (group) => group > 1;

/**
 * Convert color code to family/variant
 * @param {string} colorCode - Color code (e.g., '540', '1020')
 * @returns {{ family: number, variant: number } | null} - Family (1-12) and variant (0-9)
 */
export function colorToFamilyVariant (colorCode) {
  const num = parseInt(colorCode, 10);
  if (isNaN(num)) return null;
  const family = Math.floor(num / 100);
  const variant = (num % 100) / 10;
  if (family < 1 || family > AVATAR_FAMILY_COUNT) return null;
  if (!Number.isInteger(variant) || variant < 0 || variant >= AVATAR_VARIANT_COUNT) return null;
  return { family, variant };
}

/**
 * Get a random family and variant
 * @param {string} [seed] - Optional seed for deterministic randomization
 * @returns {{ family: number, variant: number }}
 */
export function getRandomFamilyVariant (seed) {
  let hash = 0;
  if (seed) {
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
  } else {
    hash = Math.floor(Math.random() * 1000000);
  }

  // Use absolute value to handle negative hashes
  const absHash = Math.abs(hash);
  const family = (absHash % AVATAR_FAMILY_COUNT) + 1; // 1-12
  const variant = Math.floor(absHash / AVATAR_FAMILY_COUNT) % AVATAR_VARIANT_COUNT; // 0-9

  return { family, variant };
}

/**
 * Convert OKLCH to hex color (for fallback browsers)
 * Uses sRGB approximation - may clip out-of-gamut colors
 * @param {number} l - Lightness (0-1)
 * @param {number} c - Chroma (0-0.4)
 * @param {number} h - Hue (0-360)
 * @returns {string} - Hex color string (e.g., '#ff5733')
 */
export function oklchToHex (l, c, h) {
  // Convert OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear sRGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Clamp to [0, 1]
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bl = Math.max(0, Math.min(1, bl));

  // Linear to sRGB gamma
  const toSrgb = (x) => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

  r = Math.round(toSrgb(r) * 255);
  g = Math.round(toSrgb(g) * 255);
  bl = Math.round(toSrgb(bl) * 255);

  return '#' + [r, g, bl].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute fallback hex color for a given family, variant, and anchor hue
 * @param {number} family - Family number (1-12)
 * @param {number} variant - Variant number (0-9)
 * @param {number} anchorHue - Theme's anchor hue in degrees
 * @returns {string} - Hex color string
 */
export function computeAvatarHex (family, variant, anchorHue) {
  const l = AVATAR_LIGHTNESS[variant];
  const c = AVATAR_CHROMA[variant];
  const hueOffset = AVATAR_HUE_OFFSETS[family] ?? 0;
  const h = (anchorHue + hueOffset) % 360;
  return oklchToHex(l, c, h);
}

export default {
  AVATAR_SIZE_MODIFIERS,
  AVATAR_KIND_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_ICON_SIZES,
  AVATAR_LIGHTNESS,
  AVATAR_CHROMA,
  AVATAR_HUE_OFFSETS,
  AVATAR_FAMILY_COUNT,
  AVATAR_VARIANT_COUNT,
  AVATAR_GROUP_VALIDATOR,
  colorToFamilyVariant,
  getRandomFamilyVariant,
  oklchToHex,
  computeAvatarHex,
};
