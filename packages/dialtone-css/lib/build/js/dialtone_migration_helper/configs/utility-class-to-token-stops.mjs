// Migration: old pixel-based utility class names → new token-stop-based class names
// e.g. d-h16 → d-h-25, d-p8 → d-p-100, d-m8 → d-m-100

// Sizing: pixel value → layout token stop
// MUST STAY IN SYNC with WIDTH_HEIGHTS_LAYOUT in dialtone-css/postcss/constants.cjs
const SIZING_MAP = {
  16: '25', 32: '50', 48: '75', 64: '100', 80: '125', 96: '150',
  112: '175', 128: '200', 160: '250', 192: '300', 224: '350', 256: '400',
  288: '450', 320: '500', 352: '550', 384: '600', 416: '650', 448: '700',
  480: '750', 512: '800', 544: '850', 576: '900', 608: '950', 640: '1000',
  672: '1050', 704: '1100', 736: '1150', 768: '1200', 800: '1250',
  832: '1300', 864: '1350', 896: '1400', 928: '1450', 960: '1500',
  992: '1550', 1024: '1600',
};

// Small sizing values (0-12px) that map to spacing tokens, not layout tokens.
// These old classes (d-h0, d-h1, d-h2, etc.) don't have a layout-stop equivalent.
// They should be migrated to use the spacing token directly in CSS rather than a utility class,
// or left as-is since the old classes still work.

// Spacing: pixel value → spacing token stop
// MUST STAY IN SYNC with GAP_SPACES_SPACING / MARGIN_SIZES_SPACING / PADDING_SIZES_SPACING in dialtone-css/postcss/constants.cjs
const SPACING_MAP = {
  0: '0', 1: '1', 2: '25', 4: '50', 6: '75', 8: '100',
  10: '125', 12: '150', 14: '175', 16: '200', 20: '250', 24: '300',
  32: '400', 48: '600', 64: '800',
};

// Negative spacing: old notation (n8) → new notation (n100)
const NEGATIVE_SPACING_MAP = {
  1: '1', 2: '25', 4: '50', 6: '75', 8: '100',
  10: '125', 12: '150', 14: '175', 16: '200', 20: '250', 24: '300',
  32: '400', 48: '600', 64: '800',
};

// Layout sizes for margin/padding (96px, 128px use layout tokens)
const SPACING_LAYOUT_MAP = {
  96: '150', 128: '200',
};

// Helper: build regex that matches class names with word boundaries
// Sorted by descending key length to avoid partial matches (d-h1024 before d-h102)
function buildClassRegex (prefix, map) {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length || Number(b) - Number(a));
  const pattern = keys.join('|');
  // Match class name boundary: preceded by space, quote, or start; followed by space, quote, or end
  return new RegExp(`((?:^|["'\\s]))${prefix}(${pattern})((?:["'\\s]|$))`, 'gm');
}

export default {
  description:
    'Migrates pixel-based utility class names to token-stop-based names.\n' +
    '- Sizing: d-h16 → d-h-25, d-w64 → d-w-100, d-hmn96 → d-hmn-150\n' +
    '- Margin: d-m8 → d-m-100, d-mt16 → d-mt-200, d-mtn8 → d-mt-n100\n' +
    '- Padding: d-p8 → d-p-100, d-pt16 → d-pt-200\n' +
    '- Gap: d-g8 → d-g-100, d-rg16 → d-rg-200\n' +
    '- Position: d-t8 → d-t-100, d-tn8 → d-t-n100\n' +
    '- Old deprecated sizes (d-h72, d-w332, etc.) are left unchanged for manual review.\n',
  patterns: ['**/*.{vue,html,js,ts,jsx,tsx,md,less,css}'],
  globbyConfig: {
    ignore: ['**/dialtone_migration_helper/tests/**', '**/node_modules/**'],
  },
  expressions: [
    // ── Sizing: d-h{px} → d-h-{layout-stop} ──────────────────────────────
    ...['h', 'w', 'hmn', 'hmx', 'wmn', 'wmx'].flatMap(prefix => [
      // Layout sizes (16px+)
      {
        from: buildClassRegex(`d-${prefix}`, SIZING_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SIZING_MAP[px]}${post}`,
      },
      // Layout sizes for 96/128 (margin/padding also uses these for sizing)
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_LAYOUT_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_LAYOUT_MAP[px]}${post}`,
      },
    ]),

    // ── Margin: d-m{px} → d-m-{spacing-stop} ─────────────────────────────
    ...['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my'].flatMap(prefix => [
      // Spacing sizes (0-64px)
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
      },
      // Layout sizes (96, 128px)
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_LAYOUT_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_LAYOUT_MAP[px]}${post}`,
      },
    ]),

    // ── Negative margin: d-m{dir}n{px} → d-m{dir}-n{spacing-stop} ────────
    ...['mt', 'mr', 'mb', 'ml', 'mx', 'my', 'm'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}n`, NEGATIVE_SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-n${NEGATIVE_SPACING_MAP[px]}${post}`,
    })),

    // ── Padding: d-p{px} → d-p-{spacing-stop} ────────────────────────────
    ...['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'].flatMap(prefix => [
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
      },
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_LAYOUT_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_LAYOUT_MAP[px]}${post}`,
      },
    ]),

    // ── Gap: d-g{px} → d-g-{spacing-stop} ────────────────────────────────
    ...['g', 'rg', 'cg'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
    })),

    // ── Position: d-t{px} → d-t-{spacing-stop} ───────────────────────────
    ...['t', 'r', 'b', 'l', 'x', 'y', 'all'].flatMap(prefix => [
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
      },
      // Layout position sizes (96px)
      {
        from: buildClassRegex(`d-${prefix}`, SPACING_LAYOUT_MAP),
        to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_LAYOUT_MAP[px]}${post}`,
      },
    ]),

    // ── Negative position: d-{dir}n{px} → d-{dir}-n{spacing-stop} ────────
    ...['t', 'r', 'b', 'l', 'x', 'y', 'all'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}n`, NEGATIVE_SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-n${NEGATIVE_SPACING_MAP[px]}${post}`,
    })),
  ],
};
