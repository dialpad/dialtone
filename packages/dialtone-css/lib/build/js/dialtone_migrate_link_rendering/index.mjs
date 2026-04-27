#!/usr/bin/env node
/* eslint-disable max-lines */
/* eslint-disable complexity */

/**
 * @fileoverview Migration script for DtLink and DtButton anchor / router-link rendering
 * patterns plus DtLink underline prop.
 *
 * Covers:
 *   DLT-3033  <a class="d-btn">                    -> <dt-button href="…">
 *             <router-link class="d-btn" :to>      -> <dt-button :to="…">
 *             d-btn--{size,kind,importance,…}      -> corresponding props
 *
 *   DLT-3034  <a class="d-link">                   -> <dt-link href="…">
 *             <router-link class="d-link" :to>     -> <dt-link :to="…">
 *             d-link--{tone}                       -> tone="…" (with rename)
 *             d-link--no-underline                 -> :underline="false"
 *
 *   DLT-3035  <dt-link class="d-td-…">             -> closest :underline value
 *             responsive d-td-* variants           -> warn (skip)
 *
 * Vue files only by default. `--include-markdown` opts into `.md` files.
 *
 * Usage:
 *   npx dialtone-migrate-link-rendering [options]
 *
 * Options:
 *   --cwd <path>          Working directory (default: cwd)
 *   --dry-run             Show changes without applying them
 *   --yes                 Apply all changes without prompting
 *   --help                Show help
 *   --only=<list>         Run only the named transforms; CSV of:
 *                         button-nav, link-nav, underline (default: all)
 *   --include-markdown    Also walk .md files (off by default)
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ALL_TRANSFORMS = ['button-nav', 'link-nav', 'underline'];

// Tone modifier values (canonical and renamed-from forms)
const TONE_MODIFIER_MAP = {
  critical: 'critical',
  danger: 'critical',     // rename
  warning: 'warning',
  positive: 'positive',
  success: 'positive',    // rename
  info: 'info',
  muted: 'muted',
  mention: 'mention',
};

// DtButton: kind modifiers (with d-btn--danger -> kind="critical" rename)
const BUTTON_KIND_MODIFIER_MAP = {
  muted: 'muted',
  critical: 'critical',
  danger: 'critical',     // rename
  positive: 'positive',
  success: 'positive',    // rename (defensive — unused in CSS but consumers may still write it)
  inverted: 'inverted',
  unstyled: 'unstyled',
};

// DtButton: importance modifiers
const BUTTON_IMPORTANCE_MODIFIER_MAP = {
  outlined: 'outlined',
  // d-btn--primary is the default; stripped without emitting a prop
};

// DtButton: size modifiers (t-shirt classname -> numeric prop value)
const BUTTON_SIZE_MODIFIER_MAP = {
  xs: 100,
  sm: 200,
  // d-btn--md is the default; stripped without emitting a prop
  lg: 400,
  xl: 500,
};

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

function escapeRe (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split a class attribute value into tokens, preserving order.
 * Empty tokens are dropped.
 */
function splitClasses (classStr) {
  return classStr.split(/\s+/).filter(Boolean);
}

function joinClasses (tokens) {
  return tokens.join(' ');
}

/**
 * Quote an attribute value, picking the quote style that doesn't conflict.
 * Defaults to double quotes; falls back to single if value contains them.
 */
function quoteAttr (value) {
  return value.includes('"') && !value.includes('\'')
    ? `'${value}'`
    : `"${value.replace(/"/g, '&quot;')}"`;
}

// ---------------------------------------------------------------------------
// Class-string extractors
//
// Each extractor takes a tokens[] array, mutates it (removing matched tokens),
// and returns the extracted value (or null if no match).
// ---------------------------------------------------------------------------

function extractSizeModifier (tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const m = tokens[i].match(/^d-btn--(xs|sm|md|lg|xl)$/);
    if (!m) continue;
    tokens.splice(i, 1);
    const tShirt = m[1];
    if (tShirt === 'md') return null; // default — strip silently
    return BUTTON_SIZE_MODIFIER_MAP[tShirt];
  }
  return null;
}

