#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, lstatSync, realpathSync } from 'node:fs';
import { join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const mapPath = '.agents/resources/source-docs-map.json';
function safePath(path) {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    !isAbsolute(path) &&
    !path.split('/').some((p) => p === '..' || p === '.') &&
    !path.includes('\\')
  );
}
function worktreeState(root, path) {
  let current = root;
  try {
    for (const part of path.split('/')) {
      current = join(current, part);
      if (lstatSync(current).isSymbolicLink()) return 'symlink-not-read';
    }
    return lstatSync(current).isFile() ? 'present' : 'not-a-file';
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return 'missing';
    throw error;
  }
}
export function loadMap(root) {
  if (worktreeState(root, mapPath) !== 'present') throw new Error(`Mapping unavailable: ${mapPath}`);
  const map = JSON.parse(readFileSync(join(root, mapPath), 'utf8'));
  if (map.version !== 1 || !Array.isArray(map.families) || !Array.isArray(map.mappings))
    throw new Error('Invalid source review map');
  const ids = new Set();
  for (const [kind, rows] of [
    ['families', map.families],
    ['mappings', map.mappings],
  ]) {
    for (const row of rows) {
      const id = `${kind}:${row.id}`;
      if (!row.id || ids.has(id)) throw new Error(`Invalid/duplicate mapping ID: ${id}`);
      ids.add(id);
      const paths = row.paths ?? [];
      const prefixes = row.prefixes ?? [];
      if (
        !Array.isArray(paths) ||
        !Array.isArray(prefixes) ||
        (!paths.length && !prefixes.length) ||
        !paths.every(safePath) ||
        !prefixes.every((prefix) => safePath(prefix) && prefix.endsWith('/'))
      ) {
        throw new Error(`Unsafe mapping paths: ${id}`);
      }
      if (
        kind === 'mappings' &&
        (!Array.isArray(row.targets) ||
          !row.targets.length ||
          !row.targets.every((t) => safePath(t.path) && t.reason && t.section))
      )
        throw new Error(`Invalid targets: ${id}`);
    }
  }
  return map;
}
function matches(path, row) {
  return row.paths?.includes(path) || row.prefixes?.some((prefix) => path.startsWith(prefix));
}
export function matchChangedPaths(paths, map) {
  const unique = [...new Set(paths)].sort();
  return {
    candidates: map.mappings.flatMap((row) => {
      const changedPaths = unique.filter((path) => matches(path, row));
      return changedPaths.length ? [{ id: row.id, changedPaths, targets: row.targets, status: 'review-needed' }] : [];
    }),
    unmapped: unique.filter(
      (path) => map.families.some((row) => matches(path, row)) && !map.mappings.some((row) => matches(path, row)),
    ),
  };
}
function git(root, args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 16 * 1024 * 1024,
  });
}
function commit(root, ref) {
  try {
    return git(root, ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`]).trim();
  } catch {
    throw new Error(`Commit unavailable: ${ref}`);
  }
}
function parseChanges(output) {
  const tokens = output.split('\0');
  const changes = [];
  for (let i = 0; i < tokens.length - 1; ) {
    const status = tokens[i++];
    const oldPath = tokens[i++];
    if (/^[RC]/.test(status)) changes.push({ status, oldPath, path: tokens[i++] });
    else changes.push({ status, path: oldPath });
  }
  return changes;
}
function targetState(root, path, context) {
  if (context === 'worktree') return worktreeState(root, path);
  const output =
    context === 'index'
      ? git(root, ['ls-files', '--stage', '-z', '--', path])
      : git(root, ['ls-tree', '-z', context, '--', path]);
  const row = output.split('\0').find((row) => row.slice(row.indexOf('\t') + 1) === path);
  if (!row) return 'missing';
  if (row.startsWith('120000')) return 'symlink-not-read';
  return row.startsWith('100') ? 'present' : 'not-a-file';
}
export function analyze(options, cwd = process.cwd()) {
  const committed = Boolean(options.base || options.head);
  if (Number(Boolean(options.staged)) + Number(Boolean(options.worktree)) + Number(committed) !== 1)
    throw new Error('Choose exactly one input: base/head, staged or worktree');
  if (committed && (!options.base || !options.head || Boolean(options['merge-base']) === Boolean(options.direct)))
    throw new Error('Commit mode requires base, head and exactly one of merge-base or direct');
  if (!committed && (options['merge-base'] || options.direct)) throw new Error('Comparison flags require commit mode');
  if (options['include-untracked'] && !options.worktree) throw new Error('include-untracked requires worktree mode');
  const root = git(cwd, ['rev-parse', '--show-toplevel']).trim();
  const map = loadMap(root);
  let context;
  let args;
  let boundary;
  if (committed) {
    const base = commit(root, options.base);
    const head = commit(root, options.head);
    let mergeBase;
    if (options['merge-base']) {
      try {
        mergeBase = git(root, ['merge-base', base, head]).trim();
      } catch {
        throw new Error('Merge base unavailable; no fallback comparison was made');
      }
    }
    boundary = {
      mode: options['merge-base'] ? 'merge-base' : 'direct',
      suppliedBase: options.base,
      suppliedHead: options.head,
      base,
      head,
      mergeBase: mergeBase ?? null,
      effectiveBase: mergeBase ?? base,
    };
    context = head;
    args = [boundary.effectiveBase, head];
  } else if (options.staged) {
    boundary = { mode: 'staged', head: commit(root, 'HEAD') };
    context = 'index';
    args = ['--cached', boundary.head];
  } else {
    boundary = { mode: 'worktree', base: 'index' };
    context = 'worktree';
    args = [];
  }
  const changes = parseChanges(git(root, ['diff', '--name-status', '-z', '--find-renames', ...args, '--']));
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  if (options['include-untracked']) changes.push(...untracked.map((path) => ({ status: '?', path })));
  const matched = matchChangedPaths(
    changes.flatMap((c) => (c.oldPath ? [c.oldPath, c.path] : [c.path])),
    map,
  );
  return {
    advisory: true,
    boundary,
    targetContext: context,
    mappingSource: { path: mapPath, context: 'worktree' },
    changes,
    candidates: matched.candidates.map((c) => ({
      ...c,
      targets: c.targets.map((t) => ({ ...t, state: targetState(root, t.path, context) })),
    })),
    unmapped: matched.unmapped,
    outsideBoundary: { untracked: options['include-untracked'] ? [] : untracked },
  };
}
export function formatReport(report) {
  const base = report.boundary.effectiveBase ?? report.boundary.base ?? report.boundary.head;
  const lines = [
    `Advisory documentation review (${report.boundary.mode}); target context: ${report.targetContext}.`,
    `Comparison: ${base} -> ${report.targetContext}.`,
    'Candidates require source/prose inspection; this report does not prove review or correctness.',
  ];
  for (const c of report.candidates) {
    lines.push(`${c.id}: review-needed; ${c.changedPaths.map((p) => JSON.stringify(p)).join(', ')}`);
    for (const t of c.targets) lines.push(`  ${t.path} (${t.section}; ${t.state}): ${t.reason}`);
  }
  for (const path of report.unmapped) lines.push(`Unmapped recognized source: ${JSON.stringify(path)}`);
  if (report.outsideBoundary.untracked.length)
    lines.push(
      `Outside boundary: ${report.outsideBoundary.untracked.length} nonignored untracked paths (select with worktree --include-untracked).`,
    );
  if (!report.candidates.length && !report.unmapped.length)
    lines.push('No mapped candidates in this boundary; semantic review was not performed.');
  return lines.join('\n');
}
function main() {
  try {
    const { values } = parseArgs({
      options: {
        base: { type: 'string' },
        head: { type: 'string' },
        staged: { type: 'boolean' },
        worktree: { type: 'boolean' },
        'merge-base': { type: 'boolean' },
        direct: { type: 'boolean' },
        'include-untracked': { type: 'boolean' },
        format: { type: 'string', default: 'text' },
      },
    });
    if (!['text', 'json'].includes(values.format)) throw new Error('format must be text or json');
    const report = analyze(values);
    console.log(values.format === 'json' ? JSON.stringify(report, null, 2) : formatReport(report));
  } catch (error) {
    console.error(`doc-review: ${error.message}`);
    process.exitCode = 2;
  }
}
if (process.argv[1] && realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url)) main();
