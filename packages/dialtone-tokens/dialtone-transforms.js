/**
 * custom transforms specific to dialtone-tokens. All of these will be
 * prefixed with dt/ for easy identification. Most of these are for mobile
 * because sd-transforms handles the transforms for CSS.
 */

import { colorsFilter, colorModifiersFilter, DeviceObjectFormat, deviceTransformColorModifiers, tokenColorToDeviceColor } from './transform-util.js';
import { parse, converter } from 'culori';

const SIZE_IDENTIFIERS = ['sizing', 'borderWidth', 'borderRadius', 'blur', 'spread', 'x', 'y', 'dimension'];
const SPACING_IDENTIFIERS = ['spacing'];
const FONT_FAMILY_IDENTIFIERS = ['fontFamily'];
const FONT_SIZE_IDENTIFIERS = ['fontSizes', 'fontSize'];
const WEIGHT_IDENTIFIERS = ['fontWeights', 'fontWeight'];
const LINE_HEIGHT_IDENTIFIERS = ['lineHeights', 'lineHeight'];

const FALLBACK_FONTS = ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'];
const FALLBACK_FONTS_MONO = ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'];

const ANDROID_WEIGHTS = {
  300: 'Light',
  400: 'Normal',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
};

// font size tokens are now 'dimension' type so must check path to distinguish
export const isFontSizeToken = (token) => {
  const lowerPath = token.path?.map((segment) => segment.toLowerCase()) ?? [];
  return lowerPath.includes('fontsize') ||
    (lowerPath.includes('font') && lowerPath.includes('size'));
};

// line height tokens are now 'dimension' type but DTCG still has a reference to a 'lineHeight' type so
// keeping that check as well as path
export const isLineHeightToken = (token) => {
  if (LINE_HEIGHT_IDENTIFIERS.includes(token.type)) return true;
  const lowerPath = token.path?.map((segment) => segment.toLowerCase()) ?? [];
  return lowerPath.includes('lineheight');
};

// percent tokens (e.g. size.100-percent -> "100%", or size.radius.circle -> "50%").
// excludes lineHeight tokens - those are handled by the lineHeight transform.
export const isPercentToken = (token) => {
  if (isLineHeightToken(token)) return false;
  const originalValue = token.original?.value ?? token.value;
  if (typeof originalValue === 'string' && originalValue.trim().endsWith('%')) return true;
  const lastSegment = token.path?.[token.path.length - 1]?.toLowerCase() ?? '';
  return lastSegment.includes('percent');
};

// negative tokens (e.g. size.100-negative -> "-1px")
export const isNegativeToken = (token) => {
  const lastSegment = token.path?.[token.path.length - 1]?.toLowerCase() ?? '';
  return lastSegment.includes('negative');
};

const pxToRemTransformer = (token, options) => {
  if (token.value.toString().endsWith('%')) { return token.value; }
  const baseFont = (options && options.basePxFontSize) || 16;
  const floatVal = parseFloat(token.value);

  if (isNaN(floatVal)) {
    throwSizeError(token.path, token.value, 'rem');
  }

  if (floatVal === 0) {
    return '0rem';
  }

  return `${floatVal / baseFont}rem`;
};

function throwSizeError (name, value, unitType) {
  throw new Error(`Invalid Number: '${name}: ${value}' is not a valid number, cannot transform to '${unitType}' \n`);
}

/**
 * Returns true when a token's original value references the `material.*` namespace.
 * That namespace lives in source-only token sets (`base/refs/*`) and its CSS vars
 * are intentionally not output, so a `var()` reference would resolve to nothing
 * at runtime — emit the inlined value instead. Used to gate `outputReferences`
 * across all SD configs.
 */
export function isMaterialNamespaceRef (token) {
  const orig = token.original?.value;
  return typeof orig === 'string' && orig.includes('{material.');
}