function extractImportanceModifier (tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const m = tokens[i].match(/^d-btn--(outlined|primary)$/);
    if (!m) continue;
    tokens.splice(i, 1);
    if (m[1] === 'primary') return null; // default — strip silently
    return BUTTON_IMPORTANCE_MODIFIER_MAP[m[1]];
  }
  return null;
}

function extractKindModifier (tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const m = tokens[i].match(/^d-btn--(muted|critical|danger|positive|success|inverted|unstyled)$/);
    if (!m) continue;
    tokens.splice(i, 1);
    return BUTTON_KIND_MODIFIER_MAP[m[1]];
  }
  return null;
}

function extractCircleModifier (tokens) {
  const i = tokens.indexOf('d-btn--circle');
  if (i === -1) return false;
  tokens.splice(i, 1);
  return true;
}

function extractActiveLoadingModifiers (tokens) {
  let active = false;
  let loading = false;
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i] === 'd-btn--active') {
      active = true;
      tokens.splice(i, 1);
    } else if (tokens[i] === 'd-btn--loading') {
      loading = true;
      tokens.splice(i, 1);
    }
  }
  return { active, loading };
}

/**
 * For DtLink: extract the tone modifier (d-link--{tone}) with renames applied.
 * Skips inverted variants (handled by extractInvertedLinkModifier).
 */
function extractLinkToneModifier (tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith('d-link--inverted')) continue;
    const m = t.match(/^d-link--(critical|danger|warning|positive|success|info|muted|mention)$/);
    if (!m) continue;
    tokens.splice(i, 1);
    return TONE_MODIFIER_MAP[m[1]];
  }
  return null;
}

function extractNoUnderlineModifier (tokens) {
  const i = tokens.indexOf('d-link--no-underline');
  if (i === -1) return false;
  tokens.splice(i, 1);
  return true;
}

/**
 * Detect inverted-* link modifiers. If a tone is bundled (`d-link--inverted-critical`),
 * strip the class and return that tone. Otherwise (plain `d-link--inverted`), strip the
 * class and return null. The caller emits a per-file note about v-dt-mode either way.
 *
 * Disabled-link modifiers (`d-link--disabled`, `d-link--inverted-disabled`) are LEFT
 * in place — no prop equivalent, preserved on class.
 */
function extractInvertedLinkModifier (tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === 'd-link--inverted-disabled') return { found: false, tone: null };
    if (t === 'd-link--inverted') {
      tokens.splice(i, 1);
      return { found: true, tone: null };
    }
    const m = t.match(/^d-link--inverted-(critical|danger|warning|positive|success|info|muted|mention)$/);
    if (m) {
      tokens.splice(i, 1);
      return { found: true, tone: TONE_MODIFIER_MAP[m[1]] };
    }
  }
  return { found: false, tone: null };
}

// ---------------------------------------------------------------------------
// Attribute helpers (operate on the opening-tag string, between `<tag` and `>`)
// ---------------------------------------------------------------------------


function detectDynamicClass (attrs) {
  return /(^|[\s])(:|v-bind:)class\s*=/.test(attrs);
}

/**
 * Extract a static or dynamic attribute from an attrs string.
 * Returns { name, value, dynamic, before, after } or null.
 */
function extractAttr (attrs, attrName) {
  const dynRe = new RegExp(`(?<=^|\\s)(:|v-bind:)${escapeRe(attrName)}=("([^"]*)"|'([^']*)')`);
  const dynMatch = attrs.match(dynRe);
  if (dynMatch) {
    const value = dynMatch[3] !== undefined ? dynMatch[3] : dynMatch[4];
    return {
      name: attrName,
      value,
      dynamic: true,
      before: attrs.slice(0, dynMatch.index),
      after: attrs.slice(dynMatch.index + dynMatch[0].length),
    };
  }
  const staticRe = new RegExp(`(?<=^|\\s)${escapeRe(attrName)}=("([^"]*)"|'([^']*)')`);
  const staticMatch = attrs.match(staticRe);
  if (staticMatch) {
    const value = staticMatch[2] !== undefined ? staticMatch[2] : staticMatch[3];
    return {
      name: attrName,
      value,
      dynamic: false,
      before: attrs.slice(0, staticMatch.index),
      after: attrs.slice(staticMatch.index + staticMatch[0].length),
    };
  }
  return null;
}

