#!/usr/bin/env node
/* eslint-disable max-lines */
/* eslint-disable complexity */

/**
 * @fileoverview Migration script to convert legacy typography utility classes to <dt-text> components.
 * Composed classes become a DtText `variant`; override utilities become modifier props.
 *
 * Usage (no standalone bin; run the installed script or the dialtone-migrate runner):
 *   node <dialtone>/lib/dist/js/dialtone_migrate_typography/index.mjs [options]
 *   npx dialtone-migrate --only typography [options]
 *
 * Options:
 *   --cwd <path>        Working directory (default: current directory)
 *   --dry-run           Show changes without applying them
 *   --yes               Apply all changes without prompting
 *   --file <path>       Specific file to process (repeatable)
 *   --remove-markers    Strip all dt-text-migrate review comments
 *   --help              Show help
 *
 * Examples:
 *   node <script> --dry-run --cwd ./src
 *   node <script> --yes
 *   node <script> --remove-markers --cwd ./src
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

//------------------------------------------------------------------------------
// Class-to-Prop Mapping Tables
// Validated against packages/dialtone-tokens/tokens/theme/dp/default.json
// and packages/dialtone-vue/components/Text/TextConstants.js. Each variant renders
// the composition class that the legacy kind + size pair rendered (tests assert this).
//------------------------------------------------------------------------------

// Lookup tables are keyed by class names and attribute values read from the scanned file,
// so they must not inherit Object.prototype keys such as `constructor` or `toString`.
const lookupTable = entries => Object.assign(Object.create(null), entries);

/**
 * Composed typography class → DtText props.
 * Never emit a composition `size` beside `variant`: with a variant, size is a raw
 * font-size override.
 * `flag` marks classes that cannot be safely auto-migrated.
 *   - 'eyebrow' : uses text-transform:uppercase — no DtText prop
 *   - 'code-sm' : font-size below DtText minimum code size
 *   - 'helper'  : approximated as body+density — outputs review marker too
 */
const COMPOSED_CLASS_MAP = lookupTable({
  // headline
  'd-headline--sm':                   { variant: 'headline-xs' },
  'd-headline-small':                 { variant: 'headline-xs' },
  'd-headline--md':                   { variant: 'headline-md' },
  'd-headline-medium':                { variant: 'headline-md' },
  'd-headline--lg':                   { variant: 'headline-xl' },
  'd-headline-large':                 { variant: 'headline-xl' },
  'd-headline--xl':                   { variant: 'headline-2xl' },
  'd-headline-extra-large':           { variant: 'headline-2xl' },
  'd-headline--xxl':                  { variant: 'headline-3xl' },
  'd-headline-extra-extra-large':     { variant: 'headline-3xl' },

  // headline — eyebrow (unmappable: text-transform:uppercase)
  'd-headline--eyebrow':              { flag: 'eyebrow' },
  'd-headline-eyebrow':               { flag: 'eyebrow' },

  // headline — soft variants (strength=medium per token)
  'd-headline--sm-soft':              { variant: 'headline-xs', strength: 'medium' },
  'd-headline-soft-small':            { variant: 'headline-xs', strength: 'medium' },
  'd-headline--lg-soft':              { variant: 'headline-xl', strength: 'medium' },

  // headline — compact variants
  'd-headline--sm-compact':           { variant: 'headline-xs', density: '200' },
  'd-headline-compact-small':         { variant: 'headline-xs', density: '200' },
  'd-headline--md-compact':           { variant: 'headline-md', density: '300' },
  'd-headline-compact-medium':        { variant: 'headline-md', density: '300' },
  'd-headline--lg-compact':           { variant: 'headline-xl', density: '200' },
  'd-headline-compact-large':         { variant: 'headline-xl', density: '200' },
  'd-headline--xl-compact':           { variant: 'headline-2xl', density: '100' },
  'd-headline--xxl-compact':          { variant: 'headline-3xl' }, // same lh=200 as base, no density

  // headline — soft-compact
  'd-headline--sm-soft-compact':      { variant: 'headline-xs', strength: 'medium', density: '200' },
  'd-headline-compact-soft-small':    { variant: 'headline-xs', strength: 'medium', density: '200' },
  'd-headline--lg-soft-compact':      { variant: 'headline-xl', strength: 'medium', density: '200' },

  // body
  'd-body--md':                       { variant: 'body-md' },
  'd-body-base':                      { variant: 'body-md' },
  'd-body--sm':                       { variant: 'body-xs' },
  'd-body-small':                     { variant: 'body-xs' },
  'd-body--md-compact':               { variant: 'body-md', density: '300' },
  'd-body-compact':                   { variant: 'body-md', density: '300' },
  'd-body--sm-compact':               { variant: 'body-xs', density: '200' },
  'd-body-compact-small':             { variant: 'body-xs', density: '200' },

  // label
  'd-label--md':                      { variant: 'label-md' },
  'd-label-base':                     { variant: 'label-md' },
  'd-label--sm':                      { variant: 'label-xs' },
  'd-label-small':                    { variant: 'label-xs' },
  'd-label--md-compact':              { variant: 'label-md', density: '300' },
  'd-label-compact':                  { variant: 'label-md', density: '300' },
  'd-label--sm-compact':              { variant: 'label-xs', density: '200' },
  'd-label-compact-small':            { variant: 'label-xs', density: '200' },
  'd-label--md-plain':                { variant: 'label-md', strength: 'normal' },
  'd-label-plain':                    { variant: 'label-md', strength: 'normal' },
  'd-label--md-plain-compact':        { variant: 'label-md', strength: 'normal', density: '300' },
  'd-label-compact-plain':            { variant: 'label-md', strength: 'normal', density: '300' },
  'd-label--sm-plain':                { variant: 'label-xs', strength: 'normal' },
  'd-label-plain-small':              { variant: 'label-xs', strength: 'normal' },
  'd-label--sm-plain-compact':        { variant: 'label-xs', strength: 'normal', density: '200' },
  'd-label-compact-plain-small':      { variant: 'label-xs', strength: 'normal', density: '200' },

  // code
  'd-code--md':                       { variant: 'code-sm' },
  'd-code-base':                      { variant: 'code-sm' },
  'd-code--sm':                       { flag: 'code-sm' }, // font-size below DtText minimum
  'd-code-small':                     { flag: 'code-sm' },

  // helper — approximated as body+density, flagged for review
  'd-helper--md':                     { variant: 'body-md', density: '300', flag: 'helper' },
  'd-helper-base':                    { variant: 'body-md', density: '300', flag: 'helper' },
  'd-helper--sm':                     { variant: 'body-xs', density: '200', flag: 'helper' },
  'd-helper-small':                   { variant: 'body-xs', density: '200', flag: 'helper' },
});

/**
 * Override utility class → DtText prop name and value.
 * These apply on top of (or independently from) composed class rewrites.
 */
const OVERRIDE_CLASS_MAP = lookupTable({
  // font-weight → strength
  'd-fw-bold':     { prop: 'strength', value: 'bold' },
  'd-fw-semibold': { prop: 'strength', value: 'semibold' },
  'd-fw-medium':   { prop: 'strength', value: 'medium' },
  'd-fw-normal':   { prop: 'strength', value: 'normal' },

  // line-height → density
  'd-lh-100': { prop: 'density', value: '100' },
  'd-lh-200': { prop: 'density', value: '200' },
  'd-lh-300': { prop: 'density', value: '300' },
  'd-lh-400': { prop: 'density', value: '400' },
  'd-lh-500': { prop: 'density', value: '500' },
  'd-lh-600': { prop: 'density', value: '600' },

  // foreground color → tone (1:1 map against TEXT_TONE_MODIFIERS keys)
  'd-fc-primary':          { prop: 'tone', value: 'primary' },
  'd-fc-secondary':        { prop: 'tone', value: 'secondary' },
  'd-fc-tertiary':         { prop: 'tone', value: 'tertiary' },
  'd-fc-muted':            { prop: 'tone', value: 'muted' },
  'd-fc-disabled':         { prop: 'tone', value: 'disabled' },
  'd-fc-placeholder':      { prop: 'tone', value: 'placeholder' },
  'd-fc-critical':         { prop: 'tone', value: 'critical' },
  'd-fc-critical-strong':  { prop: 'tone', value: 'critical-strong' },
  'd-fc-positive':         { prop: 'tone', value: 'positive' },
  'd-fc-positive-strong':  { prop: 'tone', value: 'positive-strong' },
  'd-fc-warning':          { prop: 'tone', value: 'warning' },
  'd-fc-info':             { prop: 'tone', value: 'info' },
  'd-fc-info-strong':      { prop: 'tone', value: 'info-strong' },
  'd-fc-neutral-black':    { prop: 'tone', value: 'neutral-black' },
  'd-fc-neutral-white':    { prop: 'tone', value: 'neutral-white' },

  // truncate
  'd-truncate': { prop: 'truncate', value: null }, // boolean prop — no value

  // text-align → align (logical naming: left→start, right→end)
  'd-ta-left':    { prop: 'align', value: 'start' },
  'd-ta-right':   { prop: 'align', value: 'end' },
  'd-ta-center':  { prop: 'align', value: 'center' },
  'd-ta-justify': { prop: 'align', value: 'justify' },

  // font-family → family. Only the family changes; size, weight and line height still
  // inherit, so it never implies a composition.
  'd-ff-mono':    { prop: 'family', value: 'mono' },
});

