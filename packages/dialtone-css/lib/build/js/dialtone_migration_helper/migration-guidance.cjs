// C3 authority: moved from the preferred migration-helper configs.
// Scope: Dialtone 9 legacy names -> Dialtone 10 spacing/layout/token-stop conventions.
// Standalone package major versions are independent of the umbrella version.
// Only exact value mappings belong here; unknown context/no equivalent requires review.
'use strict';

const SPACE_TOKEN_MAP = {
  0: 'spacing-0',     // 0px
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
  // 720 (72px), 730 (84px), 750+ (96px+) have no --dt-spacing-* equivalent.
  // Tokens at these sizes are better expressed as --dt-layout-* tokens.
  // These are left unchanged for manual review — the lint rule will flag them.
};

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

const SPACING_MAP = {
  0: '0', 1: '1', 2: '25', 4: '50', 6: '75', 8: '100',
  10: '125', 12: '150', 14: '175', 16: '200', 20: '250', 24: '300',
  32: '400', 48: '600', 64: '800',
};

const NEGATIVE_SPACING_MAP = {
  1: '1', 2: '25', 4: '50', 6: '75', 8: '100',
  10: '125', 12: '150', 14: '175', 16: '200', 20: '250', 24: '300',
  32: '400', 48: '600', 64: '800',
};

const SPACING_LAYOUT_MAP = {
  96: '150', 128: '200',
};

const RADIUS_MAP = {
  0: '0', 1: '100', 2: '200', 4: '300', 6: '350',
  8: '400', 12: '450', 16: '500', 24: '550', 32: '600',
};

const RADIUS_PAIR_PREFIX_MAP = {
  btr: 'bbsr', // top    → block-start pair
  bbr: 'bber', // bottom → block-end pair
  blr: 'bisr', // left   → inline-start pair
  brr: 'bier', // right  → inline-end pair
};

const UTILITY_REVIEW_REQUIRED = {
  // The shipped legacy declaration uses spacing-1, despite its numeric suffix.
  'd-flg2': 'Legacy d-flg2 resolves to 1px; its suffix does not identify its value. Manual layout review required.',
};

const SIZE_LAYOUT_MAP = {
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
};

module.exports = {
  SPACE_TOKEN_MAP, SIZING_MAP, SPACING_MAP, NEGATIVE_SPACING_MAP,
  SPACING_LAYOUT_MAP, RADIUS_MAP, RADIUS_PAIR_PREFIX_MAP, SIZE_LAYOUT_MAP, UTILITY_REVIEW_REQUIRED,
};