/**
 * Strip leading/trailing whitespace inside an attrs string while keeping
 * a single leading space when non-empty (so `<dt-button href="...">` parses).
 */
function normalizeAttrs (attrs) {
  const trimmed = attrs.replace(/\s+/g, ' ').trim();
  return trimmed ? ` ${trimmed}` : '';
}

// ---------------------------------------------------------------------------
// Closing-tag matcher (depth-aware)
// ---------------------------------------------------------------------------

/**
 * Given the source content and the start index of an opening tag with `tagName`,
 * find the index of the matching closing `</tagName>` (depth-aware). Returns
 * { closeStart, closeEnd } or null if unbalanced.
 */
function findClosingTag (content, openEndIndex, tagName) {
  const openRe = new RegExp(`<${escapeRe(tagName)}\\b[^>]*>`, 'g');
  const closeRe = new RegExp(`</${escapeRe(tagName)}\\s*>`, 'g');
  openRe.lastIndex = openEndIndex;
  closeRe.lastIndex = openEndIndex;

  let depth = 1;
  while (depth > 0) {
    const nextOpen = openRe.exec(content);
    const nextClose = closeRe.exec(content);
    if (!nextClose) return null;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      // self-closing elements don't actually open
      if (nextOpen[0].endsWith('/>')) depth -= 1;
      closeRe.lastIndex = nextOpen.index + nextOpen[0].length;
      continue;
    }
    depth -= 1;
    if (depth === 0) {
      return {
        closeStart: nextClose.index,
        closeEnd: nextClose.index + nextClose[0].length,
      };
    }
    openRe.lastIndex = nextClose.index + nextClose[0].length;
  }
  return null;
}

// ---------------------------------------------------------------------------
// DLT-3033: <a class="d-btn">  /  <router-link class="d-btn">  ->  <dt-button>
// ---------------------------------------------------------------------------


function transformButtonNav (content, ctx) {
  let out = content;

  // Phase 1: <a class="d-btn"> ... </a>
  out = rewriteAnchorOrRouterLink(out, /<a\b/, '</a>', 'a', 'd-btn', 'dt-button', ctx, /* isRouterLink */ false);

  // Phase 2: <router-link class="d-btn"> ... </router-link>
  out = rewriteAnchorOrRouterLink(out, /<router-link\b/, '</router-link>', 'router-link', 'd-btn', 'dt-button', ctx, /* isRouterLink */ true);

  // Phase 3: <router-link custom> wrapping <dt-button> — warn-only
  warnRouterLinkCustomWrappers(out, 'dt-button', ctx);

  return out;
}

/**
 * Walk the content looking for `<sourceTag …>` opening tags whose static class attr
 * contains `requiredClass`. For each match, find the matching closing tag and rewrite
 * the pair to `<targetTag …>…</targetTag>` with attrs derived from the source.
 *
 * Used for both DtButton (d-btn) and DtLink (d-link). The targetTag determines which
 * modifier extractors apply.
 */
