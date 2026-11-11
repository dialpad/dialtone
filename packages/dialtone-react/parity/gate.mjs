#!/usr/bin/env node
// The gate for one unit. Prints a summary block to paste into the PR description, then the details of anything
// that failed. Exits 1 unless every check passes.
//   pnpm nx run dialtone-react:gate -- <unit>        e.g. -- validation-messages (builds dialtone-icons first)
// PARITY_TMP sets where run artifacts go (default: the OS temp dir).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pascal } from './cases.mjs';
import { storyParity } from './story-parity.mjs';
import { reactDir as reactDirOf, testFiles, vueSources } from './vue-sources.mjs';

const unit = process.argv[2];
if (!unit || !/^[a-z0-9-]+$/.test(unit)) {
  console.error('usage: gate.mjs <unit id>, e.g. validation-messages, or mixin-input for common/input');
  process.exit(2);
}
const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vueRoot = path.resolve(pkg, '../dialtone-vue');
const name = pascal(unit);
// components/<Name>, or common/<name> for a directive, mixin or composable (vue-sources.mjs).
const home = reactDirOf(unit);
const reactDir = path.join(pkg, home);
// The unit's Vue sources (vue-sources.mjs): its component directory, where its Vue stories are, and every Vue path
// that's part of it, whose test files are its Vue tests.
let vue;
try {
  vue = vueSources(vueRoot, unit);
} catch (error) {
  console.error(`gate: ${error.message}`);
  process.exit(2);
}
// A unit ports something dialtone-vue has. With no Vue source (a typo, or a change that deleted it), there's nothing
// to check parity against, so the gate fails instead of passing on the React side alone. A source with no tests is fine.
if (!vue.paths.length) {
  console.error(`gate: dialtone-vue has no source for ${unit}: no component, directive, mixin or composable of that name`);
  process.exit(2);
}
// A unit ports its own Vue source: a component's <Name>.vue, or a directive's, mixin's or composable's own files. With
// that gone (deleted or renamed) and other sources left (the rest of the directory, a folded-in piece), the gate would
// check the leftovers, and skip a component's DOM parity, so it fails instead.
const component = home.startsWith('components/');
if (component ? !vue.file : !vue.own.length) {
  const own = component ? `${name}.vue` : 'file of its own';
  console.error(`gate: dialtone-vue has no ${own} for ${unit}, though it has ${vue.paths.join(', ')}`);
  process.exit(2);
}
const vueDir = vue.dir;
const tmp = fs.mkdtempSync(path.join(process.env.PARITY_TMP ?? os.tmpdir(), `parity-${unit}-`));
const rows = [];
const details = [];
const ok = (check, result) => rows.push([check, `✅ ${result}`]);
const bad = (check, result, detail) => { rows.push([check, `❌ ${result}`]); if (detail) details.push(`### ${check}\n\n${detail}`); };
const na = (check, result) => rows.push([check, `➖ ${result}`]);

