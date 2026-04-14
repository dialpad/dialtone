const TEXT_SIZE_TO_CSS_SUFFIX = {
  100: 'xs',
  200: 'sm',
  300: 'md',
  400: 'lg',
  500: 'xl',
  600: '2xl',
  700: '3xl',
};

const cache = new Map();

let measureEl = null;

function getMeasureElement () {
  if (!measureEl) {
    measureEl = document.createElement('div');
    measureEl.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(measureEl);
  }
  return measureEl;
}

/**
 * Resolves a CSS custom property to its computed px value
 * by applying it to a hidden element's width.
 *
 * @param {string} varName - CSS custom property name (e.g. '--dt-spacing-200')
 * @returns {string|null} Resolved value (e.g. '16px') or null
 */
function resolveCssVar (varName) {
  const SENTINEL = '8739.5px';
  const el = getMeasureElement();
  el.style.width = `var(${varName}, ${SENTINEL})`;
  const resolvedWidth = getComputedStyle(el).width;
  el.style.width = '';
  if (!resolvedWidth || resolvedWidth === 'auto' || resolvedWidth === SENTINEL) return null;
  return resolvedWidth;
}

/**
 * Formats a pixel string for display: strips trailing zeros, rounds to 1 decimal.
 *
 * @param {string} pxValue - e.g. '16px', '12.800000190734863px'
 * @returns {string} e.g. '16px', '12.8px'
 */
function formatPx (pxValue) {
  const num = parseFloat(pxValue);
  if (isNaN(num)) return pxValue;
  const rounded = Math.round(num * 10) / 10;
  return `${rounded}px`;
}

/**
 * Resolves a token value to a human-readable display string.
 *
 * @param {string} category - The token category (e.g. 'spacing', 'icon-size', 'typography-size')
 * @param {string|number} value - The prop value (e.g. '200', '300')
 * @param {object} [propValues] - Current prop values (needed for typography-size to read 'kind')
 * @returns {string|null} Display string (e.g. '16px', '14px', '16px / 1.6') or null
 */
export function resolveTokenValue (category, value, propValues) {
  const cacheKey = `${category}:${value}:${propValues?.kind ?? ''}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  let result = null;

  // Support 'typography-size:label' syntax for explicit kind override
  const [baseCategory, kindOverride] = category.split(':');

  switch (baseCategory) {
    case 'spacing':
      result = resolveSpacing(value);
      break;
    case 'icon-size':
      result = resolveIconSize(value);
      break;
    case 'typography-size':
      result = resolveTypographySize(value, propValues, kindOverride);
      break;
    case 'line-height':
      result = resolveLineHeight(value);
      break;
    case 'component-size':
      if (kindOverride) result = resolveComponentSize(kindOverride, value);
      break;
  }

  cache.set(cacheKey, result);
  return result;
}

function resolveSpacing (value) {
  const px = resolveCssVar(`--dt-spacing-${value}`);
  return px ? formatPx(px) : null;
}

function resolveIconSize (value) {
  const px = resolveCssVar(`--dt-icon-size-${value}`);
  return px ? formatPx(px) : null;
}

function resolveComponentSize (componentClass, value) {
  const el = getMeasureElement();
  try {
    // Apply the size modifier class to set the CSS custom property,
    // then read it via width. The actual dimension lives on a child element
    // (e.g. .d-avatar__canvas), but the custom property is set on the root.
    el.className = `d-${componentClass} d-${componentClass}--size-${value}`;
    el.style.width = `var(--${componentClass}-size-shape)`;
    const size = getComputedStyle(el).width;
    if (!size || size === 'auto' || size === '0px') return null;
    return formatPx(size);
  } finally {
    el.className = '';
    el.style.width = '';
  }
}

function resolveLineHeight (value) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--dt-font-line-height-${value}`)
    .trim();
  if (!raw) return null;
  return raw;
}

function resolveTypographySize (value, propValues, kindOverride) {
  const kind = kindOverride || propValues?.kind || 'body';
  const suffix = TEXT_SIZE_TO_CSS_SUFFIX[value];
  if (!suffix) return null;

  const el = getMeasureElement();
  let fontSize, lineHeight;
  try {
    el.className = `d-text-${kind} d-text-${kind}--${suffix}`;
    el.textContent = 'X';
    const styles = getComputedStyle(el);
    fontSize = styles.fontSize;
    lineHeight = styles.lineHeight;
  } finally {
    el.className = '';
    el.textContent = '';
  }

  if (!fontSize || fontSize === '0px') return null;

  const formattedSize = formatPx(fontSize);
  if (lineHeight && lineHeight !== 'normal') {
    const lhNum = parseFloat(lineHeight);
    const fsNum = parseFloat(fontSize);
    if (!isNaN(lhNum) && !isNaN(fsNum) && fsNum > 0) {
      const ratio = Math.round((lhNum / fsNum) * 10) / 10;
      return `${formattedSize} / ${ratio}`;
    }
  }
  return formattedSize;
}