function rewriteAnchorOrRouterLink (
  content, openTagRe, closeTagText, sourceTag,
  requiredClass, targetTag, ctx, isRouterLink,
) {
  // Build a single regex that matches the opening tag with the required class
  // (in either single-quoted or double-quoted form) — use case-insensitive `\b` boundaries.
  const openWithClassRe = new RegExp(
    `<${escapeRe(sourceTag)}\\b([^>]*?)\\sclass=("([^"]*\\b${escapeRe(requiredClass)}\\b[^"]*)"|'([^']*\\b${escapeRe(requiredClass)}\\b[^']*)')([^>]*?)(/?)>`,
    'g',
  );

  const replacements = [];
  let m;
  while ((m = openWithClassRe.exec(content)) !== null) {
    const [fullOpen, attrsBefore, , quotedDouble, quotedSingle, attrsAfter, selfClose] = m;
    const classValue = quotedDouble !== undefined ? quotedDouble : quotedSingle;
    const openStart = m.index;
    const openEnd = openStart + fullOpen.length;

    // Reconstitute the attrs string excluding the class= we matched, preserving spacing.
    const restAttrs = `${attrsBefore || ''} ${attrsAfter || ''}`.replace(/\s+/g, ' ').trim();

    let rewritten;
    if (selfClose === '/') {
      rewritten = buildRewrittenTag({
        targetTag,
        classValue,
        attrs: restAttrs,
        isRouterLink,
        selfClosing: true,
        ctx,
      });
      if (rewritten == null) continue;
      replacements.push({ start: openStart, end: openEnd, text: rewritten });
      continue;
    }

    // Find the matching closing tag
    const close = findClosingTag(content, openEnd, sourceTag);
    if (!close) {
      ctx.warnings.push(
        `${ctx.filePath}: <${sourceTag} class="${classValue}"> has no matching </${sourceTag}> — skipped.`,
      );
      continue;
    }

    rewritten = buildRewrittenTag({
      targetTag,
      classValue,
      attrs: restAttrs,
      isRouterLink,
      selfClosing: false,
      ctx,
      sourceFullOpen: fullOpen,
    });
    if (rewritten == null) continue;

    replacements.push({ start: openStart, end: openEnd, text: rewritten });
    replacements.push({ start: close.closeStart, end: close.closeEnd, text: `</${targetTag}>` });
  }

  // Apply replacements in reverse so indices stay valid
  replacements.sort((a, b) => b.start - a.start);
  let out = content;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }
  return out;
}

/**
 * Build the rewritten opening tag. Returns null to abort the rewrite (with a warning).
 */
function buildRewrittenTag ({ targetTag, classValue, attrs, isRouterLink, selfClosing, ctx }) {
  // Detect dynamic class — we can't safely rewrite if there's a :class= alongside the static class
  if (detectDynamicClass(attrs)) {
    ctx.warnings.push(
      `${ctx.filePath}: <${targetTag === 'dt-button' ? 'a/router-link.d-btn' : 'a/router-link.d-link'}> with dynamic :class — manual review required.`,
    );
    return null;
  }

  let workingAttrs = attrs;
  const tokens = splitClasses(classValue);
  const newAttrs = []; // collected new prop attributes (already in `name="value"` or `:name="value"` form)

  // 1. Strip the base class (d-btn or d-link)
  const baseClass = targetTag === 'dt-button' ? 'd-btn' : 'd-link';
  const baseIdx = tokens.indexOf(baseClass);
  if (baseIdx !== -1) tokens.splice(baseIdx, 1);

  // 2. Source-tag-specific link routing: lift `to=` from <router-link>
  if (isRouterLink) {
    const toAttr = extractAttr(workingAttrs, 'to');
    if (toAttr) {
      workingAttrs = (toAttr.before + ' ' + toAttr.after).trim();
      const propName = toAttr.dynamic ? ':to' : 'to';
      newAttrs.push(`${propName}=${quoteAttr(toAttr.value)}`);
    } else {
      // <router-link class="d-btn"> with no `to=` is unusual but legal — emit warning
      ctx.warnings.push(
        `${ctx.filePath}: <router-link class="${classValue}"> without a \`to\` attribute — skipped (likely already migrated or hand-authored).`,
      );
      return null;
    }
  } else {
    // <a class="d-btn"> — lift href= (warn if dynamic)
    const hrefAttr = extractAttr(workingAttrs, 'href');
    if (hrefAttr && hrefAttr.dynamic) {
      ctx.warnings.push(
        `${ctx.filePath}: <a class="${classValue}"> with dynamic :href — manual review required.`,
      );
      return null;
    }
    if (hrefAttr) {
      workingAttrs = (hrefAttr.before + ' ' + hrefAttr.after).trim();
      newAttrs.push(`href=${quoteAttr(hrefAttr.value)}`);
    }
    // Anchors without href are technically invalid but we still rewrite so consumer sees the change
  }

  // 3. Extract modifier classes per target component
  if (targetTag === 'dt-button') {
    extractDtButtonModifiers(tokens, newAttrs);
  } else {
    extractDtLinkModifiers(tokens, newAttrs, ctx);
  }

  // 4. Reconstruct class attr from leftover tokens (preserves vendor / BEM / utility classes)
  const remainingClass = joinClasses(tokens);
  if (remainingClass) {
    newAttrs.push(`class=${quoteAttr(remainingClass)}`);
  }

  // 5. Compose final attrs: original attrs (minus extracted) + new attrs
  const finalAttrs = normalizeAttrs(`${workingAttrs} ${newAttrs.join(' ')}`);
  return `<${targetTag}${finalAttrs}${selfClosing ? ' />' : '>'}`;
}

