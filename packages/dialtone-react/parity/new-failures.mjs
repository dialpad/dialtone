#!/usr/bin/env node
// Whether a unit's gate failures on a change are new, or were there on its base already: a staging sync leaves units
// failing until their resyncs merge, and a PR that gates one of them shouldn't fail for it. CI's gate job re-runs a
// unit that failed on the base, and asks this. Only failures the base shows too are old. Compared are the failing
// checks, and under each what gate.mjs lists: test titles, case names, story ids, and the lines of a block that isn't
// an excerpt (lint and typecheck output, failures outside any test). A failing check the base passes, an item it
// doesn't list, or a base gate that passed or didn't run, are new. The excerpt under a listed item isn't compared:
// its paths, timings and cut messages differ between runs, checkouts and gate versions. So a different failure in an
// item that already fails reads as old here; CI counts every failure of a unit whose own files a change touches,
// so that unit can't pass before its own fix does.
//   node packages/dialtone-react/parity/new-failures.mjs <gate log on the change> <gate log on the base> \
//     [<the change's checkout> <the base's checkout>]
// Exit 0 when nothing is new; 1 when something is, printed as Markdown. Both logs are the gate's standard output only.
// The checkouts, when given, are written as <root> in both logs: a stack trace names the checkout it ran in.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HEADER = /^#### Parity gate: `[a-z0-9-]+` at \S+ (✅|❌)\s*$/;
const ROW = /^\| (.+?) \| (✅|❌|⏭) ?(.*?) \|\s*$/;
// What the gate's output runs into: pnpm's and Nx's own lines, and the artifacts path the gate prints on stderr.
const END = /^\s*(?:\[?ELIFECYCLE\]?\s|ERR_PNPM_|>?\s*NX\s|artifacts: )/;
// eslint-disable-next-line no-control-regex
const ANSI = /\x1b\[[0-9;]*m/g;
// The gate's own temp directories (mkdtemp's six random characters).
const TEMP = /(parity-[a-z0-9-]+-)[A-Za-z0-9]{6}\b/g;

// Every spelling of a checkout a log can hold: as given, and as the real path (macOS's /tmp is /private/tmp).
const spellings = (root) => {
  if (!root) return [];
  let real = root;
  try { real = fs.realpathSync(root); } catch { /* a root that's gone: as given */ }
  return [...new Set([real, root].map(p => p.replace(/\/+$/, '')))].filter(Boolean).sort((a, b) => b.length - a.length);
};

/**
 * A gate log (gate.mjs' output, Nx's around it) as { failing: Map<check, Set<line>> }, or null when it holds no gate
 * summary (the gate didn't run, or crashed first). A failing check's lines are what gate.mjs printed under its
 * "### <check>" heading, less the excerpts (a fenced block right after a "- " item), or its row's result when that
 * leaves nothing. `root`, the checkout the gate ran in, is written as <root>, and the gate's temp directories lose
 * their random part.
 */
export function gateFailures (log, root) {
  let text = log.replace(ANSI, '');
  for (const spelling of spellings(root)) text = text.split(spelling).join('<root>');
  const lines = text.replace(TEMP, '$1XXXXXX').split(/\r?\n/);
  const start = lines.findIndex(l => HEADER.test(l));
  if (start < 0) return null;
  const failing = new Map();
  const results = new Map();
  let section = null;
  let block = null; // inside a fenced block: 'excerpt' or 'kept'
  let previous = ''; // the last non-blank line outside a block, in this section
  for (const line of lines.slice(start + 1)) {
    if (/^\s*```/.test(line)) {
      block = block ? null : (previous.startsWith('- ') ? 'excerpt' : 'kept');
      continue;
    }
    if (block) {
      if (block === 'kept' && section && failing.has(section) && line.trim()) failing.get(section).add(line.trim());
      continue;
    }
    if (END.test(line)) break;
    const row = !section && ROW.exec(line);
    if (row) {
      if (row[2] === '❌') { failing.set(row[1], new Set()); results.set(row[1], row[3].trim()); }
      continue;
    }
    const heading = /^### (.+?)\s*$/.exec(line);
    if (heading) { section = heading[1]; previous = ''; continue; }
    if (!line.trim()) continue;
    previous = line.trim();
    if (section && failing.has(section)) failing.get(section).add(previous);
  }
  for (const [check, details] of failing) if (!details.size) details.add(results.get(check));
  return { failing };
}

/**
 * What fails on the change but not on the base: ["<check>: <line>", ...], [] when nothing is new. A base whose gate
 * didn't run (null) or passed (no failing checks) makes every failure on the change new.
 */
export function newFailures (change, base) {
  const fresh = [];
  for (const [check, lines] of change?.failing ?? []) {
    const before = base?.failing.get(check);
    for (const line of lines) if (!before?.has(line)) fresh.push(`${check}: ${line}`);
  }
  return fresh;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [changeLog, baseLog, changeRoot, baseRoot] = process.argv.slice(2);
  const read = f => { try { return fs.readFileSync(f, 'utf8'); } catch { return ''; } };
  const change = gateFailures(read(changeLog), changeRoot);
  const base = gateFailures(read(baseLog), baseRoot);
  // CI only asks about a run that failed. With no summary, or a summary that fails no check, it failed outside the
  // gate's checks (a build step, a crash), which nothing on the base can explain.
  const fresh = !change ? ['the gate printed no summary']
    : !change.failing.size ? ['the run failed, though no check in its summary did']
      : newFailures(change, base);
  if (!fresh.length) process.exit(0);
  console.log(base ? fresh.map(l => `- ${l}`).join('\n') : `- the base's gate didn't run, so nothing could be compared\n${fresh.map(l => `- ${l}`).join('\n')}`);
  process.exit(1);
}
