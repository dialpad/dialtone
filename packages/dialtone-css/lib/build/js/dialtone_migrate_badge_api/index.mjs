#!/usr/bin/env node

/**
 * @fileoverview Migration script for the next-major DtBadge API.
 *
 * Usage:
 *   npx dialtone-migrate-badge-api [--cwd ./src] [--dry-run] [--yes]
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

const QUOTE_AWARE_ATTRS = '(?:[^>"\']|"[^"]*"|\'[^\']*\')*';
const BADGE_TAG_START = '<(?:dt-badge|DtBadge)(?=[\\s/>])';
// The paired form must not end in "/>": otherwise a self-closing badge would swallow every
// badge up to the next closing tag and only the first of them would be migrated.
const BADGE_BLOCK_RE = new RegExp(
  `${BADGE_TAG_START}${QUOTE_AWARE_ATTRS}(?<!\\/)>[\\s\\S]*?<\\/(?:dt-badge|DtBadge)>|` +
  `${BADGE_TAG_START}${QUOTE_AWARE_ATTRS}\\/>`,
  'g',
);
const BADGE_OPEN_TAG_SOURCE = `<((?:dt-badge|DtBadge)(?=[\\s/>]))(${QUOTE_AWARE_ATTRS})(\\s*\\/?>)`;
const BADGE_OPEN_TAG_RE = new RegExp(`^${BADGE_OPEN_TAG_SOURCE}`);
const BADGE_ANY_OPEN_TAG_RE = new RegExp(BADGE_OPEN_TAG_SOURCE, 'g');

// Badges are organized in groups (status, counter, release, lifecycle). `kind` names the group and defaults to status.
const GROUPS = ['status', 'counter', 'release', 'lifecycle'];

// Released (v10) `type` values -> group + variant.
const STATIC_TYPE_MAP = {
  default: { kind: 'status', variant: 'neutral' },
  info: { kind: 'status', variant: 'info' },
  positive: { kind: 'status', variant: 'positive' },
  warning: { kind: 'status', variant: 'warning' },
  critical: { kind: 'status', variant: 'critical' },
  bulletin: { kind: 'release', variant: 'pre-release' },
};

// Interim (pre-group) `variant` values -> group + variant. `lifecycle` is handled as a release below.
const INTERIM_VARIANT_MAP = {
  base: { kind: 'status', variant: 'neutral' },
  info: { kind: 'status', variant: 'info' },
  positive: { kind: 'status', variant: 'positive' },
  warning: { kind: 'status', variant: 'warning' },
  critical: { kind: 'status', variant: 'critical' },
  count: { kind: 'counter', variant: 'count' },
};

// Variant names that are already part of the grouped API but are missing `kind`.
const GROUPED_VARIANT_MAP = {
  neutral: { kind: 'status', variant: 'neutral' },
  mention: { kind: 'counter', variant: 'mention' },
};

// Interim lifecycle variants -> release group. Both release variants default to strong emphasis now,
// so the ones that used to default to base (internal, early-access, familiar) get an explicit base emphasis.
// These are also migrated when `kind="lifecycle"` is set, because lifecycle now holds content states
// (draft, published, ...), which are never touched.
const RELEASE_VARIANT_MAP = {
  new: { kind: 'release', variant: 'pre-release' },
  internal: { kind: 'release', variant: 'pre-release', emphasis: 'base' },
  'early-access': { kind: 'release', variant: 'pre-release', emphasis: 'base' },
  recent: { kind: 'release', variant: 'release' },
  familiar: { kind: 'release', variant: 'release', emphasis: 'base' },
};

function stripQuotedValues (attrs) {
  return attrs.replace(/"[^"]*"|'[^']*'/g, match => (match[0] === '"' ? '""' : '\'\''));
}

function hasAttr (attrs, prop) {
  const stripped = stripQuotedValues(attrs);
  return new RegExp(`(?:^|\\s)(?::|v-bind:)?${prop}(?:\\s*=|\\s|\\/|>|$)`).test(stripped);
}

function hasStaticAttr (attrs, prop) {
  return new RegExp(`(?:^|\\s)${prop}\\s*=\\s*("[^"]*"|'[^']*')`).test(attrs);
}

function getStaticAttrValue (attrs, prop) {
  const match = attrs.match(new RegExp(`(?:^|\\s)${prop}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`));
  return match?.[1] ?? match?.[2] ?? null;
}

function removeAttr (attrs, prop) {
  return attrs
    .replace(new RegExp(`\\s+${prop}\\s*=\\s*"[^"]*"`, 'g'), '')
    .replace(new RegExp(`\\s+${prop}\\s*=\\s*'[^']*'`, 'g'), '')
    .replace(new RegExp(`\\s+:${prop}\\s*=\\s*"[^"]*"`, 'g'), '')
    .replace(new RegExp(`\\s+:${prop}\\s*=\\s*'[^']*'`, 'g'), '')
    .replace(new RegExp(`\\s+v-bind:${prop}\\s*=\\s*"[^"]*"`, 'g'), '')
    .replace(new RegExp(`\\s+v-bind:${prop}\\s*=\\s*'[^']*'`, 'g'), '')
    .replace(new RegExp(`\\s+${prop}(?=\\s|$)`, 'g'), '');
}

function removeBooleanAttr (attrs, prop) {
  return attrs.replace(new RegExp(`\\s+${prop}(?=\\s|\\/|$)`, 'g'), '');
}

function renameAttr (attrs, oldProp, newProp) {
  return attrs
    .replace(new RegExp(`(?<=\\s)${oldProp}(?=\\s*=)`, 'g'), newProp)
    .replace(new RegExp(`(?<=\\s:)${oldProp}(?=\\s*=)`, 'g'), newProp)
    .replace(new RegExp(`(?<=\\sv-bind:)${oldProp}(?=\\s*=)`, 'g'), newProp);
}

// Attributes the Vue style guide (vue/attributes-order) puts before regular props.
const LEADING_DIRECTIVE_RE = /^\s*(?:v-for|v-if|v-else-if|v-else|:?key|ref)(?:\s*=\s*(?:"[^"]*"|'[^']*'))?(?=\s|$)/;

function insertAttr (attrs, attr) {
  let head = '';
  let tail = attrs;
  let match;
  while ((match = tail.match(LEADING_DIRECTIVE_RE))) {
    head += match[0];
    tail = tail.slice(match[0].length);
  }
  const leadingSpace = tail.match(/^\s*/)[0];
  const rest = tail.slice(leadingSpace.length).trimStart();
  // Keep multi-line tags one attribute per line.
  const separator = leadingSpace.includes('\n') ? leadingSpace : ' ';
  return `${head}${leadingSpace || ' '}${attr}${rest ? `${separator}${rest}` : ''}`;
}