// Lifting an override moves it from an !important utility to a normal DtText modifier.
// Inline styles beat the modifier but not the utility, so a style that sets the same
// CSS property makes the lift unsafe.
const OVERRIDE_STYLE_PROPERTIES = lookupTable({
  strength: ['font-weight', 'font'],
  density: ['line-height', 'font'],
  family: ['font-family', 'font'],
  tone: ['color'],
  align: ['text-align'],
  truncate: ['overflow', 'text-overflow', 'white-space'],
});

// DtText values mirrored from packages/dialtone-vue/components/Text/TextConstants.js for
// --validate. The script must not import Vue source at runtime; tests assert parity.
const TEXT_VARIANTS = new Set([
  'headline-3xl', 'headline-2xl', 'headline-xl', 'headline-lg', 'headline-md', 'headline-sm', 'headline-xs',
  'body-lg', 'body-md', 'body-sm', 'body-xs',
  'label-lg', 'label-md', 'label-sm', 'label-xs',
  'code-lg', 'code-md', 'code-sm', 'code-xs',
]);
const TEXT_FAMILIES = new Set(['inherit', 'custom', 'sans', 'mono', 'expressive']);
// Raw font-size tokens: valid `size` values beside a variant, and the d-fs-* utility scale.
const TEXT_FONT_SIZES = new Set([
  '50', '75', '100', '125', '150', '200', '250', '300', '350',
  '400', '450', '500', '550', '600', '650', '700', '750', '800',
]);
// Legacy composition sizes, valid only with kind and no variant.
const TEXT_KIND_SIZES = lookupTable({
  headline: ['700', '600', '500', '400', '300', '200', '100', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'],
  body: ['400', '300', '200', '100', 'lg', 'md', 'sm', 'xs'],
  label: ['400', '300', '200', '100', 'lg', 'md', 'sm', 'xs'],
  code: ['400', '300', '200', '100', 'lg', 'md', 'sm', 'xs'],
});
// DtText prop names mirrored from packages/dialtone-vue/components/Text/Text.vue.
const TEXT_PROPS = new Set([
  'as', 'kind', 'variant', 'size', 'family', 'italic', 'tone', 'align', 'truncate',
  'maxLines', 'numeric', 'wrap', 'textBoxTrim', 'strength', 'density',
]);

// Rewriteable element tags (only these get turned into <dt-text>)
const REWRITEABLE_TAGS = new Set(['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label']);

// Inline-phrasing children that DO NOT disqualify an element from being a text leaf.
// Anything outside this set as a child (block elements, custom components, interactive
// controls, headings, another <p>) signals the element is a wrapper, not text.
const INLINE_PHRASING_TAGS = new Set([
  'span', 'br', 'em', 'strong', 'code', 'i', 'b', 'u', 's',
  'sub', 'sup', 'kbd', 'samp', 'small', 'mark', 'wbr',
  'time', 'data', 'abbr', 'cite', 'q', 'dfn', 'var',
]);

// All recognised class names combined (for safe-to-collapse predicate in Task 4)
const ALL_KNOWN_CLASSES = new Set([
  ...Object.keys(COMPOSED_CLASS_MAP),
  ...Object.keys(OVERRIDE_CLASS_MAP),
]);

// Fast-path: only process files that contain at least one relevant class prefix
const FAST_PATH_RE = /d-headline|d-body|d-label|d-code|d-helper|d-fw-|d-fc-|d-lh-|d-truncate|d-ta-|d-fs-|d-ff-mono/;

//------------------------------------------------------------------------------
// Console helpers (no external deps — mirrors sibling scripts)
//------------------------------------------------------------------------------

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

const log = {
  cyan: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  gray: (msg) => console.log(`${colors.gray}${msg}${colors.reset}`),
  red: (msg) => `${colors.red}${msg}${colors.reset}`,
  green: (msg) => `${colors.green}${msg}${colors.reset}`,
  yellow: (msg) => `${colors.yellow}${msg}${colors.reset}`,
  bold: (msg) => console.log(`${colors.bold}${msg}${colors.reset}`),
};

//------------------------------------------------------------------------------
// Inert content masking — prevent transforms inside <script>, <style>, comments
//------------------------------------------------------------------------------

/**
 * Replace <script>, <style>, and HTML comment regions with compact placeholders
 * so regex passes don't alter their contents. Placeholders are inert tokens that
 * don't collide with any HTML/Vue syntax we care about, and never truncated.
 */
function maskInertContent (content) {
  const segments = [];
  let masked = content;
  const token = `\x00MASK_${Date.now()}_`;
  const endToken = '_KSAM\x00';

  const inertPatterns = [
    /<script[\s\S]*?<\/script>/gi,
    /<style[\s\S]*?<\/style>/gi,
    /<!--[\s\S]*?-->/g,
  ];

  for (const pattern of inertPatterns) {
    masked = masked.replace(pattern, (match) => {
      const idx = segments.length;
      segments.push(match);
      return `${token}${idx}${endToken}`;
    });
  }

  return { masked, segments, token, endToken };
}

/**
 * Restore masked segments back to their original content.
 */
function unmaskInertContent (content, segments, token, endToken, restore = () => true) {
  return content.replace(
    new RegExp(`${escapeRe(token)}(\\d+)${escapeRe(endToken)}`, 'g'),
    (match, idx) => (restore(segments[Number(idx)]) ? segments[Number(idx)] : match),
  );
}

function escapeRe (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//------------------------------------------------------------------------------
// Core transform (exported for testing)
//------------------------------------------------------------------------------

/**
 * Transform typography utility classes in a file's content.
 *
 * @param {string} content - Raw file content (.vue or .html)
 * @param {object} opts
 * @param {string} [opts.filePath] - For warnings/notes
 * @returns {{ transformed: string, warnings: string[], notes: string[] }}
 */
export function transformContent (content, opts = {}) {
  const filePath = opts.filePath || '<input>';

  if (!FAST_PATH_RE.test(content)) {
    return { transformed: content, warnings: [], notes: [] };
  }

  const warnings = [];
  const notes = [];

  const { masked, segments, token, endToken } = maskInertContent(content);

  let out = masked;

  // Task 2: composed class rewrite — implemented in subsequent tasks
  out = rewriteComposedClasses(out, filePath, warnings, notes);

  // Task 3: override utility extraction + already-DtText residual lift
  out = liftResidualOverrides(out, filePath, warnings, notes);

  // Task 4: nested-span collapse + dynamic class / d-fs-* flagging
  out = collapseNestedSpans(out, filePath, warnings, notes);
  out = flagDynamicClasses(out, filePath, warnings, notes);
  // Task 4b: composed typography classes on tags outside our rewrite scope
  // (dt-* components, <a>, <button>, custom elements). Emit marker to surface them.
  out = flagComposedOnWrapperTags(out, filePath, warnings, notes);
  // Legacy heading hint runs BEFORE flagFontSizeClasses — when both fire, the richer
  // hint wins (flagFontSizeClasses skips if any dt-text-migrate comment already exists nearby).
  out = flagLegacyHeadings(out, filePath, warnings, notes);
  out = flagFontSizeClasses(out, filePath, warnings, notes);

  // Idempotency: a marker from a prior run is masked as a comment, so passes emit it
  // again on rerun. Restore comments to drop repeats within each run of adjacent markers,
  // inline or own-line, while <script> and <style> stay masked: a marker-like string there
  // is application data.
  const withComments = unmaskInertContent(out, segments, token, endToken, segment => segment.startsWith('<!--'));
  const transformed = unmaskInertContent(deduplicateAdjacentMarkers(withComments), segments, token, endToken);

  return { transformed, warnings, notes };
}

// Markers always precede the element they describe, so a marker repeated within one
// whitespace-separated run of markers is a rerun duplicate: earlier markers are masked
// as comments, so the passes cannot see them and emit them again. Drop the repeat, with
// its line when it has a line to itself. Any other content, including an unrelated
// comment, ends the run and is never touched.
function deduplicateAdjacentMarkers (content) {
  const removals = [];
  let seen = new Set();
  let previousEnd = -1;
  for (const m of content.matchAll(/<!--\s*dt-text-migrate:[\s\S]*?-->/g)) {
    const start = m.index;
    const end = start + m[0].length;
    if (previousEnd === -1 || /\S/.test(content.slice(previousEnd, start))) seen = new Set();
    previousEnd = end;
    if (!seen.has(m[0])) {
      seen.add(m[0]);
      continue;
    }
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = content.indexOf('\n', end);
    const ownLine = lineEnd !== -1 &&
      !/\S/.test(content.slice(lineStart, start)) && !/\S/.test(content.slice(end, lineEnd));
    removals.push(ownLine ? [lineStart, lineEnd + 1] : [start, end]);
  }
  let out = content;
  for (const [start, end] of removals.reverse()) out = out.slice(0, start) + out.slice(end);
  return out;
}

//------------------------------------------------------------------------------
// Task 2 — composed class rewrite
//------------------------------------------------------------------------------

// Quote-aware attribute body — matches non-`>` non-quote chars, or a complete "..." string,
// or a complete '...' string. Used in place of `[^>]*?` for opening-tag matching so that
// expressions like `:disabled="i > total"` or `:title="a > b"` don't terminate the tag at
// the inner `>`. The `*?` keeps it non-greedy.
const ATTR_BODY = `(?:[^>"']|"[^"]*"|'[^']*')*?`;

/**
 * Regex: matches rewriteable opening tags carrying a static class attribute.
 * Groups: 1=tag, 2=attrs-before-class, 3=class-value, 4=attrs-after-class, 5=self-closing
 * Skips elements with a dynamic :class or v-bind:class (handled in Task 4).
 *
 * Uses ATTR_BODY (quote-aware) to skip over `>` inside quoted attr values.
 * Uses `\sclass=` (not `\bclass=`) — `\b` matches inside attrs like `font-size-class=`,
 * `content-class=`, `heading-class=` because `-c` is a word boundary. Requiring a leading
 * whitespace anchors `class` as a standalone attribute name.
 */
const ELEMENT_RE = new RegExp(
  `<(p|span|div|h[1-6]|label|dt-text|DtText)(${ATTR_BODY})\\sclass="([^"]*)"(${ATTR_BODY})(\\/?)>`,
  'g',
);

/**
 * Find the matching closing tag for an element, depth-counting nested same tags.
 * Ported from dialtone_migrate_flex_to_stack/index.mjs.
 */
function findMatchingClosingTag (content, startPos, tagName) {
  let depth = 1;
  let pos = startPos;

  const openPattern = new RegExp(`<${escapeRe(tagName)}(?:\\s[^>]*?)?>`);
  const selfClosePattern = new RegExp(`<${escapeRe(tagName)}(?:\\s[^>]*?)?/>`);
  const closePattern = new RegExp(`</${escapeRe(tagName)}>`);

  while (depth > 0 && pos < content.length) {
    const slice = content.slice(pos);
    const openMatch = slice.match(openPattern);
    const selfCloseMatch = slice.match(selfClosePattern);
    const closeMatch = slice.match(closePattern);

    if (!closeMatch) return null;

    const closePos = pos + closeMatch.index;
    let openPos = openMatch ? pos + openMatch.index : Infinity;

    if (selfCloseMatch && openMatch && selfCloseMatch.index === openMatch.index) {
      openPos = Infinity;
    }

    if (openPos < closePos) {
      depth++;
      pos = openPos + openMatch[0].length;
    } else {
      depth--;
      if (depth === 0) {
        return { index: closePos, length: closeMatch[0].length };
      }
      pos = closePos + closeMatch[0].length;
    }
  }

  return null;
}

const CONFLICT_MARKER = '<!-- dt-text-migrate: review conflicting class -->';
const NATIVE_PROP_MARKER = '<!-- dt-text-migrate: review attribute that may become a DtText prop -->';
const ALL_OVERRIDE_PROPS = new Set(Object.values(OVERRIDE_CLASS_MAP).map(override => override.prop));

// Attribute names in an opening tag's attribute text. Quoted values are blanked first so
// text inside a value never reads as an attribute.
function attributeNames (attrStr) {
  const stripped = attrStr.replace(/"[^"]*"|'[^']*'/g, '""');
  return [...stripped.matchAll(/(?:^|\s)([^\s=/>"']+)/g)].map(m => m[1]);
}

// The DtText prop an attribute binds: `size`, `:size`, `v-bind:size`, `.size`,
// `:size.prop` and `v-model:size` all bind size.
function boundProp (name) {
  return name.replace(/^(?::|\.|v-bind:|v-model:)/, '').split('.')[0];
}

// Object spreads and dynamic argument names can supply any prop, or a style.
function hasUncertainBinding (names) {
  return names.some(name => name === 'v-bind' || name.startsWith('v-bind.') ||
    /^(?::|\.|v-bind:|v-model:)\[/.test(name));
}

function hasAuthoredComposition (names) {
  return names.some(name => ['kind', 'size', 'variant', 'family'].includes(boundProp(name)));
}

// A native element ignores attributes named like DtText props, but converting it makes
// them props: a size becomes a raw font-size override, a second variant duplicates the
// attribute and `as` changes the tag. A spread or dynamic name may supply any of them.
function mayBecomeTextProp (names) {
  return hasUncertainBinding(names) ||
    names.some(name => TEXT_PROPS.has(boundProp(name).replace(/-(\w)/g, (_, c) => c.toUpperCase())));
}

// Props the element already authors, in any binding form: { [prop]: true }.
function parseExistingProps (names) {
  const props = Object.create(null);
  for (const name of names) props[boundProp(name)] = true;
  return props;
}

// Override props that cannot be lifted safely because an inline style may set the same
// CSS property: all of them for a bound style or spread, otherwise the ones the static
// style declares.
function blockedOverrideProps (attrStr, names) {
  // Any bound form counts, modifiers included: Vue compiles `:style.camel` to a style binding.
  if (hasUncertainBinding(names) || names.some(name => name !== 'style' && boundProp(name) === 'style')) {
    return ALL_OVERRIDE_PROPS;
  }
  const style = /(?:^|\s)style\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(attrStr);
  if (!style) return new Set();
  // Drop CSS comments, but not comment delimiters inside quoted strings (escapes respected).
  // String contents are blanked so a `;` or `:` inside one never reads as a declaration.
  const declarations = (style[1] ?? style[2]).replace(
    /("(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*')|\/\*[\s\S]*?\*\//g,
    (_, string) => (string ? '\'\'' : ' '),
  );
  const declared = new Set(
    [...declarations.matchAll(/(?:^|;)\s*([\w-]+)\s*:/g)].map(m => m[1].toLowerCase()),
  );
  if (declared.has('all')) return ALL_OVERRIDE_PROPS; // `all` resets every property
  return new Set(Object.keys(OVERRIDE_STYLE_PROPERTIES)
    .filter(prop => OVERRIDE_STYLE_PROPERTIES[prop].some(property => declared.has(property))));
}

/**
 * Split a class list into liftable override props and the classes to keep.
 * A prop stays as its utility class (and sets `conflict`) when the element already
 * authors it, when `blocked` marks it unsafe, or when utilities disagree on its value.
 * The class is kept because it may be what wins in CSS today.
 * Returns { overrideProps: [{prop, value}], remaining: string[], conflict: boolean }.
 */
function extractOverrideProps (classes, authored = {}, blocked = new Set()) {
  const byProp = new Map();
  for (const cls of classes) {
    const override = OVERRIDE_CLASS_MAP[cls];
    if (!override) continue;
    if (!byProp.has(override.prop)) byProp.set(override.prop, []);
    byProp.get(override.prop).push(cls);
  }

  const overrideProps = [];
  const kept = new Set();
  for (const [prop, list] of byProp) {
    const values = new Set(list.map(cls => OVERRIDE_CLASS_MAP[cls].value));
    if (prop in authored || blocked.has(prop) || values.size > 1) {
      list.forEach(cls => kept.add(cls));
      continue;
    }
    overrideProps.push({ prop, value: OVERRIDE_CLASS_MAP[list[0]].value });
  }

  const remaining = classes.filter(cls => !OVERRIDE_CLASS_MAP[cls] || kept.has(cls));
  return { overrideProps, remaining, conflict: kept.size > 0 };
}

// Canonical prop order: as → variant → family → strength → density → tone → align →
// truncate → class. Directives, data attributes and events follow from the original tag.
const PROP_ORDER = ['variant', 'family', 'strength', 'density', 'tone', 'align', 'truncate'];

/**
 * Build a <dt-text> opening tag from a composed-class mapping entry, the classes left
 * after removing composed classes, and the element's other attributes.
 */
function buildDtTextTag (opts) {
  const { originalTag, entry, retainedClasses, attrsBefore, attrsAfter, selfClosing, authored, blocked } = opts;
  const { overrideProps, remaining, conflict } = extractOverrideProps(retainedClasses, authored, blocked);

  const finalProps = { variant: entry.variant };
  for (const prop of ['strength', 'density']) {
    // Authored DtText props already beat the composed class in CSS (components layer
    // over base), so the generated default yields to them.
    if (entry[prop] && !(prop in authored)) finalProps[prop] = entry[prop];
  }
  // Override utilities are !important, so they also beat the composition's defaults:
  // d-fw-bold on a soft headline renders bold today.
  for (const { prop, value } of overrideProps) finalProps[prop] = value;

  let tag = '<dt-text';

  // `as` prop — omit when original tag is span or dt-text (DtText default)
  if (originalTag !== 'span' && originalTag !== 'dt-text' && originalTag !== 'DtText') {
    tag += ` as="${originalTag}"`;
  }

  for (const prop of PROP_ORDER) {
    if (!(prop in finalProps)) continue;
    const value = finalProps[prop];
    tag += value === null ? ` ${prop}` : ` ${prop}="${value}"`; // null → boolean prop (truncate)
  }

  if (remaining.length > 0) {
    tag += ` class="${remaining.join(' ')}"`;
  }

  if (attrsBefore) tag += ` ${attrsBefore}`;
  if (attrsAfter) tag += ` ${attrsAfter}`;

  return (conflict ? CONFLICT_MARKER : '') + tag + (selfClosing ? ' />' : '>');
}

// True if any class signals layout intent (display utility).
// `<div class="d-d-flex d-body--md">` is a flex container, not a text element.
function hasLayoutDisplaySignal (classes) {
  return classes.some(c => /^d-d-/.test(c));
}

// True if the element body contains a child tag that disqualifies the parent
// from being a text leaf. Block elements, custom components (dt-*, kebab-case),
// interactive controls, headings, another <p>, and <dt-text> all count.
// Inline phrasing children (span, em, strong, br, etc.) do NOT disqualify.
// Strips quoted attribute values first so a tag-like string in an attr (e.g.
// `<span title="<dt-button>">`) does not false-match as a real child.
function hasBlockOrComponentChild (body) {
  if (!body) return false;
  const stripped = body.replace(/"[^"]*"|'[^']*'/g, '');
  const tagOpens = stripped.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)\b/g);
  for (const m of tagOpens) {
    if (!INLINE_PHRASING_TAGS.has(m[1].toLowerCase())) return true;
  }
  return false;
}

// Composed classes collapse only when every mapping field matches.
function sameMapping (a, b) {
  return ['variant', 'strength', 'density', 'flag'].every(key => a[key] === b[key]);
}

function rewriteComposedClasses (content) {
  const elementRe = new RegExp(ELEMENT_RE.source, 'g');
  const replacements = [];
  const mark = (start, review) => replacements.push({
    start,
    end: start,
    replacement: `<!-- dt-text-migrate: ${review} -->`,
  });

  let m;
  while ((m = elementRe.exec(content)) !== null) {
    const [fullMatch, tagName, attrsBefore, classValue, attrsAfter, selfClosing] = m;

    // Skip elements that already have a dynamic :class binding — Task 4 handles those
    if (/(?:^|\s):class\b|(?:^|\s)v-bind:class\b/.test(attrsBefore + attrsAfter)) continue;

    const classes = classValue.split(/\s+/).filter(Boolean);
    const composed = classes.filter(cls => COMPOSED_CLASS_MAP[cls]);
    if (composed.length === 0) continue;

    const isDtText = tagName === 'dt-text' || tagName === 'DtText';
    const openStart = m.index;
    const openEnd = m.index + fullMatch.length;
    const entry = COMPOSED_CLASS_MAP[composed[0]];
    const attrs = `${attrsBefore} ${attrsAfter}`;
    const names = attributeNames(attrs);

    // Different compositions on one element: class order does not decide CSS precedence,
    // so there is no safe single variant.
    if (!composed.every(cls => sameMapping(COMPOSED_CLASS_MAP[cls], entry))) {
      mark(openStart, 'review multiple composed classes');
      continue;
    }

    // An authored composition, or a spread or dynamic name that may supply one, would sit
    // beside the generated variant and turn its size into a raw font-size override.
    if (isDtText && (hasAuthoredComposition(names) || hasUncertainBinding(names))) {
      mark(openStart, 'review composed class with authored composition');
      continue;
    }
    if (!isDtText && mayBecomeTextProp(names)) {
      replacements.push({ start: openStart, end: openStart, replacement: NATIVE_PROP_MARKER });
      continue;
    }

    // Flagged classes are never rewritten. Check them before the wrapper test: a child this
    // run converts to <dt-text> would make the element look like a wrapper on the next run.
    if (entry.flag === 'eyebrow' || entry.flag === 'code-sm') {
      mark(openStart, 'review');
      continue;
    }

    const isSelfClosing = selfClosing === '/';
    const closing = isSelfClosing ? null : findMatchingClosingTag(content, openEnd, tagName);
    const retainedClasses = classes.filter(cls => !COMPOSED_CLASS_MAP[cls]);

    // Wrapper safety: skip auto-convert when a native element looks like a layout
    // container or contains non-text children. The marker keeps the legacy class visible
    // in the migration diff; the consumer migrates it manually.
    const elementBody = closing ? content.slice(openEnd, closing.index) : '';
    if (!isDtText && (hasLayoutDisplaySignal(retainedClasses) || hasBlockOrComponentChild(elementBody))) {
      mark(openStart, 'review composed class on wrapper');
      continue;
    }

    const newTag = buildDtTextTag({
      originalTag: tagName,
      entry,
      retainedClasses,
      attrsBefore: attrsBefore.trim(),
      attrsAfter: attrsAfter.trim(),
      selfClosing: isSelfClosing,
      authored: parseExistingProps(names),
      blocked: blockedOverrideProps(attrs, names),
    });
    const helperMarker = entry.flag === 'helper' ? '<!-- dt-text-migrate: review helper -->' : '';
    replacements.push({ start: openStart, end: openEnd, replacement: helperMarker + newTag });
    if (closing) {
      replacements.push({ start: closing.index, end: closing.index + closing.length, replacement: '</dt-text>' });
    }
  }

  if (replacements.length === 0) return content;

  // Sort descending by start position, apply
  replacements.sort((a, b) => b.start - a.start);

  let out = content;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.replacement + out.slice(r.end);
  }

  return out;
}

//------------------------------------------------------------------------------
// Task 3 — override extraction + already-DtText residual lift
//------------------------------------------------------------------------------

/**
 * Build the opening tag for a residual lift on an existing <dt-text>: lifted props are
 * appended, the class attribute keeps only the remaining classes.
 */
function buildResidualTag (tagName, existingAttrs, overrideProps, remaining, selfClosing) {
  // Strip the original class attribute — we'll rebuild it if remaining is non-empty
  let attrs = existingAttrs.replace(/\sclass="[^"]*"/, '').trimEnd();

  for (const { prop, value } of overrideProps) {
    attrs += value === null ? ` ${prop}` : ` ${prop}="${value}"`;
  }

  if (remaining.length > 0) {
    attrs += ` class="${remaining.join(' ')}"`;
  }

  return `<${tagName}${attrs}${selfClosing ? ' />' : '>'}`;
}

function liftResidualOverrides (content) {
  // Match <dt-text>, <DtText>, and rewriteable tags that survived Task 2 (override-only elements)
  // Quote-aware via ATTR_BODY — same reasoning as ELEMENT_RE above
  const re = new RegExp(
    `<(dt-text|DtText|p|span|div|h[1-6]|label)(${ATTR_BODY})\\sclass="([^"]*)"(${ATTR_BODY})(\\/?)>`,
    'g',
  );
  const replacements = [];

  let m;
  while ((m = re.exec(content)) !== null) {
    const [fullMatch, tagName, attrsBefore, classValue, attrsAfter, selfClosing] = m;
    const isSelfClosing = selfClosing === '/';
    const openStart = m.index;
    const openEnd = m.index + fullMatch.length;

    const isDtText = tagName === 'dt-text' || tagName === 'DtText';
    const isNative = REWRITEABLE_TAGS.has(tagName.toLowerCase());

    // Skip elements with dynamic :class binding
    if (/(?:^|\s):class\b|(?:^|\s)v-bind:class\b/.test(attrsBefore + attrsAfter)) continue;

    const classes = classValue.split(/\s+/).filter(Boolean);

    // Check if any class is an override utility
    const hasOverride = classes.some(c => OVERRIDE_CLASS_MAP[c]);
    if (!hasOverride) continue;

    // A composed class still present was rejected or protected by rewriteComposedClasses
    // (or is on a native tag it handles); review must see that tag unchanged.
    if (classes.some(c => COMPOSED_CLASS_MAP[c])) continue;

    const attrs = `${attrsBefore} ${attrsAfter}`;
    const names = attributeNames(attrs);
    const lift = () => extractOverrideProps(classes, parseExistingProps(names), blockedOverrideProps(attrs, names));

    if (isDtText) {
      const { overrideProps, remaining, conflict } = lift();
      if (overrideProps.length === 0) {
        // Nothing to lift: leave the tag byte-for-byte so reruns stay identical.
        if (conflict) replacements.push({ start: openStart, end: openStart, replacement: CONFLICT_MARKER });
        continue;
      }

      replacements.push({
        start: openStart,
        end: openEnd,
        replacement: (conflict ? CONFLICT_MARKER : '') +
          buildResidualTag(tagName, attrsBefore + attrsAfter, overrideProps, remaining, isSelfClosing),
      });

    } else if (isNative) {
      // ⚠️ Without a composed class there is no composition to establish. Converting
      // <div>/<h*> to <dt-text> would attach the .d-text base class which changes baseline
      // typography — problematic for layout wrappers (e.g. <div class="d-fc-neutral-white">
      // around a stack). Restrict override-only rewriting to <span>/<p>/<label>, where the
      // result keeps inheriting typography and only the atomic props apply.
      const OVERRIDE_ONLY_REWRITEABLE = new Set(['span', 'p', 'label']);
      if (!OVERRIDE_ONLY_REWRITEABLE.has(tagName.toLowerCase())) continue;

      if (mayBecomeTextProp(names)) {
        replacements.push({ start: openStart, end: openStart, replacement: NATIVE_PROP_MARKER });
        continue;
      }

      // Skip elements with behavioral attrs — directives, events, id, ref, data-*
      // mean the element has significance beyond typography (e.g. <span @click>, <span id="x">)
      const allAttrs = attrs.trim();
      if (/(?:v-|@\w|:(?!class)|\bid=|\bref=|\bdata-)/.test(allAttrs)) continue;

      // Skip if any class is unrecognised — custom CSS may target it, unsafe to auto-convert
      if (classes.some(c => !ALL_KNOWN_CLASSES.has(c))) continue;

      // Wrapper safety: skip if element body contains block/component children.
      // <span class="d-fw-bold"><dt-button>x</dt-button></span> should NOT become
      // <dt-text strength="bold"><dt-button>…</dt-text>. (Mirrors the composed-path safety.)
      const closing = isSelfClosing ? null : findMatchingClosingTag(content, openEnd, tagName);
      if (closing && hasBlockOrComponentChild(content.slice(openEnd, closing.index))) continue;

      const { overrideProps, remaining, conflict } = lift();
      if (overrideProps.length === 0) {
        if (conflict) replacements.push({ start: openStart, end: openStart, replacement: CONFLICT_MARKER });
        continue;
      }

      let newTag = (conflict ? CONFLICT_MARKER : '') + '<dt-text';
      if (tagName !== 'span') newTag += ` as="${tagName}"`;

      for (const { prop, value } of overrideProps) {
        newTag += value === null ? ` ${prop}` : ` ${prop}="${value}"`;
      }

      if (remaining.length > 0) newTag += ` class="${remaining.join(' ')}"`;
      if (attrsBefore.trim()) newTag += ` ${attrsBefore.trim()}`;
      if (attrsAfter.trim()) newTag += ` ${attrsAfter.trim()}`;
      newTag += isSelfClosing ? ' />' : '>';

      replacements.push({ start: openStart, end: openEnd, replacement: newTag });

      if (closing) {
        replacements.push({
          start: closing.index,
          end: closing.index + closing.length,
          replacement: '</dt-text>',
        });
      }
    }
  }

  if (replacements.length === 0) return content;

  replacements.sort((a, b) => b.start - a.start);
  let out = content;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.replacement + out.slice(r.end);
  }
  return out;
}

//------------------------------------------------------------------------------
// Task 4 — nested-span collapse + flagging
//------------------------------------------------------------------------------

/**
 * Determine if a <span> opening tag is safe to collapse.
 * Safe = exactly one attribute (class), all classes are in ALL_KNOWN_CLASSES,
 * no Vue directives or event handlers.
 */
function isSafeToCollapseSpan (fullTag) {
  // Must not have any directive, event, binding, id, ref, or data attr
  const unsafePattern = /\bv-|@\w|:class\b|v-bind:class\b|\bid=|\bref=|\bdata-/;
  if (unsafePattern.test(fullTag)) return false;

  // Extract class value (anchored on whitespace so we don't match label-class=, etc.)
  const classMatch = fullTag.match(/\sclass="([^"]*)"/);
  if (!classMatch) return false;

  // Must have ONLY a class attribute (besides whitespace)
  const withoutClass = fullTag
    .replace(/\sclass="[^"]*"/, '')
    .replace(/<\/?span/g, '')
    .replace(/\s*\/?>/, '')
    .trim();
  if (withoutClass.length > 0) return false;

  const classes = classMatch[1].split(/\s+/).filter(Boolean);
  return classes.length > 0 && classes.every(c => ALL_KNOWN_CLASSES.has(c));
}

/**
 * Rewrite a safe child span to <dt-text> carrying only its override props. Without a
 * composition it keeps inheriting the parent's typography.
 */
function rewriteChildSpan (overrideProps, remaining) {
  let tag = '<dt-text';
  for (const { prop, value } of overrideProps) {
    tag += value === null ? ` ${prop}` : ` ${prop}="${value}"`;
  }
  if (remaining.length > 0) tag += ` class="${remaining.join(' ')}"`;
  return tag + '>';
}

function collapseNestedSpans (content) {
  // Match opening dt-text tags (quote-aware), then process the body up to the
  // DEPTH-MATCHED closing </dt-text>. The body boundary is critical when a parent
  // dt-text contains another dt-text — naive first-match would truncate the parent
  // body at the inner close, silently skipping spans that follow.
  const dtTextRe = new RegExp(`<dt-text(${ATTR_BODY})>`, 'g');
  let m;
  const replacements = [];
  // The span scan below covers the whole body, nested <dt-text> included, so edit each
  // body once through its outermost ancestor: overlapping body replacements would apply
  // the outer one with stale offsets and corrupt the template.
  let coveredEnd = -1;

  while ((m = dtTextRe.exec(content)) !== null) {
    if (m.index < coveredEnd) continue;
    const openEnd = m.index + m[0].length;
    const closing = findMatchingClosingTag(content, openEnd, 'dt-text');
    if (!closing) continue;
    coveredEnd = closing.index;
    const bodyStart = openEnd;
    const bodyEnd = closing.index;
    const body = content.slice(bodyStart, bodyEnd);

    // Find direct child <span> tags in the body (quote-aware)
    const childSpanRe = new RegExp(`<span(${ATTR_BODY})>`, 'g');
    let sm;
    const spanReplacements = [];

    while ((sm = childSpanRe.exec(body)) !== null) {
      const spanTag = sm[0];
      const spanOpenEnd = sm.index + spanTag.length;
      const classes = (spanTag.match(/\sclass="([^"]*)"/)?.[1] ?? '').split(/\s+/).filter(Boolean);

      // rewriteComposedClasses already converted or reviewed every composed span. One
      // still here was rejected there (wrapper, multiple compositions, flag) and must
      // not be retried.
      if (classes.some(c => COMPOSED_CLASS_MAP[c])) continue;
      // liftResidualOverrides already kept this span for its attributes.
      if (body.slice(0, sm.index).endsWith(NATIVE_PROP_MARKER)) continue;

      // Find the depth-matched </span> (handles nested <span>...<span>...</span>...</span>)
      const closingSpan = findMatchingClosingTag(body, spanOpenEnd, 'span');
      const spanBody = closingSpan ? body.slice(spanOpenEnd, closingSpan.index) : '';

      if (isSafeToCollapseSpan(spanTag) && !hasBlockOrComponentChild(spanBody)) {
        const { overrideProps, remaining, conflict } = extractOverrideProps(classes);
        // liftResidualOverrides already marked conflicting spans for review.
        if (conflict || overrideProps.length === 0) continue;
        spanReplacements.push({
          start: sm.index,
          end: spanOpenEnd,
          replacement: rewriteChildSpan(overrideProps, remaining),
        });
        if (closingSpan) {
          spanReplacements.push({
            start: closingSpan.index,
            end: closingSpan.index + closingSpan.length,
            replacement: '</dt-text>',
          });
        }
      } else if (classes.some(c => ALL_KNOWN_CLASSES.has(c))) {
        // Typography classes on a span we cannot convert safely — flag it
        spanReplacements.push({
          start: sm.index,
          end: sm.index,
          replacement: '<!-- dt-text-migrate: review nested span -->',
        });
      }
    }

    if (spanReplacements.length > 0) {
      spanReplacements.sort((a, b) => b.start - a.start);
      let newBody = body;
      for (const r of spanReplacements) {
        newBody = newBody.slice(0, r.start) + r.replacement + newBody.slice(r.end);
      }
      replacements.push({ start: bodyStart, end: bodyEnd, replacement: newBody });
    }
  }

  if (replacements.length === 0) return content;
  replacements.sort((a, b) => b.start - a.start);
  let out = content;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.replacement + out.slice(r.end);
  }
  return out;
}

// Note: this pattern must be created fresh (new RegExp) in the function below — never
// use a module-level /g regex with .test(), as lastIndex state persists across calls.
const DYNAMIC_CLASS_PATTERN = '(?::class|v-bind:class)="[^"]*(?:d-headline|d-body|d-label|d-code|d-helper|d-fw-|d-fc-|d-lh-|d-truncate|d-ta-)[^"]*"';

function flagDynamicClasses (content) {
  const re = new RegExp(DYNAMIC_CLASS_PATTERN);
  if (!re.test(content)) return content;

  // Walk whole opening tags (quote-aware) so the marker is never injected between
  // attributes of a multi-line element. The old line-by-line approach would insert
  // the comment before the :class= line, which lands it between attributes when the
  // opening tag spans multiple lines.
  const tagRe = new RegExp(`<[a-zA-Z][\\w-]*(${ATTR_BODY})>`, 'g');
  const insertions = [];
  let m;

  while ((m = tagRe.exec(content)) !== null) {
    if (!new RegExp(DYNAMIC_CLASS_PATTERN).test(m[0])) continue;
    const before = content.slice(Math.max(0, m.index - 80), m.index);
    if (/<!--\s*dt-text-migrate:\s*review dynamic class\s*-->/.test(before)) continue;
    insertions.push(m.index);
  }

  if (insertions.length === 0) return content;

  let out = content;
  for (const idx of insertions.reverse()) {
    const lineStart = out.lastIndexOf('\n', idx - 1) + 1;
    const indent = out.slice(lineStart, idx).match(/^[ \t]*/)[0];
    const marker = `${indent}<!-- dt-text-migrate: review dynamic class -->\n`;
    out = out.slice(0, lineStart) + marker + out.slice(lineStart);
  }
  return out;
}

// Find composed typography classes on tags outside the rewrite scope
// (dt-* components, <a>, <button>, other custom elements). Emit a marker
// so the legacy class surfaces in the migration diff instead of being silently
// passed over. Tags ARE in the rewrite scope (p/span/div/h1-6/label/dt-text)
// are handled by rewriteComposedClasses + liftResidualOverrides.
function flagComposedOnWrapperTags (content) {
  const tagRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9-]*)(${ATTR_BODY})\\sclass="([^"]*)"(${ATTR_BODY})\\/?>`,
    'g',
  );
  const insertions = [];
  let m;
  while ((m = tagRe.exec(content)) !== null) {
    const [, tagName, , classValue] = m;
    const tagLower = tagName.toLowerCase();
    if (REWRITEABLE_TAGS.has(tagLower)) continue;
    if (tagLower === 'dt-text' || tagName === 'DtText') continue;
    const classes = classValue.split(/\s+/).filter(Boolean);
    const hasComposed = classes.some(c => COMPOSED_CLASS_MAP[c]);
    if (!hasComposed) continue;
    // Idempotency: skip if our marker is already on the preceding line/inline
    const before = content.slice(Math.max(0, m.index - 80), m.index);
    if (/<!--\s*dt-text-migrate:\s*review composed class on wrapper tag\s*-->/.test(before)) continue;
    insertions.push(m.index);
  }
  if (insertions.length === 0) return content;
  let out = content;
  for (const idx of insertions.reverse()) {
    // Place marker on its own line above, preserving indentation
    const lineStart = out.lastIndexOf('\n', idx - 1) + 1;
    const indent = out.slice(lineStart, idx).match(/^[ \t]*/)[0];
    const marker = `${indent}<!-- dt-text-migrate: review composed class on wrapper tag -->\n`;
    out = out.slice(0, lineStart) + marker + out.slice(lineStart);
  }
  return out;
}

