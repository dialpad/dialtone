/**
 * dialtone-vue's `LAYOUT_SIZE_VALUES` (`common/constants/layout.js`): 0, then the layout stops, which map to
 * `--dt-layout-*` tokens (Non-zero bare integers are scale-indexed on the 64px layout base; `*px` values are literal
 * off-scale pixel exceptions). Keep in sync with it.
 */
const LAYOUT_SIZE_VALUES = [
  '0',
  '1px', '2px', '8px', '25', '20px', '24px', '50', '75', '100', '125', '150',
  '175', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650',
  '700', '750', '800', '850', '900', '950', '1000', '1050', '1100', '1150',
  '1200', '1250', '1300', '1350', '1400', '1450', '1500', '1550', '1600',
] as const;

export const FILTER_PILL_OVERLAY_MIN_INLINE_SIZE_VALUES = ['anchor', ...LAYOUT_SIZE_VALUES] as const;

export type FilterPillOverlayMinInlineSize = typeof FILTER_PILL_OVERLAY_MIN_INLINE_SIZE_VALUES[number];
