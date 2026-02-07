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
import { transformVueApi } from './transform-vue-api.mjs';
import { transformClassTable, transformAccessibleTable } from './transform-class-table.mjs';
import { transformHtmlTable } from './transform-html-table.mjs';
import {
  transformDesignColorTable,
  transformThemeColorTable,
  transformColorsCatalog,
  parseExclusionList,
} from './transform-color-tables.mjs';
import { transformNewUtilityClassTable, transformOldUtilityClassTable } from './transform-utility-class-table.mjs';
import { transformAllTokens } from './transform-tokens.mjs';
import { transformIconCatalog, transformIllustrationCatalog } from './transform-icon-catalog.mjs';
import { isStandaloneVueComponentLine, cleanupOutput } from './utils.mjs';

const State = {
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
};

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
  const output = [];
  let state = State.NORMAL;
  let accumulator = []; // for multi-line component blocks
  let fencedCodeMarker = ''; // tracks the ``` marker for fenced code
  let inSingleQuoteAttr = false; // tracks whether we're inside a single-quoted attribute value
  let frontmatterTitle = '';
  let frontmatterHeading = '';
  let frontmatterDescription = '';
  let frontmatterAuthor = '';
  let frontmatterPosted = '';
  let frontmatterSeen = false;
  let tableNestDepth = 0;
  let utilityTableIsNew = false; // tracks which utility table variant we're in

  // First pass: extract <script setup> content for utility class prefix lookup
  let scriptSetupContent = '';
  {
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
    scriptSetupContent = scriptLines.join('\n');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── FENCED_CODE state (highest priority) ──────────────────────
    if (state === State.FENCED_CODE) {
      output.push(line);
      if (trimmed.startsWith(fencedCodeMarker) && trimmed.slice(fencedCodeMarker.length).trim() === '') {
        state = State.NORMAL;
        fencedCodeMarker = '';
      }
      continue;
    }

    // Detect fenced code block start (must be checked before anything else in NORMAL)
    if (state === State.NORMAL) {
      const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);
      if (fenceMatch) {
        fencedCodeMarker = fenceMatch[1];
        state = State.FENCED_CODE;
        output.push(line);
        continue;
      }
    }

    // ── FRONTMATTER state ─────────────────────────────────────────
    if (state === State.FRONTMATTER) {
      if (trimmed === '---') {
        // End of frontmatter — emit title heading and description
        state = State.NORMAL;
        const displayTitle = frontmatterTitle || frontmatterHeading;
        // Emit reduced frontmatter
        output.push('---');
        if (displayTitle) output.push(`title: ${displayTitle}`);
        if (frontmatterDescription) output.push(`description: ${frontmatterDescription}`);
        if (frontmatterAuthor) output.push(`author: ${frontmatterAuthor}`);
        if (frontmatterPosted) output.push(`posted: ${frontmatterPosted}`);
        output.push('---');
        output.push('');
        if (displayTitle) {
          output.push(`# ${displayTitle}`);
          output.push('');
        }
        if (frontmatterDescription) {
          output.push(frontmatterDescription);
          output.push('');
        }
      } else {
        // Extract title, heading, description, author, posted from frontmatter
        const titleMatch = trimmed.match(/^title:\s*(.+)/);
        if (titleMatch) frontmatterTitle = titleMatch[1].replace(/^['"]|['"]$/g, '').trim();
        const headingMatch = trimmed.match(/^heading:\s*(.+)/);
        if (headingMatch) frontmatterHeading = headingMatch[1].replace(/^['"]|['"]$/g, '').trim();
        const descMatch = trimmed.match(/^description:\s*(.+)/);
        if (descMatch) frontmatterDescription = descMatch[1].replace(/^['"]|['"]$/g, '').trim();
        const authorMatch = trimmed.match(/^author:\s*(.+)/);
        if (authorMatch) frontmatterAuthor = authorMatch[1].replace(/^['"]|['"]$/g, '').trim();
        const postedMatch = trimmed.match(/^posted:\s*(.+)/);
        if (postedMatch) frontmatterPosted = postedMatch[1].replace(/^['"]|['"]$/g, '').trim();
      }
      continue;
    }

    // Detect frontmatter start (only at line 0)
    if (i === 0 && trimmed === '---' && !frontmatterSeen) {
      state = State.FRONTMATTER;
      frontmatterSeen = true;
      continue;
    }

    // ── HTML_COMMENT state ────────────────────────────────────────
    if (state === State.HTML_COMMENT) {
      if (trimmed.includes('-->')) {
        state = State.NORMAL;
      }
      continue;
    }

    // Detect single-line HTML comment
    if (state === State.NORMAL && trimmed.startsWith('<!--')) {
      if (trimmed.includes('-->')) {
        // Single-line comment — remove entirely
        continue;
      }
      // Multi-line comment starts
      state = State.HTML_COMMENT;
      continue;
    }

    // ── SCRIPT_SETUP state ────────────────────────────────────────
    if (state === State.SCRIPT_SETUP) {
      if (trimmed === '</script>' || trimmed.startsWith('</script>')) {
        state = State.NORMAL;
      }
      continue;
    }

    // Detect <script setup>
    if (state === State.NORMAL && trimmed.match(/^<script\b/)) {
      state = State.SCRIPT_SETUP;
      continue;
    }

    // ── STYLE_BLOCK state ──────────────────────────────────────────
    if (state === State.STYLE_BLOCK) {
      if (trimmed === '</style>' || trimmed.startsWith('</style>')) {
        state = State.NORMAL;
      }
      continue;
    }

    // Detect <style>
    if (state === State.NORMAL && trimmed.match(/^<style\b/)) {
      state = State.STYLE_BLOCK;
      continue;
    }

    // ── CODE_WELL_HEADER state ────────────────────────────────────
    if (state === State.CODE_WELL_HEADER) {
      if (trimmed === '</code-well-header>') {
        state = State.NORMAL;
      }
      continue;
    }

    // Detect <code-well-header>
    if (state === State.NORMAL && trimmed.startsWith('<code-well-header')) {
      // Check if self-closing on same line
      if (trimmed.includes('</code-well-header>') || trimmed.endsWith('/>')) {
        continue;
      }
      state = State.CODE_WELL_HEADER;
      continue;
    }

    // ── UTILITY_CLASS_TABLE state ─────────────────────────────────
    if (state === State.UTILITY_CLASS_TABLE) {
      if (
        (utilityTableIsNew && trimmed === '</new-utility-class-table>') ||
        (!utilityTableIsNew && trimmed === '</utility-class-table>')
      ) {
        // Emit the transformed table
        if (utilityTableIsNew) {
          const result = transformNewUtilityClassTable(scriptSetupContent);
          output.push(...result);
        } else {
          const result = transformOldUtilityClassTable(filePath, utilitiesDir);
          output.push(...result);
        }
        state = State.NORMAL;
      }
      continue;
    }

    // Detect <new-utility-class-table> or <utility-class-table>
    if (state === State.NORMAL && (trimmed.startsWith('<new-utility-class-table') || trimmed.startsWith('<utility-class-table'))) {
      utilityTableIsNew = trimmed.startsWith('<new-utility-class-table');
      // Self-closing on same line
      if (trimmed.endsWith('/>')) {
        if (utilityTableIsNew) {
          const result = transformNewUtilityClassTable(scriptSetupContent);
          output.push(...result);
        } else {
          const result = transformOldUtilityClassTable(filePath, utilitiesDir);
          output.push(...result);
        }
        continue;
      }
      // Check for inline close
      if (trimmed.includes('</utility-class-table>') || trimmed.includes('</new-utility-class-table>')) {
        if (utilityTableIsNew) {
          const result = transformNewUtilityClassTable(scriptSetupContent);
          output.push(...result);
        } else {
          const result = transformOldUtilityClassTable(filePath, utilitiesDir);
          output.push(...result);
        }
        continue;
      }
      state = State.UTILITY_CLASS_TABLE;
      continue;
    }

    // ── <all-tokens /> ────────────────────────────────────────────
    if (state === State.NORMAL && trimmed.startsWith('<all-tokens')) {
      const result = transformAllTokens();
      output.push(...result);
      // If not self-closing, consume until closing tag
      if (!trimmed.endsWith('/>') && !trimmed.includes('</all-tokens>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim().includes('</all-tokens>')) break;
        }
      }
      continue;
    }

    // ── <icon-catalog> ────────────────────────────────────────────
    if (state === State.NORMAL && trimmed.startsWith('<icon-catalog')) {
      const result = transformIconCatalog();
      output.push(...result);
      // If not self-closing, consume until closing tag
      if (!trimmed.endsWith('/>') && !trimmed.includes('</icon-catalog>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim().includes('</icon-catalog>')) break;
        }
      }
      continue;
    }

    // ── <icons illustration> ──────────────────────────────────────
    if (state === State.NORMAL && trimmed.startsWith('<icons ') && trimmed.includes('illustration')) {
      const result = transformIllustrationCatalog();
      output.push(...result);
      // If not self-closing, consume until closing tag
      if (!trimmed.endsWith('/>') && !trimmed.includes('</icons>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim().includes('</icons>')) break;
        }
      }
      continue;
    }

    // ── ICONS_BLOCK state (for non-illustration <icons> tags) ─────
    // These are handled as standalone Vue component lines by the generic filter below.

    // ── CODE_EXAMPLE_TABS state ───────────────────────────────────
    if (state === State.CODE_EXAMPLE_TABS) {
      accumulator.push(line);
      // Track single-quote state to avoid false /> matches inside attribute values.
      // Count unescaped single quotes on this line to toggle the state.
      const singleQuoteCount = (trimmed.match(/'/g) || []).length;
      if (singleQuoteCount % 2 !== 0) {
        inSingleQuoteAttr = !inSingleQuoteAttr;
      }
      // Only terminate on /> when we're outside quoted attribute values
      if (!inSingleQuoteAttr && (trimmed === '/>' || trimmed.endsWith('/>'))) {
        const result = transformCodeExampleTabs(accumulator);
        output.push(...result);
        accumulator = [];
        state = State.NORMAL;
      }
      continue;
    }

    // Detect <code-example-tabs
    if (state === State.NORMAL && trimmed.startsWith('<code-example-tabs')) {
      inSingleQuoteAttr = false;
      accumulator = [line];
      // Count quotes on opening line
      const sqCount = (trimmed.match(/'/g) || []).length;
      if (sqCount % 2 !== 0) {
        inSingleQuoteAttr = true;
      }
      // Check if self-closing on same line (and not inside quotes)
      if (!inSingleQuoteAttr && trimmed.endsWith('/>')) {
        const result = transformCodeExampleTabs(accumulator);
        output.push(...result);
        accumulator = [];
      } else {
        state = State.CODE_EXAMPLE_TABS;
      }
      continue;
    }

    // ── DIALTONE_USAGE state ──────────────────────────────────────
    if (state === State.DIALTONE_USAGE) {
      accumulator.push(line);
      if (trimmed === '</dialtone-usage>') {
        const result = transformUsage(accumulator);
        output.push(...result);
        accumulator = [];
        state = State.NORMAL;
      }
      continue;
    }

    // Detect <dialtone-usage>
    if (state === State.NORMAL && trimmed.startsWith('<dialtone-usage')) {
      accumulator = [line];
      if (trimmed === '</dialtone-usage>') {
        // Empty — skip
        accumulator = [];
      } else {
        state = State.DIALTONE_USAGE;
      }
      continue;
    }

    // ── HTML_TABLE state ──────────────────────────────────────────
    if (state === State.HTML_TABLE) {
      accumulator.push(line);
      // Track nested tables
      if (trimmed.match(/^<table[\s>]/i)) {
        tableNestDepth++;
      }
      if (trimmed.match(/<\/table>/i)) {
        tableNestDepth--;
        if (tableNestDepth <= 0) {
          const result = transformHtmlTable(accumulator);
          output.push(...result);
          accumulator = [];
          tableNestDepth = 0;
          state = State.NORMAL;
        }
      }
      continue;
    }

    // Detect <table>
    if (state === State.NORMAL && trimmed.match(/^<table[\s>]/i)) {
      accumulator = [line];
      tableNestDepth = 1;
      state = State.HTML_TABLE;
      continue;
    }

    // ── NORMAL state — handle inline component tags ───────────────

    // <component-vue-api component-name="X" />
    const vueApiMatch = trimmed.match(/<component-vue-api\s+component-name="([^"]+)"/);
    if (vueApiMatch) {
      const result = transformVueApi(vueApiMatch[1]);
      output.push(...result);
      continue;
    }

    // <component-class-table component-name="X">
    const classTableMatch = trimmed.match(/<component-class-table\s+component-name="([^"]+)"/);
    if (classTableMatch) {
      const result = transformClassTable(classTableMatch[1], dataDir);
      output.push(...result);
      // If it's not self-closing, skip until closing tag
      if (!trimmed.endsWith('/>') && !trimmed.includes('</component-class-table>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim().includes('</component-class-table>')) break;
        }
      }
      continue;
    }

    // <component-accessible-table component-name="X">
    const accessibleTableMatch = trimmed.match(/<component-accessible-table\s+component-name="([^"]+)"/);
    if (accessibleTableMatch) {
      const result = transformAccessibleTable(accessibleTableMatch[1], dataDir);
      output.push(...result);
      if (!trimmed.endsWith('/>') && !trimmed.includes('</component-accessible-table>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim().includes('</component-accessible-table>')) break;
        }
      }
      continue;
    }

    // <DesignColorTable class-prefix="d-fc-" :excluded-colors="varName">
    if (trimmed.startsWith('<DesignColorTable')) {
      const prefixMatch = trimmed.match(/class-prefix="([^"]+)"/);
      const classPrefix = prefixMatch ? prefixMatch[1] : '';
      const excludeMatch = trimmed.match(/:excluded-colors="([^"]+)"/);
      const excludedColors = excludeMatch
        ? parseExclusionList(scriptSetupContent, excludeMatch[1])
        : [];
      const result = transformDesignColorTable(classPrefix, excludedColors);
      output.push(...result);
      // Consume until closing tag (these have template slot children)
      if (!trimmed.endsWith('/>') && !trimmed.includes('</DesignColorTable>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim() === '</DesignColorTable>') break;
        }
      }
      continue;
    }

    // <ThemeColorTable>
    if (trimmed.startsWith('<ThemeColorTable')) {
      const result = transformThemeColorTable();
      output.push(...result);
      if (!trimmed.endsWith('/>') && !trimmed.includes('</ThemeColorTable>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim() === '</ThemeColorTable>') break;
        }
      }
      continue;
    }

    // <ColorsCatalog mode="light">
    if (trimmed.startsWith('<ColorsCatalog')) {
      const modeMatch = trimmed.match(/mode="([^"]+)"/);
      const mode = modeMatch ? modeMatch[1] : 'light';
      const result = transformColorsCatalog(mode);
      output.push(...result);
      if (!trimmed.endsWith('/>') && !trimmed.includes('</ColorsCatalog>')) {
        while (i + 1 < lines.length) {
          i++;
          if (lines[i].trim() === '</ColorsCatalog>') break;
        }
      }
      continue;
    }

    // <FlexStackNotice /> or <FlexStackNotice>
    if (trimmed.startsWith('<FlexStackNotice') || trimmed.startsWith('<flex-stack-notice')) {
      output.push('> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](/components/stack) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.');
      output.push('');
      if (!trimmed.endsWith('/>') && !trimmed.includes('</FlexStackNotice>') && !trimmed.includes('</flex-stack-notice>')) {
        while (i + 1 < lines.length) {
          i++;
          const t = lines[i].trim();
          if (t === '</FlexStackNotice>' || t === '</flex-stack-notice>') break;
        }
      }
      continue;
    }

    // <FontUtilitiesNotice /> or <FontUtilitiesNotice>
    if (trimmed.startsWith('<FontUtilitiesNotice') || trimmed.startsWith('<font-utilities-notice')) {
      output.push('> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](/components/text) component before considering any typography utility.');
      output.push('');
      if (!trimmed.endsWith('/>') && !trimmed.includes('</FontUtilitiesNotice>') && !trimmed.includes('</font-utilities-notice>')) {
        while (i + 1 < lines.length) {
          i++;
          const t = lines[i].trim();
          if (t === '</FontUtilitiesNotice>' || t === '</font-utilities-notice>') break;
        }
      }
      continue;
    }

    // <ButtonVariantsTable /> or <ButtonVariantsTable>
    if (trimmed.startsWith('<ButtonVariantsTable') || trimmed.startsWith('<button-variants-table')) {
      output.push('| | clear | outlined | primary |');
      output.push('| --- | --- | --- | --- |');
      output.push('| **default** — Our default button colors. | Default level of importance. Typically used for secondary or minimally important actions. | Slightly more important than clear, presenting a contrasting border and transparent background. | Highest level of importance, presenting a solid background color. |');
      output.push('| **danger** — Potentially destructive or otherwise critical actions. | clear danger | outlined danger | primary danger |');
      output.push('| **positive** — Used to communicate positive actions. | clear positive | outlined positive | primary positive |');
      output.push('| **inverted** — Use for placement on non-white, dark backgrounds. | clear inverted | outlined inverted | primary inverted |');
      output.push('| **muted** — For non-primary actions and contexts where base style may not work. | clear muted | outlined muted | N/A |');
      output.push('| **unstyled** — Raw button devoid of any style. | N/A | N/A | N/A |');
      output.push('');
      if (!trimmed.endsWith('/>') && !trimmed.includes('</ButtonVariantsTable>') && !trimmed.includes('</button-variants-table>')) {
        while (i + 1 < lines.length) {
          i++;
          const t = lines[i].trim();
          if (t === '</ButtonVariantsTable>' || t === '</button-variants-table>') break;
        }
      }
      continue;
    }

    // Remove standalone Vue component lines
    if (isStandaloneVueComponentLine(trimmed)) {
      continue;
    }

    // Remove closing tags for Vue components we strip
    if (trimmed.match(/^<\/[A-Z]/) || (trimmed.match(/^<\/[a-z]+-/) && !trimmed.startsWith('</table') && !trimmed.startsWith('</code-well') && !trimmed.startsWith('</script'))) {
      // Check if it's a known HTML closing tag
      const closeTagMatch = trimmed.match(/^<\/([a-zA-Z][a-zA-Z0-9-]*)/);
      if (closeTagMatch) {
        const tagName = closeTagMatch[1].toLowerCase();
        const knownHtml = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
          'div', 'span', 'p', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'pre', 'code', 'blockquote', 'section', 'header', 'footer', 'nav', 'main']);
        if (!knownHtml.has(tagName)) {
          continue;
        }
      }
    }

    // Convert inline <router-link to="...">text</router-link> to markdown links
    let processedLine = line;
    if (processedLine.includes('<router-link')) {
      processedLine = processedLine.replace(
        /<router-link\b[^>]*\bto="([^"]*)"[^>]*>(.*?)<\/router-link>/g,
        '[$2]($1)',
      );
    }

    // Pass through standard markdown
    output.push(processedLine);
  }

  return cleanupOutput(output.join('\n'));
}
