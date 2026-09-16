#!/usr/bin/env node

/**
 * cleanup-redundant-code-separator.mjs
 *
 * Finds and fixes fenced `vue demo` blocks where the `<!-- @code -->` separator
 * is redundant — i.e., the demo content above and the code content below are
 * identical after normalizing whitespace and stripping directive comments.
 *
 * Usage:
 *   node scripts/cleanup-redundant-code-separator.mjs [--dry-run] [--verbose] [file ...]
 *
 * No file args: processes all .md files in apps/dialtone-documentation/docs/ recursively.
 */

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const fileArgs = args.filter(a => !a.startsWith('--'));

const DOCS_DIR = path.resolve(
  import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname),
  '../apps/dialtone-documentation/docs',
);

// Directive comments that only affect the demo rendering, not the code tab.
// These are stripped from the demo portion before comparing to the code portion.
const DIRECTIVE_RE = /^\s*<!--\s*@(?:wrapper|custom|bg\s+\S+|class\s+\S+|demo-only|code-only)\s*-->\s*$/;

/**
 * Strip directive comment lines from content.
 */
function stripDirectives (text) {
  return text
    .split('\n')
    .filter(line => !DIRECTIVE_RE.test(line))
    .join('\n');
}

/**
 * Normalize content for comparison:
 * - trim each line
 * - collapse multiple consecutive blank lines into one
 * - collapse multiple spaces within a line into one
 * - trim the whole result
 */
function normalize (text) {
  return text
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' '))
    .join('\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Process a single markdown file. Returns the number of redundant separators removed.
 */
// eslint-disable-next-line complexity
function processFile (filePath, relPath) {
  const original = fs.readFileSync(filePath, 'utf-8');
  const lines = original.split('\n');
  const result = [];
  let removedCount = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect opening of a ```vue demo block
    if (/^```vue\s+demo\s*$/.test(line.trim())) {
      // Collect all lines of this fenced block (including the opening and closing ```)
      const blockStart = i;
      const blockLines = [line];
      i++;

      // Find the closing ```
      while (i < lines.length && lines[i].trim() !== '```') {
        blockLines.push(lines[i]);
        i++;
      }

      // Add closing ``` if found
      if (i < lines.length) {
        blockLines.push(lines[i]);
        i++;
      }

      const innerLines = blockLines.slice(1, blockLines.length - 1);

      // Check for <!-- @code --> separator
      const codeSepIdx = innerLines.findIndex(l => /^\s*<!--\s*@code\s*-->\s*$/.test(l));

      if (codeSepIdx === -1) {
        // No separator — keep as-is
        result.push(...blockLines);
        continue;
      }

      // Split into demo (above separator) and code (below separator)
      const demoLines = innerLines.slice(0, codeSepIdx);
      const codeLines = innerLines.slice(codeSepIdx + 1);

      const demoStripped = stripDirectives(demoLines.join('\n'));
      const demoNorm = normalize(demoStripped);
      const codeNorm = normalize(codeLines.join('\n'));

      if (verbose) {
        console.log(`\n[verbose] ${relPath} block at line ${blockStart + 1}:`);
        console.log(`  demo (normalized): ${JSON.stringify(demoNorm).slice(0, 120)}`);
        console.log(`  code (normalized): ${JSON.stringify(codeNorm).slice(0, 120)}`);
        console.log(`  identical: ${demoNorm === codeNorm}`);
      }

      if (demoNorm === codeNorm) {
        // Redundant — remove separator and everything below it
        removedCount++;
        result.push(blockLines[0]); // opening ```vue demo
        result.push(...demoLines);
        result.push(blockLines[blockLines.length - 1]); // closing ```
      } else {
        // Intentional — keep the whole block
        result.push(...blockLines);
      }
    } else {
      result.push(line);
      i++;
    }
  }

  if (removedCount > 0) {
    const output = result.join('\n');
    if (!dryRun) {
      fs.writeFileSync(filePath, output, 'utf-8');
    }
    console.log(`[cleanup] ${relPath}: removed ${removedCount} redundant @code separator${removedCount > 1 ? 's' : ''}`);
  }

  return removedCount;
}

async function main () {
  let files;

  if (fileArgs.length > 0) {
    // Resolve file args (may contain globs already expanded by shell)
    files = fileArgs.map(f => path.resolve(f)).filter(f => {
      if (!fs.existsSync(f)) {
        console.warn(`[cleanup] warning: ${f} does not exist, skipping`);
        return false;
      }
      return true;
    });
  } else {
    // Find all .md files under the docs directory
    files = await glob('**/*.md', { cwd: DOCS_DIR, absolute: true });
  }

  if (dryRun) {
    console.log(`[cleanup] DRY RUN — no files will be modified`);
  }

  let totalRemoved = 0;
  let filesChanged = 0;

  for (const file of files) {
    const relPath = path.relative(DOCS_DIR, file);
    const count = processFile(file, relPath);
    totalRemoved += count;
    if (count > 0) filesChanged++;
  }

  console.log(`[cleanup] Done: ${totalRemoved} separator${totalRemoved !== 1 ? 's' : ''} removed in ${filesChanged} file${filesChanged !== 1 ? 's' : ''}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