// Describe a d-fs-N class without inferring a composition from font size. Beside a
// variant, size="N" is a raw font-size override; without one, it has nothing to apply to.
function fontSizeHint (fsN, hasVariant) {
  if (!TEXT_FONT_SIZES.has(fsN)) return 'no matching DtText size token; keep class';
  return hasVariant
    ? `raw font-size token; size="${fsN}" can replace it alongside variant`
    : `raw font-size token; size="${fsN}" needs a variant, which font size alone does not determine`;
}

function flagFontSizeClasses (content) {
  // Iterate over real opening tags using a quote-aware regex so we never land
  // inside a quoted attribute value (e.g. `title="a < b"`). Walking back with
  // lastIndexOf('<') from a `class=` match is unsafe because `<` can appear
  // inside `v-if="rowCount < total"` style bindings.
  const tagRe = new RegExp(`<([a-zA-Z][\\w-]*)(${ATTR_BODY})\\sclass="([^"]*)"(${ATTR_BODY})\\/?>`, 'g');
  const replacements = [];
  let m;

  while ((m = tagRe.exec(content)) !== null) {
    const [, tagName, attrsBefore, classValue, attrsAfter] = m;
    const tagStart = m.index;

    // Only act on class attributes containing d-fs-N
    const fsMatch = classValue.match(/\bd-fs-(\d+)\b/);
    if (!fsMatch) continue;

    const fsN = fsMatch[1];
    const isDtText = tagName === 'dt-text' || tagName === 'DtText';
    const hasVariant = isDtText &&
      attributeNames(`${attrsBefore} ${attrsAfter}`).some(name => boundProp(name) === 'variant');
    const hint = `<!-- dt-text-migrate: review d-fs-${fsN} (${fontSizeHint(fsN, hasVariant)}) -->`;

    // Suppress only when a legacy-heading hint ends immediately before this tag: it already
    // describes the d-fs class. Other markers don't, and on a rerun they are masked, so
    // suppressing on them would emit the hint only on the second run.
    const immediatelyBefore = content.slice(Math.max(0, tagStart - 500), tagStart);
    const alreadyFlagged = /<!--\s*dt-text-migrate:\s*legacy heading[\s\S]*?-->\s*$/.test(immediatelyBefore);
    if (!alreadyFlagged) {
      replacements.push({ start: tagStart, end: tagStart, replacement: hint });
    }
  }

  if (replacements.length === 0) return content;
  replacements.sort((a, b) => b.start - a.start);
  let out = content;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.replacement + out.slice(r.end);
  }
  return out;
}

