#!/usr/bin/env node
/* eslint-disable max-lines */

/**
 * @fileoverview Migration script for Dialtone component prop/slot/event breaking changes.
 *
 * Covers these changes:
 *   DLT-3161  avatar: clickable → interactive
 *   DLT-3157  kind/validation-state values: danger→critical, error→critical, success→positive
 *   DLT-3159  positive boolean props: hide-close→show-close, hide-icon→show-icon, etc.
 *   DLT-3282  show prop → open (modal, toast, tooltip) + update:show → update:open
 *   DLT-3283  slot renames: titleOverride→header, labelSlot→label, headingSlot→heading
 *   DLT-3284  title/titleId → headerText/headerId props (banner, notice, toast, modal)
 *   DLT-3159  label-visible → show-label (checkbox, combobox, input, select-menu, toggle, etc.)
 *   DLT-3100  rootClass removed — warns with file locations, cannot auto-migrate
 *
 * Usage:
 *   npx dialtone-migrate-props [options]
 *
 * Options:
 *   --cwd <path>     Working directory (default: current directory)
 *   --dry-run        Show changes without applying them
 *   --yes            Apply all changes without prompting
 *   --help           Show help
 *
 * Examples:
 *   npx dialtone-migrate-props
 *   npx dialtone-migrate-props --dry-run
 *   npx dialtone-migrate-props --cwd ./src
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function kebabToCamel (str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function escapeRe (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Transformation Data
// ---------------------------------------------------------------------------

// Components where `show` → `open` and `update:show` → `update:open`
const SHOW_TO_OPEN_COMPONENTS = new Set([
  'dt-modal', 'DtModal',
  'dt-toast', 'DtToast',
  'dt-tooltip', 'DtTooltip',
]);

// Direct prop renames per component (kebab-case keys; camelCase handled automatically)
const COMPONENT_PROP_RENAMES = {
  'dt-avatar': {
    clickable: 'interactive',
  },
  'dt-banner': {
    title: 'header-text',
    'title-id': 'header-id',
  },
  'dt-notice': {
    title: 'header-text',
    'title-id': 'header-id',
  },
  'dt-toast': {
    title: 'header-text',
    'title-id': 'header-id',
  },
  'dt-modal': {
    title: 'header-text',
    'banner-title': 'banner-header-text',
  },
  'dt-checkbox': { 'label-visible': 'show-label' },
  'dt-combobox': { 'label-visible': 'show-label' },
  'dt-combobox-multi-select': { 'label-visible': 'show-label' },
  'dt-combobox-with-popover': { 'label-visible': 'show-label' },
  'dt-input': { 'label-visible': 'show-label' },
  'dt-select-menu': { 'label-visible': 'show-label' },
  'dt-toggle': { 'label-visible': 'show-label' },
  'dt-radio-group': { 'label-visible': 'show-label' },
};

// Removed class props per component: old-prop → class attribute directly
const ROOT_CLASS_RENAMES = {
  'dt-input': 'root-class',
  'dt-checkbox': 'root-class',
  'dt-radio': 'root-class',
  'dt-select-menu': 'root-class',
  'dt-toggle': 'wrapper-class',
  'dt-card': 'container-class',
  'dt-breadcrumb-item': 'root-class',
  'dt-split-button': 'root-class',
  'dt-feed-item-pill': 'wrapper-class',
};

// Inverted boolean props per component: `hide-X` → `:show-X="false"`
const INVERTED_BOOL_PROPS = {
  'dt-banner': { 'hide-close': 'show-close', 'hide-icon': 'show-icon', 'hide-action': 'show-action' },
  'dt-chip': { 'hide-close': 'show-close' },
  'dt-modal': { 'hide-close': 'show-close' },
  'dt-notice': { 'hide-close': 'show-close', 'hide-icon': 'show-icon', 'hide-action': 'show-action' },
  'dt-toast': { 'hide-close': 'show-close', 'hide-icon': 'show-icon', 'hide-action': 'show-action' },
  'dt-filter-pill': { 'hide-clear': 'show-clear' },
};

// Prop value renames applied to any dt-* component (kind and validation-state)
const PROP_VALUE_RENAMES = [
  { prop: 'kind', oldValue: 'danger', newValue: 'critical' },
  { prop: 'kind', oldValue: 'error', newValue: 'critical' },
  { prop: 'kind', oldValue: 'success', newValue: 'positive' },
  { prop: 'validation-state', oldValue: 'error', newValue: 'critical' },
  { prop: 'validation-state', oldValue: 'success', newValue: 'positive' },
];

// Slot renames — applied globally (names are unique enough across the system)
const SLOT_RENAMES = [
  { old: 'titleOverride', new: 'header' },
  { old: 'labelSlot', new: 'label' },
  { old: 'headingSlot', new: 'heading' },
];

// Regex matching any Dialtone component opening tag (multi-line safe)
const DT_TAG_RE = /<(dt-[\w-]+|Dt\w+)\b([\s\S]*?)(?:\/?>)/g;

// ---------------------------------------------------------------------------
// Per-tag Sub-Transformers
// ---------------------------------------------------------------------------

/**
 * `show` → `open` plus `@update:show` / `v-model:show` on overlay components.
 */
