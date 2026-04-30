/**
 * markdown-it plugin that transforms GFM-style blockquote alerts into
 * <dt-notice> Vue components.
 *
 * Syntax:
 *   > [!WARNING] Optional title
 *   > Body text with **markdown** and [links](/path).
 *
 * Supported kinds: BASE, INFO, POSITIVE, WARNING, CRITICAL
 * (uppercase by convention, case-insensitive — maps to DtNotice's `kind` prop).
 * Legacy `SUCCESS` and `ERROR` aliases are accepted and translated to
 * `positive` / `critical` before being passed to DtNotice — DtNotice's
 * validator only accepts the canonical names since DLT-3157.
 *
 * Always outputs: :show-close="false", class="d-wmx100p d-my-200"
 *
 * Two-pass design:
 *   1. `notice_detect` runs BEFORE inline parsing — matches [!KIND] in raw
 *      text, strips the marker line, and stores kind/title on the token.
 *   2. `notice_render` runs AFTER all other core rules (including
 *      markdownItClass) — renders the fully-processed body tokens and wraps
 *      them in a <dt-notice> html_block.
 */

import { encodeForAttr } from './fenced-demo-shared.js';

const ALERT_RE = /^\[!(base|critical|error|info|positive|success|warning)\][ \t]*(.*)/i;
const KIND_ALIASES = { error: 'critical', success: 'positive' };

export default function noticePlugin (md) {
  // Pass 1: Before inline parsing — detect [!KIND] marker and strip it.
  // At this stage inline tokens have `content` (raw text) but no `children`.
  md.core.ruler.before('inline', 'notice_detect', function (state) {
    const tokens = state.tokens;

    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].type !== 'blockquote_open') continue;

      const closeIdx = findMatchingClose(tokens, i, 'blockquote_open', 'blockquote_close');
      if (closeIdx === -1) continue;

      // Find first inline token inside the blockquote
      let firstInlineIdx = -1;
      for (let j = i + 1; j < closeIdx; j++) {
        if (tokens[j].type === 'inline') {
          firstInlineIdx = j;
          break;
        }
      }
      if (firstInlineIdx === -1) continue;

      const firstInline = tokens[firstInlineIdx];
      const lines = firstInline.content.split('\n');
      const match = ALERT_RE.exec(lines[0]);
      if (!match) continue;

      const rawKind = match[1].toLowerCase();
      const kind = KIND_ALIASES[rawKind] || rawKind;
      const title = match[2].trim();

      // Mark the blockquote for pass 2
      tokens[i].meta = tokens[i].meta || {};
      tokens[i].meta.notice = { kind, title: title || null };

      // Remove the [!KIND] line from inline content
      lines.shift();

      if (lines.length > 0 && lines.some(l => l.trim() !== '')) {
        // Remaining lines become the new content for inline parsing
        firstInline.content = lines.join('\n');
      } else {
        // First paragraph is now empty — remove paragraph_open + inline + paragraph_close
        const pOpenIdx = firstInlineIdx - 1;
        if (pOpenIdx > i && tokens[pOpenIdx].type === 'paragraph_open') {
          tokens.splice(pOpenIdx, 3);
        }
      }
    }
  });

  // Pass 2: After all core rules (including markdownItClass) — render marked
  // blockquotes as <dt-notice> HTML blocks.
  md.core.ruler.push('notice_render', function (state) {
    const tokens = state.tokens;

    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].type !== 'blockquote_open') continue;
      if (!tokens[i].meta?.notice) continue;

      const { kind, title } = tokens[i].meta.notice;
      const closeIdx = findMatchingClose(tokens, i, 'blockquote_open', 'blockquote_close');
      if (closeIdx === -1) continue;

      // Extract body tokens (everything between blockquote_open and blockquote_close)
      const bodyTokens = tokens.slice(i + 1, closeIdx);
      let bodyHtml = bodyTokens.length > 0
        ? md.renderer.render(bodyTokens, md.options, state.env)
        : '';

      // Strip <p> wrappers — DtNotice wraps slot content in its own <p>.
      // Keeping them creates invalid nested <p><p>...</p></p>.
      // Adjacent paragraphs get <br> separators; remaining <p> tags are
      // removed so block elements like <ul> don't cause orphaned </p>.
      bodyHtml = bodyHtml
        .replace(/<\/p>\s*<p[^>]*>/g, '<br>')
        .replace(/<p[^>]*>/g, '')
        .replace(/<\/p>/g, '');

      // Build <dt-notice> tag. DtNotice's title prop was renamed to
      // header-text in DLT-3284; using the deprecated `title` attribute
      // would be silently ignored.
      const attrs = [`kind="${kind}"`];
      if (title) {
        attrs.push(`header-text="${encodeForAttr(title)}"`);
      }
      attrs.push(':show-close="false"', 'class="d-wmx100p d-my-200 dialtone-doc-notice"');

      const html = `<dt-notice ${attrs.join(' ')}>\n${bodyHtml}</dt-notice>\n`;

      const newToken = new state.Token('html_block', '', 0);
      newToken.content = html;
      tokens.splice(i, closeIdx - i + 1, newToken);
    }
  });
}

/**
 * Find the matching close token for an open token, accounting for nesting.
 */
function findMatchingClose (tokens, openIdx, openType, closeType) {
  let depth = 1;
  for (let j = openIdx + 1; j < tokens.length; j++) {
    if (tokens[j].type === openType) depth++;
    if (tokens[j].type === closeType) depth--;
    if (depth === 0) return j;
  }
  return -1;
}