/**
 * Detect the legacy raw-utility heading pattern (no composed class, but d-fw-* +
 * d-fc-* + d-fs-N built up by hand on a rewriteable native tag) and emit a hint
 * comment for the DtText migration. Font size and weight alone cannot choose a
 * variant, so the hint leaves that step to the reviewer.
 *
 * The element is NOT rewritten; the developer reviews and applies. Cleanly removed by
 * --remove-markers.
 */
function flagLegacyHeadings (content) {
  // Match rewriteable native elements with a static class attribute
  // Quote-aware via ATTR_BODY — same reasoning as ELEMENT_RE above
  const re = new RegExp(
    `<(p|span|div|h[1-6]|label)(${ATTR_BODY})\\sclass="([^"]*)"(${ATTR_BODY})(\\/?)>`,
    'g',
  );
  const replacements = [];
  let m;

  while ((m = re.exec(content)) !== null) {
    const [, tagName, attrsBefore, classValue, attrsAfter] = m;
    const classes = classValue.split(/\s+/).filter(Boolean);

    // Skip if there's a composed class (Task 2 handled it)
    if (classes.some(c => COMPOSED_CLASS_MAP[c])) continue;

    // Skip if dynamic class binding present
    if (/(?:^|\s):class\b|(?:^|\s)v-bind:class\b/.test(attrsBefore + attrsAfter)) continue;

    // The signature: at least one d-fw-* AND one d-fs-N together (heading-builder pattern)
    const fwMatch = classes.find(c => /^d-fw-(bold|semibold|medium|normal)$/.test(c));
    const fsMatch = classes.find(c => /^d-fs-\d+$/.test(c));
    if (!fwMatch || !fsMatch) continue;

    // Skip if the element was already rewritten/flagged just before this position
    const beforeTag = content.slice(Math.max(0, m.index - 120), m.index);
    if (beforeTag.includes('dt-text-migrate:')) continue;

    // Build hint
    const strength = fwMatch.replace('d-fw-', '');
    const fsN = fsMatch.replace('d-fs-', '');
    const fcMatch = classes.find(c => OVERRIDE_CLASS_MAP[c] && OVERRIDE_CLASS_MAP[c].prop === 'tone');
    const tone = fcMatch ? OVERRIDE_CLASS_MAP[fcMatch].value : null;

    // A heading tag suggests a headline variant; its size step still needs review.
    const isHeadingTag = /^h[1-6]$/.test(tagName);
    const variantHint = isHeadingTag ? 'variant=headline-? (VERIFY)' : 'variant=? (VERIFY: headline, body or label)';
    const sizeHint = TEXT_FONT_SIZES.has(fsN)
      ? `d-fs-${fsN} is a raw font-size token (size="${fsN}" once a variant is set)`
      : `d-fs-${fsN} has no matching DtText size token (keep class)`;

    const parts = [];
    if (!isHeadingTag) parts.push(`as=${tagName}`);
    parts.push(variantHint, sizeHint, `strength=${strength}`);
    if (tone) parts.push(`tone=${tone}`);

    const hint = `<!-- dt-text-migrate: legacy heading — ${parts.join(' | ')} -->`;

    replacements.push({ start: m.index, end: m.index, replacement: hint });
  }

  if (replacements.length === 0) return content;
  replacements.sort((a, b) => b.start - a.start);
  let out = content;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.replacement + out.slice(r.end);
  }
  return out;
}

