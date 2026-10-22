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
const CHIP_BLOCK_RE = new RegExp(
  `<(?:dt-chip|DtChip)\\b${QUOTE_AWARE_ATTRS}>[\\s\\S]*?<\\/(?:dt-chip|DtChip)>|` +
  `<(?:dt-chip|DtChip)\\b${QUOTE_AWARE_ATTRS}\\/>`,
  'g',
);
const CHIP_OPEN_TAG_RE = new RegExp(`^<((?:dt-chip|DtChip)\\b)(${QUOTE_AWARE_ATTRS})(\\s*\\/?>)`);

function stripQuotedValues (attrs) {
  return attrs.replace(/"[^"]*"|'[^']*'/g, match => (match[0] === '"' ? '""' : '\'\''));
}

function hasAttr (attrs, prop) {
  const stripped = stripQuotedValues(attrs);
  return new RegExp(`(?:^|\\s)(?::|v-bind:)?${prop}(?:\\s*=|\\s|\\/|>|$)`).test(stripped);
}

function hasDynamicAttr (attrs, prop) {
  return new RegExp(`(?:^|\\s)(?::|v-bind:)${prop}\\s*=`).test(attrs);
}

function insertAttr (attrs, attr) {
  const leadingSpace = attrs.match(/^\s*/)[0];
  const rest = attrs.slice(leadingSpace.length).trimStart();
  return `${leadingSpace || ' '}${attr}${rest ? ` ${rest}` : ''}`;
}

function renameAttr (attrs, oldProp, newProp) {
  return attrs
    .replace(new RegExp(`(?<=\\s)${oldProp}(?=\\s*=)`, 'g'), newProp)
    .replace(new RegExp(`(?<=\\s:)${oldProp}(?=\\s*=)`, 'g'), newProp)
    .replace(new RegExp(`(?<=\\sv-bind:)${oldProp}(?=\\s*=)`, 'g'), newProp);
}

function transformChipOpenTag (tag, warnings, filePath) {
  const match = tag.match(CHIP_OPEN_TAG_RE);
  if (!match) return tag;

  const [, tagName, originalAttrs, closer] = match;
  let attrs = originalAttrs;
  const hasShowClose = hasAttr(attrs, 'show-close') || hasAttr(attrs, 'showClose');
  const hasInteractive = hasAttr(attrs, 'interactive');

  if (!hasAttr(attrs, 'size')) {
    attrs = insertAttr(attrs, 'size="300"');
  }

  if (!hasShowClose && !hasInteractive) {
    warnings.push(`CHIP_API_OMITTED_SHOW_CLOSE_INTERACTIVE file=${filePath}`);
  }

  if (hasDynamicAttr(attrs, 'show-close') || hasDynamicAttr(attrs, 'showClose')) {
    warnings.push(`CHIP_API_DYNAMIC_SHOW_CLOSE file=${filePath}`);
  }

  if (hasShowClose && !hasInteractive) {
    warnings.push(`CHIP_API_SHOW_CLOSE_WITHOUT_INTERACTIVE file=${filePath}`);
  }

  attrs = renameAttr(attrs, 'icon-class', 'start-icon-class');
  attrs = renameAttr(attrs, 'iconClass', 'startIconClass');
  attrs = renameAttr(attrs, 'avatar-class', 'start-avatar-class');
  attrs = renameAttr(attrs, 'avatarClass', 'startAvatarClass');

  return `<${tagName}${attrs}${closer}`;
}

function transformChipSlots (block, warnings, filePath) {
  let result = block;
  const hasIconSlot = /#icon\b|v-slot:icon\b|slot="icon"/.test(result);
  const hasAvatarSlot = /#avatar\b|v-slot:avatar\b|slot="avatar"/.test(result);
  const before = result;

  result = result
    .replace(/#icon\b/g, '#startIcon')
    .replace(/#avatar\b/g, '#startAvatar')
    .replace(/v-slot:icon\b/g, 'v-slot:startIcon')
    .replace(/v-slot:avatar\b/g, 'v-slot:startAvatar')
    .replace(/slot="icon"/g, 'slot="startIcon"')
    .replace(/slot="avatar"/g, 'slot="startAvatar"');

  if (result !== before) warnings.push(`CHIP_API_SLOT_RENAMED file=${filePath}`);
  if (hasIconSlot && hasAvatarSlot) warnings.push(`CHIP_API_ICON_AVATAR_CONFLICT file=${filePath}`);

  return result;
}

function transformChipBlock (block, warnings, filePath) {
  return transformChipSlots(block, warnings, filePath).replace(CHIP_OPEN_TAG_RE, tag => {
    return transformChipOpenTag(tag, warnings, filePath);
  });
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
  const transformed = masked.replace(CHIP_BLOCK_RE, block => transformChipBlock(block, warnings, filePath));

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