function extractDtButtonModifiers (tokens, newAttrs) {
  const size = extractSizeModifier(tokens);
  if (size != null) newAttrs.push(`:size="${size}"`);

  const importance = extractImportanceModifier(tokens);
  if (importance != null) newAttrs.push(`importance="${importance}"`);

  const kind = extractKindModifier(tokens);
  if (kind != null) newAttrs.push(`kind="${kind}"`);

  if (extractCircleModifier(tokens)) newAttrs.push('circle');

  const { active, loading } = extractActiveLoadingModifiers(tokens);
  if (active) newAttrs.push('active');
  if (loading) newAttrs.push('loading');
}

function extractDtLinkModifiers (tokens, newAttrs, ctx) {
  const inverted = extractInvertedLinkModifier(tokens);
  let invertedTone = null;
  if (inverted.found) {
    invertedTone = inverted.tone;
    ctx.notes.push({
      kind: 'inverted-link',
      message: `<dt-link> migrated from d-link--inverted; consider applying the v-dt-mode directive on a parent instead of the deprecated inverted styling.`,
    });
  }

  const tone = invertedTone ?? extractLinkToneModifier(tokens);
  if (tone != null) newAttrs.push(`tone="${tone}"`);

  if (extractNoUnderlineModifier(tokens)) newAttrs.push(':underline="false"');
}

/**
 * Walk the content and warn on `<router-link custom>` wrappers around `<targetTag>`.
 * Doesn't transform — purely informational, per Q2 resolution.
 */
function warnRouterLinkCustomWrappers (content, targetTag, ctx) {
  const re = new RegExp(`<router-link\\s[^>]*?\\bcustom\\b[^>]*>[\\s\\S]*?<${escapeRe(targetTag)}\\b`, 'g');
  while (re.exec(content) !== null) {
    ctx.warnings.push(
      `${ctx.filePath}: <router-link custom> wrapping <${targetTag}> — manual review required (lift the to= onto <${targetTag}> directly).`,
    );
  }
}

// ---------------------------------------------------------------------------
// Stubs for V2 / V3 transforms — filled in subsequent slices
// ---------------------------------------------------------------------------

function transformLinkNav (content, ctx) {
  let out = content;
  out = rewriteAnchorOrRouterLink(out, /<a\b/, '</a>', 'a', 'd-link', 'dt-link', ctx, false);
  out = rewriteAnchorOrRouterLink(out, /<router-link\b/, '</router-link>', 'router-link', 'd-link', 'dt-link', ctx, true);
  warnRouterLinkCustomWrappers(out, 'dt-link', ctx);
  return out;
}

// ---------------------------------------------------------------------------
// DLT-3035: <dt-link class="d-td-...">  ->  closest :underline value
// ---------------------------------------------------------------------------

const D_TD_RECOGNIZED_TOKEN_RE = /^(?:h:)?d-td-(none|underline)$/;
const D_TD_ANY_TOKEN_RE = /(?:^|\s)([\w:]+:)?d-td-[\w-]+/;

/**
 * Map rest+hover state to a prop emission decision.
 * Returns { propValue, hoverDelta } where:
 *   - propValue is 'true' (default — strip classes), 'false' (set :underline="false"),
 *     or null (no change to the prop)
 *   - hoverDelta indicates whether the closest mapping changes hover behavior vs the original
 */
