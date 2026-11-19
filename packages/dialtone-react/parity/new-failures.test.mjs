// new-failures.mjs: which of a unit's gate failures on a change its base doesn't show. Node's test runner, not Vitest:
// the harness runs in plain Node.
//   node --test packages/dialtone-react/parity/*.test.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { gateFailures, newFailures } from './new-failures.mjs';

// A gate log the way CI captures it: Nx around gate.mjs' summary, its colours included.
const gateLog = (rows, details = '', { unit = 'stack', sha = 'abc1234' } = {}) => [
  '\u001b[1m> nx run dialtone-react:gate stack\u001b[22m',
  '',
  `#### Parity gate: \`${unit}\` at ${sha} ${rows.some(([, r]) => r.startsWith('❌')) ? '❌' : '✅'}`,
  '',
  '| Check | Result |',
  '|---|---|',
  ...rows.map(([c, r]) => `| ${c} | ${r} |`),
  '',
  details,
  'artifacts: /tmp/parity-stack-AbCdEf',
  '',
  ' \u001b[31mNX\u001b[39m   Running target gate for project dialtone-react failed',
  '### Not a section: Nx output after the summary',
  '- not a detail',
].join('\n');
const OK = r => [r, '✅ clean'];
const missingStory = '### Story parity\n\nVue stories with no React story of the same id (title plus export name):\n'
  + '- components-stack--align-self (export `AlignSelf`)';
const stale = gateLog([OK('Typecheck'), OK('Lint'), ['Story parity', '❌ 1 story missing']], missingStory);

test('gateFailures: failing checks with their detail lines, or their row\'s result without any; Nx lines aren\'t details', () => {
  const { failing } = gateFailures(stale);
  assert.deepEqual([...failing.keys()], ['Story parity']);
  assert.deepEqual([...failing.get('Story parity')],
    ['Vue stories with no React story of the same id (title plus export name):', '- components-stack--align-self (export `AlignSelf`)']);
  const bare = gateFailures(gateLog([['DOM parity', '❌ Vue side failed'], ['Typecheck', '⏭ skipped: CI\'s check job typechecks the package']]));
  assert.deepEqual([...bare.failing.entries()].map(([c, l]) => [c, [...l]]), [['DOM parity', ['Vue side failed']]]);
  assert.equal(gateFailures('pnpm: command failed before the gate ran'), null);
  assert.equal(gateFailures(gateLog([OK('Lint')])).failing.size, 0);
});

test('newFailures: only what the base doesn\'t show, line for line', () => {
  const base = gateFailures(stale);
  // The same failure: nothing new, whatever the sha, the counts in the row, or fewer lines.
  assert.deepEqual(newFailures(gateFailures(gateLog([['Story parity', '❌ 2 stories missing']], missingStory, { sha: 'fff0000' })), base), []);
  assert.deepEqual(newFailures(gateFailures(gateLog([['Story parity', '❌ 0 missing']], '### Story parity\n\nVue stories with no React story of the same id (title plus export name):')), base), []);
  // Another missing story, another failing check, or a check failing without details whose result changed: new.
  const more = `${missingStory}\n- components-stack--gap (export \`Gap\`)`;
  assert.deepEqual(newFailures(gateFailures(gateLog([['Story parity', '❌ 2 stories missing']], more)), base),
    ['Story parity: - components-stack--gap (export `Gap`)']);
  assert.deepEqual(newFailures(gateFailures(gateLog([['Story parity', '❌ 1'], ['Lint', '❌ 1 error']], `${missingStory}\n\n### Lint\n\nStack.tsx:3:1 x (semi)`)), base),
    ['Lint: Stack.tsx:3:1 x (semi)']);
  assert.deepEqual(newFailures(gateFailures(gateLog([['DOM parity', '❌ 2/7 cases differ']])), gateFailures(gateLog([['DOM parity', '❌ 1/7 cases differ']]))),
    ['DOM parity: 2/7 cases differ']);
  // A base that passed, or whose gate didn't run: every failure is new.
  assert.equal(newFailures(base, gateFailures(gateLog([OK('Story parity')]))).length, 2);
  assert.equal(newFailures(base, null).length, 2);
});

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'new-failures-'));
after(() => fs.rmSync(dir, { recursive: true, force: true }));
const cli = (change, base) => {
  const [c, b] = ['change', 'base'].map(n => path.join(dir, `${n}-${Math.random().toString(36).slice(2)}.log`));
  if (change !== undefined) fs.writeFileSync(c, change);
  if (base !== undefined) fs.writeFileSync(b, base);
  return spawnSync(process.execPath, [fileURLToPath(new URL('./new-failures.mjs', import.meta.url)), c, b], { encoding: 'utf8' });
};

