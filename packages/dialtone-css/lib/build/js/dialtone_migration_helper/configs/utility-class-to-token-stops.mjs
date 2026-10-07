import guidance from '../migration-guidance.cjs';
const {
  SIZING_MAP, SPACING_MAP, NEGATIVE_SPACING_MAP, SPACING_LAYOUT_MAP, RADIUS_MAP, RADIUS_PAIR_PREFIX_MAP,
} = guidance;

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
    '- Margin: d-m8 → d-m-100, d-mt16 → d-mt-200, d-mtn8 → d-mt-n100 (values ≥ 96px left unchanged)\n' +
    '- Padding: d-p8 → d-p-100, d-pt16 → d-pt-200 (values ≥ 96px left unchanged — no layout-token padding class exists)\n' +
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
      // `dot: true` makes dot-dirs globbable; explicitly exclude the git directory.
      '**/.git/**',
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
    // Only spacing-scale values (0-64px) are migrated. Values ≥ 96px (e.g. d-mt96)
    // are left unchanged: token-stop margin classes use spacing tokens only, so
    // d-mt-150 resolves to --dt-spacing-150 (12px), not --dt-layout-150 (96px).
    ...['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
    })),

    // ── Negative margin: d-m{dir}n{px} → d-m{dir}-n{spacing-stop} ────────
    ...['mt', 'mr', 'mb', 'ml', 'mx', 'my', 'm'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}n`, NEGATIVE_SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-n${NEGATIVE_SPACING_MAP[px]}${post}`,
    })),

    // ── Padding: d-p{px} → d-p-{spacing-stop} ────────────────────────────
    // Only spacing-scale values (0-64px) are migrated. Values ≥ 96px (e.g. d-pt96)
    // are left unchanged: token-stop padding classes use spacing tokens only, so
    // d-pt-150 resolves to --dt-spacing-150 (12px), not --dt-layout-150 (96px).
    ...['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
    })),

    // ── Gap: d-g{px} → d-g-{spacing-stop} ────────────────────────────────
    ...['g', 'rg', 'cg'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
    })),

    // ── Position: d-t{px} → d-t-{spacing-stop} ───────────────────────────
    // Only spacing-scale values (0-64px) are migrated. Values ≥ 96px (e.g. d-t96)
    // are left unchanged: token-stop position classes use spacing tokens only, so
    // d-t-150 resolves to --dt-spacing-150 (12px), not --dt-layout-150 (96px).
    ...['t', 'r', 'b', 'l', 'x', 'y', 'all'].map(prefix => ({
      from: buildClassRegex(`d-${prefix}`, SPACING_MAP),
      to: (match, pre, px, post) => `${pre}d-${prefix}-${SPACING_MAP[px]}${post}`,
    })),

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