//------------------------------------------------------------------------------
// File utilities
//------------------------------------------------------------------------------

async function findFiles (dir, extensions, ignore = []) {
  const results = [];

  async function walk (currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (ignore.some(ig => fullPath.includes(ig))) continue;
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    } catch {
      // skip unreadable dirs
    }
  }

  await walk(dir);
  return results;
}

async function validateAndResolveFiles (filePaths, extensions) {
  const resolved = [];
  for (const fp of filePaths) {
    const abs = path.isAbsolute(fp) ? fp : path.resolve(process.cwd(), fp);
    try {
      const stat = await fs.stat(abs);
      if (!stat.isFile()) continue;
      if (!extensions.some(ext => abs.endsWith(ext))) continue;
      resolved.push(abs);
    } catch {
      // ignore missing
    }
  }
  return resolved;
}

//------------------------------------------------------------------------------
// Import detection (ported from flex-to-stack)
//------------------------------------------------------------------------------

export function detectImportPathFor (content, packageName) {
  return detectImportPattern(content, packageName);
}

/**
 * @param {string} content - File content
 * @param {string} [packageName] - Explicit package name (e.g. @dialpad/dialtone-next).
 *   When provided, it is used verbatim, overriding the heuristics below. This lets
 *   consumers running Dialtone under a custom package alias inject the correct import.
 */
