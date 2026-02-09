/**
 * State-machine parser that transforms a component .md source file
 * into clean GFM markdown.
 *
 * States:
 *   NORMAL          — default, pass-through for standard markdown
 *   FRONTMATTER     — inside YAML --- block
 *   FENCED_CODE     — inside ``` fenced code block (highest priority)
 *   CODE_WELL_HEADER — inside <code-well-header>...</code-well-header> (remove)
 *   CODE_EXAMPLE_TABS — accumulating <code-example-tabs ... /> lines
 *   DIALTONE_USAGE  — inside <dialtone-usage>...</dialtone-usage>
 *   UTILITY_CLASS_TABLE — inside <utility-class-table> or <new-utility-class-table>
 *   HTML_TABLE      — inside <table>...</table>
 *   SCRIPT_SETUP    — inside <script setup>...</script>
 *   STYLE_BLOCK     — inside <style>...</style>
 *   HTML_COMMENT    — inside multi-line <!-- ... -->
 *   ICONS_BLOCK     — inside <icons ...>...</icons> (non-self-closing)
 */

import { transformCodeExampleTabs } from './transform-code-example-tabs.mjs';
import { transformUsage } from './transform-usage.mjs';
import { transformHtmlTable } from './transform-html-table.mjs';
import { transformNewUtilityClassTable, transformOldUtilityClassTable } from './transform-utility-class-table.mjs';
import { isStandaloneVueComponentLine, cleanupOutput, PASSTHROUGH_COMPONENTS } from './utils.mjs';
import { INLINE_HANDLERS, consumeUntilClose, parseFrontmatterField } from './component-handlers.mjs';

const S = {
  NORMAL: 'NORMAL',
  FRONTMATTER: 'FRONTMATTER',
  FENCED_CODE: 'FENCED_CODE',
  CODE_WELL_HEADER: 'CODE_WELL_HEADER',
  CODE_EXAMPLE_TABS: 'CODE_EXAMPLE_TABS',
  DIALTONE_USAGE: 'DIALTONE_USAGE',
  UTILITY_CLASS_TABLE: 'UTILITY_CLASS_TABLE',
  HTML_TABLE: 'HTML_TABLE',
  SCRIPT_SETUP: 'SCRIPT_SETUP',
  STYLE_BLOCK: 'STYLE_BLOCK',
  HTML_COMMENT: 'HTML_COMMENT',
  ICONS_BLOCK: 'ICONS_BLOCK',
  DT_NOTICE: 'DT_NOTICE',
};

/**
 * Extract <script setup> content from source lines.
 */
function extractScriptSetup (lines) {
  let inScript = false;
  const scriptLines = [];
  for (const line of lines) {
    const t = line.trim();
    if (!inScript && t.match(/^<script\b/)) {
      inScript = true;
      scriptLines.push(line);
      continue;
    }
    if (inScript) {
      scriptLines.push(line);
      if (t === '</script>' || t.startsWith('</script>')) {
        inScript = false;
      }
    }
  }
  return scriptLines.join('\n');
}

/**
 * Process a frontmatter line, extracting known fields.
 */
function extractFrontmatterFields (trimmed, fm) {
  for (const field of ['title', 'heading', 'description', 'author', 'posted', 'status', 'storybook', 'keywords']) {
    const val = parseFrontmatterField(trimmed, field);
    if (val !== null) fm[field] = val;
  }
}

/**
 * Emit the title, description, and metadata as plain markdown (no YAML frontmatter).
 */