function applyShowToOpen (tag, canonical) {
  if (!SHOW_TO_OPEN_COMPONENTS.has(canonical)) return { tag, count: 0 };
  let result = tag;
  let count = 0;

  // :show="…" or show="…" but NOT show-close / show-icon / show-action etc.
  result = result.replace(/(\b:?)(show)(?=[=\s/>])/g, (match, colon, _prop, offset, str) => {
    if (str[offset + match.length] === '-') return match;
    count++;
    return `${colon}open`;
  });

  const updateBefore = result;
  result = result.replace(/@update:show\b/g, '@update:open');
  count += (result !== updateBefore) ? 1 : 0;

  const vmodelBefore = result;
  result = result.replace(/v-model:show\b/g, 'v-model:open');
  count += (result !== vmodelBefore) ? 1 : 0;

  return { tag: result, count };
}

/**
 * Direct 1:1 prop renames for a specific component.
 */
function applyPropRenames (tag, canonical) {
  const renames = COMPONENT_PROP_RENAMES[canonical];
  if (!renames) return { tag, count: 0 };

  let result = tag;
  let count = 0;

  for (const [oldProp, newProp] of Object.entries(renames)) {
    const oldCamel = kebabToCamel(oldProp);
    const newCamel = kebabToCamel(newProp);

    // Static kebab: `old-prop="…"` or bare boolean
    const before1 = result;
    result = result.replace(new RegExp(`(?<!:)\\b${escapeRe(oldProp)}(?=[=\\s/>])`, 'g'), newProp);
    if (result !== before1) { count++; continue; }

    // Bound kebab: `:old-prop="…"`
    const before2 = result;
    result = result.replace(new RegExp(`(?<=:)${escapeRe(oldProp)}(?==)`, 'g'), newProp);
    if (result !== before2) { count++; continue; }

    // Bound camelCase: `:oldProp="…"`
    if (oldCamel !== oldProp) {
      const before3 = result;
      result = result.replace(new RegExp(`(?<=:)${escapeRe(oldCamel)}(?==)`, 'g'), newCamel);
      if (result !== before3) count++;
    }
  }

  return { tag: result, count };
}

/**
 * Apply one inverted-boolean rename: hide-X → :show-X="false".
 * Returns { tag, count, warning? }
 */
