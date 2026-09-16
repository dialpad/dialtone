// Mapping: base color utility/token → semantic equivalent.
// Derived from tokens/theme/dp/default.json (light mode, non-inverted, non-opaque).
// Only entries where the mapping is unambiguous (1:1) are included.

const FOREGROUND_MAP = {
  'black-600': 'tertiary',
  'black-700': 'secondary',
  'black-900': 'primary',
  'red-600': 'critical',
  'red-700': 'critical-strong',
  'green-800': 'positive',
  'green-900': 'positive-strong',
  'gold-800': 'warning',
};

const SURFACE_MAP = {
  'black-50': 'primary',
  'black-100': 'secondary',
  'black-200': 'moderate',
  'black-300': 'bold',
  'black-600': 'strong',
  'black-800': 'contrast',
  'red-50': 'critical-subtle',
  'red-100': 'critical',
  'red-600': 'critical-strong',
  'gold-50': 'warning-subtle',
  'gold-100': 'warning',
  'gold-400': 'warning-strong',
  'green-50': 'positive-subtle',
  'green-100': 'positive',
  'green-800': 'positive-strong',
  'blue-50': 'info-subtle',
  'blue-100': 'info',
  'blue-800': 'info-strong',
  'purple-50': 'brand-subtle',
  'purple-100': 'brand',
  'purple-600': 'brand-strong',
};

const BORDER_MAP = {
  'red-300': 'critical-subtle',
  'red-600': 'critical',
  'red-800': 'critical-strong',
  'green-300': 'positive-subtle',
  'green-700': 'positive',
  'green-900': 'positive-strong',
  'gold-300': 'warning-subtle',
  'gold-500': 'warning',
  'gold-700': 'warning-strong',
  'purple-300': 'brand-subtle',
  'purple-600': 'brand',
  'purple-800': 'brand-strong',
  'blue-500': 'focus',
};

// ── Expression factories ─────────────────────────────────────────────

function utilityExpr (prefix, map) {
  return {
    from: new RegExp(`d-${prefix}-(\\w+)-(\\d+)`, 'g'),
    to: (match, color, stop) => {
      const s = map[`${color}-${stop}`];
      return s ? `d-${prefix}-${s}` : match;
    },
  };
}

function cssPropertyReplacer (map, category) {
  return (match, pre, color, stop) => {
    const s = map[`${color}-${stop}`];
    return s ? `${pre}var(--dt-color-${category}-${s})` : match;
  };
}

// Border regex side group: physical + logical properties
 
const BORDER_SIDES = '(?:-(?:top|right|bottom|left|block(?:-(?:start|end))?|inline(?:-(?:start|end))?))?';

export default {
  description:
    'Replaces base color utility classes and CSS tokens with semantic equivalents.\n' +
    '- Utility classes: d-fc-{color}-{stop} → d-fc-{semantic}, d-bgc-*, d-bc-*, d-divide-*\n\t' +
      'eg. d-fc-red-600 → d-fc-critical, d-bgc-black-100 → d-bgc-secondary\n' +
    '- CSS properties: color/background/border declarations with var(--dt-color-{color}-{stop})\n\t' +
      'eg. color: var(--dt-color-red-600) → color: var(--dt-color-foreground-critical)\n\t' +
      'eg. border: ... solid var(--dt-color-red-600) → ...var(--dt-color-border-critical)\n' +
    '- Unmapped base colors pass through for manual review (linters will flag them).\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,js,ts,jsx,tsx}'],
  expressions: [
    // ── Utility class expressions ────────────────────────────────────
    utilityExpr('fc', FOREGROUND_MAP),
    utilityExpr('bgc', SURFACE_MAP),
    utilityExpr('bc', BORDER_MAP),
    utilityExpr('divide', BORDER_MAP),

    // ── CSS property context expressions ─────────────────────────────

    // color: var(--dt-color-*) → var(--dt-color-foreground-*)
    // Guard: (^|[;{}\s]) ensures "color" is standalone, not "background-color" etc.
    {
      from: /((?:^|[;{}\s])color\s*:\s*)var\(--dt-color-(\w+)-(\d+)\)/gm,
      to: cssPropertyReplacer(FOREGROUND_MAP, 'foreground'),
    },
    // background[-color]: var(--dt-color-*) → var(--dt-color-surface-*)
    {
      from: /(background(?:-color)?\s*:[^;]*?)var\(--dt-color-(\w+)-(\d+)\)/gm,
      to: cssPropertyReplacer(SURFACE_MAP, 'surface'),
    },
    // border[-side][-color]: ... var(--dt-color-*) → var(--dt-color-border-*)
    // Covers physical (top/right/bottom/left) and logical (block/inline/-start/-end) sides
    {
      from: new RegExp(
        `(border${BORDER_SIDES}(?:-color)?\\s*:[^;]*?)var\\(--dt-color-(\\w+)-(\\d+)\\)`, 'gm',
      ),
      to: cssPropertyReplacer(BORDER_MAP, 'border'),
    },
  ],
};
