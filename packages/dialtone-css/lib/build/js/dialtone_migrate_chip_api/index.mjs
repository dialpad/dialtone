#!/usr/bin/env node

/**
 * @fileoverview Migration script for the next-major DtChip API.
 *
 * Usage:
 *   npx dialtone-migrate-chip-api [--cwd ./src] [--dry-run] [--yes]
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

const QUOTE_AWARE_ATTRS = '(?:[^>"\']|"[^"]*"|\'[^\']*\')*';
const CHIP_NAMES = ['dt-chip', 'DtChip'];
const CHIP_OPEN_TAG_RE = new RegExp(`^<((?:dt-chip|DtChip)(?=[\\s/>]))(${QUOTE_AWARE_ATTRS})(\\s*\\/?>)`);
// Any open, close or self-closing tag. Groups: closing slash, name, attributes, self-closing slash.
const TAG_RE = new RegExp(`<(\\/?)([A-Za-z][\\w.:-]*)(${QUOTE_AWARE_ATTRS}?)(\\/?)>`, 'g');
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

// Old slot name -> new slot name.
const SLOT_RENAMES = { icon: 'startIcon', avatar: 'startAvatar' };

// Attributes are tokenized so that quoted values (labels, classes, expressions) are never mistaken for attributes.
// Each token covers the whole attribute: name plus `=value` when present. A trailing "/" is not a token.
const ATTR_RE = /([^\s"'=<>/]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;

function parseAttrs (attrs) {
  return [...attrs.matchAll(ATTR_RE)].map(match => ({
    name: match[1],
    value: match[2] ?? null,
    start: match.index,
    end: match.index + match[0].length,
  }));
}

const unquote = value => value.replace(/^(["'])(.*)\1$/, '$2');
const attrNames = prop => [prop, `:${prop}`, `v-bind:${prop}`];
const boundNames = prop => [`:${prop}`, `v-bind:${prop}`];

function hasAttr (attrs, prop) {
  return parseAttrs(attrs).some(token => attrNames(prop).includes(token.name));
}

function hasDynamicAttr (attrs, prop) {
  return parseAttrs(attrs).some(token => boundNames(prop).includes(token.name) && token.value !== null);
}

// An explicit literal false (interactive="false", :interactive="false") means the chip is not interactive.
// Any other value, including a dynamic expression, is treated as possibly interactive.
function isInteractive (attrs) {
  return parseAttrs(attrs)
    .filter(token => attrNames('interactive').includes(token.name))
    .some(token => token.value === null || unquote(token.value).trim() !== 'false');
}

function insertAttr (attrs, attr) {
  const leadingSpace = attrs.match(/^\s*/)[0];
  const rest = attrs.slice(leadingSpace.length).trimStart();
  // Keep multi-line tags one attribute per line.
  const separator = leadingSpace.includes('\n') ? leadingSpace : ' ';
  return `${leadingSpace || ' '}${attr}${rest ? `${separator}${rest}` : ''}`;
}

// Inserts right after the `after` attribute, on the same line or the next one, matching how it is laid out.
function insertAttrAfter (attrs, after, attr) {
  const token = parseAttrs(attrs).find(t => attrNames(after).includes(t.name));
  if (!token) return insertAttr(attrs, attr);
  const gap = attrs.slice(0, token.start).match(/\s*$/)[0] || ' ';
  return `${attrs.slice(0, token.end)}${gap}${attr}${attrs.slice(token.end)}`;
}

// 'static' for a literal true (bare, "" or "true"), 'false' for a literal false, 'dynamic' for any other
// expression, 'none' when the chip has no interactive attribute.
function interactiveState (attrs) {
  const token = parseAttrs(attrs).find(t => attrNames('interactive').includes(t.name));
  if (!token) return 'none';
  if (token.value === null) return 'static';
  const value = unquote(token.value).trim();
  if (value === 'false') return 'false';
  return value === '' || value === 'true' ? 'static' : 'dynamic';
}

function renameAttr (attrs, oldProp, newProp) {
  const renames = new Map(attrNames(oldProp).map((name, i) => [name, attrNames(newProp)[i]]));
  let result = attrs;
  // Back to front so earlier token offsets stay valid.
  for (const token of parseAttrs(attrs).filter(t => t.value !== null && renames.has(t.name)).reverse()) {
    result = result.slice(0, token.start) + renames.get(token.name) + result.slice(token.start + token.name.length);
  }
  return result;
}