function run (cwd, args, env = {}) {
  const proc = spawnSync('pnpm', ['exec', ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 64 << 20 });
  if (proc.error) { // pnpm didn't start, or its output overflowed maxBuffer
    console.error(`gate: couldn't run pnpm exec ${args[0]} (${proc.error.code ?? proc.error.message})`);
    process.exit(2);
  }
  return proc;
}
const readJson = file => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null);
// A Vitest run with the JSON reporter, plus the default one for readable errors. `error` explains a run that
// produced no test results (import or config errors). `broken` explains failures outside any test: a file that
// failed to load, a beforeAll or afterAll hook that threw, or an unhandled error. An unhandled error leaves the
// JSON report green, so only the exit status shows it.
function vitest (cwd, args, report, env = {}) {
  const proc = run(cwd, [...args, '--reporter=json', '--reporter=default', `--outputFile=${report}`], env);
  const json = readJson(report);
  const tests = results(json);
  const files = json?.testResults ?? [];
  const output = `${proc.stdout}\n${proc.stderr}`;
  // The default reporter's section that starts with the banner `marker` (its first 30 lines), or ''.
  const section = marker => { const at = output.search(marker); return at < 0 ? '' : output.slice(at).trim().split('\n').slice(0, 30).join('\n'); };
  const outside = files.filter(f => f.status === 'failed' && !(f.assertionResults ?? []).some(a => a.status === 'failed'));
  const broken = outside.map(f => `${path.relative(cwd, f.name)}: ${f.message || 'a beforeAll or afterAll hook failed'}`);
  // A failing hook leaves the JSON message empty; its error is only in the default reporter's Failed Suites.
  if (outside.some(f => !f.message)) broken.push(section(/⎯+ Failed Suites/));
  if (tests.length && !outside.length && proc.status !== 0 && !tests.some(t => t.status === 'failed')) {
    const detail = section(/⎯+ Unhandled (?:Error|Rejection)/) || tail(output, 30);
    broken.push(`Vitest exited with ${proc.status ?? proc.signal} although no test failed, probably an unhandled error:\n${detail}`);
  }
  const messages = files.map(f => f.message).filter(Boolean).join('\n');
  return { tests, broken: broken.filter(Boolean).join('\n'), error: tests.length ? '' : (messages || tail(output, 30) || 'The run produced no output.') };
}
const tail = (s, n = 40) => s.trim().split('\n').slice(-n).join('\n');
const block = s => `\`\`\`\n${s}\n\`\`\``;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
// Vitest's JSON reporter: testResults[].assertionResults[] with ancestorTitles, title and status.
const results = report => (report?.testResults ?? []).flatMap(f => f.assertionResults
  .map(a => ({ title: [...a.ancestorTitles, a.title].join(' › '), status: a.status, failure: a.failureMessages?.join('\n') ?? '' })));

if (!fs.existsSync(reactDir)) {
  console.error(`gate: ${path.relative(process.cwd(), reactDir)} doesn't exist`);
  process.exit(2);
}
const isComponent = Boolean(vue.file);
// Every script file in the unit's directory, nested ones too: lint and tsc check them all, so the scans below must.
const reactFiles = fs.readdirSync(reactDir, { recursive: true, withFileTypes: true })
  .filter(d => d.isFile() && /\.[cm]?[jt]sx?$/.test(d.name)).map(d => path.join(d.parentPath, d.name));
const sourceFiles = reactFiles.filter(f => !/\.(test|stories|parity)\.[cm]?[jt]sx?$/.test(f));

// 1. Typecheck, the whole package (a unit can break its dependents' types).
const tsc = run(pkg, ['tsc', '-p', 'tsconfig.json']);
if (tsc.status === 0) ok('Typecheck', 'clean');
else bad('Typecheck', plural((tsc.stdout.match(/error TS/g) ?? []).length, 'error'), block(tail(tsc.stdout)));

// Lint, the unit's directory (CI lints the whole package). Warnings are counted, not failed.
{
  const lint = run(pkg, ['eslint', '--format', 'json', `${home}/`]);
  let messages = null;
  try {
    messages = JSON.parse(lint.stdout)
      .flatMap(f => f.messages.map(m => ({ ...m, file: path.relative(pkg, f.filePath) })));
  } catch { /* ESLint itself failed (a config or parse error): reported below */ }
  const errors = messages?.filter(m => m.severity === 2) ?? [];
  const warnings = (messages?.length ?? 0) - errors.length;
  const lines = errors.map(m => `${m.file}:${m.line}:${m.column} ${m.message.split('\n')[0]} (${m.ruleId ?? 'parse'})`);
  const warned = warnings ? ` · ${plural(warnings, 'warning')}` : '';
  if (!messages) bad('Lint', 'ESLint failed', block(tail(`${lint.stdout}\n${lint.stderr}`)));
  else if (errors.length) bad('Lint', plural(errors.length, 'error') + warned, block(lines.join('\n')));
  else ok('Lint', `clean${warned}`);
}

