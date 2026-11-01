import { expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { assertGuidanceBuild } from '../scripts/check-example-guidance.mjs';
import { createGuidanceManifest, selectGuidance } from '../src/generators/example-guidance.mjs';

const manifest = () => createGuidanceManifest([{ id: 'examples/test', sources: [{ id: 'source', text: 'Disabled styling does not prevent events.' }], dependencies: [] }], { model: 'test-model', toolingHash: 'a'.repeat(64), driverHash: 'd'.repeat(64) });
function complete(data) {
  const input = data.entries[0];
  const notes = [{ text: 'Prevent disabled events in application code.', references: [{ source: 'source', quote: 'does not prevent events' }] }];
  return selectGuidance(data, [{ schemaVersion: 1, entries: [{ id: input.id, inputHash: input.inputHash, status: 'complete', notes }] }]);
}

it('rejects an offline build at the publication boundary', () => {
  const data = manifest();
  expect(() => assertGuidanceBuild(data, selectGuidance(data), [{ id: 'examples/test', content: 'No note' }])).toThrow(/guidance/i);
});

it('requires the selected bytes to match both current inputs and served prose', () => {
  const data = manifest();
  const guidance = complete(data);
  const records = [{ id: 'examples/test', content: guidance.entries[0].notes[0].text }];
  expect(() => assertGuidanceBuild(data, guidance, records)).not.toThrow();
  expect(() => assertGuidanceBuild(data, { ...guidance, manifestHash: 'stale' }, records)).toThrow();
  expect(() => assertGuidanceBuild(data, { ...guidance, digest: 'corrupt' }, records)).toThrow();
  expect(() => assertGuidanceBuild(data, { ...guidance, driverHash: 'e'.repeat(64) }, records)).toThrow(/driverHash/);
  expect(() => assertGuidanceBuild(data, { ...guidance, policyHash: 'e'.repeat(64) }, records)).toThrow(/policyHash/);
  expect(() => assertGuidanceBuild(data, guidance, [{ id: 'examples/test', content: 'Note omitted' }])).toThrow();
});


it('passes the publication GitHub token only to restoration, never to builds', () => {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'guidance-token-scope-')));
  try {
    const docs = join(directory, 'packages/dialtone-docs');
    for (const path of ['scripts', 'dist']) mkdirSync(join(docs, path), { recursive: true });
    mkdirSync(join(directory, 'bin'));
    const data = manifest();
    const guidance = complete(data);
    const bytes = JSON.stringify(guidance);
    writeFileSync(join(docs, 'dist/example-guidance-inputs.json'), JSON.stringify(data));
    writeFileSync(join(docs, 'dist/example-guidance.json'), bytes);
    writeFileSync(join(docs, 'dist/public-docs.json'), JSON.stringify([{ id: 'examples/test', content: guidance.entries[0].notes[0].text }]));
    for (const adapter of ['dialtone-cli', 'dialtone-mcp-server']) {
      const build = join(directory, 'packages', adapter, 'build');
      mkdirSync(build, { recursive: true });
      writeFileSync(join(build, 'example-guidance.json'), bytes);
    }
    const script = readFileSync(new URL('../scripts/check-example-guidance.mjs', import.meta.url), 'utf8')
      .replace('\'../src/generators/example-guidance.mjs\'', JSON.stringify(new URL('../src/generators/example-guidance.mjs', import.meta.url).href));
    const scriptPath = join(docs, 'scripts/check-example-guidance.mjs');
    writeFileSync(scriptPath, script);
    const log = join(directory, 'commands.jsonl');
    for (const command of ['pnpm', 'node']) writeFileSync(join(directory, 'bin', command), `#!${process.execPath}
require('node:fs').appendFileSync(${JSON.stringify(log)}, JSON.stringify({ args: process.argv.slice(2), token: process.env.GH_TOKEN }) + '\\n');
`, { mode: 0o700 });
    const env = { ...process.env, PATH: `${join(directory, 'bin')}:${process.env.PATH}`, GH_TOKEN: 'synthetic-restoration-token' };
    for (const key of ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GITHUB_TOKEN', 'NODE_AUTH_TOKEN']) delete env[key];
    const result = spawnSync(process.execPath, [scriptPath, '--prepare-publication'], { cwd: directory, env, encoding: 'utf8' });
    expect(result.status, result.stderr).toBe(0);
    const commands = readFileSync(log, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    expect(commands.some(command => command.args[0] === 'nx')).toBe(true);
    const restore = commands.filter(command => command.args[0] === 'packages/dialtone-docs/scripts/restore-example-guidance.mjs');
    expect(restore).toHaveLength(1);
    expect(restore[0].token).toBe('synthetic-restoration-token');
    for (const command of commands.filter(command => !restore.includes(command))) expect(command.token).toBeUndefined();
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
