/**
 * Run every check over every built component and summarise.
 *
 * Four questions, asked separately because each catches what the others cannot:
 *
 *   1. rendered values  — does Figma look like the browser, in BOTH modes?
 *   2. token identity   — is each property wired to the token the stylesheet names?
 *   3. slot pass        — are the nodes hidden behind a BOOLEAN component property
 *                         (which defaults to false, so the ordinary sweep never
 *                         renders them) also correct?
 *   4. merged           — for a set that carries its slots as component properties,
 *                         is it right in BOTH states — slots off AND slots on?
 *
 * (1) alone passes a binding to the wrong variable whenever that variable happens to
 * carry the right colour — how B-16 survived. (2) alone cannot see a value that was
 * never bound. (3) alone exists because a Figma property's non-default value is
 * otherwise never rendered at all — the B-11 pattern. (4) exists because B-108 hid
 * exactly there: the default state was correct, the toggled state put the icon on top
 * of the label, and nothing was looking at the toggled state.
 *
 *   node sync-scripts/check-all.mjs              # everything
 *   node sync-scripts/check-all.mjs badge button   # just these
 *   node sync-scripts/check-all.mjs --light-only # faster while iterating
 *
 * Deliberately NOT a CI job yet: it needs a browser, a Figma PAT, and a scratch file
 * that is nobody's source of truth. Wire it up once this lives somewhere real.
 */
import './pin-cwd.mjs';   // launch directory must not matter
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { COMPONENTS } from './component-axes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const lightOnly = args.includes('--light-only');
const wanted = args.filter(a => !a.startsWith('--'));
const names = wanted.length ? wanted : Object.keys(COMPONENTS);

/**
 * `<component>-merged` names a MERGED build, which is how run-batch builds, records and stamps
 * one (its slots live behind component properties, so it lands on its own page with its own
 * set id, `figmaMergedSetId`). It is checked as itself: against that set, in both slot states,
 * and not as the ordinary set of the same component, which it replaces for those checks.
 */
const baseOf = (n) => n.replace(/-merged$/, '');
const isMerged = (n) => n.endsWith('-merged');
const cfgOf = (n) => COMPONENTS[baseOf(n)];
const setIdOf = (n) => (isMerged(n) ? cfgOf(n).figmaMergedSetId : cfgOf(n).figmaSetId);

for (const n of names) {
  if (!cfgOf(n)) throw new Error(`unknown component "${n}" — known: ${Object.keys(COMPONENTS).join(', ')}`);
  if (!setIdOf(n)) throw new Error(`${n} has no ${isMerged(n) ? 'figmaMergedSetId' : 'figmaSetId'}`);
}

/**
 * IS THIS SET BUILT FROM THE PAYLOAD ON DISK?
 *
 * A pass over a stale set is worse than no pass: it reports on work nobody is looking
 * at, in the same words it uses for work that is current. run-batch records each built
 * component's payload fingerprints; compare them with what the shard index says now.
 * Reported, never fatal — verifying a stale set on purpose is a legitimate thing to do,
 * being unaware of it is not.
 */
const staleness = [];
try {
  const stamp = JSON.parse(readFileSync(join(HERE, 'build-data/built-from.json'), 'utf8'));
  const index = JSON.parse(readFileSync(join(HERE, 'build-data/shards/index.json'), 'utf8'));
  for (const n of names) {
    const was = stamp[n];
    const now = index.components.find(c => c.component === n);
    if (!was) { staleness.push(`${n}: never recorded as built — cannot tell which payload the set came from`); continue; }
    if (was.setId !== setIdOf(n)) {
      staleness.push(`${n}: config points at ${setIdOf(n)} but the build recorded ${was.setId}`);
    }
    if (!now) continue;
    const nowFp = now.shards.map(s => s.fingerprint).join(',');
    if (nowFp && was.fingerprints.join(',') !== nowFp) {
      staleness.push(`${n}: payload on disk has changed since the set was built — REBUILD before trusting this`);
    }
    // The builder decides what the canvas gets as much as the payload does. Watching only
    // the data reported "no rebuild needed" for three components whose output had changed
    // under a builder edit, which is the wrong answer to the question being asked.
    if (index.builder && was.builder && index.builder !== was.builder) {
      staleness.push(`${n}: built by a DIFFERENT builder revision (${was.builder} → ${index.builder}) — REBUILD`);
    } else if (index.builder && !was.builder) {
      // Say what is unknown rather than nothing. A build recorded before this guard
      // existed carries no builder revision, so "no warning" would read as "current".
      staleness.push(`${n}: the build recorded no builder revision — cannot tell if the builder has changed since`);
    }
  }
} catch (e) {
  /**
   * A MISSING INPUT IS NOT AN ABSENCE OF DOUBT.
   *
   * This used to swallow everything as "nothing to compare, and nothing to claim", so when
   * an aborted build-plugin run left no shard index, the whole staleness check evaluated to
   * silence and the passes ran against a canvas nobody could vouch for. Same shape as the
   * REST reads: the absence of a signal was read as the absence of a problem.
   */
  staleness.push(`cannot tell whether these sets are current: ${e.message}`);
}

