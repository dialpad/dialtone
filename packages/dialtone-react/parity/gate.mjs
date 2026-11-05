#!/usr/bin/env node
// The gate for one unit (parity.md › The gate). Prints a summary block that workers paste into the PR
// verbatim, then the details of anything that failed. Exits 1 unless every check passes.
//   pnpm --filter @dialpad/dialtone-react gate <unit>        e.g. gate validation-messages
// PARITY_TMP sets where run artifacts go (default: the OS temp dir).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pascal } from './cases.mjs';

const unit = process.argv[2];
if (!unit || !/^[a-z0-9-]+$/.test(unit)) {
  console.error('usage: gate.mjs <unit id>, e.g. validation-messages');
  process.exit(2);
}
const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vueRoot = path.resolve(pkg, '../dialtone-vue');
const name = pascal(unit);
const reactDir = path.join(pkg, 'components', name);
const vueDir = path.join(vueRoot, 'components', name);
const tmp = fs.mkdtempSync(path.join(process.env.PARITY_TMP ?? os.tmpdir(), `parity-${unit}-`));
const rows = [];
const details = [];
const ok = (check, result) => rows.push([check, `✅ ${result}`]);
const bad = (check, result, detail) => { rows.push([check, `❌ ${result}`]); if (detail) details.push(`### ${check}\n\n${detail}`); };
const na = (check, result) => rows.push([check, `➖ ${result}`]);

const run = (cwd, args, env = {}) => spawnSync('pnpm', ['exec', ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 64 << 20 });
const readJson = file => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null);
// A Vitest run with the JSON reporter; `error` explains a run that produced no test results (import or config errors).
function vitest (cwd, args, report, env = {}) {
  const proc = run(cwd, [...args, '--reporter=json', `--outputFile=${report}`], env);
  const json = readJson(report);
  const tests = results(json);
  const messages = (json?.testResults ?? []).map(f => f.message).filter(Boolean).join('\n');
  return { tests, error: tests.length ? '' : (messages || tail(`${proc.stdout}\n${proc.stderr}`, 30) || 'The run produced no output.') };
}
const tail = (s, n = 40) => s.trim().split('\n').slice(-n).join('\n');
const block = s => `\`\`\`\n${s}\n\`\`\``;
// Vitest's JSON reporter: testResults[].assertionResults[] with ancestorTitles, title and status.
const results = report => (report?.testResults ?? []).flatMap(f => f.assertionResults
  .map(a => ({ title: [...a.ancestorTitles, a.title].join(' › '), status: a.status, failure: a.failureMessages?.join('\n') ?? '' })));

if (!fs.existsSync(reactDir)) {
  console.error(`gate: ${path.relative(process.cwd(), reactDir)} doesn't exist`);
  process.exit(2);
}
const isComponent = fs.existsSync(path.join(vueDir, `${name}.vue`));
const reactFiles = fs.readdirSync(reactDir).map(f => path.join(reactDir, f));
const sourceFiles = reactFiles.filter(f => /\.tsx?$/.test(f) && !/\.(test|stories|parity)\.tsx?$/.test(f));

// 1. Typecheck, the whole package (a unit can break its dependents' types).
const tsc = run(pkg, ['tsc', '-p', 'tsconfig.json']);
if (tsc.status === 0) ok('Typecheck', 'clean');
else bad('Typecheck', `${(tsc.stdout.match(/error TS/g) ?? []).length} errors`, block(tail(tsc.stdout)));

// 2. The unit's React tests, and 3. test parity with its Vue tests.
const { tests: reactTests, error: reactError } = vitest(pkg, ['vitest', 'run', `components/${name}/`], path.join(tmp, 'react-tests.json'));
const failing = reactTests.filter(t => t.status === 'failed');
const passing = reactTests.filter(t => t.status === 'passed');
if (!reactTests.length) bad('Unit tests', 'none ran', block(reactError));
else if (failing.length) bad('Unit tests', `${failing.length} failed, ${passing.length} passed`, failing.map(t => `- ${t.title}\n${block(tail(t.failure, 15))}`).join('\n'));
else ok('Unit tests', `${passing.length} passed`);