function transformChipOpenTag (tag, warnings, filePath) {
  const match = tag.match(CHIP_OPEN_TAG_RE);
  if (!match) return tag;

  const [, tagName, originalAttrs, closer] = match;
  let attrs = originalAttrs;
  const hasShowClose = hasAttr(attrs, 'show-close') || hasAttr(attrs, 'showClose');

  if (!hasAttr(attrs, 'size')) {
    attrs = insertAttr(attrs, 'size="300"');
  }

  if (!hasShowClose) {
    const state = interactiveState(attrs);
    const hasSpread = parseAttrs(attrs).some(token => token.name === 'v-bind' && token.value !== null);
    if (state === 'static' && !hasSpread) {
      // showClose now defaults to false, so an interactive chip keeps its close button only with show-close.
      attrs = insertAttrAfter(attrs, 'interactive', 'show-close');
    } else if (state === 'static') {
      warnings.push(`CHIP_API_OMITTED_SHOW_CLOSE_SPREAD file=${filePath} (v-bind object may supply show-close)`);
    } else if (state === 'dynamic') {
      warnings.push(`CHIP_API_OMITTED_SHOW_CLOSE_DYNAMIC_INTERACTIVE file=${filePath}`
        + ' (add show-close if the chip can be interactive)');
    } else {
      warnings.push(`CHIP_API_OMITTED_SHOW_CLOSE_INTERACTIVE file=${filePath}`
        + ' (the close button needs both interactive and show-close)');
    }
  }

  if (hasDynamicAttr(attrs, 'show-close') || hasDynamicAttr(attrs, 'showClose')) {
    warnings.push(`CHIP_API_DYNAMIC_SHOW_CLOSE file=${filePath}`);
  }

  if (hasShowClose && !isInteractive(attrs)) {
    warnings.push(`CHIP_API_SHOW_CLOSE_WITHOUT_INTERACTIVE file=${filePath}`);
  }

  attrs = renameAttr(attrs, 'icon-class', 'start-icon-class');
  attrs = renameAttr(attrs, 'iconClass', 'startIconClass');
  attrs = renameAttr(attrs, 'avatar-class', 'start-avatar-class');
  attrs = renameAttr(attrs, 'avatarClass', 'startAvatarClass');

  return `<${tagName}${attrs}${closer}`;
}

// Renames the old slot names on one direct child of a chip: `#icon`, `v-slot:icon` and `slot="icon"`.
function renameSlotAttrs (attrs) {
  const found = { icon: false, avatar: false };
  let result = attrs;
  for (const token of parseAttrs(attrs).reverse()) {
    let oldSlot = null;
    let replacement = null;
    if (token.name.startsWith('#') && SLOT_RENAMES[token.name.slice(1)]) {
      oldSlot = token.name.slice(1);
      replacement = `#${SLOT_RENAMES[oldSlot]}${result.slice(token.start + token.name.length, token.end)}`;
    } else if (token.name.startsWith('v-slot:') && SLOT_RENAMES[token.name.slice(7)]) {
      oldSlot = token.name.slice(7);
      replacement = `v-slot:${SLOT_RENAMES[oldSlot]}${result.slice(token.start + token.name.length, token.end)}`;
    } else if (token.name === 'slot' && token.value !== null && SLOT_RENAMES[unquote(token.value)]) {
      oldSlot = unquote(token.value);
      const eq = result.slice(token.start + token.name.length, token.end - token.value.length);
      const quote = /^["']/.test(token.value) ? token.value[0] : '';
      replacement = `slot${eq}${quote}${SLOT_RENAMES[oldSlot]}${quote}`;
    }
    if (oldSlot) {
      found[oldSlot] = true;
      result = result.slice(0, token.start) + replacement + result.slice(token.end);
    }
  }
  return { attrs: result, found };
}

// Walks the tags once, tracking nesting, so that only the chip's own opening tag and its direct
// children's slots are touched. Slots of nested components (an avatar's #icon, a button's #icon) stay as is.
function transformChips (content, warnings, filePath) {
  const edits = [];
  const stack = [];

  for (const match of content.matchAll(TAG_RE)) {
    const [tag, closing, name, attrs, selfClosing] = match;
    const start = match.index;

    if (closing) {
      const idx = stack.findLastIndex(entry => entry.name === name);
      if (idx !== -1) stack.length = idx;
      continue;
    }

    const parent = stack[stack.length - 1];
    const isChip = CHIP_NAMES.includes(name);
    let text = tag;
    if (parent?.chip) {
      const { attrs: newAttrs, found } = renameSlotAttrs(attrs);
      text = `<${name}${newAttrs}${selfClosing}>`;
      if (newAttrs !== attrs && !parent.chip.renamed) warnings.push(`CHIP_API_SLOT_RENAMED file=${filePath}`);
      parent.chip.renamed ||= newAttrs !== attrs;
      parent.chip.icon ||= found.icon;
      parent.chip.avatar ||= found.avatar;
      if (parent.chip.icon && parent.chip.avatar && !parent.chip.conflict) {
        parent.chip.conflict = true;
        warnings.push(`CHIP_API_ICON_AVATAR_CONFLICT file=${filePath}`);
      }
    }
    if (isChip) text = transformChipOpenTag(text, warnings, filePath);
    if (text !== tag) edits.push({ start, end: start + tag.length, text });

    if (!selfClosing && !VOID_ELEMENTS.has(name.toLowerCase())) {
      stack.push({ name, chip: isChip ? { renamed: false, icon: false, avatar: false, conflict: false } : null });
    }
  }

  let result = content;
  // Back to front so earlier offsets stay valid.
  for (const edit of edits.reverse()) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  }
  return result;
}