/**
 * STOP BEFORE THE PASSES, NOT AFTER THEM.
 *
 * This file already said a pass over a stale set is worse than no pass — and then ran the
 * passes anyway and printed the warning underneath the results. Which is exactly what
 * happened: 3560 findings on a set built before the border fold was removed, read as a
 * regression, with the six REBUILD lines below the table nobody reaches first.
 *
 * A stale canvas cannot produce a meaningful verdict, so the run refuses rather than
 * producing one. `--stale-ok` is there because verifying a stale set on purpose is
 * legitimate; being unaware of it is not.
 */
/**
 * ANY staleness blocks, and the test is not a regex over the prose.
 *
 * The first version of this guard filtered for the word REBUILD, so "cannot tell whether
 * these sets are current" — the strongest possible reason not to trust a pass — slipped
 * straight through it and the passes ran twice more. Matching on the wording of a message
 * is the same mistake as reading a REST field's absence as a value: the signal has to be
 * the thing itself.
 *
 * So: if anything at all is unknown about which payload built this canvas, no pass can
 * describe it, and the run says so instead of producing a verdict.
 */
if (staleness.length && !args.includes('--stale-ok')) {
  console.log('\n⚠ the canvas cannot be vouched for, so no pass can describe it:\n');
  for (const m of staleness) console.log(`  ${m}`);
  const which = names.filter(n => staleness.some(m => m.startsWith(`${n}:`)));
  console.log('\nRebuild first. That needs the plugin, so it is run-batch, not this:\n');
  console.log(`  node sync-scripts/run-batch.mjs ${(which.length ? which : names).join(' ')}\n`);
  console.log('run-batch re-measures, preflights, serves, waits for you to click Run in\n'
    + 'Figma, writes the returned set ids back, and then runs these same passes.\n'
    + 'To check the stale canvas deliberately, re-run with --stale-ok.');
  process.exit(1);
}

function run (script, argv) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [join(HERE, script), ...argv], {
      cwd: join(HERE, '..'),
      env: process.env,
    });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    child.on('close', code => resolve({ code, out }));
  });
}

/** Pull the numbers back out of a run's own report rather than re-deriving them. */
function summarise (out) {
  const grab = (re) => { const m = out.match(re); return m ? m[1] : null; };
  return {
    variants: grab(/variants\s+:\s+(\d+)/) || grab(/variants\s+:\s+(\d+) checked/),
    findings: grab(/findings\s+:\s+(\d+)/),
    compared: grab(/bindings compared\s*:\s+(\d+)/),
    agree: grab(/\(agree (\d+)\)/),
    disagreements: grab(/DISAGREEMENTS\s+:\s+(\d+)/),
    modes: grab(/by mode\s+:\s+(.+)/),
    allowed: grab(/allowed\s+:\s+(.+)/),
    // The identity pass records its own allowances (the transparent-border fold). They
    // were printed by that script but never reached this summary, which is the only
    // thing anyone reads — a deliberate divergence nobody can see is the failure mode.
    identityAllowed: grab(/recorded allowances\s+:\s+(.+)/),
    boxSpread: grab(/box spread:\s+(.+)/),
  };
}

// Build the full job list first, then run it with a concurrency cap. Each pass is an
// independent process against an independent Figma read, so serialising them only
// cost wall-clock.
const jobs = [];
const skipped = [];
// A config with `merged: true` IS its merged build (one set, one id, built under its own name),
// so it is checked as one: both slot states, against `figmaSetId`.
const mergedPrimary = (n) => !isMerged(n) && !!cfgOf(n).merged;
for (const name of names) {
  if (isMerged(name) || mergedPrimary(name)) {
    // One set, both states: the values pass reads it with slots empty, then filled.
    jobs.push({ component: name, pass: 'merged', script: 'verify-components.mjs',
                argv: [baseOf(name), '--set', setIdOf(name), '--merged', ...(lightOnly ? ['--light-only'] : [])] });
    jobs.push({ component: name, pass: 'identity', script: 'audit-provenance.mjs',
                argv: [baseOf(name), '--set', setIdOf(name)] });
    continue;
  }
  const cfg = COMPONENTS[name];
  const setId = cfg.figmaSetId;
  jobs.push({ component: name, pass: 'values', script: 'verify-components.mjs',
              argv: [name, '--set', setId, ...(lightOnly ? ['--light-only'] : [])] });
  jobs.push({ component: name, pass: 'identity', script: 'audit-provenance.mjs',
              argv: [name, '--set', setId] });
  if (cfg.slotPass) {
    /**
     * A MERGED set is checked in BOTH of its states against the one set: slots empty with
     * Figma's hidden layers excluded, then slots filled with them included. That second
     * sub-pass is the one that matters — it is the only thing that looks at the state a
     * designer reaches by toggling, and B-108 lived there undetected while every other
     * check passed.
     *
     * Reported as SKIP when no merged set exists, never as a pass: a component whose merged
     * build has not happened has not been checked in its toggled state, and saying nothing
     * would read as though it had.
     */
    if (cfg.figmaMergedSetId) {
      jobs.push({ component: name, pass: 'merged', script: 'verify-components.mjs',
                  argv: [name, '--set', cfg.figmaMergedSetId, '--merged', ...(lightOnly ? ['--light-only'] : [])] });
    } else {
      skipped.push({ component: name, pass: 'merged',
                     why: `declares slotPass [${cfg.slotPass.join(', ')}] but no figmaMergedSetId — the toggled state is unchecked` });
    }
  }
}