function detectImportPattern (content, packageName) {
  // Explicit override: honor the caller-provided package name.
  if (packageName) return packageName;

  if (content.includes('from \'@/components/')) return '@/components/text';
  if (content.includes('from \'./\'')) return './';
  if (content.includes('from \'@dialpad/dialtone-vue') || content.includes('from \'@dialpad/dialtone-icons')) {
    return '@dialpad/dialtone-vue';
  }
  return '@/components/text';
}

function detectMissingDtTextImport (content, usesText, packageName) {
  if (!usesText) return null;
  const hasImport = /import\s+(?:\{[^}]*\bDtText\b[^}]*\}|DtText)\s+from/.test(content);
  if (hasImport) return null;
  return {
    needsImport: true,
    suggestedPath: detectImportPattern(content, packageName),
    hasComponentsObject: /components:\s*\{/.test(content),
  };
}

/**
 * Attempt to auto-insert a component import (and Options API registration) into a Vue SFC.
 * Returns updated content on success, or null when the insertion can't be made safely
 * (caller should fall back to printing manual instructions).
 *
 * Handles:
 *   - <script setup>: inserts import after the last existing import; no components
 *     registration needed (auto-registered when imported in setup context).
 *   - Options API with existing `components: {}`: inserts import + adds to the object.
 *   - Options API without a components object: returns null (manual step required).
 */
