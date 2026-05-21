#!/usr/bin/env node
/* eslint-disable max-lines */
/* eslint-disable complexity */

/**
 * @fileoverview Master migration script for Dialtone next major version.
 *
 * Orchestrates all individual migration scripts in the correct order.
 * Supports selective execution, dry-run mode, and a health-check to
 * report which migrations are still needed.
 *
 * Usage:
 *   npx dialtone-migrate [options]
 *
 * Options:
 *   --cwd <path>       Working directory (default: cwd)
 *   --dry-run          Show changes without applying them
 *   --yes              Apply all changes without prompting
 *   --health-check     Report migration status without modifying files
 *   --all              Run all required migrations without selection prompt
 *   --only <ids>       Comma-separated list of migration IDs to run
 *   --help             Show help
 *
 * Examples:
 *   npx dialtone-migrate
 *   npx dialtone-migrate --health-check --cwd ./src
 *   npx dialtone-migrate --all --dry-run
 *   npx dialtone-migrate --only color-stops,hsl-to-oklch
 */

import { spawn } from 'node:child_process';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Migration registry
// ---------------------------------------------------------------------------

/**
 * @typedef {object} Migration
 * @property {string} id           - Unique identifier
 * @property {string} name         - Display name
 * @property {string} description  - Short description
 * @property {'required'|'opt-in'} category
 * @property {'config'|'standalone'|'manual'} type
 * @property {string} [configName] - Config filename for migration-helper type
 * @property {string} [scriptDir]  - Directory name for standalone scripts
 * @property {string[]} [extraArgs] - Extra CLI args to forward
 * @property {RegExp[]} detectPatterns - Patterns that indicate migration is still needed
 * @property {string[]} fileExtensions - File extensions to scan during health check
 */