function replaceOrInsertVariant (attrs, variant) {
  if (hasStaticAttr(attrs, 'variant')) {
    return attrs.replace(/(\svariant\s*=\s*)(?:"[^"]*"|'[^']*')/, `$1"${variant}"`);
  }
  return insertAttr(attrs, `variant="${variant}"`);
}

// Puts emphasis right after variant, on the same line or the next one, matching how the variant is laid out.
function insertEmphasisAfterVariant (attrs, emphasis) {
  return attrs.replace(/(\s+)(variant\s*=\s*(?:"[^"]*"|'[^']*'))/, `$1$2$1emphasis="${emphasis}"`);
}

function replaceOrInsertKind (attrs, kind) {
  if (hasStaticAttr(attrs, 'kind')) {
    return attrs.replace(/(\skind\s*=\s*)(?:"[^"]*"|'[^']*')/, `$1"${kind}"`);
  }
  return insertAttr(attrs, `kind="${kind}"`);
}

function replaceOrInsertEmphasis (attrs, emphasis) {
  if (hasStaticAttr(attrs, 'emphasis')) {
    return attrs.replace(/(\semphasis\s*=\s*)(?:"[^"]*"|'[^']*')/, `$1"${emphasis}"`);
  }
  return insertAttr(attrs, `emphasis="${emphasis}"`);
}

function transformBadgeOpenTag (tag, warnings, filePath) {
  const match = tag.match(BADGE_OPEN_TAG_RE);
  if (!match) return tag;

  const [, tagName, originalAttrs, closer] = match;
  let attrs = originalAttrs;

  for (const prop of ['type', 'kind', 'text']) {
    if (new RegExp(`(?:^|\\s)(?::|v-bind:)${prop}\\s*=`).test(attrs)) {
      warnings.push(`BADGE_API_DYNAMIC_PROP file=${filePath} prop=${prop}`);
    }
  }

  if (hasAttr(attrs, 'decoration')) {
    warnings.push(`BADGE_API_DECORATION file=${filePath}`);
  }

  attrs = renameAttr(attrs, 'text', 'label');
  const typeValue = getStaticAttrValue(attrs, 'type');
  const kindValue = getStaticAttrValue(attrs, 'kind');
  const variantValue = getStaticAttrValue(attrs, 'variant');
  const emphasisValue = getStaticAttrValue(attrs, 'emphasis');
  const hasDynamicKind = new RegExp('(?:^|\\s)(?::|v-bind:)kind\\s*=').test(attrs);
  // A v-bind object spread can carry type/variant/kind from data this script can't see.
  const hasSpread = /(?:^|\s)v-bind\s*=/.test(attrs);
  const hasDynamicGroupSource = hasSpread || ['variant', 'type']
    .some(prop => new RegExp(`(?:^|\\s)(?::|v-bind:)${prop}\\s*=`).test(attrs));

  // Infer the group (kind) and variant from what the badge uses today.
  let target = null;
  if (kindValue === 'lifecycle' && RELEASE_VARIANT_MAP[variantValue]) {
    target = RELEASE_VARIANT_MAP[variantValue]; // interim release variant under the old lifecycle group
  } else if (GROUPS.includes(kindValue) || hasDynamicKind) {
    target = null; // already has a group
  } else if (hasDynamicGroupSource) {
    warnings.push(`BADGE_API_DYNAMIC_KIND file=${filePath}`);
  } else if (variantValue) {
    if (variantValue === 'lifecycle') {
      // The interim lifecycle variant stored the stage in emphasis, which is kept. With none it was early-access.
      target = RELEASE_VARIANT_MAP['early-access'];
    } else if (RELEASE_VARIANT_MAP[variantValue] || INTERIM_VARIANT_MAP[variantValue]
      || GROUPED_VARIANT_MAP[variantValue]) {
      target = RELEASE_VARIANT_MAP[variantValue] || INTERIM_VARIANT_MAP[variantValue]
        || GROUPED_VARIANT_MAP[variantValue];
    } else {
      warnings.push(`BADGE_API_UNKNOWN_VARIANT file=${filePath} variant=${variantValue}`);
    }
  } else if (typeValue === 'ai') {
    warnings.push(`BADGE_API_AI_TYPE file=${filePath}`);
    target = { kind: 'status', variant: null };
  } else if (kindValue === 'count') {
    target = { kind: 'counter', variant: 'count' };
    if (typeValue === 'bulletin') {
      // A purple count in the released API is the strong count now.
      attrs = replaceOrInsertEmphasis(attrs, 'strong');
    } else if (typeValue && typeValue !== 'default') {
      warnings.push(`BADGE_API_AMBIGUOUS_COUNT_TYPE file=${filePath} type=${typeValue}`);
    }
  } else if (typeValue && !STATIC_TYPE_MAP[typeValue]) {
    warnings.push(`BADGE_API_UNKNOWN_TYPE file=${filePath} type=${typeValue}`);
  } else {
    target = STATIC_TYPE_MAP[typeValue || 'default'];
  }

  if (target) {
    // Drop the old kind (label | count) so the new one is written first, before variant.
    attrs = removeAttr(attrs, 'kind');
    if (target.variant) attrs = replaceOrInsertVariant(attrs, target.variant);
    attrs = replaceOrInsertKind(attrs, target.kind);
    // Keep the old default look: without an explicit emphasis these used to render as base, not strong.
    if (target.emphasis && !hasAttr(attrs, 'emphasis')) attrs = insertEmphasisAfterVariant(attrs, target.emphasis);
    if (emphasisValue === 'clear') {
      warnings.push(`BADGE_API_CLEAR_UNSUPPORTED file=${filePath}`);
      attrs = removeAttr(attrs, 'emphasis');
    }
  }

  if (typeValue && typeValue !== 'ai') attrs = removeAttr(attrs, 'type');

  const hasSubtle = /\ssubtle(?=\s|\/|$)/.test(attrs);
  const hasOutlined = /\soutlined(?=\s|\/|$)/.test(attrs);
  if (hasSubtle || hasOutlined) {
    const hasExplicitEmphasis = hasAttr(attrs, 'emphasis');
    attrs = removeBooleanAttr(removeBooleanAttr(attrs, 'subtle'), 'outlined');
    // subtle and outlined only ever applied to bulletin badges (the lifecycle group). Keep their
    // look: outlined -> subtle (outline), subtle -> base (light fill). Status badges have no outline.
    if (typeValue !== 'bulletin') {
      warnings.push(`BADGE_API_OUTLINE_UNSUPPORTED file=${filePath}`);
    } else if (!hasExplicitEmphasis) {
      attrs = replaceOrInsertEmphasis(attrs, hasOutlined ? 'subtle' : 'base');
    }
  }

  return `<${tagName}${attrs}${closer}`;
}

// The physical leftIcon/rightIcon slots are deprecated in favor of startIcon/endIcon.
function transformBadgeSlots (block, warnings, filePath) {
  const before = block;
  const result = block
    .replace(/#leftIcon\b/g, '#startIcon')
    .replace(/#rightIcon\b/g, '#endIcon')
    .replace(/v-slot:leftIcon\b/g, 'v-slot:startIcon')
    .replace(/v-slot:rightIcon\b/g, 'v-slot:endIcon')
    .replace(/slot="leftIcon"/g, 'slot="startIcon"')
    .replace(/slot="rightIcon"/g, 'slot="endIcon"');

  if (result !== before) {
    warnings.push(`BADGE_API_SLOT_RENAMED file=${filePath}`);
  }

  return result;
}

function transformBadgeBlock (block, warnings, filePath) {
  return transformBadgeSlots(block, warnings, filePath).replace(BADGE_ANY_OPEN_TAG_RE, tag => {
    return transformBadgeOpenTag(tag, warnings, filePath);
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
  if (!/(?:dt-badge|DtBadge)/.test(content)) return { transformed: content, warnings };

  const { masked, segments, token } = maskInertContent(content);
  const transformed = masked.replace(BADGE_BLOCK_RE, block => transformBadgeBlock(block, warnings, filePath));

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
Usage: npx dialtone-migrate-badge-api [options]

Migrates DtBadge to variant/emphasis/label/start/end.

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
    console.log('No DtBadge API changes found.');
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