function mapDtdToUnderline (rest, hover) {
  // Default DtLink behavior: rest=underline, hover=none
  // d-link--no-underline (underline=false): rest=none, hover=underline
  if (rest === 'underline' && hover === 'none') return { propValue: null, hoverDelta: false };
  if (rest === 'none' && hover === 'underline') return { propValue: 'false', hoverDelta: false };
  // "alone" / "both-same" cases — closest mapping with hover delta
  if (rest === 'none' && hover === 'none') return { propValue: 'false', hoverDelta: true };
  if (rest === 'underline' && hover === 'underline') return { propValue: null, hoverDelta: true };
  return { propValue: null, hoverDelta: false };
}

function transformUnderline (content, ctx) {
  // Match <dt-link …> opening tags (not self-closing — those have nothing to underline-style)
  const re = /<dt-link\b([^>]*?)>/g;
  return content.replace(re, (fullTag, rawAttrs) => {
    const attrs = rawAttrs || '';

    // Skip if :underline is already set (idempotency)
    if (/(^|\s)(:|v-bind:)?underline\s*=/.test(attrs)) return fullTag;

    // Need a static class= with d-td-* tokens to do anything
    const classMatch = attrs.match(/(?<![:\w-])class=("([^"]*)"|'([^']*)')/);
    if (!classMatch) {
      // No static class. Check if there's a dynamic :class with d-td-* in it — warn.
      const dynClassMatch = attrs.match(/(?:^|\s)(?::|v-bind:)class=("([^"]*)"|'([^']*)')/);
      if (dynClassMatch) {
        const expr = dynClassMatch[2] !== undefined ? dynClassMatch[2] : dynClassMatch[3];
        if (/d-td-/.test(expr)) {
          ctx.warnings.push(
            `${ctx.filePath}: <dt-link :class="${expr}"> contains d-td-* in a dynamic binding — manual review required.`,
          );
        }
      }
      return fullTag;
    }

    const classValue = classMatch[2] !== undefined ? classMatch[2] : classMatch[3];
    if (!D_TD_ANY_TOKEN_RE.test(' ' + classValue)) return fullTag;

    const tokens = classValue.split(/\s+/).filter(Boolean);

    // Detect unsupported variants (responsive prefix like sm:d-td-*, focus f:d-td-*, etc.)
    const unsupported = tokens.filter(t => /^(?:[\w-]+:)?d-td-/.test(t) && !D_TD_RECOGNIZED_TOKEN_RE.test(t));
    if (unsupported.length > 0) {
      ctx.warnings.push(
        `${ctx.filePath}: <dt-link class="${classValue}"> has responsive or unsupported d-td-* variant(s) (${unsupported.join(', ')}) — skipped.`,
      );
      return fullTag;
    }

    // Compute effective rest/hover state.
    // Bare `d-td-*` is `text-decoration: <value> !important` and applies in BOTH rest and hover
    // because there's no :hover qualifier on the rule. An explicit `h:d-td-*` overrides hover only.
    let restOverride = null;
    let hoverOverride = null;
    const remaining = [];
    for (const token of tokens) {
      const m = token.match(D_TD_RECOGNIZED_TOKEN_RE);
      if (!m) {
        remaining.push(token);
        continue;
      }
      const isHover = token.startsWith('h:');
      const value = m[1]; // 'none' or 'underline'
      if (isHover) hoverOverride = value;
      else restOverride = value;
    }
    const rest = restOverride ?? 'underline'; // DtLink default rest
    // Hover precedence: explicit h:d-td-* > bare d-td-* (!important applies on hover too) > default
    const hover = hoverOverride ?? restOverride ?? 'none';

    const { propValue, hoverDelta } = mapDtdToUnderline(rest, hover);

    // Build new class attribute
    const newClassValue = remaining.join(' ');
    let newAttrs = attrs.replace(classMatch[0], '').replace(/\s+/g, ' ').trim();
    if (newClassValue) newAttrs += ` class=${quoteAttr(newClassValue)}`;
    if (propValue === 'false') newAttrs += ' :underline="false"';

    if (hoverDelta) {
      ctx.notes.push({
        kind: 'underline-hover-delta',
        message: '<dt-link>: hover behavior may differ from the original d-td-* classes; review if hover styling matters.',
      });
    }

    return `<dt-link${newAttrs ? ' ' + newAttrs : ''}>`;
  });
}