const vueTestFiles = fs.existsSync(vueDir) ? fs.readdirSync(vueDir).filter(f => f.endsWith('.test.js')) : [];
const vueRun = vueTestFiles.length
  ? vitest(vueRoot, ['vitest', 'run', ...vueTestFiles.map(f => `components/${name}/${f}`)], path.join(tmp, 'vue-tests.json'))
  : { tests: [], error: '' };
const vueTests = vueRun.tests.filter(t => t.status === 'passed');
const skips = readJson(path.join(reactDir, 'skips.json')) ?? {};
const vueSource = vueTestFiles.map(f => fs.readFileSync(path.join(vueDir, f), 'utf8')).join('\n');
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
  else if (missing.length || badSkips.length || unknownSkips.length) {
    bad('Test parity', summary, [
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
  if (!vueDom.tests.length || vueFailed.length) {
    bad('DOM parity', 'Vue side failed', vueFailed.map(t => `- ${t.title}\n${block(tail(t.failure, 15))}`).join('\n') || block(vueDom.error));
  } else {
    const reactRun = vitest(pkg, ['vitest', 'run', '--config', 'parity/react/vitest.config.ts'], path.join(tmp, 'react-dom.json'), env);
    const reactDom = reactRun.tests;
    const cases = readJson(path.join(goldens, `${unit}.json`))?.cases ?? [];
    const deviations = readJson(path.join(reactDir, 'deviations.json')) ?? {};
    const caseResults = reactDom.filter(t => cases.some(c => t.title === `${unit} › ${c.name}`));
    const failed = reactDom.filter(t => t.status !== 'passed');
    const matched = caseResults.filter(t => t.status === 'passed' && !deviations[t.title.slice(unit.length + 3)]).length;
    const summary = `${matched}/${cases.length} cases match Vue · ${Object.keys(deviations).length} deviations`;
    if (!reactDom.length) bad('DOM parity', 'React side didn\'t run', block(reactRun.error));
    else if (failed.length || caseResults.length !== cases.length) bad('DOM parity', summary, failed.map(t => `- ${t.title}\n${block(tail(t.failure, 60))}`).join('\n'));
    else ok('DOM parity', summary);
  }
} else na('DOM parity', 'not a component');

// 5. Story parity: once the React Storybook exists (Phase 0).
if (fs.existsSync(path.join(pkg, '.storybook'))) na('Story parity', 'not wired up yet');
else na('Story parity', 'no React Storybook yet');

// 6. Anti-gaming (parity.md): component code can't branch on the environment; tests mock only what Vue's mock.
{
  const problems = [];
  for (const f of sourceFiles) {
    const hits = fs.readFileSync(f, 'utf8').match(/import\.meta\.env|NODE_ENV|\bvitest\b|\bjsdom\b/g);
    if (hits) problems.push(`- ${path.basename(f)} mentions ${[...new Set(hits)].join(', ')}`);
  }
  const mocks = src => [...src.matchAll(/vi\.mock\(\s*['"`]([^'"`]+)['"`]/g)].map(m => path.basename(m[1]).replace(/\.\w+$/, ''));
  const vueMocks = new Set(mocks(vueSource));
  for (const f of reactFiles.filter(f => /\.test\.tsx?$/.test(f))) {
    for (const m of mocks(fs.readFileSync(f, 'utf8'))) if (!vueMocks.has(m)) problems.push(`- ${path.basename(f)} mocks ${m}, which the Vue tests don't`);
  }
  if (problems.length) bad('Anti-gaming', `${problems.length} problems`, problems.join('\n'));
  else ok('Anti-gaming', 'clean');
}

const sha = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: pkg, encoding: 'utf8' }).stdout.trim();
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
