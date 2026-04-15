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

  // Support colon syntax: 'typography-size:label', 'color:d-fc:color'
  const [baseCategory, ...categoryArgs] = category.split(':');

  switch (baseCategory) {
    case 'spacing':
      result = resolveSpacing(value);
      break;
    case 'icon-size':
      result = resolveIconSize(value);
      break;
    case 'typography-size':
      result = resolveTypographySize(value, propValues, categoryArgs[0]);
      break;
    case 'line-height':
      result = resolveLineHeight(value);
      break;
    case 'component-size':
      if (categoryArgs[0]) result = resolveComponentSize(categoryArgs[0], value);
      break;
    case 'color':
      if (categoryArgs[0]) result = resolveColor(categoryArgs[0], categoryArgs[1] || 'color', value);
      break;
  }

  cache.set(cacheKey, result);
  return result;
}

/**
 * Resolves a computed color from CSS classes applied to the measure element.
 *
 * classPrefix patterns:
 *   'class[attr]'  — sets attr=value, reads from child element (avatar family)
 *   'class--'      — applies 'class class--{value}' (BEM modifier)
 *   'class'        — applies 'class-{value}' (utility class)
 *
 * cssProperty patterns:
 *   'color', 'backgroundColor'  — standard computed style property
 *   '--custom-prop'             — read via getPropertyValue
 *   '--custom-prop-'            — value appended: '--x-' + 'foo' → '--x-foo'
 */
function resolveColor (classPrefix, cssProperty, value) {
  const el = getMeasureElement();
  const bracketMatch = classPrefix.match(/^(.+)\[(.+)\]$/);
  try {
    if (bracketMatch) {
      el.className = bracketMatch[1];
      el.setAttribute(bracketMatch[2], value);
      // Avatar family needs a child element for OKLCH color computation
      // (background-color is on .d-avatar__canvas-inner, inheriting vars from parent)
      if (bracketMatch[2] === 'data-avatar-family') {
        el.setAttribute('data-avatar-variant', '3');
        let child = el.firstElementChild;
        if (!child) {
          child = document.createElement('div');
          el.appendChild(child);
        }
        child.className = `${bracketMatch[1]}__canvas-inner`;
      }
    // Component modifier pattern: prefix ends with '--' (e.g., 'd-badge--')
    // → class = 'd-badge d-badge--{value}'
    } else if (classPrefix.endsWith('--')) {
      const base = classPrefix.slice(0, -2);
      el.className = `${base} ${classPrefix}${value}`;
    // Utility pattern: no '--' suffix (e.g., 'd-fc')
    // → class = 'd-fc-{value}'
    } else {
      el.className = `${classPrefix}-${value}`;
    }
    const target = (bracketMatch && el.firstElementChild) || el;
    const styles = getComputedStyle(target);
    // Custom property that ends with '-' gets value appended (e.g., '--presence-color-background-' + 'active')
    const propName = cssProperty.endsWith('-') ? `${cssProperty}${value}` : cssProperty;
    const resolved = propName.startsWith('--')
      ? styles.getPropertyValue(propName).trim()
      : styles[propName];
    if (!resolved || resolved === 'rgba(0, 0, 0, 0)' || resolved === 'transparent') return null;
    return resolved;
  } finally {
    el.className = '';
    if (bracketMatch) {
      el.removeAttribute(bracketMatch[2]);
      el.removeAttribute('data-avatar-variant');
      if (el.firstElementChild) el.removeChild(el.firstElementChild);
    }
  }
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