// ---------------------------------------------------------------------------
// Top-level transform entry point
// ---------------------------------------------------------------------------

/**
 * Mask HTML comments so the transformers don't match tags written as documentation
 * inside `<!-- … -->` blocks (e.g. fixture/example files).
 */
function maskInertContent (content, filePath = '') {
  const isMarkdown = filePath.endsWith('.md');
  const innerRe = isMarkdown
    ? /<!--[\s\S]*?-->|```[\s\S]*?```|`[^`\n]*`/g
    : /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/g;
  const segments = [];
  const masked = content.replace(innerRe, (match) => {
    const placeholder = ` DT_MIGRATE_INERT_${segments.length} `;
    segments.push(match);
    return placeholder;
  });
  return { masked, segments };
}

function unmaskInertContent (masked, segments) {
  return masked.replace(/ DT_MIGRATE_INERT_(\d+) /g, (_, idx) => segments[Number(idx)]);
}


/**
 * Transform a file's contents. Returns { transformed, warnings, notes }.
 */
export function transformContent (content, opts = {}) {
  const enabled = opts.only && opts.only.length > 0 ? new Set(opts.only) : new Set(ALL_TRANSFORMS);
  const ctx = {
    filePath: opts.filePath || '<input>',
    warnings: [],
    notes: [],
  };

  const { masked, segments } = maskInertContent(content, ctx.filePath);
  let out = masked;
  if (enabled.has('button-nav')) out = transformButtonNav(out, ctx);
  if (enabled.has('link-nav')) out = transformLinkNav(out, ctx);
  if (enabled.has('underline')) out = transformUnderline(out, ctx);

  return { transformed: unmaskInertContent(out, segments), warnings: ctx.warnings, notes: ctx.notes };
}

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

async function findFiles (dir, extensions, ignore = []) {
  const results = [];
  async function walk (currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (ignore.some(ig => fullPath.includes(ig))) continue;
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  await walk(dir);
  return results;
}

// ---------------------------------------------------------------------------
// CLI plumbing
// ---------------------------------------------------------------------------

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate-link-rendering [options]

Migrates legacy anchor / router-link patterns to <dt-button> and <dt-link>, plus
DtLink \`d-td-*\` utility classes to the \`underline\` prop.

Covers:
  DLT-3033  <a class="d-btn">                    -> <dt-button href="…">
            <router-link class="d-btn" :to>      -> <dt-button :to="…">
            d-btn--{xs,sm,lg,xl}                 -> :size="{100,200,400,500}"
            d-btn--outlined                      -> importance="outlined"
            d-btn--{muted,critical,positive,…}   -> kind="…" (with renames)
            d-btn--{circle,active,loading}       -> bare boolean attrs

  DLT-3034  <a class="d-link">                   -> <dt-link href="…">
            <router-link class="d-link" :to>     -> <dt-link :to="…">
            d-link--{tone}                       -> tone="…" (with renames
                                                    danger->critical, success->positive)
            d-link--no-underline                 -> :underline="false"
            d-link--inverted*                    -> per-file note nudging toward v-dt-mode

  DLT-3035  <dt-link class="d-td-…">             -> closest :underline value
                                                    (per-file note when hover delta exists)

Vendor classes (d-btn--brand, etc.) and BEM internals (d-btn__icon, etc.) are
preserved on the resulting tag's class attribute, not warned.

Vue files only by default. Use --include-markdown to also walk .md files.

Options:
  --cwd <path>          Working directory (default: cwd)
  --dry-run             Show changes without applying them
  --yes                 Apply all changes without prompting
  --help                Show help
  --only=<list>         Run only the named transforms; CSV of:
                        button-nav, link-nav, underline
  --include-markdown    Also walk .md files

Examples:
  npx dialtone-migrate-link-rendering
  npx dialtone-migrate-link-rendering --dry-run
  npx dialtone-migrate-link-rendering --cwd ./src
  npx dialtone-migrate-link-rendering --only=button-nav,link-nav
`);
}

