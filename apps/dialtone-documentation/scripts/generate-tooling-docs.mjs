#!/usr/bin/env node

/**
 * Synchronize generated rule tables in the ESLint and Stylelint documentation.
 *
 * Usage:
 *   node apps/dialtone-documentation/scripts/generate-tooling-docs.mjs
 *   node apps/dialtone-documentation/scripts/generate-tooling-docs.mjs --check
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const GITHUB_BLOB_PREFIX = 'https://github.com/dialpad/dialtone/blob/staging/';
const CHECK_ONLY = process.argv.includes('--check');
const GENERATED_NOTICE =
  '<!-- Do not edit this section manually. Run `pnpm nx run dialtone-documentation:generate-tooling-docs` to update it. -->';

const PAGES = {
  eslint: resolve(
    REPO_ROOT,
    'apps/dialtone-documentation/docs/guides/eslint/index.md',
  ),
  stylelint: resolve(
    REPO_ROOT,
    'apps/dialtone-documentation/docs/guides/stylelint/index.md',
  ),
};

const MARKERS = {
  eslint: {
    start: '<!-- GENERATED:eslint-rules:start -->',
    end: '<!-- GENERATED:eslint-rules:end -->',
  },
  stylelint: {
    start: '<!-- GENERATED:stylelint-rules:start -->',
    end: '<!-- GENERATED:stylelint-rules:end -->',
  },
};

function sourceUrl(relativePath) {
  return `${GITHUB_BLOB_PREFIX}${relativePath}`;
}

function resolveDocumentationUrl(url, sourcePath) {
  if (!url?.startsWith(GITHUB_BLOB_PREFIX)) return url || sourceUrl(sourcePath);

  const docsPath = url.slice(GITHUB_BLOB_PREFIX.length);
  return existsSync(resolve(REPO_ROOT, docsPath)) ? url : sourceUrl(sourcePath);
}

function normalizeDescription(description, ruleName) {
  if (!description)
    throw new Error(`Missing documentation description for ${ruleName}`);

  const normalized = description.replace(/\s+/g, ' ').trim();
  return /[.!?`]$/.test(normalized) ? normalized : `${normalized}.`;
}

function escapeTableCell(value) {
  return value.replace(/\|/g, '\\|');
}

function renderTable(columns, rows) {
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map(escapeTableCell).join(' | ')} |`);

  return [header, divider, ...body].join('\n');
}

function eslintRules() {
  const plugin = require(
    resolve(REPO_ROOT, 'packages/eslint-plugin-dialtone/lib'),
  );

  return Object.entries(plugin.rules)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([name, rule]) => {
      const sourcePath = `packages/eslint-plugin-dialtone/lib/rules/${name}.js`;
      const meta = rule.meta;

      return [
        `[${name}](${resolveDocumentationUrl(meta?.docs?.url, sourcePath)})`,
        normalizeDescription(meta?.docs?.description, name),
        meta?.fixable ? 'Yes' : 'No',
      ];
    });
}

function stylelintRules() {
  const plugins = require(
    resolve(REPO_ROOT, 'packages/stylelint-plugin-dialtone/lib'),
  );
  const prefix = '@dialpad/stylelint-plugin-dialtone/';

  return plugins
    .filter((plugin) => plugin.ruleName.startsWith(prefix))
    .map((plugin) => {
      const name = plugin.ruleName.slice(prefix.length);
      const sourcePath = `packages/stylelint-plugin-dialtone/lib/rules/${name}.js`;
      const meta = plugin.rule.meta;

      return [
        `[${name}](${resolveDocumentationUrl(meta?.url, sourcePath)})`,
        normalizeDescription(meta?.description, plugin.ruleName),
        meta?.fixable ? 'Yes' : 'No',
      ];
    })
    .sort(([first], [second]) => first.localeCompare(second));
}

function replaceGeneratedSection(content, markers, generatedContent, pagePath) {
  const startIndex = content.indexOf(markers.start);
  const endIndex = content.indexOf(markers.end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(
      `Missing or invalid generated-section markers in ${pagePath}`,
    );
  }

  if (
    content.indexOf(markers.start, startIndex + markers.start.length) !== -1 ||
    content.indexOf(markers.end, endIndex + markers.end.length) !== -1
  ) {
    throw new Error(`Duplicate generated-section markers in ${pagePath}`);
  }

  const before = content.slice(0, startIndex);
  const after = content.slice(endIndex + markers.end.length);
  return `${before}${markers.start}\n${GENERATED_NOTICE}\n\n${generatedContent}\n\n${markers.end}${after}`;
}

async function expectedPage(pagePath, markers, generatedContent) {
  const current = readFileSync(pagePath, 'utf-8');
  const replaced = replaceGeneratedSection(
    current,
    markers,
    generatedContent,
    pagePath,
  );
  const prettierConfig = await resolveConfig(pagePath);

  return format(replaced, {
    ...prettierConfig,
    parser: 'markdown',
    filepath: pagePath,
  });
}

async function generatePage(name, rows) {
  const pagePath = PAGES[name];
  const current = readFileSync(pagePath, 'utf-8');
  const table = renderTable(['Rule', 'What it checks', 'Autofix'], rows);
  const expected = await expectedPage(pagePath, MARKERS[name], table);

  if (current === expected) {
    console.info(`generate-tooling-docs: ${name} is current`);
    return true;
  }

  if (CHECK_ONLY) {
    console.error(`generate-tooling-docs: ${name} is stale`);
    return false;
  }

  writeFileSync(pagePath, expected, 'utf-8');
  console.info(`generate-tooling-docs: updated ${name}`);
  return true;
}

async function main() {
  const results = await Promise.all([
    generatePage('eslint', eslintRules()),
    generatePage('stylelint', stylelintRules()),
  ]);

  if (CHECK_ONLY && results.includes(false)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`generate-tooling-docs failed: ${error.message}`);
  process.exitCode = 1;
});