// 2. The unit's React tests, and 3. test parity with its Vue tests.
const unitRun = vitest(pkg, ['vitest', 'run', `${home}/`], path.join(tmp, 'react-tests.json'));
const reactTests = unitRun.tests;
const failing = reactTests.filter(t => t.status === 'failed');
const passing = reactTests.filter(t => t.status === 'passed');
if (!reactTests.length) bad('Unit tests', 'none ran', block(unitRun.error));
else if (failing.length || unitRun.broken) {
  bad('Unit tests', [failing.length && `${failing.length} failed, ${passing.length} passed`, unitRun.broken && 'failures outside any test']
    .filter(Boolean).join(' · '), [
    ...failing.map(t => `- ${t.title}\n${block(tail(t.failure, 15))}`),
    unitRun.broken && `Failures outside any test:\n${block(unitRun.broken)}`,
  ].filter(Boolean).join('\n'));
} else if (!passing.length) {
  bad('Unit tests', `none passed (${reactTests.length} skipped or todo)`, 'Every React test of this unit is skipped or todo, so nothing was checked.');
} else ok('Unit tests', `${passing.length} passed`);

// Every Vue test file in the unit's Vue sources, nested ones too: Toast/Layouts, what's folded in
// (directives/tooltip_directive for tooltip), or a directive's, mixin's or composable's own tests.
const vueTestFiles = testFiles(vueRoot, vue.paths);
const vueRun = vueTestFiles.length
  ? vitest(vueRoot, ['vitest', 'run', ...vueTestFiles], path.join(tmp, 'vue-tests.json'))
  : { tests: [], error: '', broken: '' };