test('gateFailures ends at pnpm\'s and Nx\'s lines, and writes the checkout and the gate\'s temp directories the same', () => {
  const trace = root => gateLog([['DOM parity', '❌ 1/7 cases differ']], `### DOM parity\n\nTypeError: x is undefined\n    at ${root}/packages/dialtone-react/parity/react/dom.test.tsx:151:30\n    at file://${root}/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk.js:1893:20\nsee /tmp/parity-stack-${root.length % 2 ? 'aB3dE9' : 'Zz9Yy8'}/react-dom.json\n[ELIFECYCLE] Command failed with exit code 1.\n- not a detail either`);
  const change = gateFailures(trace('/home/runner/work/dialtone/dialtone'), '/home/runner/work/dialtone/dialtone');
  const base = gateFailures(trace('/home/runner/work/_temp/base'), '/home/runner/work/_temp/base');
  assert.deepEqual(newFailures(change, base), []);
  assert.deepEqual([...change.failing.get('DOM parity')], ['TypeError: x is undefined',
    'at <root>/packages/dialtone-react/parity/react/dom.test.tsx:151:30',
    'at file://<root>/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk.js:1893:20',
    'see /tmp/parity-stack-XXXXXX/react-dom.json']);
  // Without the roots, the paths differ: a false failure, never a missed one.
  assert.equal(newFailures(gateFailures(trace('/a')), gateFailures(trace('/b'))).length, 2);
});

test('an excerpt under a listed item isn\'t compared; the item is, and so is a block that isn\'t an excerpt', () => {
  const unit = (excerpt, outside = 'Error: boom') => gateLog([['Unit tests', '❌ 1 failed, 30 passed']],
    `### Unit tests\n\n- DtStack › renders\n\`\`\`\n${excerpt}\n\`\`\`\nFailures outside any test:\n\`\`\`\n${outside}\n\`\`\``);
  const base = gateFailures(unit('AssertionError: expected \'<div…\' to be \'<span…\'\n    at /base/x.test.tsx:3:4'));
  assert.deepEqual([...base.failing.get('Unit tests')], ['- DtStack › renders', 'Failures outside any test:', 'Error: boom']);
  // Another excerpt under the same item (a path, a cut message, another gate version's format): old.
  assert.deepEqual(newFailures(gateFailures(unit('AssertionError: expected \'<p…\' to be \'<span…\'\n    at /head/x.test.tsx:9:9')), base), []);
  // Another item, or another line in a block that isn't an excerpt: new.
  assert.deepEqual(newFailures(gateFailures(unit('x').replace('DtStack › renders', 'DtStack › gaps')), base), ['Unit tests: - DtStack › gaps']);
  assert.deepEqual(newFailures(gateFailures(unit('x', 'Error: another')), base), ['Unit tests: Error: another']);
  // A lint block has no item before it, so it's compared line by line.
  const lint = l => gateFailures(gateLog([['Lint', '❌ 1 error']], `### Lint\n\n\`\`\`\n${l}\n\`\`\``));
  assert.deepEqual(newFailures(lint('Stack.tsx:3:1 x (semi)'), lint('Stack.tsx:3:1 x (semi)')), []);
  assert.deepEqual(newFailures(lint('Stack.tsx:4:1 y (eqeqeq)'), lint('Stack.tsx:3:1 x (semi)')), ['Lint: Stack.tsx:4:1 y (eqeqeq)']);
  // An excerpt that never closes (a cut log) keeps everything after it out.
  assert.deepEqual([...gateFailures(gateLog([['Unit tests', '❌ 1']], '### Unit tests\n\n- a › b\n```\nmessage')).failing.get('Unit tests')], ['- a › b']);
});

test('the CLI: exit 0 only when every failure was on the base already, and lists what\'s new', () => {
  assert.equal(cli(stale, stale).status, 0);
  const more = cli(gateLog([['Story parity', '❌ 2']], `${missingStory}\n- components-stack--gap (export \`Gap\`)`), stale);
  assert.equal(more.status, 1);
  assert.equal(more.stdout.trim(), '- Story parity: - components-stack--gap (export `Gap`)');
  // The base's gate didn't run (a missing log, or no summary), or the change failed outside the gate's checks.
  assert.match(cli(stale, 'install failed').stdout, /base's gate didn't run/);
  assert.equal(cli(stale, undefined).status, 1);
  assert.equal(cli(gateLog([OK('Lint')]), stale).status, 1);
  assert.equal(cli('crashed before the summary', stale).status, 1);
  assert.equal(cli(undefined, stale).status, 1);
});
