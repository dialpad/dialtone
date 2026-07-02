// Dialtone Migration Helper — next→stable token name reverse-rename tables.
//
// Source: @dialpad/dialtone-css dialtone_migration_helper/configs/ (read 2026-07-02,
// from dialpad-uikits/kits/chatkit/.yalc/@dialpad/dialtone-css). Direction is
// REVERSED vs the codemod configs — those migrate stable→next, these map next→stable.
//
// globalThis.__dtTokenRenames.toStable(nextName) → string[] of stable-side name
// candidates in priority order. The engine picks the first present in the stable map.

(() => {
  'use strict';

  // space-to-spacing.mjs MAP reversed: --dt-spacing-{suffix} ← --dt-space-{stop}
  // Priority: space-* candidates come first (stable's primary spacing namespace)
  const SPACE_FROM_SPACING = {
    'spacing-0':   ['space-0'],
    'spacing-1':   ['space-100'],
    'spacing-25':  ['space-200'],
    'spacing-50':  ['space-300'],
    'spacing-75':  ['space-350'],
    'spacing-100': ['space-400'],
    'spacing-150': ['space-450'],
    'spacing-200': ['space-500'],
    'spacing-250': ['space-525'],
    'spacing-300': ['space-550'],
    'spacing-400': ['space-600'],
    'spacing-525': ['space-625'],
    'spacing-600': ['space-650'],
    'spacing-800': ['space-700'],
  };

  // size-to-layout.mjs SPACING_MAP reversed: additional --dt-spacing-{suffix} ← --dt-size-{stop}
  // Lower priority than SPACE_FROM_SPACING (size-* tried only when space-* absent in stable map)
  const SIZE_FROM_SPACING = {
    'spacing-0':   ['size-0'],
    'spacing-1':   ['size-50', 'size-100'],
    'spacing-25':  ['size-200'],
    'spacing-50':  ['size-300'],
    'spacing-75':  ['size-350'],
    'spacing-100': ['size-400'],
    'spacing-150': ['size-450'],
    'spacing-200': ['size-500'],
    'spacing-250': ['size-525'],
    'spacing-300': ['size-550'],
    'spacing-400': ['size-600'],
    'spacing-525': ['size-625'],
    'spacing-600': ['size-650'],
    'spacing-800': ['size-700'],
  };

  // size-to-layout.mjs LAYOUT_MAP reversed: --dt-layout-{suffix} ← --dt-size-{stop}
  // Many-to-one reverses listed in ascending stop order (lower stop = preferred candidate)
  const SIZE_FROM_LAYOUT = {
    'layout-1px':  ['size-100'],
    'layout-2px':  ['size-200'],
    'layout-8px':  ['size-400'],
    'layout-20px': ['size-525'],
    'layout-24px': ['size-550'],
    'layout-25':   ['size-500'],
    'layout-50':   ['size-600'],
    'layout-75':   ['size-650'],
    'layout-100':  ['size-700', 'size-720'],
    'layout-125':  ['size-730'],
    'layout-150':  ['size-750', 'size-760'],
    'layout-175':  ['size-775'],
    'layout-200':  ['size-800'],
    'layout-250':  ['size-825'],
    'layout-300':  ['size-850'],
    'layout-350':  ['size-875'],
    'layout-400':  ['size-900', 'size-905'],
    'layout-500':  ['size-925'],
    'layout-600':  ['size-950'],
    'layout-700':  ['size-975'],
    'layout-800':  ['size-1000'],
    'layout-1000': ['size-1020'],
    'layout-1200': ['size-1050', 'size-1040'],
    'layout-1300': ['size-1060'],
    'layout-1400': ['size-1080'],
    'layout-1600': ['size-1100'],
  };

  // size-to-layout.mjs BORDER_STOPS / RADIUS_STOPS reversed
  const BORDER = new Set([0, 50, 100, 150, 200, 300, 400]);
  const RADIUS = new Set([0, 100, 200, 300, 350, 400, 450, 500, 600]);

  globalThis.__dtTokenRenames = {
    // Returns stable-side name candidates for a next-side token name.
    // Engine in substituteTokenValues uses the first candidate present in the stable map.
    toStable(name) {
      if (!name.startsWith('--dt-')) return [];
      const suffix = name.slice(5); // strip '--dt-'
      const candidates = [];

      // layout-{N}-percent ← size-{N}-percent: straight stop-number swap (handle before strip)
      const layoutPct = suffix.match(/^layout-(\d+)-percent$/);
      if (layoutPct) {
        candidates.push(`--dt-size-${layoutPct[1]}-percent`);
      }

      // Strip -negative / -percent variant suffix for table lookups
      const variantMatch = suffix.match(/^(.+?)(-negative|-percent)$/);
      const base = variantMatch ? variantMatch[1] : suffix;
      const variant = variantMatch ? variantMatch[2] : '';

      // spacing-* → space-* candidates (space-* priority, then size-*)
      const fromSpace = SPACE_FROM_SPACING[base];
      if (fromSpace) for (const s of fromSpace) candidates.push(`--dt-${s}${variant}`);
      const fromSize = SIZE_FROM_SPACING[base];
      if (fromSize) for (const s of fromSize) candidates.push(`--dt-${s}${variant}`);

      // layout-* → size-* (base tokens only; -percent handled above, -negative carries through)
      if (!variant || variant === '-negative') {
        const fromLayout = SIZE_FROM_LAYOUT[base];
        if (fromLayout) for (const s of fromLayout) candidates.push(`--dt-${s}`);
      }

      // size-border-N ← size-N
      const borderMatch = base.match(/^size-border-(\d+)$/);
      if (borderMatch && BORDER.has(Number(borderMatch[1]))) {
        candidates.push(`--dt-size-${borderMatch[1]}${variant}`);
      }

      // size-radius-N ← size-N
      const radiusMatch = base.match(/^size-radius-(\d+)$/);
      if (radiusMatch && RADIUS.has(Number(radiusMatch[1]))) {
        candidates.push(`--dt-size-${radiusMatch[1]}${variant}`);
      }

      // success-to-positive reversed: *-positive[-*] → *-success[-*]
      if (base.includes('-positive')) {
        const stableBase = base.replace(/-positive(?=-|$)/, '-success');
        if (stableBase !== base) candidates.push(`--dt-${stableBase}${variant}`);
      }

      return candidates;
    },
  };
})();