const vueTests = vueRun.tests.filter(t => t.status === 'passed');
// A red Vue suite would silently shrink what the React tests are checked against, so it fails the check.
const vueFailing = vueRun.tests.filter(t => t.status === 'failed');
const skips = readJson(path.join(reactDir, 'skips.json')) ?? {};
const vueSource = vueTestFiles.map(f => fs.readFileSync(path.join(vueRoot, f), 'utf8')).join('\n');
// The body of a Vue test, roughly: from its declaration to the next it/test/describe. it.each titles are
// templates (%s, $name), so each declaration's title becomes a pattern to match the reported title against.
const declarations = [...vueSource.matchAll(/\b(?:it|test)(?:\.each\([\s\S]{0,2000}?\)\s*)?\(\s*(['"`])(.*?)\1/g)]
  .map(m => ({ index: m.index, pattern: new RegExp(`^${m[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%[sidfjop#%]|\\\$\w+/g, '.*?')}$`) }));
const vueBody = title => {
  const leaf = title.split(' › ').at(-1);
  const i = declarations.findIndex(d => d.pattern.test(leaf));
  if (i < 0) return '';
  const rest = vueSource.slice(declarations[i].index);
  return rest.slice(0, rest.slice(1).search(/\n\s*(?:it|test|describe)(?:\.each)?\(/) + 1 || undefined);
};
const VUE_INTERNALS = /\.vm\.|\.props\(|setData\(|findComponent\(/;
{
  const pool = new Map();
  for (const t of reactTests) pool.set(t.title, [...(pool.get(t.title) ?? []), t.status]);
  const take = (title, status) => {
    const list = pool.get(title) ?? [];
    const i = list.indexOf(status);
    if (i < 0) return false;
    list.splice(i, 1);
    return true;
  };
  const missing = []; const badSkips = []; let ported = 0; let skipped = 0;
  for (const { title } of vueTests) {
    if (take(title, 'passed') || take(title, 'failed')) { ported++; continue; }
    if (take(title, 'skipped') || take(title, 'pending') || take(title, 'todo')) {
      const reason = skips[title];
      if (reason && (VUE_INTERNALS.test(vueBody(title)) || /deprecated/i.test(reason))) skipped++;
      else badSkips.push(`- ${title}: ${reason
        ? 'skips are only for Vue tests that assert Vue internals (.vm., .props(, setData(, findComponent() or deprecated API (say "deprecated" in the reason); port what the test checks instead'
        : 'not in skips.json'}`);
      continue;
    }
    missing.push(`- ${title}`);
  }
  const extra = [...pool.entries()].flatMap(([title, list]) => list.map(() => `- ${title}`));
  const unknownSkips = Object.keys(skips).filter(k => !vueTests.some(t => t.title === k)).map(k => `- ${k}`);
  const summary = `${ported}/${vueTests.length} Vue tests ported · ${skipped} skipped`;
  if (!vueTestFiles.length) na('Test parity', 'no Vue tests');
  else if (!vueRun.tests.length) bad('Test parity', 'the Vue tests didn\'t run', block(vueRun.error));
  else if (vueFailing.length || vueRun.broken || missing.length || badSkips.length || unknownSkips.length) {
    bad('Test parity', vueFailing.length || vueRun.broken ? `${summary} · the Vue tests aren't green` : summary, [
      vueFailing.length && `Vue tests that fail on this base, so React can't be checked against them:\n${vueFailing.map(t => `- ${t.title}`).join('\n')}`,
      vueRun.broken && `Vue failures outside any test:\n${block(vueRun.broken)}`,
      missing.length && `Vue tests with no React test of the same title:\n${missing.join('\n')}`,
      badSkips.length && `Skips that aren't allowed:\n${badSkips.join('\n')}`,
      unknownSkips.length && `skips.json entries with no Vue test:\n${unknownSkips.join('\n')}`,
    ].filter(Boolean).join('\n\n'));
  } else ok('Test parity', summary + (extra.length ? ` · ${extra.length} React-only` : ''));
}

// 4. DOM parity: Vue goldens, then the React side against them.
if (isComponent) {
  const goldens = path.join(tmp, 'goldens');
  const env = { PARITY_UNITS: unit, PARITY_OUT: goldens, PARITY_GOLDENS: goldens };
  const vueDom = vitest(vueRoot, ['vitest', 'run', '--config', path.join(pkg, 'parity/vue/vitest.config.mjs')], path.join(tmp, 'vue-dom.json'), env);
  const vueFailed = vueDom.tests.filter(t => t.status !== 'passed');
  if (!vueDom.tests.length || vueFailed.length || vueDom.broken) {
    bad('DOM parity', 'Vue side failed', [
      ...vueFailed.map(t => `- ${t.title}\n${block(tail(t.failure, 15))}`),
      vueDom.broken && block(vueDom.broken),
    ].filter(Boolean).join('\n') || block(vueDom.error));
  } else {
    const reactRun = vitest(pkg, ['vitest', 'run', '--config', 'parity/react/vitest.config.ts'], path.join(tmp, 'react-dom.json'), env);
    const reactDom = reactRun.tests;
    const cases = readJson(path.join(goldens, `${unit}.json`))?.cases ?? [];
    const deviations = readJson(path.join(reactDir, 'deviations.json')) ?? {};
    const caseResults = reactDom.filter(t => cases.some(c => t.title === `${unit} › ${c.name}`));
    const failed = reactDom.filter(t => t.status !== 'passed');
    // A deviation that only waives the Math.random check (noRandom) still compares the DOM, so its case matches.
    const domMatches = d => !d || (d.noRandom && !d.skip && d.react === undefined);
    const matched = caseResults.filter(t => t.status === 'passed' && domMatches(deviations[t.title.slice(unit.length + 3)])).length;
    // Slots whose output depends on context the component injects reach React with Vue's context already applied,
    // so whether the port provides it isn't compared. Said in the row so a reviewer checks it by hand.
    const contextSlots = cases.reduce((n, c) => n + (c.slotContext?.length ?? 0), 0);
    const summary = `${matched}/${cases.length} cases match Vue · ${Object.keys(deviations).length} deviations`
      + (contextSlots ? ` · ${contextSlots} slots static (injected context not compared)` : '');
    if (!reactDom.length) bad('DOM parity', 'React side didn\'t run', block(reactRun.error));
    else if (failed.length || caseResults.length !== cases.length || reactRun.broken) {
      bad('DOM parity', summary, [
        ...failed.map(t => `- ${t.title}\n${block(tail(t.failure, 60))}`),
        reactRun.broken && `Failures outside any case:\n${block(reactRun.broken)}`,
      ].filter(Boolean).join('\n'));
    } else ok('DOM parity', summary);
  }
} else na('DOM parity', 'not a component');

// 5. Story parity (story-parity.mjs). Base CI sets PARITY_SKIP_STAND_INS=1: a merge can leave stand-ins for the
// component it added, which follow-up PRs swap out.
{
  const stories = storyParity({
    vueDir, reactDir, name, pkg, vueRoot, vuePaths: vue.paths, standIns: process.env.PARITY_SKIP_STAND_INS !== '1',
  });
  if (stories.status === 'ok') ok('Story parity', stories.summary);
  else if (stories.status === 'na') na('Story parity', stories.summary);
  else bad('Story parity', stories.summary, stories.detail);
}

// 6. Anti-gaming: component code can't branch on the environment; tests mock only what Vue's mock; no
// file of the unit switches lint or typecheck off. @ts-expect-error stays allowed: lint requires it to say why, and
// it fails once the error it expects is gone.
{
  const problems = [];
  for (const f of sourceFiles) {
    const hits = fs.readFileSync(f, 'utf8').match(/import\.meta\.env|NODE_ENV|\bvitest\b|\bjsdom\b/g);
    if (hits) problems.push(`- ${path.relative(reactDir, f)} mentions ${[...new Set(hits)].join(', ')}`);
  }
  // Every form: eslint-disable, -line, -next-line, and inline rule config (`/* eslint rule: off */`, quoted or not).
  // Case-insensitive, as tsc reads its pragmas: `// @TS-NOCHECK` works. eslint.config.js also sets noInlineConfig
  // for components/ and common/, so a spelling this misses still has no effect.
  const SUPPRESSIONS = /eslint-disable(?:-next-line|-line)?|\/\*\s*eslint\s|@ts-ignore|@ts-nocheck/gi;
  for (const f of reactFiles) {
    const hits = fs.readFileSync(f, 'utf8').match(SUPPRESSIONS);
    if (hits) problems.push(`- ${path.relative(reactDir, f)} suppresses checks: ${[...new Set(hits)].join(', ')}`);
  }
  const mocks = src => [...src.matchAll(/vi\.mock\(\s*['"`]([^'"`]+)['"`]/g)].map(m => path.basename(m[1]).replace(/\.\w+$/, ''));
  const vueMocks = new Set(mocks(vueSource));
  for (const f of reactFiles.filter(f => /\.test\.[cm]?[jt]sx?$/.test(f))) {
    for (const m of mocks(fs.readFileSync(f, 'utf8'))) if (!vueMocks.has(m)) problems.push(`- ${path.relative(reactDir, f)} mocks ${m}, which the Vue tests don't`);
  }
  if (problems.length) bad('Anti-gaming', plural(problems.length, 'problem'), problems.join('\n'));
  else ok('Anti-gaming', 'clean');
}

const sha = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: pkg, encoding: 'utf8' }).stdout?.trim() || 'unknown';
const passed = rows.every(([, r]) => !r.startsWith('❌'));
console.log([
  `#### Parity gate: \`${unit}\` at ${sha} ${passed ? '✅' : '❌'}`,
  '',
  '| Check | Result |',
  '|---|---|',
  ...rows.map(([c, r]) => `| ${c} | ${r} |`),
  '',
  ...details,
].join('\n'));
console.error(`\nartifacts: ${tmp}`);
process.exit(passed ? 0 : 1);
