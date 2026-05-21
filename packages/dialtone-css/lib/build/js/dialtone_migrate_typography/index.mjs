#!/usr/bin/env node
/* eslint-disable max-lines */
/* eslint-disable complexity */

/**
 * @fileoverview Migration script to convert legacy typography utility classes to <dt-text> components.
 *
 * Usage:
 *   npx dialtone-migrate-typography [options]
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
 *   npx dialtone-migrate-typography --dry-run --cwd ./src
 *   npx dialtone-migrate-typography --yes
 *   npx dialtone-migrate-typography --remove-markers --cwd ./src
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

//------------------------------------------------------------------------------
// Class-to-Prop Mapping Tables
// Validated against packages/dialtone-tokens/tokens/theme/dp/default.json
// and packages/dialtone-vue/components/Text/TextConstants.js (2026-05-19)
//------------------------------------------------------------------------------

/**
 * Composed typography class → DtText props.
 * `flag` marks classes that cannot be safely auto-migrated.
 *   - 'eyebrow' : uses text-transform:uppercase — no DtText prop
 *   - 'code-sm' : font-size below DtText minimum code size
 *   - 'helper'  : approximated as body+density — outputs review marker too
 */
const COMPOSED_CLASS_MAP = {
  // headline
  'd-headline--sm':                   { kind: 'headline', size: '100' },
  'd-headline-small':                 { kind: 'headline', size: '100' },
  'd-headline--md':                   { kind: 'headline', size: '300' },
  'd-headline-medium':                { kind: 'headline', size: '300' },
  'd-headline--lg':                   { kind: 'headline', size: '500' },
  'd-headline-large':                 { kind: 'headline', size: '500' },
  'd-headline--xl':                   { kind: 'headline', size: '600' },
  'd-headline-extra-large':           { kind: 'headline', size: '600' },
  'd-headline--xxl':                  { kind: 'headline', size: '700' },
  'd-headline-extra-extra-large':     { kind: 'headline', size: '700' },

  // headline — eyebrow (unmappable: text-transform:uppercase)
  'd-headline--eyebrow':              { flag: 'eyebrow' },
  'd-headline-eyebrow':               { flag: 'eyebrow' },

  // headline — soft variants (strength=medium per token)
  'd-headline--sm-soft':              { kind: 'headline', size: '100', strength: 'medium' },
  'd-headline-soft-small':            { kind: 'headline', size: '100', strength: 'medium' },
  'd-headline--lg-soft':              { kind: 'headline', size: '500', strength: 'medium' },

  // headline — compact variants
  'd-headline--sm-compact':           { kind: 'headline', size: '100', density: '200' },
  'd-headline-compact-small':         { kind: 'headline', size: '100', density: '200' },
  'd-headline--md-compact':           { kind: 'headline', size: '300', density: '300' },
  'd-headline-compact-medium':        { kind: 'headline', size: '300', density: '300' },
  'd-headline--lg-compact':           { kind: 'headline', size: '500', density: '200' },
  'd-headline-compact-large':         { kind: 'headline', size: '500', density: '200' },
  'd-headline--xl-compact':           { kind: 'headline', size: '600', density: '100' },
  'd-headline--xxl-compact':          { kind: 'headline', size: '700' }, // same lh=200 as base, no density

  // headline — soft-compact
  'd-headline--sm-soft-compact':      { kind: 'headline', size: '100', strength: 'medium', density: '200' },
  'd-headline-compact-soft-small':    { kind: 'headline', size: '100', strength: 'medium', density: '200' },
  'd-headline--lg-soft-compact':      { kind: 'headline', size: '500', strength: 'medium', density: '200' },

  // body
  'd-body--md':                       { kind: 'body', size: '300' },
  'd-body-base':                      { kind: 'body', size: '300' },
  'd-body--sm':                       { kind: 'body', size: '100' },
  'd-body-small':                     { kind: 'body', size: '100' },
  'd-body--md-compact':               { kind: 'body', size: '300', density: '300' },
  'd-body-compact':                   { kind: 'body', size: '300', density: '300' },
  'd-body--sm-compact':               { kind: 'body', size: '100', density: '200' },
  'd-body-compact-small':             { kind: 'body', size: '100', density: '200' },

  // label
  'd-label--md':                      { kind: 'label', size: '300' },
  'd-label-base':                     { kind: 'label', size: '300' },
  'd-label--sm':                      { kind: 'label', size: '100' },
  'd-label-small':                    { kind: 'label', size: '100' },
  'd-label--md-compact':              { kind: 'label', size: '300', density: '300' },
  'd-label-compact':                  { kind: 'label', size: '300', density: '300' },
  'd-label--sm-compact':              { kind: 'label', size: '100', density: '200' },
  'd-label-compact-small':            { kind: 'label', size: '100', density: '200' },
  'd-label--md-plain':                { kind: 'label', size: '300', strength: 'normal' },
  'd-label-plain':                    { kind: 'label', size: '300', strength: 'normal' },
  'd-label--md-plain-compact':        { kind: 'label', size: '300', strength: 'normal', density: '300' },
  'd-label-compact-plain':            { kind: 'label', size: '300', strength: 'normal', density: '300' },
  'd-label--sm-plain':                { kind: 'label', size: '100', strength: 'normal' },
  'd-label-plain-small':              { kind: 'label', size: '100', strength: 'normal' },
  'd-label--sm-plain-compact':        { kind: 'label', size: '100', strength: 'normal', density: '200' },
  'd-label-compact-plain-small':      { kind: 'label', size: '100', strength: 'normal', density: '200' },

  // code
  'd-code--md':                       { kind: 'code', size: '200' },
  'd-code-base':                      { kind: 'code', size: '200' },
  'd-code--sm':                       { flag: 'code-sm' }, // font-size below DtText minimum
  'd-code-small':                     { flag: 'code-sm' },

  // helper — approximated as body+density, flagged for review
  'd-helper--md':                     { kind: 'body', size: '300', density: '300', flag: 'helper' },
  'd-helper-base':                    { kind: 'body', size: '300', density: '300', flag: 'helper' },
  'd-helper--sm':                     { kind: 'body', size: '100', density: '200', flag: 'helper' },
  'd-helper-small':                   { kind: 'body', size: '100', density: '200', flag: 'helper' },
};