export function injectComponentImport (content, componentName, importPath) {
  if (new RegExp(`import\\s+(?:\\{[^}]*\\b${componentName}\\b[^}]*\\}|${componentName})\\s+from`).test(content)) {
    return null; // already imported
  }

  const isScriptSetup = /<script\b[^>]*\bsetup\b/.test(content);
  const scriptBlockRe = isScriptSetup
    ? /<script\b[^>]*\bsetup\b[^>]*>([\s\S]*?)<\/script>/
    : /<script\b(?![^>]*\bsetup\b)[^>]*>([\s\S]*?)<\/script>/;
  const scriptMatch = scriptBlockRe.exec(content);
  if (!scriptMatch) return null;

  const scriptInnerStart = scriptMatch.index + scriptMatch[0].indexOf('>') + 1;
  const scriptInner = scriptMatch[1];

  const importLineRe = /^import\s.+from\s+['"][^'"]+['"]\s*;?/gm;
  let lastImportMatch = null;
  let m;
  while ((m = importLineRe.exec(scriptInner)) !== null) lastImportMatch = m;

  const insertOffset = lastImportMatch
    ? scriptInnerStart + lastImportMatch.index + lastImportMatch[0].length
    : scriptInnerStart;

  const importLine = `\nimport { ${componentName} } from '${importPath}';`;
  let out = content.slice(0, insertOffset) + importLine + content.slice(insertOffset);

  if (isScriptSetup) return out; // import alone is sufficient for <script setup>

  // Options API: also register in components: {}
  // Re-exec against the updated content to get current positions, then restrict
  // the components: { search to within the script block and after export default
  // to avoid matching template bindings or helper objects that appear earlier.
  const scriptMatchUpdated = scriptBlockRe.exec(out);
  if (!scriptMatchUpdated) return null;
  const scriptBodyStart = scriptMatchUpdated.index + scriptMatchUpdated[0].indexOf('>') + 1;
  const scriptBodyText = scriptMatchUpdated[1];
  const exportDefaultMatch = /\bexport\s+default\b/.exec(scriptBodyText);
  if (!exportDefaultMatch) return null;
  const searchFrom = scriptBodyStart + exportDefaultMatch.index;
  const compMatchInSlice = /components\s*:\s*\{/.exec(out.slice(searchFrom));
  if (!compMatchInSlice) return null; // no components object — can't safely auto-register
  const compAbsIndex = searchFrom + compMatchInSlice.index;

  const lineStart = out.lastIndexOf('\n', compAbsIndex) + 1;
  const compIndent = out.slice(lineStart, compAbsIndex).match(/^[ \t]*/)[0];
  const memberIndent = compIndent + '  ';
  const insertAt = compAbsIndex + compMatchInSlice[0].length;
  out = out.slice(0, insertAt) + `\n${memberIndent}${componentName},` + out.slice(insertAt);

  return out;
}

function printImportInstructions (filePath, importCheck) {
  console.log(log.yellow('\n⚠️  ACTION REQUIRED: Add DtText import and registration'));
  log.cyan(`   File: ${filePath}`);
  console.log();
  log.gray('   Add this import to your <script> block:');
  console.log(log.green(`   import { DtText } from '${importCheck.suggestedPath}';`));
  console.log();
  if (importCheck.hasComponentsObject) {
    log.gray('   Add to your components object:');
    console.log(log.green('   components: {'));
    console.log(log.green('     // ... existing components'));
    console.log(log.green('     DtText,'));
    console.log(log.green('   },'));
  } else {
    log.gray('   Create or update your components object:');
    console.log(log.green('   export default {'));
    console.log(log.green('     components: { DtText },'));
    console.log(log.green('     // ... rest of your component'));
    console.log(log.green('   };'));
  }
  console.log();
}

//------------------------------------------------------------------------------
// --validate mode: detect post-migration DtText prop bugs
//------------------------------------------------------------------------------

const VALID_STRENGTHS = new Set(['bold', 'semibold', 'medium', 'normal']);
const VALID_DENSITIES = new Set(['100', '200', '300', '400', '500', '600']);
const VALID_ALIGNS = new Set(['start', 'center', 'end', 'justify']);
const VALID_STATIC_VALUES = {
  kind: new Set(Object.keys(TEXT_KIND_SIZES)),
  variant: TEXT_VARIANTS,
  family: TEXT_FAMILIES,
  strength: VALID_STRENGTHS,
  density: VALID_DENSITIES,
  align: VALID_ALIGNS,
};

// Size depends on context, as in DtText: beside a variant it is a raw font-size token;
// with kind alone, a composition size; with neither, DtText ignores it. Bound values and
// spreads stay unknown rather than guessed.
function sizeIssue (names, values) {
  const binds = prop => names.some(name => boundProp(name) === prop);
  if (!binds('size') || hasUncertainBinding(names)) return null;

  if (binds('variant')) {
    if (!('variant' in values) || !('size' in values) || TEXT_FONT_SIZES.has(values.size)) return null;
    return {
      type: 'invalid-value',
      message: `size="${values.size}" with variant must be a font-size token (expected one of: ${[...TEXT_FONT_SIZES].join(', ')}).`,
    };
  }

  if (binds('kind')) {
    const allowed = TEXT_KIND_SIZES[values.kind];
    if (!allowed || !('size' in values) || allowed.includes(values.size)) return null;
    return {
      type: 'invalid-value',
      message: `size="${values.size}" is not valid for kind="${values.kind}" (expected one of: ${allowed.join(', ')}).`,
    };
  }

  return {
    type: 'size-without-composition',
    message: 'size needs a variant (or legacy kind); without one DtText ignores it.',
  };
}

/**
 * Scan a file's content for DtText prop bugs. Returns array of issues with line numbers.
 * Issue types:
 *   - object-syntax — `:tone="{ muted: cond }"` style (CSS-class binding misapplied to prop)
 *   - invalid-value — `density="160"`, `variant="title-md"`, a size invalid in its context
 *   - size-without-composition — size with no variant or kind to apply to
 *   - mixed-class — DtText with `class="d-fw-bold"` or another typography utility
 */
export function validateDtTextProps (content) {
  const issues = [];

  // Compute inert regions (script/style/comments) over the ORIGINAL content so we
  // can both skip false positives AND keep accurate line numbers. maskInertContent
  // emits compact tokens that change offsets — using its masked output would produce
  // wrong line numbers when a large script/comment precedes a real <dt-text> tag.
  const inertRanges = [];
  for (const pattern of [/<script[\s\S]*?<\/script>/gi, /<style[\s\S]*?<\/style>/gi, /<!--[\s\S]*?-->/g]) {
    let im;
    while ((im = pattern.exec(content)) !== null) {
      inertRanges.push([im.index, im.index + im[0].length]);
    }
  }
  const isInsideInert = (idx) => inertRanges.some(([s, e]) => idx >= s && idx < e);

  // Quote-aware tag scan so `:title="a > b"` doesn't truncate the attr capture
  const tagRe = new RegExp(`<(?:dt-text|DtText)\\b(${ATTR_BODY})>`, 'g');
  let m;
  while ((m = tagRe.exec(content)) !== null) {
    if (isInsideInert(m.index)) continue;
    const attrStr = m[1];
    const lineNum = content.slice(0, m.index).split('\n').length;
    const tagSnippet = m[0].length > 120 ? m[0].slice(0, 117) + '...' : m[0];
    const report = (type, message) => issues.push({ type, line: lineNum, message, snippet: tagSnippet });

    // Object syntax detection: any prop bound with `:prop="{...}"`
    const objectSyntaxRe = /:(\w[\w-]*)="\s*\{/g;
    let osm;
    while ((osm = objectSyntaxRe.exec(attrStr)) !== null) {
      const propName = osm[1];
      // Only flag known string props (where object syntax is wrong)
      if (['tone', 'kind', 'variant', 'family', 'size', 'strength', 'density', 'align', 'as'].includes(propName)) {
        report('object-syntax',
          `:${propName}="{ ... }" uses CSS-class syntax — DtText expects a string. Use :${propName}="cond ? 'value' : undefined" instead.`);
      }
    }

    // Static-value validation — anchor on whitespace so we don't match `:prop=` (bound)
    const values = {};
    const staticPropRe = /\s(kind|variant|family|size|strength|density|align)\s*=\s*"([^"]+)"/g;
    let spm;
    while ((spm = staticPropRe.exec(attrStr)) !== null) {
      const [, propName, value] = spm;
      values[propName] = value;
      const validSet = VALID_STATIC_VALUES[propName];
      if (validSet && !validSet.has(value)) {
        report('invalid-value', `${propName}="${value}" is not a valid value (expected one of: ${[...validSet].join(', ')}).`);
      }
    }

    const size = sizeIssue(attributeNames(attrStr), values);
    if (size) report(size.type, size.message);

    // Mixed class detection: DtText with class= containing typography utilities
    const classM = attrStr.match(/\sclass="([^"]*)"/);
    if (classM) {
      const offenders = classM[1].split(/\s+/).filter(c => ALL_KNOWN_CLASSES.has(c));
      if (offenders.length > 0) {
        report('mixed-class', `DtText carries typography utility classes [${offenders.join(', ')}] — lift to props instead.`);
      }
    }
  }

  return issues;
}

//------------------------------------------------------------------------------
// --remove-markers cleanup mode
//------------------------------------------------------------------------------

export const removeMarkersForTest = removeMarkers;