function applyOneInvertedProp (tag, oldProp, newProp) {
  const oldCamel = kebabToCamel(oldProp);
  const newCamel = kebabToCamel(newProp);

  // `:hide-prop="false"` or `:hideXxx="false"` → remove (default is true)
  for (const p of [escapeRe(oldProp), escapeRe(oldCamel)]) {
    const before = tag;
    tag = tag.replace(new RegExp(`:${p}="false"`, 'g'), '');
    if (tag !== before) return { tag, count: 1 };
  }

  // `:hide-prop="true"` → `:show-prop="false"`
  const trueBefore = tag;
  tag = tag.replace(new RegExp(`:${escapeRe(oldProp)}="true"`, 'g'), `:${newProp}="false"`);
  if (tag !== trueBefore) return { tag, count: 1 };

  // `:hideXxx="true"` → `:showXxx="false"`
  const camelTrueBefore = tag;
  tag = tag.replace(new RegExp(`:${escapeRe(oldCamel)}="true"`, 'g'), `:${newCamel}="false"`);
  if (tag !== camelTrueBefore) return { tag, count: 1 };

  // Bare boolean: `hide-prop` → `:show-prop="false"`
  const bareBefore = tag;
  tag = tag.replace(new RegExp(`(?<!:)\\b${escapeRe(oldProp)}(?=[\\s/>])`, 'g'), `:${newProp}="false"`);
  if (tag !== bareBefore) return { tag, count: 1 };

  // Bound expression: cannot auto-invert — emit warning
  const exprMatch = new RegExp(`:${escapeRe(oldProp)}="([^"]*)"`, 'g').exec(tag);
  if (exprMatch) {
    return {
      tag,
      count: 0,
      warning: `Cannot auto-invert :${oldProp}="${exprMatch[1]}" → :${newProp}. ` +
        `Replace manually with :${newProp}="!(${exprMatch[1]})"`,
    };
  }

  return { tag, count: 0 };
}

/**
 * Inverted boolean props for a specific component (hide-X → :show-X="false").
 */
function applyInvertedBoolProps (tag, canonical) {
  const invertedMap = INVERTED_BOOL_PROPS[canonical];
  if (!invertedMap) return { tag, count: 0, warnings: [] };

  let result = tag;
  let count = 0;
  const warnings = [];

  for (const [oldProp, newProp] of Object.entries(invertedMap)) {
    const { tag: updated, count: c, warning } = applyOneInvertedProp(result, oldProp, newProp);
    result = updated;
    count += c;
    if (warning) warnings.push(warning);
  }

  return { tag: result, count, warnings };
}

/**
 * `kind` and `validation-state` value renames on any dt-* component.
 */
function applyPropValueRenames (tag) {
  let result = tag;
  let count = 0;

  for (const { prop, oldValue, newValue } of PROP_VALUE_RENAMES) {
    const propCamel = kebabToCamel(prop);

    for (const p of [prop, propCamel]) {
      // Static: `prop="oldValue"`
      const before1 = result;
      result = result.replace(
        new RegExp(`(?<!:)\\b${escapeRe(p)}="${escapeRe(oldValue)}"`, 'g'),
        `${p}="${newValue}"`,
      );
      if (result !== before1) count++;

      // Bound string literal: `:prop="'oldValue'"`
      const before2 = result;
      result = result.replace(
        new RegExp(`:${escapeRe(p)}="'${escapeRe(oldValue)}'"`, 'g'),
        `:${p}="'${newValue}'"`,
      );
      if (result !== before2) count++;
    }
  }

  return { tag: result, count };
}

/**
 * Renames a removed class prop (root-class, wrapper-class, container-class) to `class`.
 * Static values are merged into an existing `class="…"` if present.
 * Dynamic bindings warn if `:class` already exists (cannot safely merge expressions).
 */
function applyRootClassRename (tag, canonical) {
  const oldProp = ROOT_CLASS_RENAMES[canonical];
  if (!oldProp) return { tag, count: 0, warnings: [] };

  const oldCamel = kebabToCamel(oldProp);
  let result = tag;
  let count = 0;
  const warnings = [];

  for (const p of [oldProp, oldCamel]) {
    // Dynamic: `:old-prop="expr"` → `:class="expr"` (warn if :class already exists)
    const dynRe = new RegExp(`:${escapeRe(p)}="([^"]*)"`);
    const dynMatch = dynRe.exec(result);
    if (dynMatch) {
      if (/:class="/.test(result)) {
        warnings.push(
          `Cannot auto-merge :${p}="${dynMatch[1]}" into :class on <${canonical}> — merge manually.`,
        );
      } else {
        result = result.replace(dynMatch[0], `:class="${dynMatch[1]}"`);
        count++;
      }
      break;
    }

    // Static: `old-prop="value"` → `class="value"` (merge if class already exists)
    const staticRe = new RegExp(`(?<!:)\\b${escapeRe(p)}="([^"]*)"`);
    const staticMatch = staticRe.exec(result);
    if (staticMatch) {
      const addedVal = staticMatch[1];
      const existingClassMatch = /(?<![:\w-])class="([^"]*)"/.exec(result);
      if (existingClassMatch) {
        result = result.replace(staticMatch[0], '');
        result = result.replace(existingClassMatch[0], `class="${existingClassMatch[1]} ${addedVal}"`);
      } else {
        result = result.replace(staticMatch[0], `class="${addedVal}"`);
      }
      count++;
      break;
    }
  }

  return { tag: result, count, warnings };
}