/**
 * Override utility class → DtText prop name and value.
 * These apply on top of (or independently from) composed class rewrites.
 */
const OVERRIDE_CLASS_MAP = {
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

  // font-family → kind (special: establishes monospace text kind)
  'd-ff-mono':    { prop: 'kind', value: 'code' },
};

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
function unmaskInertContent (content, segments, token, endToken) {
  return content.replace(
    new RegExp(`${escapeRe(token)}(\\d+)${escapeRe(endToken)}`, 'g'),
    (_, idx) => segments[Number(idx)],
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

  const unmasked = unmaskInertContent(out, segments, token, endToken);

  // Idempotency: collapse consecutive identical dt-text-migrate own-line markers.
  // This handles the re-run case where a marker emitted by a prior run gets masked
  // (since it's an HTML comment) and the same marker is re-emitted by flagDynamicClasses
  // / flagLegacyHeadings on the same target line.
  const transformed = deduplicateAdjacentMarkers(unmasked);

  return { transformed, warnings, notes };
}

function deduplicateAdjacentMarkers (content) {
  const lines = content.split('\n');
  const out = [];
  const markerRe = /^\s*<!--\s*dt-text-migrate:[\s\S]*?-->\s*$/;
  for (const line of lines) {
    const prev = out[out.length - 1];
    // Drop this line if it's a dt-text-migrate marker identical (trimmed) to the previous emitted line
    if (prev && markerRe.test(line) && markerRe.test(prev) && line.trim() === prev.trim()) continue;
    out.push(line);
  }
  return out.join('\n');
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

/**
 * Split a class list into override props + remaining classes.
 * Returns { overrideProps: [{prop, value}], remaining: string[], conflictClasses: string[] }
 * `conflictClasses` are override classes whose prop already exists in existingProps.
 */
function extractOverrideProps (classes, existingProps = {}) {
  const overrideProps = [];
  const remaining = [];
  const conflictClasses = [];

  for (const cls of classes) {
    const override = OVERRIDE_CLASS_MAP[cls];
    if (!override) {
      remaining.push(cls);
      continue;
    }
    const { prop, value } = override;
    if (prop in existingProps) {
      // Conflict — explicit prop takes precedence, flag the class
      conflictClasses.push(cls);
      continue;
    }
    // Avoid duplicates
    if (!overrideProps.some(p => p.prop === prop)) {
      overrideProps.push({ prop, value });
    }
  }

  return { overrideProps, remaining, conflictClasses };
}

/**
 * Build a <dt-text> opening tag from the resolved props + retained classes + other attrs.
 * Also extracts any override utility classes from retainedClasses and lifts them to props.
 */
function buildDtTextTag (opts) {
  const { originalTag, kind, size, density, strength, retainedClasses, attrsBefore, attrsAfter, selfClosing } = opts;

  // Extract the existing props so we can detect conflicts
  const existingProps = {};
  if (kind) existingProps.kind = kind;
  if (size) existingProps.size = size;
  if (strength) existingProps.strength = strength;
  if (density) existingProps.density = density;

  const { overrideProps, remaining, conflictClasses } = extractOverrideProps(retainedClasses, existingProps);

  // Consolidate props into canonical order matching beacon's convention:
  // as → kind → size → strength → density → tone → align → boolean (truncate, numeric) → class
  // (directives/data-attrs/events flow through attrsBefore/attrsAfter from the original tag)
  const finalProps = {};
  if (kind) finalProps.kind = kind;
  if (size) finalProps.size = size;
  if (strength) finalProps.strength = strength;
  if (density) finalProps.density = density;
  for (const { prop, value } of overrideProps) {
    // Override classes win over composed defaults if conflicting (e.g. d-fw-bold overrides headline-soft's medium)
    finalProps[prop] = value;
  }

  let tag = '<dt-text';

  // `as` prop — omit when original tag is span or dt-text (DtText default)
  if (originalTag !== 'span' && originalTag !== 'dt-text' && originalTag !== 'DtText') {
    tag += ` as="${originalTag}"`;
  }

  // Canonical order
  const PROP_ORDER = ['kind', 'size', 'strength', 'density', 'tone', 'align', 'truncate', 'numeric'];
  for (const prop of PROP_ORDER) {
    if (!(prop in finalProps)) continue;
    const value = finalProps[prop];
    if (value === null) {
      tag += ` ${prop}`; // boolean prop (e.g. truncate)
    } else {
      tag += ` ${prop}="${value}"`;
    }
  }

  if (remaining.length > 0) {
    tag += ` class="${remaining.join(' ')}"`;
  }

  if (attrsBefore) tag += ` ${attrsBefore}`;
  if (attrsAfter) tag += ` ${attrsAfter}`;

  const openTag = tag + (selfClosing ? ' />' : '>');
  const conflictComment = conflictClasses.length > 0
    ? '<!-- dt-text-migrate: review conflicting class -->'
    : '';

  return conflictComment + openTag;
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
function hasBlockOrComponentChild (body) {
  if (!body) return false;
  const tagOpens = body.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)\b/g);
  for (const m of tagOpens) {
    if (!INLINE_PHRASING_TAGS.has(m[1].toLowerCase())) return true;
  }
  return false;
}

function rewriteComposedClasses (content) {
  const elementRe = new RegExp(ELEMENT_RE.source, 'g');
  const matches = [];

  let m;
  while ((m = elementRe.exec(content)) !== null) {
    const [fullMatch, tagName, attrsBefore, classValue, attrsAfter, selfClosing] = m;

    // Skip elements that already have a dynamic :class binding — Task 4 handles those
    if (/(?:^|\s):class\b|(?:^|\s)v-bind:class\b/.test(attrsBefore + attrsAfter)) continue;

    const classes = classValue.split(/\s+/).filter(Boolean);

    // Find the first composed class in the class list
    const composedEntry = classes.reduce((found, cls) => {
      return found || (COMPOSED_CLASS_MAP[cls] ? { cls, entry: COMPOSED_CLASS_MAP[cls] } : null);
    }, null);

    if (!composedEntry) continue;

    const { cls: composedCls, entry } = composedEntry;

    // Only rewrite native rewriteable tags; skip if already dt-text (handled in Task 3)
    const isNativeRewriteable = REWRITEABLE_TAGS.has(tagName.toLowerCase());
    const isDtText = tagName === 'dt-text' || tagName === 'DtText';
    if (!isNativeRewriteable && !isDtText) continue;

    const retainedClasses = classes.filter(c => c !== composedCls);
    const isSelfClosing = selfClosing === '/';
    const openStart = m.index;
    const openEnd = m.index + fullMatch.length;

    let closeStart = null;
    let closeEnd = null;
    let closeReplacement = null;

    if (!isSelfClosing) {
      const closing = findMatchingClosingTag(content, openEnd, tagName);
      if (closing) {
        closeStart = closing.index;
        closeEnd = closing.index + closing.length;
        closeReplacement = '</dt-text>';
      }
    }

    // Wrapper safety: skip auto-convert when the element looks like a layout container
    // or contains non-text children. Emit a review marker so the legacy class still
    // surfaces in the migration diff. Only applies to native HTML rewriteable tags
    // — dt-text residual lifts go through their own path in liftResidualOverrides.
    const elementBody = (!isSelfClosing && closeStart !== null)
      ? content.slice(openEnd, closeStart)
      : '';
    const isWrapper = isNativeRewriteable
      && (hasLayoutDisplaySignal(retainedClasses) || hasBlockOrComponentChild(elementBody));

    if (isWrapper) {
      matches.push({
        entry: { flag: 'wrapper' },
        composedCls,
        tagName,
        attrsBefore: attrsBefore.trim(),
        attrsAfter: attrsAfter.trim(),
        retainedClasses,
        isSelfClosing,
        openStart,
        openEnd,
        closeStart: null,
        closeEnd: null,
        closeReplacement: null,
      });
      continue;
    }

    matches.push({
      entry,
      composedCls,
      tagName,
      attrsBefore: attrsBefore.trim(),
      attrsAfter: attrsAfter.trim(),
      retainedClasses,
      isSelfClosing,
      openStart,
      openEnd,
      closeStart,
      closeEnd,
      closeReplacement,
    });
  }

  if (matches.length === 0) return content;

  // Apply in reverse order to preserve positions
  const replacements = [];

  for (const match of matches) {
    const {
      entry, tagName, attrsBefore, attrsAfter, retainedClasses,
      isSelfClosing, openStart, openEnd, closeStart, closeEnd,
    } = match;

    if (entry.flag === 'eyebrow' || entry.flag === 'code-sm') {
      // Prepend a review comment before the element — no rewrite
      replacements.push({
        start: openStart,
        end: openStart,
        replacement: '<!-- dt-text-migrate: review -->',
      });
      continue;
    }

    if (entry.flag === 'wrapper') {
      // Layout container or wrapper with non-text children — emit a review
      // marker so the legacy composed class surfaces in the diff. Tag and
      // classes are left intact for the consumer to migrate manually.
      replacements.push({
        start: openStart,
        end: openStart,
        replacement: '<!-- dt-text-migrate: review composed class on wrapper -->',
      });
      continue;
    }

    if (entry.flag === 'helper') {
      // Rewrite to body+density approximation AND prepend helper review comment (single replacement)
      const newTag = buildDtTextTag({
        originalTag: tagName,
        kind: entry.kind,
        size: entry.size,
        density: entry.density,
        strength: entry.strength,
        retainedClasses,
        attrsBefore,
        attrsAfter,
        selfClosing: isSelfClosing,
      });
      replacements.push({
        start: openStart,
        end: openEnd,
        replacement: '<!-- dt-text-migrate: review helper -->' + newTag,
      });
      if (!isSelfClosing && closeStart !== null) {
        replacements.push({ start: closeStart, end: closeEnd, replacement: '</dt-text>' });
      }
      continue;
    }

    // Normal rewrite
    const newTag = buildDtTextTag({
      originalTag: tagName,
      kind: entry.kind,
      size: entry.size,
      density: entry.density,
      strength: entry.strength,
      retainedClasses,
      attrsBefore,
      attrsAfter,
      selfClosing: isSelfClosing,
    });

    replacements.push({ start: openStart, end: openEnd, replacement: newTag });
    if (!isSelfClosing && closeStart !== null) {
      replacements.push({ start: closeStart, end: closeEnd, replacement: '</dt-text>' });
    }
  }

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
 * Parse the known prop key-value pairs already present in an element's attribute string.
 * Returns { [propName]: value } for string props and { [propName]: true } for boolean props.
 */
function parseExistingProps (attrStr) {
  const props = {};
  // Anchor on whitespace/start so we don't match suffix attrs like `font-kind=`,
  // `wrapper-truncate=`, `label-size=` etc. — `\b` is a word boundary between `-` and `k`,
  // so `\b(kind|...)` matches inside `font-kind=`. Requiring `\s` (or start of attrStr,
  // which often begins with whitespace) anchors the prop as a real attribute name.
  // Allow `:` or `v-bind:` prefix for bound props (e.g. `:size="…"` counts as an existing size).
  const propRe = /(?:^|\s)(?::|v-bind:)?(kind|size|strength|density|tone|align|truncate|as)\s*=\s*"([^"]*)"/g;
  const boolRe = /(?:^|\s)truncate\b(?!\s*[=:])/g;
  let m;
  while ((m = propRe.exec(attrStr)) !== null) {
    props[m[1]] = m[2];
  }
  while ((m = boolRe.exec(attrStr)) !== null) {
    props.truncate = true;
  }
  return props;
}

