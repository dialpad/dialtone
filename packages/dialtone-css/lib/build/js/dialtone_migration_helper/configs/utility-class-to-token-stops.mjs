// Migration: old pixel-based utility class names → new token-stop-based class names
// e.g. d-h16 → d-h-25, d-p8 → d-p-100, d-m8 → d-m-100

// Sizing: pixel value → layout token stop
// MUST STAY IN SYNC with LAYOUT_STOPS in dialtone-css/postcss/constants.cjs
// Off-scale pixel-indexed exceptions (1, 2, 8, 20, 24) map to the Npx stops
// introduced in DLT-3330; scale-indexed values (16+) map to the 64px-base stops.
const SIZING_MAP = {
  // Off-scale pixel-indexed exceptions
  1: '1px', 2: '2px', 8: '8px', 20: '20px', 24: '24px',
  // Scale-indexed stops (64px base)
  16: '25', 32: '50', 48: '75', 64: '100', 80: '125', 96: '150',
  112: '175', 128: '200', 160: '250', 192: '300', 224: '350', 256: '400',
  288: '450', 320: '500', 352: '550', 384: '600', 416: '650', 448: '700',
  480: '750', 512: '800', 544: '850', 576: '900', 608: '950', 640: '1000',
  672: '1050', 704: '1100', 736: '1150', 768: '1200', 800: '1250',
  832: '1300', 864: '1350', 896: '1400', 928: '1450', 960: '1500',
  992: '1550', 1024: '1600',
};

// Remaining off-scale sizing values without a layout-token equivalent (4, 6, 10, 12, 14)
// are left on the Tier 1 calc-based legacy path and pass through unchanged.

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

// Border-radius: legacy pixel value → new radius token stop
// MUST STAY IN SYNC with RADIUS_STOPS in dialtone-css/postcss/constants.cjs.
const RADIUS_MAP = {
  0: '0', 1: '100', 2: '200', 4: '300', 6: '350',
  8: '400', 12: '450', 16: '500', 24: '550', 32: '600',
};

// Border-radius: legacy physical-side prefix → new logical prefix.
const RADIUS_PAIR_PREFIX_MAP = {
  btr: 'bbsr', // top    → block-start pair
  bbr: 'bber', // bottom → block-end pair
  blr: 'bisr', // left   → inline-start pair
  brr: 'bier', // right  → inline-end pair
};

// Class-name boundary: preceded by space, quote, or start; followed by space, quote, or end.
const CLASS_BOUNDARY_LEFT = `((?:^|["'\\s]))`;
const CLASS_BOUNDARY_RIGHT = `((?:["'\\s]|$))`;

// Build regex that matches class names ending in any key from `map`, with boundaries.
// Keys sorted by descending length to avoid partial matches (d-h1024 before d-h102).
function buildClassRegex (prefix, map) {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length || Number(b) - Number(a));
  return new RegExp(`${CLASS_BOUNDARY_LEFT}${prefix}(${keys.join('|')})${CLASS_BOUNDARY_RIGHT}`, 'gm');
}

// Variant for fixed-keyword suffixes (e.g. `-pill`, `-circle`).
function buildKeywordClassRegex (prefix, keyword) {
  return new RegExp(`${CLASS_BOUNDARY_LEFT}${prefix}-${keyword}${CLASS_BOUNDARY_RIGHT}`, 'gm');
}

export default {
  description:
    'Migrates pixel-based utility class names to token-stop-based names.\n' +
    '- Sizing: d-h16 → d-h-25, d-w64 → d-w-100, d-hmn96 → d-hmn-150\n' +
    '- Off-scale sizing: d-w1 → d-w-1px, d-h24 → d-h-24px (pixel-indexed exceptions)\n' +
    '- Margin: d-m8 → d-m-100, d-mt16 → d-mt-200, d-mtn8 → d-mt-n100\n' +
    '- Padding: d-p8 → d-p-100, d-pt16 → d-pt-200\n' +
    '- Gap: d-g8 → d-g-100, d-rg16 → d-rg-200\n' +
    '- Position: d-t8 → d-t-100, d-tn8 → d-t-n100\n' +
    '- Border-radius all: d-bar6 → d-bar-350, d-bar24 → d-bar-550\n' +
    '- Border-radius pair (physical → logical): d-btr6 → d-bbsr-350, d-bbr8 → d-bber-400, d-blr12 → d-bisr-450, d-brr16 → d-bier-500\n' +
    '- Border-radius pair keyword: d-btr-pill → d-bbsr-pill, d-brr-circle → d-bier-circle\n' +
    '- Old deprecated sizes (d-h72, d-w332, etc.) are left unchanged for manual review.\n',
  patterns: ['**/*.{vue,html,js,ts,jsx,tsx,md,mdx,less,css}'],
  globbyConfig: {
    // Include dotfiles/dotdirs so tooling directories like `.vuepress/baseComponents/`,
    // `.storybook/`, and per-repo docs folders are scanned. Dotted build-output caches are
    // explicitly excluded below.
    dot: true,
    ignore: [
      '**/node_modules/**',
      // Built outputs: regenerated on next build; rewriting selectors in co-selected rules
      // (`.d-bar-350, .d-bar6 { ... }`) would corrupt them since the leading whitespace
      // before the legacy selector looks like a class boundary to the regex.
      '**/dist/**',
      '**/build/**',
      '**/lib/dist/**',
      // Framework caches
      '**/.cache/**',
      '**/.vite/**',
      '**/.vuepress/.cache/**',
      '**/.vuepress/.temp/**',
      '**/.vuepress/dist/**',
      '**/.next/**',
      '**/.nuxt/**',
      '**/.turbo/**',
      '**/.nx/**',
      // Migration-helper test fixtures intentionally contain legacy class names.
      '**/dialtone_migration_helper/tests/**',
      // ESLint-plugin rules and tests inherently contain legacy class names as regex patterns
      // and test inputs — they're the tool that detects the legacy classes, don't rewrite them.
      '**/eslint-plugin-dialtone/**',
    ],
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

    // ── Border-radius all-corners numeric: d-bar{px} → d-bar-{stop} ──────
    {
      from: buildClassRegex('d-bar', RADIUS_MAP),
      to: (match, pre, px, post) => `${pre}d-bar-${RADIUS_MAP[px]}${post}`,
    },

    // ── Border-radius side-pair numeric: d-{legacy}{px} → d-{logical}-{stop}
    // Physical pair prefixes (btr/bbr/blr/brr) rewrite to their logical siblings (bbsr/bber/bisr/bier).
    ...Object.entries(RADIUS_PAIR_PREFIX_MAP).map(([legacy, logical]) => ({
      from: buildClassRegex(`d-${legacy}`, RADIUS_MAP),
      to: (match, pre, px, post) => `${pre}d-${logical}-${RADIUS_MAP[px]}${post}`,
    })),

    // ── Border-radius side-pair keyword: d-{legacy}-{pill|circle} → d-{logical}-{pill|circle}
    // Legacy `.d-bar-pill` / `.d-bar-circle` stay as-is (same name in the new scheme).
    ...Object.entries(RADIUS_PAIR_PREFIX_MAP).flatMap(([legacy, logical]) =>
      ['pill', 'circle'].map(keyword => ({
        from: buildKeywordClassRegex(`d-${legacy}`, keyword),
        to: (match, pre, post) => `${pre}d-${logical}-${keyword}${post}`,
      })),
    ),
  ],
};