/**
 * Warn about removed rootClass / root-class prop on components not in ROOT_CLASS_RENAMES.
 */
function detectRootClass (tag, tagName, canonical) {
  if (ROOT_CLASS_RENAMES[canonical]) return [];
  const re = /\broot-class(?:=|\b)|\brootClass(?:=|\b)/g;
  const matches = tag.match(re);
  if (!matches) return [];
  return matches.map(() =>
    `rootClass / root-class has been removed from <${tagName}>` +
    ' — apply classes directly on the component element or use a wrapper.',
  );
}

// ---------------------------------------------------------------------------
// Per-tag Entry Point
// ---------------------------------------------------------------------------

/**
 * Returns the canonical kebab-case component name for config lookups.
 * PascalCase → kebab-case: DtAvatar → dt-avatar
 */
function normalizeTagName (tag) {
  if (tag.startsWith('dt-')) return tag;
  return tag.replace(/(?<=[a-z])([A-Z])/g, '-$1').toLowerCase();
}

function transformTag (fullTag, tagName) {
  const canonical = normalizeTagName(tagName);
  let tag = fullTag;
  let count = 0;
  const warnings = [];

  const r1 = applyShowToOpen(tag, canonical);
  tag = r1.tag; count += r1.count;

  const r2 = applyPropRenames(tag, canonical);
  tag = r2.tag; count += r2.count;

  const r3 = applyInvertedBoolProps(tag, canonical);
  tag = r3.tag; count += r3.count;
  warnings.push(...r3.warnings);

  const r4 = applyPropValueRenames(tag);
  tag = r4.tag; count += r4.count;

  const r5 = applyRootClassRename(tag, canonical);
  tag = r5.tag; count += r5.count;
  warnings.push(...r5.warnings);

  warnings.push(...detectRootClass(tag, tagName, canonical));

  return { result: tag, count, warnings };
}

// ---------------------------------------------------------------------------
// Full-file Slot Transforms
// ---------------------------------------------------------------------------

function transformSlots (content) {
  let result = content;
  let count = 0;

  for (const { old: oldName, new: newName } of SLOT_RENAMES) {
    const patterns = [
      [new RegExp(`#${escapeRe(oldName)}\\b`, 'g'), `#${newName}`],
      [new RegExp(`v-slot:${escapeRe(oldName)}\\b`, 'g'), `v-slot:${newName}`],
      [new RegExp(`slot="${escapeRe(oldName)}"`, 'g'), `slot="${newName}"`],
    ];

    for (const [re, replacement] of patterns) {
      const before = result;
      result = result.replace(re, replacement);
      if (result !== before) count += (before.match(re) || []).length;
    }
  }

  return { result, count };
}

// ---------------------------------------------------------------------------
// Main Transform
// ---------------------------------------------------------------------------

function transformContent (content) {
  let transformed = content;
  let totalCount = 0;
  const allWarnings = [];

  const { result: slotResult, count: slotCount } = transformSlots(transformed);
  transformed = slotResult;
  totalCount += slotCount;

  DT_TAG_RE.lastIndex = 0;
  transformed = transformed.replace(DT_TAG_RE, (fullMatch, tagName) => {
    const { result, count, warnings } = transformTag(fullMatch, tagName);
    totalCount += count;
    if (warnings.length) allWarnings.push(...warnings);
    return result;
  });

  return { transformed, count: totalCount, warnings: allWarnings };
}

export { transformContent };

// ---------------------------------------------------------------------------
// File Finder
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate-props [options]

Migrates Dialtone component prop/slot/event breaking changes introduced in
DLT-3100, DLT-3157, DLT-3159, DLT-3161, DLT-3282, DLT-3283, DLT-3284.