function emitFrontmatter (fm, output) {
  const displayTitle = fm.title || fm.heading;
  if (displayTitle) {
    output.push(`# ${displayTitle}`);
    output.push('');
  }
  if (fm.description) {
    output.push(fm.description);
    output.push('');
  }
  const meta = [];
  if (fm.status) meta.push(`- **Status**: ${fm.status}`);
  if (fm.storybook) meta.push(`- **Storybook**: ${fm.storybook}`);
  if (fm.keywords) meta.push(`- **Keywords**: ${fm.keywords.replace(/^\[|]$/g, '').replace(/"/g, '').replace(/,(?!\s)/g, ', ')}`);
  if (fm.author) meta.push(`- **Author**: ${fm.author}`);
  if (fm.posted) meta.push(`- **Posted**: ${fm.posted}`);
  if (meta.length > 0) {
    output.push(...meta);
    output.push('');
  }
}

/**
 * Emit the appropriate utility class table result.
 */
function emitUtilityTable (isNew, ctx, output) {
  const result = isNew
    ? transformNewUtilityClassTable(ctx.scriptSetupContent)
    : transformOldUtilityClassTable(ctx.filePath, ctx.utilitiesDir);
  output.push(...result);
}

/**
 * Check if a closing tag is a Vue component (not standard HTML).
 */
const KNOWN_CLOSING_HTML = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'div', 'span', 'p', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'pre', 'code', 'blockquote', 'section', 'header', 'footer', 'nav', 'main']);

function isVueClosingTag (trimmed) {
  if (!trimmed.match(/^<\/[A-Z]/) && !(trimmed.match(/^<\/[a-z]+-/) && !trimmed.startsWith('</table') && !trimmed.startsWith('</code-well') && !trimmed.startsWith('</script'))) {
    return false;
  }
  const m = trimmed.match(/^<\/([a-zA-Z][a-zA-Z0-9-]*)/);
  return m ? !KNOWN_CLOSING_HTML.has(m[1].toLowerCase()) : false;
}

// ── State handler: FENCED_CODE ───────────────────────────────────
function handleFencedCode (ctx) {
  ctx.output.push(ctx.line);
  if (ctx.trimmed.startsWith(ctx.fencedCodeMarker) && ctx.trimmed.slice(ctx.fencedCodeMarker.length).trim() === '') {
    ctx.state = S.NORMAL;
    ctx.fencedCodeMarker = '';
  }
}

// ── State handler: FRONTMATTER ───────────────────────────────────
function handleFrontmatter (ctx) {
  if (ctx.trimmed === '---') {
    ctx.state = S.NORMAL;
    emitFrontmatter(ctx.fm, ctx.output);
  } else {
    extractFrontmatterFields(ctx.trimmed, ctx.fm);
  }
}

// ── State handler: skip-until-close states ────────────────────────
function handleSkipUntilClose (ctx, closeTag, nextState) {
  if (ctx.trimmed === closeTag || ctx.trimmed.startsWith(closeTag)) {
    ctx.state = nextState;
  }
}

// ── State handler: UTILITY_CLASS_TABLE ────────────────────────────
function handleUtilityClassTableState (ctx) {
  if (
    (ctx.utilityTableIsNew && ctx.trimmed === '</new-utility-class-table>') ||
    (!ctx.utilityTableIsNew && ctx.trimmed === '</utility-class-table>')
  ) {
    emitUtilityTable(ctx.utilityTableIsNew, ctx, ctx.output);
    ctx.state = S.NORMAL;
  }
}