const CONCURRENCY = Number(process.env.CHECK_CONCURRENCY || 4);
const rows = [];
let failed = 0;
let started = 0;
let done = 0;

async function worker () {
  while (true) {
    const i = started++;
    if (i >= jobs.length) return;
    const job = jobs[i];
    const { code, out } = await run(job.script, job.argv);
    const s = summarise(out);
    const bad = code !== 0;
    if (bad) failed++;
    done++;
    console.log(`  [${String(done).padStart(2)}/${jobs.length}] ${job.component}/${job.pass} … ${bad ? 'FAIL' : 'ok'}`);
    rows.push({ component: job.component, pass: job.pass, ok: !bad, ...s, raw: bad ? out : null });
  }
}
console.log(`running ${jobs.length} passes, ${CONCURRENCY} at a time\n`);
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));

// keep the report in a stable order regardless of completion order
const order = new Map(jobs.map((j, i) => [`${j.component}/${j.pass}`, i]));
rows.sort((a, b) => order.get(`${a.component}/${a.pass}`) - order.get(`${b.component}/${b.pass}`));

console.log('\n' + '='.repeat(78));
console.log('component  pass      result   detail');
console.log('-'.repeat(78));
for (const r of rows) {
  const detail = r.pass === 'identity'
    ? `${r.agree || '?'}/${r.compared || '?'} bindings agree, ${r.disagreements || '?'} disagreements`
    : `${r.variants || '?'} variants, ${r.findings || '?'} findings${r.modes ? '  [' + r.modes.trim() + ']' : ''}`;
  console.log(`${r.component.padEnd(10)} ${r.pass.padEnd(9)} ${(r.ok ? 'PASS' : 'FAIL').padEnd(8)} ${detail}`);
}
for (const k of skipped) {
  console.log(`${k.component.padEnd(10)} ${k.pass.padEnd(9)} ${'SKIP'.padEnd(8)} ${k.why}`);
}
console.log('='.repeat(78));

// Allowances are printed, never hidden: a divergence nobody can see is the failure
// mode this whole exercise kept running into.
// Whatever staleness did NOT stop the run above — an unrecorded build, a config pointing at
// a different set, or a deliberate --stale-ok — still qualifies the results.
if (staleness.length) {
  console.log('\n⚠ these results may not describe what is on the canvas:');
  for (const s of staleness) console.log(`  ${s}`);
}

const allowances = rows.filter(r => r.allowed || r.identityAllowed);
if (allowances.length) {
  console.log('\nrecorded allowances (deliberate divergences):');
  for (const r of allowances) {
    if (r.allowed) console.log(`  ${r.component}/${r.pass}: ${r.allowed.trim()}`);
    if (r.identityAllowed) console.log(`  ${r.component}/${r.pass}: ${r.identityAllowed.trim()}`);
  }
}

/**
 * Print the SHAPE of a failure, not its tail.
 *
 * This was `slice(-30)`, and the verifier's own report ends with twelve worked examples
 * — 24 lines — so the `by field:` histogram was pushed off the top of every single
 * failing component. Ten failing passes were reported with exactly one histogram line
 * each, which reads as "one kind of problem" when the truth was three or four. The
 * histogram is what says whether 240 findings are one bug or eighty; the examples only
 * illustrate. So slice from the summary FORWARD, keep the whole histogram, and keep
 * only enough examples to see the pattern.
 */
function digest (raw) {
  const lines = raw.split('\n').filter(l => !/\[vite\]|console\.error/.test(l));
  const start = lines.findIndex(l => /^component\s*:/.test(l));
  if (start < 0) return lines.slice(-30).join('\n');   // crashed before reporting
  const examples = lines.findIndex(l => /^first 12:/.test(l));
  const head = lines.slice(start, examples < 0 ? lines.length : examples);
  const tail = examples < 0 ? [] : ['first 3 of those:', ...lines.slice(examples + 1, examples + 7)];
  return [...head, ...tail].join('\n');
}

for (const r of rows.filter(x => !x.ok)) {
  console.log(`\n──── ${r.component}/${r.pass} output ────`);
  console.log(digest(r.raw));
}

const skipNote = skipped.length ? ` (${skipped.length} skipped)` : '';
console.log(failed ? `\n❌ ${failed} of ${rows.length} passes failed${skipNote}` : `\n✅ all ${rows.length} passes clean${skipNote}`);
process.exit(failed ? 1 : 0);