export function registerDialtoneTransforms (styleDictionary) {
  styleDictionary.registerTransform({
    name: 'dt/size/pxToRem',
    type: 'value',
    filter: function (token) {
      return [...FONT_SIZE_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type) &&
      !(token.filePath === 'tokens/root.json');
    },
    transform: pxToRemTransformer,
  });

  styleDictionary.registerTransform({
    name: 'dt/space/pxToRem',
    type: 'value',
    filter: function (token) {
      return SPACING_IDENTIFIERS.includes(token.type);
    },
    transform: pxToRemTransformer,
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/size/resolveMath',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      // replace unmathable characters with empty string
      const mathString = token.value.replace(/dp|sp|em|px|%/g, '');

      const result = eval(mathString).toFixed(2);
      return `${result}dp`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/size/pxToDp',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'dp');
      }

      return `${floatVal.toFixed(2)}dp`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/color',
    type: 'value',
    filter: colorsFilter,
    transform: function (token) {
      return tokenColorToDeviceColor(token.value, DeviceObjectFormat.ANDROID_XML);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/color/modifiers',
    type: 'value',
    transitive: true,
    filter: colorModifiersFilter,
    transform: function (token) {
      return deviceTransformColorModifiers(token, DeviceObjectFormat.ANDROID_XML);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/color',
    type: 'value',
    filter: colorsFilter,
    transform: (token) => {
      return tokenColorToDeviceColor(token.value, DeviceObjectFormat.ANDROID_COMPOSE);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/color/modifiers',
    type: 'value',
    transitive: true,
    filter: colorModifiersFilter,
    transform: (token) => {
      return deviceTransformColorModifiers(token, DeviceObjectFormat.ANDROID_COMPOSE);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/fonts/transformToStack',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return FONT_FAMILY_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      if (token.name === 'mono' || token.path.includes('code')) {
        return 'FontFamily.Monospace';
      }
      return 'FontFamily.Default';
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/fonts/weight',
    type: 'value',
    filter: function (token) {
      return WEIGHT_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      return `FontWeight.${ANDROID_WEIGHTS[token.value]}`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/pxToDp',
    type: 'value',
    transitive: true,
    filter: function (token) {
      // Exclude lineHeight tokens - they're handled by lineHeight transform
      if (isLineHeightToken(token)) return false;
      // Exclude font size tokens - they're handled by pxToSp transform
      if (isFontSizeToken(token)) return false;
      return token.type === 'dimension';
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'dp');
      }

      return `${floatVal}.dp`;
    },
  });

  // Sp is for font sizes only
  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/pxToSp',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return isFontSizeToken(token);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'sp');
      }

      return `${floatVal}.sp`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/resolveMath',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return token.type === 'dimension';
    },
    transform: (token) => {
      // replace unmathable characters with empty string
      let unit;
      if (token.value.includes('.dp')) unit = 'dp';
      if (token.value.includes('.sp')) unit = 'sp';
      if (token.value.includes('.em')) unit = 'em';
      const mathString = token.value.replace(/\.dp|\.sp|\.em|px|%/g, '');

      const result = eval(mathString);
      return `${result}.${unit}`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/lineHeight/percentToDecimal',
    type: 'value',
    filter: function (token) {
      return isLineHeightToken(token);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      if (floatVal === 0) {
        return '0';
      }

      return `${floatVal / 100}.em`;
    },
  });

  // Sp is for font sizes only
  styleDictionary.registerTransform({
    name: 'dt/android/compose/number/toFloat',
    type: 'value',
    filter: function (token) {
      return token.type === 'number';
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'F');
      }

      return `${floatVal}F`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/stringify',
    type: 'value',
    filter: function (token) {
      return ['type', 'textCase', 'other'].includes(token.type);
    },
    transform: (token) => {
      return `"${token.value}"`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/fonts/transformToStack',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return FONT_FAMILY_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      if (token.name === 'mono' || token.path.includes('code')) {
        return 'UIFont.monospacedSystemFont(ofSize: 15, weight: .regular)';
      }
      return 'UIFont.systemFont(ofSize: 15)';
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/color',
    type: 'value',
    filter: colorsFilter,
    transform: (token) => {
      return tokenColorToDeviceColor(token.value, DeviceObjectFormat.IOS_SWIFT);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/color/modifiers',
    type: 'value',
    transitive: true,
    filter: colorModifiersFilter,
    transform: (token) => {
      return deviceTransformColorModifiers(token, DeviceObjectFormat.IOS_SWIFT);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/size/pxToCGFloat',
    type: 'value',
    filter: function (token) {
      // Exclude lineHeight dimension tokens - they're handled by dt/ios/lineHeight/percentToDecimal
      if (token.type === 'dimension' && token.path?.includes('lineHeight')) return false;
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'dp');
      }

      return `CGFloat(${(floatVal).toFixed(2)})`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/lineHeight/percentToDecimal',
    type: 'value',
    filter: function (token) {
      // Skip if already transformed to CGFloat
      if (typeof token.value === 'string' && token.value.includes('CGFloat')) return false;
      // Match by type (legacy tokens) or path (DTCG-compliant tokens with type: dimension)
      return ['opacity', ...LINE_HEIGHT_IDENTIFIERS].includes(token.type) ||
        (token.type === 'dimension' && token.path?.includes('lineHeight'));
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      return `CGFloat(${(floatVal).toFixed(2)})`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/lineHeight/percentToDecimal',
    type: 'value',
    filter: function (token) {
      // Match by type (legacy tokens) or path (DTCG-compliant tokens with type: dimension)
      return LINE_HEIGHT_IDENTIFIERS.includes(token.type) ||
        (token.type === 'dimension' && token.path?.includes('lineHeight'));
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      if (floatVal === 0) {
        return '0';
      }

      return `${floatVal / 100}`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/fonts/transformToStack',
    type: 'value',
    filter: function (token) {
      return FONT_FAMILY_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      if (token.name === 'body' || token.name === 'expressive') {
        return `${token.value}, ${FALLBACK_FONTS.join(', ')}`;
      } else if (token.name === 'mono') {
        return `${token.value}, ${FALLBACK_FONTS_MONO.join(', ')}`;
      }
      return token.value;
    },
  });

  // Convert hex color to OKLCH and extract just the hue component (degrees)
  // Used for avatar anchor hue that rotates avatar colors based on theme accent
  const toOklch = converter('oklch');
  styleDictionary.registerTransform({
    name: 'dt/avatar/anchorHue',
    type: 'value',
    transitive: true, // Must be transitive to run after references are resolved
    filter: function (token) {
      // Only apply to avatar.anchor.hue token
      return token.path.join('.') === 'avatar.anchor.hue';
    },
    transform: (token) => {
      const color = parse(token.value);
      if (!color) {
        console.warn(`Could not parse color for avatar anchor hue: ${token.value}`);
        return '0';
      }
      const oklch = toOklch(color);
      // Return just the hue value in degrees, rounded to 1 decimal
      // Handle achromatic colors (undefined hue) by defaulting to 0
      const hue = oklch.h ?? 0;
      return Math.round(hue * 10) / 10;
    },
  });

}

/**
 * Tag every alpha-modified single-ref token whose chain resolves to
 * `color.black.N` with `$extensions.dt.relativeColor = { ref, alpha }`. Pairs
 * with `registerRelativeColorWrap` to emit CSS Color 5 relative-color syntax
 * in CSS output (e.g. `oklch(from var(--dt-color-black-800) l c h / .5)`),
 * letting modified-from-black tokens follow a runtime `--dt-color-black-N`
 * swap instead of being baked at build time.
 *
 * Why it's a preprocessor and not a transform: SD clones tokens between
 * transitive transform passes, so mutating `$extensions` from inside a
 * transform gets reverted. Preprocessors run once before any cloning.
 *
 * Why we leave `studio.tokens.modify` intact: iOS, Android, and JSON
 * pipelines use their own `<platform>/color/modifiers` transforms to apply
 * alpha at build time. They need the original extension. Only the CSS wrap
 * short-circuits on `dt.relativeColor`; non-CSS platforms are unaffected.
 *
 * Scope: alpha modifiers only (any space — alpha math is space-agnostic).
 * The chain may be pure aliases (e.g. `surface.bold = {color.black.300}`,
 * `surface.bold-opaque = alpha(.3, {color.surface.bold})`) or
 * alpha-on-alpha (e.g. `shell.color.border.subtle` chained off the flagged
 * `border.subtle`); both kinds compose via nested `oklch(from …)`.
 *
 * Excluded: candidates with any non-alpha downstream consumer. If we tagged
 * one of those, sd-transforms would later pass our relative-syntax string
 * to colorjs.io's `lighten`/`darken`/`mix` — which can't parse `oklch(from …)`
 * — and throw at build time. The unsafe-set walk in pass 3 prunes them.
 */
function tagRelativeColorChain (dictionary, BLACK_REF) {
  const { alphaTokens, refOf, dependents } = collectChainEdges(dictionary);
  const reachesBlack = transitivelyReaches(refOf, BLACK_REF);
  const unsafe = candidatesWithNonAlphaConsumer(alphaTokens, dependents);

  for (const [name, { node, ref, alpha }] of alphaTokens) {
    if (unsafe.has(name)) continue;
    if (!BLACK_REF.test(ref) && !reachesBlack.has(ref)) continue;
    node.$extensions.dt = node.$extensions.dt || {};
    node.$extensions.dt.relativeColor = { ref, alpha };
  }
  return dictionary;
}

/** Walk the dictionary, building three structures used to compute the flag set:
 *   - alphaTokens: candidates (name → {node, ref, alpha})
 *   - refOf: chain edges that relay relative-syntax (no-modify aliases AND alpha-flagged tokens)
 *   - dependents: reverse-index (ref-target → consumers + their modify) for non-alpha downstream detection */
function collectChainEdges (dictionary) {
  const SINGLE_REF = /^\{([^}]+)\}$/;
  const alphaTokens = new Map();
  const refOf = new Map();
  const dependents = new Map();
  (function recur (node, path) {
    if (!node || typeof node !== 'object') return;
    if (typeof node.value === 'string') {
      const match = SINGLE_REF.exec(node.value.trim());
      if (!match) return;
      const name = path.join('.');
      const ref = match[1];
      const modify = node.$extensions?.['studio.tokens']?.modify;
      const isAlpha = modify?.type === 'alpha';
      // Pure aliases and alpha-flagged tokens both relay the chain;
      // non-alpha modifiers (lighten/darken/mix) break it.
      if (!modify || isAlpha) refOf.set(name, ref);
      if (isAlpha) alphaTokens.set(name, { node, ref, alpha: modify.value });
      if (!dependents.has(ref)) dependents.set(ref, []);
      dependents.get(ref).push({ name, modify });
      return;
    }
    for (const key of Object.keys(node)) recur(node[key], [...path, key]);
  })(dictionary, []);
  return { alphaTokens, refOf, dependents };
}

