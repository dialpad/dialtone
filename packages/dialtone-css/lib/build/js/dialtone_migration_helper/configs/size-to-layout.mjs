import guidance from '../migration-guidance.cjs';
const { SPACE_TOKEN_MAP: SPACING_MAP, SIZE_LAYOUT_MAP: LAYOUT_MAP } = guidance;

// Valid stops for semantic border and radius tokens
const BORDER_STOPS = new Set([0, 50, 100, 150, 200, 300, 400]);
const RADIUS_STOPS = new Set([0, 100, 200, 300, 350, 400, 450, 500, 600]);

// ── Replacer factories ─────────────────────────────────────────────────────

function spacingReplacer (match, pre, stop, suffix) {
  const token = SPACING_MAP[Number(stop)];
  return token ? `${pre}var(--dt-${token}${suffix || ''})` : match;
}

function layoutReplacer (match, pre, stop, suffix) {
  const s = Number(stop);
  if (suffix) return match; // No negative layout tokens exist in the supported target.
  if (LAYOUT_MAP[s]) return `${pre}var(--dt-layout-${LAYOUT_MAP[s]}${suffix || ''})`;

  return match;
}

function borderReplacer (match, pre, stop) {
  const s = Number(stop);
  return BORDER_STOPS.has(s) ? `${pre}var(--dt-size-border-${s})` : match;
}

function radiusReplacer (match, pre, stop) {
  const s = Number(stop);
  return RADIUS_STOPS.has(s) ? `${pre}var(--dt-size-radius-${s})` : match;
}

// Spacing property names (physical + logical)
const SPACING_PROPS =
  'padding(?:-(?:top|right|bottom|left|block(?:-(?:start|end))?|inline(?:-(?:start|end))?))?|' +
  'margin(?:-(?:top|right|bottom|left|block(?:-(?:start|end))?|inline(?:-(?:start|end))?))?|' +
  'gap|row-gap|column-gap|' +
  'inset(?:-(?:block(?:-(?:start|end))?|inline(?:-(?:start|end))?))?|' +
  // Custom properties whose name contains spacing-related keywords
  // e.g. --badge-padding-x, --badge-gap, --badge-letter-spacing
  '--[a-z0-9-]*(?:padding|margin|gap|spacing|inset|offset)[a-z0-9-]*';

// Layout property names (physical + logical)
const LAYOUT_PROPS =
  '(?:min-|max-)?width|' +
  '(?:min-|max-)?height|' +
  'flex-basis|' +
  '(?:min-|max-)?inline-size|' +
  '(?:min-|max-)?block-size|' +
  // Custom properties whose name contains layout-related keywords
  // e.g. --badge-min-width
  // Note: "height" is intentionally excluded — "line-height" custom props would misroute.
  // Note: "radius" is handled by RADIUS_PROPS, not here.
  '--[a-z0-9-]*(?:width|basis)[a-z0-9-]*';

// Border-width property names → --dt-size-border-*
// Matches border shorthand, border-width, directional border-*, outline, outline-width.
// Does NOT match border-color, border-style, border-image, or border-radius.
const BORDER_PROPS =
  'border(?:-(?:top|right|bottom|left|block(?:-(?:start|end))?|inline(?:-(?:start|end))?))?(?:-width)?|' +
  'outline(?:-width)?|' +
  // Custom properties with "border-width" in name (e.g. --popover-border-width)
  '--[a-z0-9-]*border-width[a-z0-9-]*';

// Border-radius property names → --dt-size-radius-*
const RADIUS_PROPS =
  'border-radius|' +
  'border-(?:top|bottom)-(?:left|right)-radius|' +
  'border-(?:start|end)-(?:start|end)-radius|' +
  // Custom properties with "radius" in name (e.g. --badge-radius, --notice-border-radius)
  '--[a-z0-9-]*radius[a-z0-9-]*';

export default {
  description:
    'Migrates --dt-size-* tokens based on CSS property context.\n' +
    '- Border properties (border, border-width, outline) → var(--dt-size-border-*)\n\t' +
      'eg. border: var(--dt-size-100) solid → border: var(--dt-size-border-100) solid\n' +
    '- Border-radius properties → var(--dt-size-radius-*)\n\t' +
      'eg. border-radius: var(--dt-size-300) → border-radius: var(--dt-size-radius-300)\n' +
    '- Spacing properties (padding, margin, gap, inset) → var(--dt-spacing-*)\n\t' +
      'eg. padding: var(--dt-size-400) → padding: var(--dt-spacing-100)\n' +
    '- Layout properties (width, height, min/max, flex-basis) → var(--dt-layout-*)\n\t' +
      'eg. width: var(--dt-size-700) → width: var(--dt-layout-100)\n' +
    '- Off-scale layout exceptions: width: var(--dt-size-400) → width: var(--dt-layout-8px)\n\t' +
      '(covers 100/200/400/525/550 stops → 1px/2px/8px/20px/24px in layout context only)\n' +
    '- Percentage tokens → var(--dt-layout-*-percent)\n\t' +
      'eg. var(--dt-size-100-percent) → var(--dt-layout-100-percent)\n' +
    '- Approximate, out-of-scale, negative layout and unknown-context mappings are left unchanged for manual review.\n' +
    '- Also converts calc(var(--dt-spacing-*) * -1) → var(--dt-spacing-*-negative).\n' +
    '- Unmapped tokens pass through unchanged — the lint rule will flag them.\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,js,ts,jsx,tsx}'],
  globbyConfig: {
    ignore: ['**/dialtone_migration_helper/tests/**'],
  },
  expressions: [
    // Border-width context → --dt-size-border-* (must run before layout to win --*-border-width* conflicts)
    {
      from: new RegExp(
        `((?:^|[;{\n])\\s*(?:${BORDER_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)\\)`,
        'gm',
      ),
      to: borderReplacer,
    },
    // Border-radius context → --dt-size-radius-* (must run before layout to win --*-radius* conflicts)
    {
      from: new RegExp(
        `((?:^|[;{\n])\\s*(?:${RADIUS_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)\\)`,
        'gm',
      ),
      to: radiusReplacer,
    },
    // Percentage tokens → --dt-layout-*-percent (context-independent, straight prefix swap)
    {
      from: /var\(--dt-size-([0-9]+)-percent\)/g,
      to: (match, stop) => `var(--dt-layout-${stop}-percent)`,
    },
    // Spacing-context properties → --dt-spacing-*
    {
      from: new RegExp(
        `((?:^|[;{\n])\\s*(?:${SPACING_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)(-negative|-percent)?\\)`,
        'gm',
      ),
      to: spacingReplacer,
    },
    // Layout-context properties → exact --dt-layout-* matches
    {
      from: new RegExp(
        `((?:^|[;{\n])\\s*(?:${LAYOUT_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)(-negative)?\\)`,
        'gm',
      ),
      to: layoutReplacer,
    },
    // Cleanup: calc(var(--dt-spacing-*) * -1) → var(--dt-spacing-*-negative)
    {
      from: /calc\(var\(--dt-spacing-([a-z0-9]+)\)\s*\*\s*-1\)/g,
      to: (match, stop) => `var(--dt-spacing-${stop}-negative)`,
    },
  ],
};