Migrations applied:
  clickable              → interactive           (dt-avatar)
  show                   → open                  (dt-modal, dt-toast, dt-tooltip)
  @update:show           → @update:open          (dt-modal, dt-toast, dt-tooltip)
  v-model:show           → v-model:open          (dt-modal, dt-toast, dt-tooltip)
  title                  → header-text           (dt-banner, dt-notice, dt-toast, dt-modal)
  title-id               → header-id             (dt-banner, dt-notice, dt-toast)
  banner-title           → banner-header-text    (dt-modal)
  label-visible          → show-label            (dt-checkbox, dt-combobox, dt-input, etc.)
  hide-close             → :show-close="false"   (dt-banner, dt-chip, dt-modal, dt-notice, dt-toast)
  hide-icon              → :show-icon="false"    (dt-banner, dt-notice, dt-toast)
  hide-action            → :show-action="false"  (dt-banner, dt-notice, dt-toast)
  hide-clear             → :show-clear="false"   (dt-filter-pill)
  root-class             → class                 (dt-input, dt-checkbox, dt-radio, dt-select-menu, dt-breadcrumb-item, dt-split-button)
  wrapper-class          → class                 (dt-toggle, dt-feed-item-pill)
  container-class        → class                 (dt-card)
  kind="danger"          → kind="critical"       (any dt-* component)
  kind="error"           → kind="critical"       (any dt-* component)
  kind="success"         → kind="positive"       (any dt-* component)
  validation-state="error"   → validation-state="critical"
  validation-state="success" → validation-state="positive"
  #titleOverride         → #header               (slots)
  #labelSlot             → #label                (slots)
  #headingSlot           → #heading              (slots)
  rootClass / root-class → (warns — manual fix required for unknown components)

Options:
  --cwd <path>     Working directory (default: current directory)
  --dry-run        Show changes without applying them
  --yes            Apply all changes without prompting
  --help           Show help
`);
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

function parseArgs (args) {
  const cwdIndex = args.indexOf('--cwd');
  return {
    help: args.includes('--help'),
    dryRun: args.includes('--dry-run'),
    autoYes: args.includes('--yes'),
    cwd: cwdIndex !== -1 && args[cwdIndex + 1]
      ? path.resolve(args[cwdIndex + 1])
      : process.cwd(),
  };
}

async function scanFiles (cwd) {
  const extensions = ['.vue', '.md', '.html', '.js', '.ts', '.jsx', '.tsx'];
  const ignore = ['node_modules', 'dist', '.git', '.vuepress/public'];
  const files = await findFiles(cwd, extensions, ignore);

  const changes = [];
  const allWarnings = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const { transformed, count, warnings } = transformContent(content);
    if (count > 0) changes.push({ file, content, transformed, count });
    if (warnings.length) allWarnings.push(...warnings.map(w => `${path.relative(cwd, file)}: ${w}`));
  }

  return { changes, allWarnings };
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
  console.log('⚠  Manual action required:\n');
  for (const w of warnings) console.log(`  ${w}`);
  console.log();
}

function printChangeSummary (changes, cwd) {
  const total = changes.reduce((sum, c) => sum + c.count, 0);
  console.log(`Found ${total} change(s) across ${changes.length} file(s):\n`);
  for (const { file, count } of changes) {
    console.log(`  ${path.relative(cwd, file)} (${count} change${count > 1 ? 's' : ''})`);
  }
  return total;
}

async function main () {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { printHelp(); process.exit(0); }

  console.log(`\nScanning ${opts.cwd} for Dialtone prop/slot/event usage...\n`);

  const { changes, allWarnings } = await scanFiles(opts.cwd);
  printWarnings(allWarnings);

  if (changes.length === 0) {
    console.log('No matching usage found. Nothing to migrate.');
    process.exit(0);
  }

  const total = printChangeSummary(changes, opts.cwd);

  if (opts.dryRun) {
    console.log('\n--dry-run: No files were modified.\n');
    process.exit(0);
  }

  const applied = await applyChanges(changes, opts.autoYes);
  if (applied) console.log(`\nMigrated ${total} reference(s) across ${changes.length} file(s).\n`);
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
