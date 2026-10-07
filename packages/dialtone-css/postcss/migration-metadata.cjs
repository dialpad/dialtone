// Consume the preferred migration-helper authority; do not maintain a second stop map.
const { SIZING_MAP, SPACING_MAP, NEGATIVE_SPACING_MAP, RADIUS_MAP, RADIUS_PAIR_PREFIX_MAP, SPACE_TOKEN_MAP, UTILITY_REVIEW_REQUIRED } = require('../lib/build/js/dialtone_migration_helper/migration-guidance.cjs');
const scope = 'Legacy Dialtone 9 naming. For Dialtone 10, verify the installed target supports the replacement.';

function utilityMetadata (name) {
  let match;
  let replacement;
  let layoutReview = false;
  if ((match = /^d-(h|w|hmn|hmx|wmn|wmx)(\d+)$/.exec(name))) {
    if (SIZING_MAP[match[2]]) replacement = `d-${match[1]}-${SIZING_MAP[match[2]]}`;
  } else if ((match = /^d-(m[trblxy]?|[trblxy]|all)n(\d+)$/.exec(name))) {
    if (NEGATIVE_SPACING_MAP[match[2]]) replacement = `d-${match[1]}-n${NEGATIVE_SPACING_MAP[match[2]]}`;
  } else if ((match = /^d-(m[trblxy]?|p[trblxy]?|g|rg|cg|[trblxy]|all)(\d+)$/.exec(name))) {
    if (SPACING_MAP[match[2]]) replacement = `d-${match[1]}-${SPACING_MAP[match[2]]}`;
    layoutReview = ['g', 'cg'].includes(match[1]);
  } else if ((match = /^d-(bar|btr|bbr|blr|brr)(\d+|-pill|-circle)$/.exec(name))) {
    const prefix = RADIUS_PAIR_PREFIX_MAP[match[1]] || match[1];
    const stop = match[2].startsWith('-') ? match[2].slice(1) : RADIUS_MAP[match[2]];
    if (stop != null) replacement = `d-${prefix}-${stop}`;
  } else if ((match = /^d-(flg|gg|grg|gcg)(\d+)$/.exec(name))) {
    const prefix = match[1] === 'grg' ? 'rg' : match[1] === 'gcg' ? 'cg' : 'g';
    if (SPACING_MAP[match[2]]) replacement = `d-${prefix}-${SPACING_MAP[match[2]]}`;
    layoutReview = match[1] === 'flg';
  } else {
    return null;
  }
  if (replacement === name) return null;
  const reviewReason = UTILITY_REVIEW_REQUIRED[name];
  if (reviewReason) replacement = undefined;
  return {
    deprecated: true,
    category: 'migration',
    reason: `${scope} ${reviewReason || (replacement ? 'Use the corresponding token-stop name.' : 'No exact token-stop equivalent; manual review required.')}${layoutReview ? ' Legacy gap rules affect child margins and --fl-gap; manual layout review required before using native gap.' : ''}`,
    alternatives: replacement ? [replacement] : [],
    docs: 'https://dialtone.dialpad.com/guides/migration/',
  };
}

function tokenMetadata (name, deprecated) {
  if (name.startsWith('--dt-space-')) {
    const match = /^--dt-space-([0-9]+)(-negative)?$/.exec(name);
    const target = match && SPACE_TOKEN_MAP[match[1]];
    return {
      deprecated: true, category: 'migration',
      reason: `${scope} ${target ? 'For spacing properties, the replacement preserves the value; other contexts require manual review.' : 'No exact spacing equivalent; manual review required.'}`,
      alternatives: target ? [`--dt-${target}${match[2] || ''}`] : [],
    };
  }
  if (/^--dt-size-\d/.test(name)) {
    return {
      deprecated: true, category: 'migration',
      reason: `${scope} Generic size tokens require CSS property context. Select size-to-layout in the migration helper; unsupported or approximate mappings require manual review.`,
      alternatives: [],
    };
  }
  return deprecated ? {
    deprecated: true,
    reason: typeof deprecated === 'string' ? deprecated : 'Deprecated in the source token contract.',
    alternatives: [],
  } : null;
}

module.exports = { utilityMetadata, tokenMetadata };