// ── State handler: CODE_EXAMPLE_TABS ──────────────────────────────
function handleCodeExampleTabsState (ctx) {
  ctx.accumulator.push(ctx.line);
  const sqCount = (ctx.trimmed.match(/'/g) || []).length;
  if (sqCount % 2 !== 0) ctx.inSingleQuoteAttr = !ctx.inSingleQuoteAttr;
  if (!ctx.inSingleQuoteAttr && (ctx.trimmed === '/>' || ctx.trimmed.endsWith('/>'))) {
    ctx.output.push(...transformCodeExampleTabs(ctx.accumulator));
    ctx.accumulator = [];
    ctx.state = S.NORMAL;
  }
}

// ── State handler: DIALTONE_USAGE ─────────────────────────────────
function handleDialtoneUsageState (ctx) {
  ctx.accumulator.push(ctx.line);
  if (ctx.trimmed === '</dialtone-usage>') {
    ctx.output.push(...transformUsage(ctx.accumulator));
    ctx.accumulator = [];
    ctx.state = S.NORMAL;
  }
}

// ── State handler: HTML_TABLE ─────────────────────────────────────
function handleHtmlTableState (ctx) {
  ctx.accumulator.push(ctx.line);
  if (ctx.trimmed.match(/^<table[\s>]/i)) ctx.tableNestDepth++;
  if (ctx.trimmed.match(/<\/table>/i)) {
    ctx.tableNestDepth--;
    if (ctx.tableNestDepth <= 0) {
      ctx.output.push(...transformHtmlTable(ctx.accumulator));
      ctx.accumulator = [];
      ctx.tableNestDepth = 0;
      ctx.state = S.NORMAL;
    }
  }
}

// ── Detect state transitions from NORMAL ──────────────────────────
function tryDetectFencedCode (ctx) {
  const fenceMatch = ctx.trimmed.match(/^(`{3,}|~{3,})/);
  if (!fenceMatch) return false;
  ctx.fencedCodeMarker = fenceMatch[1];
  ctx.state = S.FENCED_CODE;
  ctx.output.push(ctx.line);
  return true;
}

function tryDetectComment (ctx) {
  if (!ctx.trimmed.startsWith('<!--')) return false;
  if (!ctx.trimmed.includes('-->')) ctx.state = S.HTML_COMMENT;
  return true;
}

function tryDetectScriptOrStyle (ctx) {
  if (ctx.trimmed.match(/^<script\b/)) { ctx.state = S.SCRIPT_SETUP; return true; }
  if (ctx.trimmed.match(/^<style\b/)) { ctx.state = S.STYLE_BLOCK; return true; }
  return false;
}

function tryDetectCodeWellHeader (ctx) {
  if (!ctx.trimmed.startsWith('<code-well-header')) return false;
  if (!ctx.trimmed.includes('</code-well-header>') && !ctx.trimmed.endsWith('/>')) {
    ctx.state = S.CODE_WELL_HEADER;
  }
  return true;
}

function tryDetectUtilityClassTable (ctx) {
  if (!ctx.trimmed.startsWith('<new-utility-class-table') && !ctx.trimmed.startsWith('<utility-class-table')) return false;
  ctx.utilityTableIsNew = ctx.trimmed.startsWith('<new-utility-class-table');
  if (ctx.trimmed.endsWith('/>') || ctx.trimmed.includes('</utility-class-table>') || ctx.trimmed.includes('</new-utility-class-table>')) {
    emitUtilityTable(ctx.utilityTableIsNew, ctx, ctx.output);
    return true;
  }
  ctx.state = S.UTILITY_CLASS_TABLE;
  return true;
}

function tryDetectCodeExampleTabs (ctx) {
  if (!ctx.trimmed.startsWith('<code-example-tabs')) return false;
  ctx.inSingleQuoteAttr = false;
  ctx.accumulator = [ctx.line];
  const sqCount = (ctx.trimmed.match(/'/g) || []).length;
  if (sqCount % 2 !== 0) ctx.inSingleQuoteAttr = true;
  if (!ctx.inSingleQuoteAttr && ctx.trimmed.endsWith('/>')) {
    ctx.output.push(...transformCodeExampleTabs(ctx.accumulator));
    ctx.accumulator = [];
  } else {
    ctx.state = S.CODE_EXAMPLE_TABS;
  }
  return true;
}

function tryDetectDialtoneUsage (ctx) {
  if (!ctx.trimmed.startsWith('<dialtone-usage')) return false;
  ctx.accumulator = [ctx.line];
  if (ctx.trimmed === '</dialtone-usage>') {
    ctx.accumulator = [];
  } else {
    ctx.state = S.DIALTONE_USAGE;
  }
  return true;
}

function tryDetectHtmlTable (ctx) {
  if (!ctx.trimmed.match(/^<table[\s>]/i)) return false;
  ctx.accumulator = [ctx.line];
  ctx.tableNestDepth = 1;
  ctx.state = S.HTML_TABLE;
  return true;
}

function tryInlineHandlers (ctx) {
  for (const handler of INLINE_HANDLERS) {
    const m = handler.match(ctx.trimmed);
    if (m) {
      ctx.output.push(...handler.handle(m, { ...ctx.handlerCtx, trimmed: ctx.trimmed }));
      ctx.i = consumeUntilClose(ctx.lines, ctx.i, ctx.trimmed, ...handler.closingTags);
      return true;
    }
  }
  return false;
}

function tryDetectFrontmatterStart (ctx) {
  if (ctx.i !== 0 || ctx.trimmed !== '---' || ctx.frontmatterSeen) return false;
  ctx.state = S.FRONTMATTER;
  ctx.frontmatterSeen = true;
  return true;
}

// ── Kind → GitHub alert mapping for dt-notice ────────────────────
const NOTICE_KIND_MAP = {
  warning: 'WARNING',
  info: 'NOTE',
  error: 'CAUTION',
  success: 'TIP',
  base: 'NOTE',
};

/**
 * Extract the `kind` attribute from a (possibly partial) tag string.
 */
function extractNoticeKind (tagText) {
  const m = tagText.match(/\bkind="([^"]*)"/);
  return m ? m[1] : null;
}

/**
 * Strip remaining inline HTML tags (but keep text content).
 */
function stripInlineHtml (text) {
  return text.replace(/<[^>]*>/g, '').trim();
}

function tryDetectDtNotice (ctx) {
  if (!ctx.trimmed.startsWith('<dt-notice')) return false;

  // Collect the full opening tag (may span multiple lines)
  let openTagText = ctx.trimmed;
  let openTagClosed = openTagText.includes('>');

  if (!openTagClosed) {
    // Multi-line opening tag — accumulate until we find the closing >
    const tagLines = [ctx.trimmed];
    while (!openTagClosed && ctx.i + 1 < ctx.lines.length) {
      ctx.i++;
      const nextTrimmed = ctx.lines[ctx.i].trim();
      tagLines.push(nextTrimmed);
      if (nextTrimmed.includes('>')) {
        openTagClosed = true;
      }
    }
    openTagText = tagLines.join(' ');
  }

  const kind = extractNoticeKind(openTagText) || 'base';
  ctx.noticeKind = kind;
  ctx.accumulator = [];
  ctx.state = S.DT_NOTICE;
  return true;
}

/**
 * Convert dt-notice template content into GFM alert lines.
 * @param {string} openingTag - The <dt-notice ...> opening tag (for kind extraction)
 * @param {string[]} bodyLines - Lines between <dt-notice> and </dt-notice>
 * @returns {string[]} - GFM alert markdown lines
 */
export function transformDtNotice (openingTag, bodyLines) {
  const kind = extractNoticeKind(openingTag) || 'base';
  const alertType = NOTICE_KIND_MAP[kind] || 'NOTE';

  const filtered = bodyLines.filter(l => {
    const t = l.trim();
    if (t.match(/^<template\b/)) return false;
    if (t === '</template>') return false;
    return true;
  });

  const joined = filtered.join('\n');
  const withLinks = convertRouterLinks(joined);
  const cleaned = stripInlineHtml(withLinks);
  const paragraphs = cleaned.split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const content = paragraphs.join('\n\n');

  if (!content) return [];
  const lines = [`> [!${alertType}]`];
  for (const line of content.split('\n')) {
    const trimmedLine = line.trim();
    lines.push(trimmedLine ? `> ${trimmedLine}` : '>');
  }
  lines.push('');
  return lines;
}

// ── State handler: DT_NOTICE ──────────────────────────────────────
function handleDtNoticeState (ctx) {
  if (ctx.trimmed === '</dt-notice>' || ctx.trimmed.startsWith('</dt-notice>')) {
    // Build the opening tag string for kind extraction
    const openingTag = `<dt-notice kind="${ctx.noticeKind}">`;
    const result = transformDtNotice(openingTag, ctx.accumulator);
    ctx.output.push(...result);

    ctx.accumulator = [];
    ctx.state = S.NORMAL;
    return;
  }

  ctx.accumulator.push(ctx.line);
}

/**
 * Detect passthrough wrapper components (e.g. <BlogPost>, <BlogPostPreview>).
 * Strips the opening/closing tags but keeps inner content for normal processing.
 */
function tryDetectPassthroughComponent (ctx) {
  const match = ctx.trimmed.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
  if (!match) return false;
  const tagName = match[1].toLowerCase();
  if (!PASSTHROUGH_COMPONENTS.has(tagName)) return false;

  // Closing tag — just skip it
  if (ctx.trimmed.startsWith('</')) return true;

  // Opening tag — skip attribute lines until we find the closing >
  if (!ctx.trimmed.includes('>')) {
    while (ctx.i + 1 < ctx.lines.length) {
      ctx.i++;
      if (ctx.lines[ctx.i].trim().includes('>')) break;
    }
  }
  return true;
}

/**
 * Remove Vue component tags that may span multiple lines and contain inner content.
 * Handles: orphaned closing tags, single-line self-closing tags, and multi-line
 * opening tags (with or without inner content up to the matching closing tag).
 */
function tryRemoveVueComponent (ctx) {
  // Orphaned closing tag — safety net
  if (isVueClosingTag(ctx.trimmed)) return true;

  // Must be a standalone Vue component opening tag
  if (!isStandaloneVueComponentLine(ctx.trimmed)) return false;

  // If the line is already a closing tag (handled above), skip
  if (ctx.trimmed.startsWith('</')) return true;

  // Single-line self-closing: <DtFoo ... />
  if (ctx.trimmed.endsWith('/>')) return true;

  // Single-line with closing tag on same line: <dt-foo>...</dt-foo>
  const tagMatch = ctx.trimmed.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/);
  if (!tagMatch) return true;
  const tagName = tagMatch[1];
  const closingTag = `</${tagName}>`;

  if (ctx.trimmed.includes('>') && ctx.trimmed.includes(closingTag)) return true;

  // Multi-line: advance past attribute lines until we find the end of the opening tag
  const openTagClosed = ctx.trimmed.includes('>');
  if (!openTagClosed) {
    while (ctx.i + 1 < ctx.lines.length) {
      ctx.i++;
      const nextTrimmed = ctx.lines[ctx.i].trim();
      if (nextTrimmed.includes('>')) break;
    }
  }

  // Check if the opening tag was self-closing (`/>`)
  const currentTrimmed = ctx.lines[ctx.i].trim();
  if (currentTrimmed.endsWith('/>') || currentTrimmed === '/>') return true;

  // Not self-closing — advance past inner content until the matching closing tag
  const closingTagLower = closingTag.toLowerCase();
  while (ctx.i + 1 < ctx.lines.length) {
    ctx.i++;
    const nextTrimmed = ctx.lines[ctx.i].trim();
    if (nextTrimmed.toLowerCase().startsWith(closingTagLower)) break;
  }

  return true;
}

/**
 * Detectors run in order for NORMAL state lines.
 * Each returns true if the line was consumed.
 */
const NORMAL_DETECTORS = [
  tryDetectFencedCode,
  tryDetectFrontmatterStart,
  tryDetectComment,
  tryDetectScriptOrStyle,
  tryDetectCodeWellHeader,
  tryDetectUtilityClassTable,
  tryDetectCodeExampleTabs,
  tryDetectDialtoneUsage,
  tryDetectHtmlTable,
  tryInlineHandlers,
  tryDetectDtNotice,
  tryDetectPassthroughComponent,
  tryRemoveVueComponent,
];

/**
 * Process a single line in NORMAL state, checking all detectors.
 * Returns true if the line was consumed.
 */
function processNormalLine (ctx) {
  for (const detector of NORMAL_DETECTORS) {
    if (detector(ctx)) return true;
  }
  return false;
}

/**
 * State dispatch table — maps non-NORMAL states to handler functions.
 */
const STATE_HANDLERS = {
  [S.FENCED_CODE]: handleFencedCode,
  [S.FRONTMATTER]: handleFrontmatter,
  [S.HTML_COMMENT]: (ctx) => handleSkipUntilClose(ctx, '-->', S.NORMAL),
  [S.SCRIPT_SETUP]: (ctx) => handleSkipUntilClose(ctx, '</script>', S.NORMAL),
  [S.STYLE_BLOCK]: (ctx) => handleSkipUntilClose(ctx, '</style>', S.NORMAL),
  [S.CODE_WELL_HEADER]: (ctx) => handleSkipUntilClose(ctx, '</code-well-header>', S.NORMAL),
  [S.UTILITY_CLASS_TABLE]: handleUtilityClassTableState,
  [S.CODE_EXAMPLE_TABS]: handleCodeExampleTabsState,
  [S.DIALTONE_USAGE]: handleDialtoneUsageState,
  [S.HTML_TABLE]: handleHtmlTableState,
  [S.DT_NOTICE]: handleDtNoticeState,
};

/**
 * Convert inline <router-link to="...">text</router-link> to markdown links.
 * Uses dotAll flag to handle router-link tags that span multiple lines.
 */
function convertRouterLinks (line) {
  if (!line.includes('<router-link')) return line;
  return line.replace(
    /<router-link\b[^>]*\bto="([^"]*)"[^>]*>(.*?)<\/router-link>/gs,
    (_, url, text) => `[${text.replace(/\s+/g, ' ').trim()}](${url})`,
  );
}

/**
 * Parse a component source markdown file and return clean GFM.
 *
 * @param {string} source - The raw source markdown content
 * @param {object} options
 * @param {string} options.dataDir - Absolute path to docs/_data/ directory
 * @param {string} [options.filePath] - Absolute path to the source .md file
 * @param {string} [options.utilitiesDir] - Absolute path to docs/utilities/ directory
 * @returns {string} - Clean GFM markdown
 */
export function parseSourceMarkdown (source, { dataDir, filePath, utilitiesDir }) {
  const lines = source.split('\n');
  const scriptSetupContent = extractScriptSetup(lines);
  const ctx = {
    lines,
    output: [],
    state: S.NORMAL,
    accumulator: [],
    fencedCodeMarker: '',
    inSingleQuoteAttr: false,
    frontmatterSeen: false,
    tableNestDepth: 0,
    utilityTableIsNew: false,
    fm: { title: '', heading: '', description: '', author: '', posted: '', status: '', storybook: '', keywords: '' },
    scriptSetupContent,
    filePath,
    utilitiesDir,
    handlerCtx: { dataDir, scriptSetupContent },
    i: 0,
    line: '',
    trimmed: '',
  };

  for (ctx.i = 0; ctx.i < lines.length; ctx.i++) {
    ctx.line = lines[ctx.i];
    ctx.trimmed = ctx.line.trim();

    const stateHandler = STATE_HANDLERS[ctx.state];
    if (stateHandler) {
      stateHandler(ctx);
      continue;
    }

    // NORMAL state — try all detectors
    if (processNormalLine(ctx)) continue;

    ctx.output.push(convertRouterLinks(ctx.line));
  }

  return cleanupOutput(ctx.output.join('\n'));
}