/** Fixed-point iteration: a chain link is in the set if its ref matches
 *  `rootPattern` directly, or its ref is itself in the set. */
function transitivelyReaches (refOf, rootPattern) {
  const reached = new Set();
  for (let added = true; added;) {
    added = false;
    for (const [name, ref] of refOf) {
      if (reached.has(name)) continue;
      if (rootPattern.test(ref) || reached.has(ref)) {
        reached.add(name);
        added = true;
      }
    }
  }
  return reached;
}

/** Forward DFS from each candidate through `dependents`; mark unsafe if any
 *  reachable consumer carries a non-alpha modifier. */
function candidatesWithNonAlphaConsumer (alphaTokens, dependents) {
  const unsafe = new Set();
  for (const candidate of alphaTokens.keys()) {
    const stack = [candidate];
    const seen = new Set();
    while (stack.length) {
      const cur = stack.pop();
      for (const { name, modify } of dependents.get(cur) || []) {
        if (seen.has(name)) continue;
        seen.add(name);
        if (modify && modify.type !== 'alpha') { unsafe.add(candidate); break; }
        stack.push(name);
      }
      if (unsafe.has(candidate)) break;
    }
  }
  return unsafe;
}

export function registerDialtonePreprocessors (styleDictionary) {
  const BLACK_REF = /^color\.black\.\d+$/;
  styleDictionary.registerPreprocessor({
    name: 'dt/relative-color/extract',
    preprocessor: (dictionary) => tagRelativeColorChain(dictionary, BLACK_REF),
  });
}

/**
 * Re-register sd-transforms' `ts/color/modifiers` with a wrap that emits CSS
 * Color 5 relative-color syntax for tokens flagged by `dt/relative-color/extract`.
 * Re-using the same name preserves the transform's array position, so other
 * modifier shapes (lighten/darken/mix on non-black ramps) continue to flow
 * through sd-transforms' original logic untouched.
 *
 * The wrap declares single-arg lambdas (`(token) => …`) intentionally —
 * sd-transforms's original is single-arg, and SD 4.x infers function arity
 * for some internal invocations. A two-arg form caused transitive resolution
 * of unrelated chart tokens to throw `undefined Lightness in oklch()`.
 */
export function registerRelativeColorWrap (styleDictionary) {
  const original = styleDictionary.hooks.transforms['ts/color/modifiers'];
  styleDictionary.registerTransform({
    ...original,
    name: 'ts/color/modifiers',
    transform: (token) => {
      if (token.$extensions?.dt?.relativeColor) {
        const { ref, alpha } = token.$extensions.dt.relativeColor;
        const cssVar = `--dt-${ref.replace(/\./g, '-')}`;
        return `oklch(from var(${cssVar}) l c h / ${alpha})`;
      }
      return original.transform(token);
    },
  });
}