/** @type {Migration[]} */
const MIGRATIONS = [
  // ── Required (breaking) ────────────────────────────────────────────
  {
    id: 'color-stops',
    name: 'Color Stops',
    description: 'Base color ramps standardized to a 12-stop scale.',
    category: 'required',
    type: 'config',
    configName: 'color-stops',
    detectPatterns: [
      /var\(--dt-color-(?:purple|magenta)-(?:250|350)\)/,
      /var\(--dt-color-(?:blue|green|red|gold)-(?:425|450|475)\)/,
      /d-(?:bgc|fc|bc)-(?:purple|magenta)-(?:250|350)/,
    ],
    fileExtensions: ['.css', '.less', '.html', '.vue', '.js', '.ts', '.jsx', '.tsx'],
  },
  {
    id: 'hsl-to-oklch',
    name: 'HSL to OKLCH',
    description: 'Color tokens moved from HSL to OKLCH. Per-channel breakout variables removed.',
    category: 'required',
    type: 'config',
    configName: 'hsl-to-oklch',
    detectPatterns: [
      /var\(--[\w-]+-(?:hsl|hsla)\)/,
      /var\(--[\w-]+-h\)\s*,\s*var\(--[\w-]+-s\)/,
    ],
    fileExtensions: ['.css', '.less', '.scss', '.html', '.vue', '.js', '.ts', '.jsx', '.tsx'],
  },
  {
    id: 'space-to-spacing',
    name: 'Space to Spacing Tokens',
    description: '--dt-space-* becomes --dt-spacing-*.',
    category: 'required',
    type: 'config',
    configName: 'space-to-spacing',
    detectPatterns: [
      /var\(--dt-space-\d+/,
    ],
    fileExtensions: ['.css', '.less', '.scss', '.html', '.vue', '.js', '.ts', '.jsx', '.tsx'],
  },
  {
    id: 'size-to-layout',
    name: 'Size to Layout Tokens',
    description: '--dt-size-* routed to --dt-layout-*, --dt-spacing-*, --dt-size-border-*, or --dt-size-radius-*.',
    category: 'required',
    type: 'config',
    configName: 'size-to-layout',
    detectPatterns: [
      /var\(--dt-size-\d+\)/,
    ],
    fileExtensions: ['.css', '.less', '.scss', '.html', '.vue', '.js', '.ts', '.jsx', '.tsx'],
  },
  {
    id: 'border-radius',
    name: 'Border-Radius Logical Names',
    description: 'Physical directional radius classes (d-btr*, d-bbr*, d-blr*, d-brr*) replaced by logical equivalents (d-bbsr*, d-bber*, d-bisr*, d-bier*). Numeric stops standardized.',
    category: 'required',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_border_radius',
    detectPatterns: [
      /(?:["'\s=`])d-bar(?:0|1|2|4|6|8|12|16|24|32)(?:["'\s>;`])/,
      /(?:["'\s=`])d-(?:btr|bbr|blr|brr)(?:\d|-pill|-circle)(?:["'\s>;`])/,
    ],
    fileExtensions: ['.vue', '.html', '.js', '.ts', '.jsx', '.tsx', '.md'],
  },
  {
    id: 'utility-class-to-token-stops',
    name: 'Utility Class Token Stops',
    description: 'Pixel-based utility class names migrated to token-stop-based names (d-h16 → d-h-25, d-p8 → d-p-100, etc.).',
    category: 'required',
    type: 'config',
    configName: 'utility-class-to-token-stops',
    detectPatterns: [
      /(?:["'\s])d-(?:h|w|hmn|hmx|wmn|wmx)(?:16|32|48|64|96|128)(?:["'\s])/,
      /(?:["'\s])d-(?:m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py)(?:4|8|12|16|24|32|48|64)(?:["'\s])/,
      /(?:["'\s])d-(?:g|rg|cg)(?:4|8|12|16|24|32)(?:["'\s])/,
    ],
    fileExtensions: ['.vue', '.html', '.js', '.ts', '.jsx', '.tsx', '.md', '.css', '.less'],
  },
  {
    id: 'theme-to-mode',
    name: 'Theme to Mode',
    description: 'Deprecated setTheme() and data-dt-theme migrated to the layered theming API (setMode/setBrand/setContrast/initDialtoneTheme).',
    category: 'required',
    type: 'config',
    configName: 'theme-to-mode',
    detectPatterns: [
      /(?<!\.)setTheme\s*\(/,
      /\bdata-dt-theme\b/,
    ],
    fileExtensions: ['.vue', '.html', '.js', '.ts', '.jsx', '.tsx', '.css', '.less', '.scss', '.mjs'],
  },
  {
    id: 'component-props',
    name: 'Component Props & Events',
    description: 'Value renames, show→open, hide-* inversion, title→header-text, event/slot renames, rootClass removal.',
    category: 'required',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_props',
    detectPatterns: [
      /(?:show|hide-close|hide-icon|label-visible|selected-values)(?:=|[\s>])/,
      /<(?:dt-(?:banner|notice|toast|modal)|Dt(?:Banner|Notice|Toast|Modal))\b[^>]*\btitle(?:=|[\s>])/,
      /<(?:dt-[\w-]+|Dt\w+)\b[^>]*@(?:input|change)(?:=|\.)/,
      /kind="(?:danger|error)"/,
      /validation-state="(?:error|success)"/,
    ],
    fileExtensions: ['.vue'],
  },
  {
    id: 'chip-interactive',
    name: 'DtChip Interactive Default',
    description: 'interactive prop default changed from true to false. Clickable chips must opt in.',
    category: 'required',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_chip_interactive',
    detectPatterns: [
      /<(?:dt-chip|DtChip)\b[^>]*(?:@click|v-on:click)[^>]*>/,
    ],
    fileExtensions: ['.vue'],
  },
  {
    id: 'scrollbar-always',
    name: 'Scrollbar :never → :always',
    description: 'v-dt-scrollbar:never renamed to v-dt-scrollbar:always.',
    category: 'required',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_scrollbar_always',
    detectPatterns: [
      /v-dt-scrollbar:never/,
      /scrollbar="never"/,
    ],
    fileExtensions: ['.vue', '.html'],
  },

  // ── Opt-in (deprecation, best practices) ──────────────────────────
  {
    id: 'base-to-semantic',
    name: 'Base to Semantic Colors',
    description: 'Upgrade base color utilities/tokens to theme-aware semantic equivalents.',
    category: 'opt-in',
    type: 'config',
    configName: 'base-to-semantic',
    detectPatterns: [
      /d-fc-(?:black|red|green|gold)-\d+/,
      /d-bgc-(?:black|red|green|gold|blue|purple)-\d+/,
    ],
    fileExtensions: ['.css', '.less', '.html', '.vue', '.js', '.ts', '.jsx', '.tsx'],
  },
  {
    id: 'success-to-positive',
    name: 'Success to Positive',
    description: 'success* tokens and utility classes deprecated in favor of positive*.',
    category: 'opt-in',
    type: 'config',
    configName: 'success-to-positive',
    detectPatterns: [
      /var\(--dt-color-(?:foreground|surface|border|link)-success/,
      /d-(?:fc|bgc|bc)-success/,
    ],
    fileExtensions: ['.css', '.less', '.html', '.vue', '.js', '.ts', '.jsx', '.tsx'],
  },
  {
    id: 'stack-gap-to-spacing',
    name: 'Stack Gap to Spacing',
    description: 'DtStack and DtDescriptionList gap prop values migrated from old size stops to new spacing stops.',
    category: 'opt-in',
    type: 'config',
    configName: 'stack-gap-to-spacing',
    detectPatterns: [
      /gap="(?:50|100|200|300|350|400|450|500|525|550|600|625|650|700)"/,
      /d-stack--gap-(?:50|100|200|300|350|400|450|500|525|550|600|625|650|700)/,
    ],
    fileExtensions: ['.vue', '.html', '.js', '.ts', '.jsx', '.tsx', '.md'],
  },
  {
    id: 'flex-to-stack',
    name: 'Flex to DtStack',
    description: 'Replace d-d-flex utilities with the <dt-stack> component.',
    category: 'opt-in',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_flex_to_stack',
    detectPatterns: [
      /class="[^"]*d-d-flex[^"]*"/,
    ],
    fileExtensions: ['.vue'],
  },
  {
    id: 'link-rendering',
    name: 'Link and Button Navigation',
    description: 'DtButton/DtLink gain to/href props; legacy anchor/router-link workarounds replaced.',
    category: 'opt-in',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_link_rendering',
    detectPatterns: [
      /<a\b[^>]*class="[^"]*d-btn/,
      /<router-link\b[^>]*class="[^"]*d-link/,
      /<dt-link\b[^>]*class="[^"]*d-td-/,
    ],
    fileExtensions: ['.vue'],
  },
  {
    id: 'tshirt-to-numeric',
    name: 'Component Sizes to Numeric',
    description: 'size="sm" becomes :size="200" across all components.',
    category: 'opt-in',
    type: 'standalone',
    scriptDir: 'dialtone_migrate_tshirt_to_numeric',
    detectPatterns: [
      /<(?:dt-[\w-]+|Dt\w+)\b[^>]*\bsize="(?:xs|sm|md|lg|xl|2xl|3xl)"/,
    ],
    fileExtensions: ['.vue', '.html', '.md'],
  },
  {
    id: 'physical-to-logical',
    name: 'Logical Naming',
    description: 'Slots, props, events: left/right becomes start/end.',
    category: 'opt-in',
    type: 'config',
    configName: 'physical-to-logical',
    detectPatterns: [
      /#leftIcon|#rightIcon|#alphaIcon|#omegaIcon/,
      /alpha-(?:disabled|loading|active)/,
      /omega-(?:disabled|active)/,
      /icon-position="(?:left|right)"/,
    ],
    fileExtensions: ['.vue', '.html'],
  },
];

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

function parseArgs (args) {
  const cwdIndex = args.indexOf('--cwd');
  const onlyIndex = args.indexOf('--only');
  return {
    help: args.includes('--help'),
    dryRun: args.includes('--dry-run'),
    autoYes: args.includes('--yes'),
    healthCheck: args.includes('--health-check'),
    all: args.includes('--all'),
    cwd: cwdIndex !== -1 && args[cwdIndex + 1]
      ? path.resolve(args[cwdIndex + 1])
      : process.cwd(),
    only: onlyIndex !== -1 && args[onlyIndex + 1]
      ? args[onlyIndex + 1].split(',').map(s => s.trim())
      : null,
  };
}

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate [options]

Master migration script for Dialtone next major version.
Orchestrates all individual migration tools in the correct order.

Options:
  --cwd <path>       Working directory (default: cwd)
  --dry-run          Show changes without applying them
  --yes              Apply all changes without prompting
  --health-check     Report migration status without modifying files
  --all              Run all required migrations without selection prompt
  --only <ids>       Comma-separated list of migration IDs to run
  --help             Show help

Available migration IDs (required):
${MIGRATIONS.filter(m => m.category === 'required').map(m => `  ${m.id.padEnd(32)} ${m.name}`).join('\n')}

Available migration IDs (opt-in):
${MIGRATIONS.filter(m => m.category === 'opt-in').map(m => `  ${m.id.padEnd(32)} ${m.name}`).join('\n')}

Examples:
  npx dialtone-migrate                              # Interactive selection
  npx dialtone-migrate --health-check --cwd ./src   # Check migration status
  npx dialtone-migrate --all --dry-run               # Dry-run all required
  npx dialtone-migrate --only color-stops,hsl-to-oklch --yes
`);
}

// ---------------------------------------------------------------------------
// File walker (shared utility)
// ---------------------------------------------------------------------------

const DEFAULT_IGNORE = ['node_modules', 'dist', '.git', '.vuepress/public', '.vuepress/.temp', '.vuepress/.cache', 'storybook-static'];

function isIgnoredPath (fullPath) {
  const segments = fullPath.split(path.sep);
  return DEFAULT_IGNORE.some(ig => {
    if (ig.includes('/')) {
      const parts = ig.split('/');
      for (let i = 0; i + parts.length <= segments.length; i++) {
        if (parts.every((p, j) => segments[i + j] === p)) return true;
      }
      return false;
    }
    return segments.includes(ig);
  });
}

async function findFiles (dir, extensions) {
  const results = [];
  async function walk (currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch { return; }
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (isIgnoredPath(fullPath)) continue;
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
// Health check
// ---------------------------------------------------------------------------

async function healthCheck (cwd) {
  console.log(`\n${'━'.repeat(70)}`);
  console.log('  DIALTONE MIGRATION HEALTH CHECK');
  console.log(`${'━'.repeat(70)}\n`);
  console.log(`  Scanning: ${cwd}\n`);

  // Collect all needed extensions
  const allExtensions = [...new Set(MIGRATIONS.flatMap(m => m.fileExtensions))];
  const files = await findFiles(cwd, allExtensions);

  if (files.length === 0) {
    console.log('  No scannable files found in the target directory.\n');
    return;
  }

  // Read all files once
  const fileContents = new Map();
  for (const file of files) {
    try {
      fileContents.set(file, await fs.readFile(file, 'utf8'));
    } catch { /* skip unreadable */ }
  }

  const requiredResults = [];
  const optInResults = [];

  for (const migration of MIGRATIONS) {
    let matchCount = 0;
    const matchedFiles = new Set();

    for (const [file, content] of fileContents) {
      if (!migration.fileExtensions.some(ext => file.endsWith(ext))) continue;
      for (const pattern of migration.detectPatterns) {
        // Reset lastIndex for global patterns
        const re = new RegExp(pattern.source, pattern.flags.replace('g', ''));
        if (re.test(content)) {
          matchedFiles.add(path.relative(cwd, file));
          // Count all matches
          const globalRe = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
          const matches = content.match(globalRe);
          if (matches) matchCount += matches.length;
        }
      }
    }

    const result = {
      migration,
      matchCount,
      fileCount: matchedFiles.size,
      files: [...matchedFiles].slice(0, 5), // Show up to 5 sample files
      totalFiles: matchedFiles.size,
    };

    if (migration.category === 'required') {
      requiredResults.push(result);
    } else {
      optInResults.push(result);
    }
  }

  // Print required migrations
  console.log('  REQUIRED MIGRATIONS (breaking changes)\n');
  printHealthResults(requiredResults);

  // Print opt-in migrations
  console.log('\n  OPT-IN MIGRATIONS (best practices)\n');
  printHealthResults(optInResults);

  // Summary
  const requiredPending = requiredResults.filter(r => r.matchCount > 0);
  const optInPending = optInResults.filter(r => r.matchCount > 0);

  console.log(`\n${'━'.repeat(70)}`);
  console.log('  SUMMARY');
  console.log(`${'━'.repeat(70)}\n`);

  if (requiredPending.length === 0) {
    console.log('  ✓ All required migrations are complete!\n');
  } else {
    console.log(`  ✗ ${requiredPending.length} required migration(s) still pending:\n`);
    for (const r of requiredPending) {
      console.log(`    - ${r.migration.name} (${r.matchCount} matches in ${r.fileCount} files)`);
    }
    console.log();
  }

  if (optInPending.length > 0) {
    console.log(`  ○ ${optInPending.length} opt-in migration(s) available:\n`);
    for (const r of optInPending) {
      console.log(`    - ${r.migration.name} (${r.matchCount} matches in ${r.fileCount} files)`);
    }
    console.log();
  }
}

function printHealthResults (results) {
  for (const r of results) {
    const status = r.matchCount === 0 ? '✓' : '✗';
    const statusLabel = r.matchCount === 0 ? 'DONE' : 'PENDING';
    const color = r.matchCount === 0 ? '\x1b[32m' : '\x1b[33m';
    const reset = '\x1b[0m';

    console.log(`  ${color}${status} [${statusLabel}]${reset} ${r.migration.name} (${r.migration.id})`);
    console.log(`    ${r.migration.description}`);

    if (r.matchCount > 0) {
      console.log(`    → ${r.matchCount} pattern match(es) in ${r.fileCount} file(s)`);
      if (r.files.length > 0) {
        for (const f of r.files) {
          console.log(`      ${f}`);
        }
        if (r.totalFiles > 5) {
          console.log(`      ... and ${r.totalFiles - 5} more`);
        }
      }
    }
    console.log();
  }
}

// ---------------------------------------------------------------------------
// Interactive selection
// ---------------------------------------------------------------------------

function createReadlineInterface () {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

async function prompt (question) {
  const rl = createReadlineInterface();
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function selectMigrations (migrations) {
  console.log('\nAvailable migrations:\n');

  const required = migrations.filter(m => m.category === 'required');
  const optIn = migrations.filter(m => m.category === 'opt-in');

  if (required.length > 0) {
    console.log('  REQUIRED (breaking changes):');
    required.forEach((m, i) => {
      console.log(`    [${i + 1}] ${m.name} (${m.id})`);
      console.log(`        ${m.description}`);
    });
  }

  if (optIn.length > 0) {
    console.log('\n  OPT-IN (best practices):');
    optIn.forEach((m, i) => {
      console.log(`    [${required.length + i + 1}] ${m.name} (${m.id})`);
      console.log(`        ${m.description}`);
    });
  }

  const all = [...required, ...optIn];
  console.log(`\n  [a] All required migrations`);
  console.log(`  [q] Quit\n`);

  const answer = await prompt('Select migrations (comma-separated numbers, "a" for all required, or "q" to quit): ');

  if (answer === 'q') return [];
  if (answer === 'a') return required;

  const indices = answer.split(',').map(s => parseInt(s.trim(), 10) - 1);
  const selected = indices
    .filter(i => i >= 0 && i < all.length)
    .map(i => all[i]);

  if (selected.length === 0) {
    console.log('No valid selections. Exiting.');
    return [];
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Migration runner
// ---------------------------------------------------------------------------

/**
 * Run a config-based migration using only Node builtins.
 * Reads the config's expressions and applies them to matching files
 * without importing the migration-helper (which requires chalk/globby/inquirer).
 */
async function runConfigMigration (migration, opts) {
  const configPath = path.resolve(
    __dirname, '..', 'dialtone_migration_helper', 'configs', `${migration.configName}.mjs`,
  );

  const { default: configData } = await import(configPath);

  // Derive file extensions from the config's glob patterns
  const extPattern = /\{([^}]+)\}/;
  const extensions = [];
  for (const p of (configData.patterns || [])) {
    const m = p.match(extPattern);
    if (m) {
      for (const ext of m[1].split(',')) {
        const e = '.' + ext.trim();
        if (!extensions.includes(e)) extensions.push(e);
      }
    }
  }
  // Fallback to migration registry extensions if config patterns don't specify
  if (extensions.length === 0) {
    extensions.push(...migration.fileExtensions);
  }

  console.log(`  Configuration: ${migration.configName}`);
  console.log(`  ${configData.description.split('\n')[0]}\n`);

  // Find files using the master script's own walker
  const allFiles = await findFiles(opts.cwd, extensions);

  // Read and filter files that have matches
  const matched = [];
  for (const file of allFiles) {
    let data;
    try {
      data = await fs.readFile(file, 'utf8');
    } catch { continue; }
    // Skip likely minified files
    if ((data.match(/[\n\r]/g) || []).length <= 3) continue;
    let matchCount = 0;
    for (const expr of configData.expressions) {
      const testRe = new RegExp(expr.from.source, expr.from.flags.replace('g', ''));
      if (testRe.test(data)) matchCount++;
    }
    if (matchCount > 0) {
      matched.push({ file, data, matches: 0 });
    }
  }

  if (matched.length === 0) {
    console.log('  No matches found. Skipping.\n');
    return { skipped: true };
  }

  console.log(`  ${matched.length} file(s) queued for modification.`);

  if (opts.dryRun) {
    console.log('  --dry-run: No files were modified.\n');
    for (const f of matched.slice(0, 10)) {
      console.log(`    ${path.relative(opts.cwd, f.file)}`);
    }
    if (matched.length > 10) console.log(`    ... and ${matched.length - 10} more`);
    return { dryRun: true, fileCount: matched.length };
  }

  if (!opts.autoYes) {
    const answer = await prompt(`  Apply changes to ${matched.length} file(s)? (y/N) `);
    if (answer !== 'y' && answer !== 'yes') {
      console.log('  Skipped.\n');
      return { skipped: true };
    }
  }

  // Apply expressions and write files.
  // Loop until convergence: some config regexes only match one token per
  // property declaration per pass (e.g. border-width with two var(--dt-size-*)).
  for (const entry of matched) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const expr of configData.expressions) {
        const before = entry.data;
        entry.data = entry.data.replace(expr.from, (match, ...args) => {
          if (typeof expr.to === 'function') {
            return expr.to(match, ...args);
          }
          return match.replace(expr.from, expr.to);
        });
        if (entry.data !== before) {
          entry.matches++;
          changed = true;
        }
      }
    }
    if (entry.matches > 0) {
      await fs.writeFile(entry.file, entry.data, 'utf8');
      const shortname = path.relative(opts.cwd, entry.file);
      console.log(`  >> ${shortname}, ${entry.matches} changes`);
    }
  }

  console.log();
  return { applied: true, fileCount: matched.length };
}

/**
 * Run a standalone migration script as a child process.
 */
async function runStandaloneMigration (migration, opts) {
  const scriptPath = path.resolve(__dirname, '..', migration.scriptDir, 'index.mjs');

  const args = ['--cwd', opts.cwd];
  if (opts.dryRun) args.push('--dry-run');
  if (opts.autoYes) args.push('--yes');

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('close', code => {
      // Exit code 0 means success (or nothing to do)
      resolve({ exitCode: code });
    });

    child.on('error', reject);
  });
}

async function runMigration (migration, opts) {
  if (migration.type === 'config') {
    return runConfigMigration(migration, opts);
  }

  if (migration.type === 'standalone') {
    return runStandaloneMigration(migration, opts);
  }

  console.log(`  ⚠ Manual migration required. See migration guide for details.\n`);
  return { manual: true };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main () {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  console.log(`\n${'━'.repeat(70)}`);
  console.log('  DIALTONE MIGRATION TOOL');
  console.log(`${'━'.repeat(70)}`);

  // Health check mode
  if (opts.healthCheck) {
    await healthCheck(opts.cwd);
    process.exit(0);
  }

  // Determine which migrations to run
  let selected;

  if (opts.only) {
    selected = opts.only.map(id => {
      const m = MIGRATIONS.find(m => m.id === id);
      if (!m) {
        console.error(`\n  Unknown migration ID: "${id}"`);
        console.error(`  Available IDs: ${MIGRATIONS.map(m => m.id).join(', ')}\n`);
        process.exit(1);
      }
      return m;
    });
  } else if (opts.all) {
    selected = MIGRATIONS.filter(m => m.category === 'required');
  } else {
    selected = await selectMigrations(MIGRATIONS);
  }

  if (selected.length === 0) {
    console.log('\n  No migrations selected. Exiting.\n');
    process.exit(0);
  }

  // Confirmation
  console.log(`\n  Target directory: ${opts.cwd}`);
  console.log(`  Migrations to run (${selected.length}):\n`);
  for (const m of selected) {
    const tag = m.category === 'required' ? '[REQUIRED]' : '[OPT-IN]';
    console.log(`    ${tag} ${m.name}`);
  }

  if (opts.dryRun) {
    console.log('\n  Mode: DRY RUN (no files will be modified)\n');
  }

  if (!opts.autoYes && !opts.dryRun) {
    console.log(`\n  ⚠ Please ensure you are running this in a repository where changes`);
    console.log(`    can be rolled back. Modifications will occur to files.\n`);

    const answer = await prompt('  Proceed? (y/N) ');
    if (answer !== 'y' && answer !== 'yes') {
      console.log('  Cancelled.\n');
      process.exit(0);
    }
  }

  // Run migrations in order
  const results = [];

  for (let i = 0; i < selected.length; i++) {
    const migration = selected[i];
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`  [${i + 1}/${selected.length}] ${migration.name} (${migration.id})`);
    console.log(`${'─'.repeat(70)}\n`);

    try {
      const result = await runMigration(migration, opts);
      results.push({ migration, ...result, success: true });
    } catch (err) {
      console.error(`\n  ✗ Error running ${migration.name}: ${err.message}\n`);
      results.push({ migration, success: false, error: err.message });

      const answer = await prompt('  Continue with remaining migrations? (y/N) ');
      if (answer !== 'y' && answer !== 'yes') break;
    }
  }

  // Final summary
  console.log(`\n${'━'.repeat(70)}`);
  console.log('  MIGRATION SUMMARY');
  console.log(`${'━'.repeat(70)}\n`);

  for (const r of results) {
    const status = r.success
      ? (r.skipped ? '○ SKIPPED' : r.dryRun ? '◐ DRY RUN' : r.manual ? '⚠ MANUAL' : '✓ DONE')
      : '✗ FAILED';
    console.log(`  ${status}  ${r.migration.name}`);
    if (!r.success && r.error) console.log(`         ${r.error}`);
  }

  console.log(`\n  Tip: Run with --health-check to verify remaining migration work.\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