function maskInertContent (content) {
  const token = Math.random().toString(36).slice(2, 10);
  const innerRe = /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/g;
  const segments = [];
  const masked = content.replace(innerRe, (match) => {
    const placeholder = ` DT_MIGRATE_INERT_${token}_${segments.length} `;
    segments.push(match);
    return placeholder;
  });
  return { masked, segments, token };
}

function unmaskInertContent (masked, segments, token) {
  return masked.replace(new RegExp(` DT_MIGRATE_INERT_${token}_(\\d+) `, 'g'), (_, idx) => segments[Number(idx)]);
}

export function transformContent (content, opts = {}) {
  const filePath = opts.filePath || '<input>';
  const warnings = [];
  if (!/(?:dt-chip|DtChip)/.test(content)) return { transformed: content, warnings };

  const { masked, segments, token } = maskInertContent(content);
  const transformed = transformChips(masked, warnings, filePath);

  return { transformed: unmaskInertContent(transformed, segments, token), warnings };
}

function isIgnoredPath (fullPath, ignore) {
  return ignore.some(ig => fullPath.split(path.sep).includes(ig));
}

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
      if (isIgnoredPath(fullPath, ignore)) continue;
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) results.push(fullPath);
    }
  }
  await walk(dir);
  return results;
}

function parseArgs (args) {
  const cwdIndex = args.indexOf('--cwd');
  return {
    help: args.includes('--help'),
    dryRun: args.includes('--dry-run'),
    autoYes: args.includes('--yes'),
    cwd: cwdIndex !== -1 && args[cwdIndex + 1] ? path.resolve(args[cwdIndex + 1]) : process.cwd(),
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

async function scanFiles (cwd) {
  const files = await findFiles(cwd, ['.vue'], ['node_modules', 'dist', '.git', '.vuepress']);
  const changes = [];
  const allWarnings = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const { transformed, warnings } = transformContent(content, { filePath: path.relative(cwd, file) });
    if (transformed !== content) changes.push({ file, transformed });
    allWarnings.push(...warnings);
  }

  return { changes, allWarnings };
}

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate-chip-api [options]

Migrates DtChip to variant/emphasis/start/end and preserves omitted size as size="300".

Options:
  --cwd <path>   Working directory (default: cwd)
  --dry-run      Show changes without applying them
  --yes          Apply all changes without prompting
  --help         Show help
`);
}

async function main () {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  const { changes, allWarnings } = await scanFiles(opts.cwd);
  allWarnings.forEach(warning => console.log(warning));

  if (!changes.length) {
    console.log('No DtChip API changes found.');
    process.exit(0);
  }

  console.log(`Found changes in ${changes.length} file(s).`);
  changes.forEach(({ file }) => console.log(`  ${path.relative(opts.cwd, file)}`));

  if (opts.dryRun) {
    console.log('--dry-run: No files were modified.');
    process.exit(0);
  }

  if (!opts.autoYes) {
    const answer = await prompt('Apply changes? (y/N) ');
    if (answer !== 'y' && answer !== 'yes') process.exit(0);
  }

  for (const { file, transformed } of changes) await fs.writeFile(file, transformed, 'utf8');
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