function removeMarkers (content) {
  // Strip dt-text-migrate comment markers.
  // Own-line: marker + its trailing newline becomes empty (also drop leading indent on that line).
  // Inline: marker is removed in-place, preserving surrounding whitespace.
  // Use [\s\S]*? (non-greedy) so the legacy-heading hint's inline `<dt-text ...>` markup
  // inside the comment doesn't terminate the match early at the first `>`.
  return content
    .replace(/^[ \t]*<!--\s*dt-text-migrate:[\s\S]*?-->[ \t]*\n/gm, '')
    .replace(/<!--\s*dt-text-migrate:[\s\S]*?-->/g, '');
}

//------------------------------------------------------------------------------
// File processing
//------------------------------------------------------------------------------

async function prompt (question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function processFile (filePath, options) {
  const content = await fs.readFile(filePath, 'utf-8');

  if (options.validate) {
    // Read-only: scan for post-migration DtText prop bugs
    const issues = validateDtTextProps(content);
    if (issues.length === 0) return { changes: 0, needsImport: false, validateIssues: 0 };
    log.cyan(`\n📄 ${filePath}`);
    for (const issue of issues) {
      const color = issue.type === 'object-syntax' || issue.type === 'invalid-value' ? log.red : log.yellow;
      console.log(color(`   [${issue.type}] line ${issue.line}: ${issue.message}`));
      log.gray(`     ${issue.snippet}`);
    }
    return { changes: 0, needsImport: false, validateIssues: issues.length };
  }

  if (options.removeMarkers) {
    const cleaned = removeMarkers(content);
    if (cleaned === content) return { changes: 0, needsImport: false };
    log.cyan(`\n📄 ${filePath}`);
    if (!options.dryRun) {
      await fs.writeFile(filePath, cleaned, 'utf-8');
      console.log(log.green('   ✓ Markers removed'));
    }
    return { changes: 1, needsImport: false };
  }

  if (!FAST_PATH_RE.test(content)) return { changes: 0, needsImport: false };

  const { transformed, notes } = transformContent(content, {
    filePath: path.relative(options.cwd || process.cwd(), filePath),
  });

  if (transformed === content) return { changes: 0, needsImport: false };

  log.cyan(`\n📄 ${filePath}`);

  if (options.dryRun) {
    log.gray(`   Would apply changes`);
    return { changes: 1, needsImport: false };
  }

  let shouldApply = options.yes;

  if (!shouldApply) {
    const answer = await prompt('   Apply? [y]es / [n]o / [a]ll / [q]uit: ');
    if (answer === 'q' || answer === 'quit') process.exit(0);
    if (answer === 'a' || answer === 'all') { options.yes = true; shouldApply = true; }
    if (answer === 'y' || answer === 'yes') shouldApply = true;
  }

  if (!shouldApply) return { changes: 0, needsImport: false };

  // Only warn about missing DtText import when we actually INSERTED new <dt-text> elements
  // — review-marker-only changes (eyebrow/d-code--sm/d-fs-* flags) don't require an import.
  // Use a count delta (not boolean presence) so partial migrations on a file that already
  // had a <dt-text> still warn when more are added.
  const beforeCount = (content.match(/<dt-text\b/g) || []).length;
  const afterCount = (transformed.match(/<dt-text\b/g) || []).length;
  const addedDtText = afterCount > beforeCount;
  // Auto-inject DtText import before writing; fall back to manual instructions if needed.
  // Skipped entirely when --no-import is set (e.g. DtText is globally registered).
  const importCheck = options.noImport ? null : detectMissingDtTextImport(transformed, addedDtText, options.package);

  let finalContent = transformed;
  if (importCheck?.needsImport) {
    const injected = injectComponentImport(transformed, 'DtText', importCheck.suggestedPath);
    if (injected) finalContent = injected;
  }

  await fs.writeFile(filePath, finalContent, 'utf-8');

  if (importCheck?.needsImport) {
    if (finalContent !== transformed) {
      console.log(log.green('   ✓ Saved + added DtText import'));
    } else {
      console.log(log.green('   ✓ Saved'));
      printImportInstructions(filePath, importCheck);
    }
  } else {
    console.log(log.green('   ✓ Saved'));
  }

  if (notes.length > 0) {
    for (const note of notes) log.gray(`   ℹ ${note}`);
  }

  return { changes: 1, needsImport: importCheck?.needsImport && finalContent === transformed };
}

//------------------------------------------------------------------------------
// Argument parsing
//------------------------------------------------------------------------------

function parseArgs () {
  const args = process.argv.slice(2);
  const options = {
    cwd: process.cwd(),
    dryRun: false,
    yes: false,
    extensions: ['.vue', '.html'],
    files: [],
    removeMarkers: false,
    validate: false,
    noImport: false, // Skip import injection (for apps that globally register DtText)
    package: null, // Override the package name used for injected DtText imports
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: node <path-to-this-script> [options]
       npx dialtone-migrate --only typography [options]

Migrates legacy typography utility classes to <dt-text> components. Composed classes
(d-headline--*, d-body--*, d-label--*, d-code--md) become a variant prop; override
utilities become strength, density, tone, align, truncate and family props.
Existing DtText kind + size pairs are left for: npx dialtone-migrate --only text-variant

Options:
  --cwd <path>        Working directory (default: current directory)
  --file <path>       Specific file to process (repeatable)
  --dry-run           Show changes without applying them
  --yes, -y           Apply all changes without prompting
  --remove-markers    Strip all <!-- dt-text-migrate: review ... --> comments
  --validate          Read-only mode: scan existing <dt-text> for prop bugs
                      (object syntax, invalid values, size without a variant or kind,
                      mixed CSS classes)
  --no-import         Skip import injection (use when DtText is globally registered)
  --package <name>    Package name for injected DtText imports
                      (default: @dialpad/dialtone-vue when a Dialtone import is detected).
                      Use when Dialtone runs under a custom alias, e.g. @dialpad/dialtone-next.
  --help, -h          Show help

Examples (installed script path: lib/dist/js/dialtone_migrate_typography/index.mjs in
@dialpad/dialtone-css, or dist/js/dialtone_migrate_typography/index.mjs in @dialpad/dialtone):
  node <script> --dry-run --cwd ./src
  node <script> --yes
  node <script> --file src/Foo.vue --dry-run
  node <script> --remove-markers --cwd ./src

Post-Migration Steps:
  1. Add DtText imports as instructed by the script (skipped with --no-import)
  2. Review files marked with <!-- dt-text-migrate: review --> comments
  3. Run with --remove-markers to clean up all markers after manual review
`);
      process.exit(0);
    }

    if (arg === '--cwd' && args[i + 1]) {
      options.cwd = path.resolve(args[++i]);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (arg === '--file' && args[i + 1]) {
      options.files.push(args[++i]);
    } else if (arg === '--remove-markers') {
      options.removeMarkers = true;
    } else if (arg === '--validate') {
      options.validate = true;
    } else if (arg === '--no-import') {
      options.noImport = true;
    } else if (arg === '--package') {
      // Reject a missing value or one that is really the next option (e.g.
      // `--package --yes`) so an invalid alias is never recorded.
      const value = args[i + 1];
      if (!value || value.startsWith('-')) {
        console.error('\n  --package requires a package name (e.g. --package @dialpad/dialtone-next)\n');
        process.exit(1);
      }
      options.package = args[++i];
    }
  }

  return options;
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

async function main () {
  const options = parseArgs();

  log.bold('\n🔄 Typography Migration Tool\n');

  if (options.removeMarkers) {
    log.gray('Mode: Remove dt-text-migrate markers');
  } else if (options.dryRun) {
    console.log(log.yellow('DRY RUN - no files will be modified'));
  } else if (options.yes) {
    console.log(log.yellow('AUTO-APPLY - all changes applied without prompts'));
  }

  let files;
  if (options.files.length > 0) {
    files = await validateAndResolveFiles(options.files, options.extensions);
  } else {
    log.gray(`Working directory: ${options.cwd}`);
    files = await findFiles(options.cwd, options.extensions, ['node_modules', 'dist', 'coverage', '.git']);
  }

  log.gray(`Found ${files.length} file(s) to scan\n`);

  if (files.length === 0) {
    console.log(log.yellow('No files found.'));
    return;
  }

  let totalChanges = 0;
  let totalValidateIssues = 0;
  let filesWithIssues = 0;
  let filesNeedingImports = 0;
  const importList = [];

  for (const file of files) {
    const result = await processFile(file, { ...options });
    totalChanges += result.changes;
    if (result.validateIssues) {
      totalValidateIssues += result.validateIssues;
      filesWithIssues++;
    }
    if (result.needsImport) {
      filesNeedingImports++;
      importList.push(file);
    }
  }

  log.bold('\n📊 Summary\n');
  console.log(`   Files scanned: ${files.length}`);
  if (options.validate) {
    console.log(`   Files with issues: ${filesWithIssues}`);
    console.log(`   Total issues: ${totalValidateIssues}`);
    if (totalValidateIssues === 0) console.log(log.green('   ✓ No DtText prop bugs detected'));
  } else if (options.removeMarkers) {
    console.log(`   Files cleaned: ${totalChanges}`);
  } else {
    console.log(`   Files changed: ${totalChanges}`);
  }

  if (filesNeedingImports > 0 && !options.dryRun) {
    console.log(log.yellow(`\n⚠️  ${filesNeedingImports} file(s) need DtText import/registration`));
    importList.forEach(f => log.gray(`   [ ] ${f}`));
  }

  if (options.dryRun && totalChanges > 0) {
    console.log(log.yellow('\n   Run without --dry-run to apply changes.'));
  }

  console.log();
}

const isDirectRun = (() => {
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  main().catch((error) => {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
    process.exit(1);
  });
}
