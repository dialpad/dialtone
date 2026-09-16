// Mapping: --dt-size-{stop} → --dt-spacing-{suffix}
// For tokens used in spacing context (padding, margin, gap, inset, etc.)
const SPACING_MAP = {
  0: 'spacing-0',     // 0px
  50: 'spacing-1',    // 0.5px → 1px (nearest non-subpixel)
  100: 'spacing-1',   // 1px
  200: 'spacing-25',  // 2px
  300: 'spacing-50',  // 4px
  350: 'spacing-75',  // 6px
  400: 'spacing-100', // 8px
  450: 'spacing-150', // 12px
  500: 'spacing-200', // 16px
  525: 'spacing-250', // 20px
  550: 'spacing-300', // 24px
  600: 'spacing-400', // 32px
  625: 'spacing-525', // 42px
  650: 'spacing-600', // 48px
  700: 'spacing-800', // 64px
};

// Mapping: --dt-size-{stop} → --dt-layout-{suffix}
// For tokens used in layout context (width, height, etc.)
// Exact matches are labeled; nearest-neighbor approximations note the delta.
const LAYOUT_MAP = {
  // Off-scale pixel-indexed exceptions (DLT-3330) — exact matches via Npx stops.
  // Old --dt-size-N stop at these pixel values has no scale-indexed layout equivalent;
  // route to the off-scale Npx token in layout-property context.
  100: '1px',   // 1px
  200: '2px',   // 2px
  400: '8px',   // 8px
  525: '20px',  // 20px
  550: '24px',  // 24px
  // Exact scale matches
  500: '25',    // 16px
  600: '50',    // 32px
  650: '75',    // 48px
  700: '100',   // 64px
  750: '150',   // 96px
  800: '200',   // 128px
  850: '300',   // 192px
  900: '400',   // 256px
  950: '600',   // 384px
  1000: '800',  // 512px
  1050: '1200', // 768px
  1100: '1600', // 1024px
  // Nearest-neighbor (no exact match in --dt-layout-* scale)
  825: '250',   // 164px → 160px (Δ4px)
  875: '350',   // 216px → 224px (Δ8px)
  905: '400',   // 264px → 256px (Δ8px)
  925: '500',   // 332px → 320px (Δ12px)
  975: '700',   // 464px → 448px (Δ16px)
  1020: '1000', // 628px → 640px (Δ12px)
  1040: '1200', // 764px → 768px (Δ4px)
  1060: '1300', // 828px → 832px (Δ4px)
  1080: '1400', // 912px → 896px (Δ16px)
  // Previously missing — these old stops silently passed through
  720: '100',   // 72px → 64px (Δ8px)
  730: '125',   // 84px → 80px (Δ4px)
  760: '150',   // 102px → 96px (Δ6px)
  775: '175',   // 114px → 112px (Δ2px)
};

// Tokens that exceed the --dt-layout-* scale (max 1024px at layout-1600).
// Converted to raw rem values with a TODO comment for future token replacement.
const RAW_FALLBACK = {
  1115: '71.25rem', // 1140px
  1120: '79.25rem', // 1268px
  1125: '80rem',    // 1280px
  1130: '83.75rem', // 1340px
  1150: '96rem',    // 1536px
  1200: '128rem',   // 2048px
};

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
  if (LAYOUT_MAP[s]) return `${pre}var(--dt-layout-${LAYOUT_MAP[s]}${suffix || ''})`;
  if (RAW_FALLBACK[s]) {
    return `${pre}${RAW_FALLBACK[s]} /* TODO: no --dt-layout-* equivalent for --dt-size-${s} — replace with a layout token when one is added */`;
  }
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
    '- Tokens exceeding the layout scale (>1024px) are converted to raw rem with a TODO comment.\n' +
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
        `((?:${BORDER_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)\\)`,
        'gm',
      ),
      to: borderReplacer,
    },
    // Border-radius context → --dt-size-radius-* (must run before layout to win --*-radius* conflicts)
    {
      from: new RegExp(
        `((?:${RADIUS_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)\\)`,
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
        `((?:${SPACING_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)(-negative|-percent)?\\)`,
        'gm',
      ),
      to: spacingReplacer,
    },
    // Layout-context properties → --dt-layout-* (or raw rem for out-of-scale values)
    {
      from: new RegExp(
        `((?:${LAYOUT_PROPS})\\s*:[^;]*?)var\\(--dt-size-([0-9]+)(-negative)?\\)`,
        'gm',
      ),
      to: layoutReplacer,
    },
    // Default: remaining --dt-size-* not matched by a known property context → layout map
    {
      from: /var\(--dt-size-([0-9]+)(-negative|-percent)?\)/g,
      to: (match, stop, suffix) => {
        const s = Number(stop);
        if (LAYOUT_MAP[s]) return `var(--dt-layout-${LAYOUT_MAP[s]}${suffix || ''})`;
        if (RAW_FALLBACK[s]) {
          return `${RAW_FALLBACK[s]} /* TODO: no --dt-layout-* equivalent for --dt-size-${s} — replace with a layout token when one is added */`;
        }
        return match;
      },
    },
    // Cleanup: calc(var(--dt-spacing-*) * -1) → var(--dt-spacing-*-negative)
    {
      from: /calc\(var\(--dt-spacing-([a-z0-9]+)\)\s*\*\s*-1\)/g,
      to: (match, stop) => `var(--dt-spacing-${stop}-negative)`,
    },
  ],
};