function parseArgs (args) {
  const cwdIndex = args.indexOf('--cwd');
  const onlyArg = args.find(a => a.startsWith('--only='));
  return {
    help: args.includes('--help'),
    dryRun: args.includes('--dry-run'),
    autoYes: args.includes('--yes'),
    includeMarkdown: args.includes('--include-markdown'),
    cwd: cwdIndex !== -1 && args[cwdIndex + 1]
      ? path.resolve(args[cwdIndex + 1])
      : process.cwd(),
    only: onlyArg ? onlyArg.slice('--only='.length).split(',').map(s => s.trim()).filter(Boolean) : [],
  };
}

async function prompt (question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function scanFiles (cwd, includeMarkdown, only) {
  const extensions = ['.vue'];
  if (includeMarkdown) extensions.push('.md');
  const ignore = ['node_modules', 'dist', '.git', '.vuepress/public', '.vuepress/.temp', '.vuepress/.cache'];
  const files = await findFiles(cwd, extensions, ignore);

  const changes = [];
  const allWarnings = [];
  const allNotes = []; // grouped per file

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const { transformed, warnings, notes } = transformContent(content, {
      only,
      filePath: path.relative(cwd, file),
    });
    if (transformed !== content) {
      changes.push({ file, content, transformed });
    }
    if (warnings.length) allWarnings.push(...warnings);
    if (notes.length) {
      allNotes.push({
        file: path.relative(cwd, file),
        notes,
      });
    }
  }

  return { changes, allWarnings, allNotes };
}

async function applyChanges (changes, autoYes) {
  if (!autoYes) {
    const answer = await prompt('\nApply changes? (y/N) ');
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Cancelled.');
      return false;
    }
  }
  for (const { file, transformed } of changes) {
    await fs.writeFile(file, transformed, 'utf8');
  }
  return true;
}

function printWarnings (warnings) {
  if (!warnings.length) return;
  console.log('\nWarnings — manual action required:\n');
  for (const w of warnings) console.log(`  ${w}`);
  console.log();
}

function printNotes (notesByFile) {
  if (!notesByFile.length) return;
  console.log('\nNotes — informational:\n');
  for (const { file, notes } of notesByFile) {
    // Group same-message notes per file into a single line with a count
    const counts = new Map();
    for (const n of notes) {
      counts.set(n.message, (counts.get(n.message) || 0) + 1);
    }
    for (const [message, count] of counts) {
      const prefix = count > 1 ? `${count}× ` : '';
      console.log(`  ${file}: ${prefix}${message}`);
    }
  }
  console.log();
}

function printChangeSummary (changes, cwd) {
  console.log(`\nFound changes in ${changes.length} file(s):\n`);
  for (const { file } of changes) {
    console.log(`  ${path.relative(cwd, file)}`);
  }
}

async function main () {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  // Validate --only list
  if (opts.only.length) {
    const invalid = opts.only.filter(t => !ALL_TRANSFORMS.includes(t));
    if (invalid.length) {
      console.error(`Unknown transform(s) in --only: ${invalid.join(', ')}`);
      console.error(`Valid transforms: ${ALL_TRANSFORMS.join(', ')}`);
      process.exit(2);
    }
  }

  console.log(`\nScanning ${opts.cwd} for legacy link/button patterns...`);
  if (opts.includeMarkdown) console.log('(including .md files)');
  if (opts.only.length) console.log(`(only: ${opts.only.join(', ')})`);

  const { changes, allWarnings, allNotes } = await scanFiles(opts.cwd, opts.includeMarkdown, opts.only);

  printWarnings(allWarnings);
  printNotes(allNotes);

  if (changes.length === 0) {
    console.log(allWarnings.length || allNotes.length
      ? 'No automated code changes needed. See manual action items / notes above.'
      : 'No matching usage found. Nothing to migrate.');
    process.exit(0);
  }

  printChangeSummary(changes, opts.cwd);

  if (opts.dryRun) {
    console.log(`\n--dry-run: No files were modified.`);
    process.exit(0);
  }

  const applied = await applyChanges(changes, opts.autoYes);
  if (applied) console.log(`\nMigrated ${changes.length} file(s).\n`);
}

const isDirectRun = (() => {
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