/**
 * Build the attr string for the lifted props + remaining classes + preserved other attrs.
 * Used for residual lift on existing <dt-text> elements.
 */
function buildResidualTag (tagName, existingAttrs, overrideProps, remaining, conflictClasses) {
  // Strip the original class attribute — we'll rebuild it if remaining is non-empty
  let attrs = existingAttrs.replace(/\sclass="[^"]*"/, '').trimEnd();

  for (const { prop, value } of overrideProps) {
    if (value === null) {
      attrs += ` ${prop}`;
    } else {
      attrs += ` ${prop}="${value}"`;
    }
  }

  if (remaining.length > 0) {
    attrs += ` class="${remaining.join(' ')}"`;
  }

  const conflictComment = conflictClasses.length > 0
    ? '<!-- dt-text-migrate: review conflicting class -->'
    : '';

  return conflictComment + `<${tagName}${attrs}>`;
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

    if (isDtText) {
      // Residual lift: parse existing props to detect conflicts
      const allAttrs = (attrsBefore + ' ' + attrsAfter).trim();
      const existingProps = parseExistingProps(allAttrs);
      const { overrideProps, remaining, conflictClasses } = extractOverrideProps(classes, existingProps);

      if (overrideProps.length === 0 && conflictClasses.length === 0) continue;

      replacements.push({
        start: openStart,
        end: openEnd,
        replacement: buildResidualTag(tagName, attrsBefore + attrsAfter, overrideProps, remaining, conflictClasses),
      });

    } else if (isNative) {
      // Override-only on rewriteable tag: check no composed class (Task 2 already handled those)
      const hasComposed = classes.some(c => COMPOSED_CLASS_MAP[c]);
      if (hasComposed) continue; // Already handled by rewriteComposedClasses

      // ⚠️ Without a composed class, `kind`/`size` are not deducible. Converting <div>/<h*>
      // to <dt-text> would attach the .d-text base class which changes baseline typography —
      // problematic for layout wrappers (e.g. <div class="d-fc-neutral-white"> around a stack).
      // Restrict override-only rewriting to <span>/<p>/<label> where text-as-default is safe.
      const OVERRIDE_ONLY_REWRITEABLE = new Set(['span', 'p', 'label']);
      if (!OVERRIDE_ONLY_REWRITEABLE.has(tagName.toLowerCase())) continue;

      // Skip elements with behavioral attrs — directives, events, id, ref, data-*
      // mean the element has significance beyond typography (e.g. <span @click>, <span id="x">)
      const allAttrs = (attrsBefore + ' ' + attrsAfter).trim();
      if (/(?:v-|@\w|:(?!class)|\bid=|\bref=|\bdata-)/.test(allAttrs)) continue;

      // Skip if any class is unrecognised — custom CSS may target it, unsafe to auto-convert
      if (classes.some(c => !ALL_KNOWN_CLASSES.has(c))) continue;

      // Wrapper safety: skip if element body contains block/component children.
      // <span class="d-fw-bold"><dt-button>x</dt-button></span> should NOT become
      // <dt-text strength="bold"><dt-button>…</dt-text>. (Mirrors the composed-path safety.)
      if (!isSelfClosing) {
        const closing = findMatchingClosingTag(content, openEnd, tagName);
        if (closing) {
          const body = content.slice(openEnd, closing.index);
          if (hasBlockOrComponentChild(body)) continue;
        }
      }

      // Check no dynamic :class conflicts
      const { overrideProps, remaining } = extractOverrideProps(classes, {});
      if (overrideProps.length === 0) continue;

      let newTag = '<dt-text';
      if (tagName !== 'span') newTag += ` as="${tagName}"`;

      for (const { prop, value } of overrideProps) {
        if (value === null) {
          newTag += ` ${prop}`;
        } else {
          newTag += ` ${prop}="${value}"`;
        }
      }

      if (remaining.length > 0) newTag += ` class="${remaining.join(' ')}"`;
      if (attrsBefore.trim()) newTag += ` ${attrsBefore.trim()}`;
      if (attrsAfter.trim()) newTag += ` ${attrsAfter.trim()}`;
      newTag += isSelfClosing ? ' />' : '>';

      replacements.push({ start: openStart, end: openEnd, replacement: newTag });

      if (!isSelfClosing) {
        const closing = findMatchingClosingTag(content, openEnd, tagName);
        if (closing) {
          replacements.push({
            start: closing.index,
            end: closing.index + closing.length,
            replacement: '</dt-text>',
          });
        }
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
  if (classes.length === 0 || !classes.every(c => ALL_KNOWN_CLASSES.has(c))) return false;

  // Reject if any composed class is flagged (eyebrow / code-sm / helper) — those are
  // explicitly out-of-scope-for-auto-rewrite per the PRD and Task 2 already emits a
  // review marker for them. Rewriting here would contradict the flag.
  return !classes.some(c => COMPOSED_CLASS_MAP[c] && COMPOSED_CLASS_MAP[c].flag);
}

/**
 * Rewrite a safe child span tag (with only recognized classes) to <dt-text>.
 */
function rewriteChildSpan (spanTag) {
  const classMatch = spanTag.match(/\sclass="([^"]*)"/);
  if (!classMatch) return spanTag;

  const classes = classMatch[1].split(/\s+/).filter(Boolean);
  const existingProps = {};
  const { overrideProps, remaining } = extractOverrideProps(classes, existingProps);
  const composedEntry = classes.reduce(
    (f, c) => f || (COMPOSED_CLASS_MAP[c] ? { cls: c, entry: COMPOSED_CLASS_MAP[c] } : null),
    null,
  );

  let tag = '<dt-text';
  if (composedEntry && !composedEntry.entry.flag) {
    const { kind, size } = composedEntry.entry;
    if (kind) tag += ` kind="${kind}"`;
    if (size) tag += ` size="${size}"`;
  }
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

  while ((m = dtTextRe.exec(content)) !== null) {
    const openEnd = m.index + m[0].length;
    const closing = findMatchingClosingTag(content, openEnd, 'dt-text');
    if (!closing) continue;
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
      if (isSafeToCollapseSpan(spanTag)) {
        spanReplacements.push({
          start: sm.index,
          end: spanOpenEnd,
          replacement: rewriteChildSpan(spanTag),
        });
        // Find the depth-matched </span> (handles nested <span>...<span>...</span>...</span>)
        const closingSpan = findMatchingClosingTag(body, spanOpenEnd, 'span');
        if (closingSpan) {
          spanReplacements.push({
            start: closingSpan.index,
            end: closingSpan.index + closingSpan.length,
            replacement: '</dt-text>',
          });
        }
      } else {
        // Check if it has any typography classes — if so, flag it
        const classM = spanTag.match(/\sclass="([^"]*)"/);
        if (classM) {
          const hasTypo = classM[1].split(/\s+/).some(c => ALL_KNOWN_CLASSES.has(c));
          if (hasTypo) {
            spanReplacements.push({
              start: sm.index,
              end: sm.index,
              replacement: '<!-- dt-text-migrate: review nested span -->',
            });
          }
        }
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

  const lines = content.split('\n');
  const out = lines.map(line => {
    if (!/:class=|v-bind:class=/.test(line)) return line;
    if (!new RegExp(DYNAMIC_CLASS_PATTERN).test(line)) return line;
    // Preserve the line's indentation; put the marker on its own line above.
    const indentMatch = line.match(/^[ \t]*/);
    const indent = indentMatch ? indentMatch[0] : '';
    return `${indent}<!-- dt-text-migrate: review dynamic class -->\n${line}`;
  });

  return out.join('\n');
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

// On-menu d-fs-N → DtText size mapping hint (body/label size + headline size if applicable)
// fs.N values that align with DtText's scale (matches dialtone-tokens font.size token stops)
const ON_MENU_FS_HINTS = {
  '100': 'body/label size="100"',
  '200': 'body/label size="300" OR headline size="100"',
  '300': 'headline size="300"',
  '400': 'headline size="500"',
  '500': 'headline size="600"',
  '600': 'headline size="700"',
};

function flagFontSizeClasses (content) {
  // Iterate over real opening tags using a quote-aware regex so we never land
  // inside a quoted attribute value (e.g. `title="a < b"`). Walking back with
  // lastIndexOf('<') from a `class=` match is unsafe because `<` can appear
  // inside `v-if="rowCount < total"` style bindings.
  const tagRe = new RegExp(`<[a-zA-Z][\\w-]*(${ATTR_BODY})\\sclass="([^"]*)"`, 'g');
  const replacements = [];
  let m;

  while ((m = tagRe.exec(content)) !== null) {
    const tagStart = m.index;
    const classValue = m[2];

    // Only act on class attributes containing d-fs-N
    const fsMatch = classValue.match(/\bd-fs-(\d+)\b/);
    if (!fsMatch) continue;

    const fsN = fsMatch[1];
    const hint = ON_MENU_FS_HINTS[fsN]
      ? `<!-- dt-text-migrate: review d-fs-${fsN} (on-menu — maps to ${ON_MENU_FS_HINTS[fsN]}) -->`
      : `<!-- dt-text-migrate: review d-fs-${fsN} (off-menu — no clean DtText equivalent, keep class) -->`;

    // Suppress when a dt-text-migrate comment ends immediately before this tag
    // (legacy-heading hints share the same target position — don't double up).
    const immediatelyBefore = content.slice(Math.max(0, tagStart - 500), tagStart);
    const alreadyFlagged = /<!--\s*dt-text-migrate:[\s\S]*?-->\s*$/.test(immediatelyBefore);
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
 * comment with the proposed DtText migration. This is firespotter's dominant pattern
 * — most uc_client headings predate composed classes.
 *
 * The hint comment includes the proposed `<dt-text>` form. The element is NOT rewritten;
 * the developer reviews and applies. Cleanly removed by --remove-markers.
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

    // Decide kind: explicit headings get headline; ambiguous tags get a "verify kind" note
    const isHeadingTag = /^h[1-6]$/.test(tagName);
    const kindHint = isHeadingTag ? 'kind=headline' : 'kind=body|label|headline (VERIFY)';
    const sizeHint = ON_MENU_FS_HINTS[fsN]
      ? `size: ${ON_MENU_FS_HINTS[fsN]}`
      : `size: d-fs-${fsN} is off-menu — keep class`;

    const parts = [];
    if (!isHeadingTag) parts.push(`as=${tagName}`);
    parts.push(kindHint, sizeHint, `strength=${strength}`);
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

export function detectImportPathFor (content) {
  return detectImportPattern(content);
}

function detectImportPattern (content) {
  if (content.includes('from \'@/components/')) return '@/components/text';
  if (content.includes('from \'./\'')) return './';
  if (content.includes('from \'@dialpad/dialtone-vue') || content.includes('from \'@dialpad/dialtone-icons')) {
    return '@dialpad/dialtone-vue';
  }
  return '@/components/text';
}

function detectMissingDtTextImport (content, usesText) {
  if (!usesText) return null;
  const hasImport = /import\s+(?:\{[^}]*\bDtText\b[^}]*\}|DtText)\s+from/.test(content);
  if (hasImport) return null;
  return {
    needsImport: true,
    suggestedPath: detectImportPattern(content),
    hasComponentsObject: /components:\s*\{/.test(content),
  };
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

const VALID_KINDS = new Set(['headline', 'body', 'label', 'code']);
const VALID_SIZES = new Set([
  '100', '200', '300', '400', '500', '600', '700',
  'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl',
]);
const VALID_STRENGTHS = new Set(['bold', 'semibold', 'medium', 'normal']);
const VALID_DENSITIES = new Set(['100', '200', '300', '400', '500', '600']);
const VALID_ALIGNS = new Set(['start', 'center', 'end', 'justify']);

/**
 * Scan a file's content for DtText prop bugs. Returns array of issues with line numbers.
 * Issue types:
 *   - object-syntax — `:tone="{ muted: cond }"` style (CSS-class binding misapplied to prop)
 *   - invalid-value — `density="160"`, `kind="title"`, etc.
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

    // Object syntax detection: any prop bound with `:prop="{...}"`
    const objectSyntaxRe = /:(\w[\w-]*)="\s*\{/g;
    let osm;
    while ((osm = objectSyntaxRe.exec(attrStr)) !== null) {
      const propName = osm[1];
      // Only flag known string props (where object syntax is wrong)
      if (['tone', 'kind', 'size', 'strength', 'density', 'align', 'as'].includes(propName)) {
        issues.push({
          type: 'object-syntax',
          line: lineNum,
          message: `:${propName}="{ ... }" uses CSS-class syntax — DtText expects a string. Use :${propName}="cond ? 'value' : undefined" instead.`,
          snippet: tagSnippet,
        });
      }
    }

    // Static-value validation — anchor on whitespace so we don't match `:prop=` (bound)
    const staticPropRe = /\s(kind|size|strength|density|align)\s*=\s*"([^"]+)"/g;
    let spm;
    while ((spm = staticPropRe.exec(attrStr)) !== null) {
      const [, propName, value] = spm;
      const validSet = {
        kind: VALID_KINDS, size: VALID_SIZES, strength: VALID_STRENGTHS,
        density: VALID_DENSITIES, align: VALID_ALIGNS,
      }[propName];
      if (validSet && !validSet.has(value)) {
        issues.push({
          type: 'invalid-value',
          line: lineNum,
          message: `${propName}="${value}" is not a valid value (expected one of: ${[...validSet].join(', ')}).`,
          snippet: tagSnippet,
        });
      }
    }

    // Mixed class detection: DtText with class= containing typography utilities
    const classM = attrStr.match(/\sclass="([^"]*)"/);
    if (classM) {
      const offenders = classM[1].split(/\s+/).filter(c => ALL_KNOWN_CLASSES.has(c));
      if (offenders.length > 0) {
        issues.push({
          type: 'mixed-class',
          line: lineNum,
          message: `DtText carries typography utility classes [${offenders.join(', ')}] — lift to props instead.`,
          snippet: tagSnippet,
        });
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

  await fs.writeFile(filePath, transformed, 'utf-8');
  console.log(log.green('   ✓ Saved'));

  // Only warn about missing DtText import when we actually INSERTED new <dt-text> elements
  // — review-marker-only changes (eyebrow/d-code--sm/d-fs-* flags) don't require an import.
  // Use a count delta (not boolean presence) so partial migrations on a file that already
  // had a <dt-text> still warn when more are added.
  const beforeCount = (content.match(/<dt-text\b/g) || []).length;
  const afterCount = (transformed.match(/<dt-text\b/g) || []).length;
  const addedDtText = afterCount > beforeCount;
  const importCheck = detectMissingDtTextImport(transformed, addedDtText);
  if (importCheck?.needsImport) printImportInstructions(filePath, importCheck);

  if (notes.length > 0) {
    for (const note of notes) log.gray(`   ℹ ${note}`);
  }

  return { changes: 1, needsImport: !!importCheck?.needsImport };
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
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: npx dialtone-migrate-typography [options]

Migrates legacy typography utility classes to <dt-text> components.

Options:
  --cwd <path>        Working directory (default: current directory)
  --file <path>       Specific file to process (repeatable)
  --dry-run           Show changes without applying them
  --yes, -y           Apply all changes without prompting
  --remove-markers    Strip all <!-- dt-text-migrate: review ... --> comments
  --validate          Read-only mode: scan existing <dt-text> for prop bugs
                      (object syntax, invalid values, mixed CSS classes)
  --help, -h          Show help

Examples:
  npx dialtone-migrate-typography --dry-run --cwd ./src
  npx dialtone-migrate-typography --yes
  npx dialtone-migrate-typography --file src/Foo.vue --dry-run
  npx dialtone-migrate-typography --remove-markers --cwd ./src

Post-Migration Steps:
  1. Add DtText imports as instructed by the script
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
