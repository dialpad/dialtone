import { readFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectGuidance, guidanceHash } from '../src/generators/example-guidance.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const docs = resolve(root, 'packages/dialtone-docs/dist');
const adapters = ['dialtone-cli', 'dialtone-mcp-server'];
const json = name => JSON.parse(readFileSync(resolve(docs, name), 'utf8'));

export function assertGuidanceBuild(manifest, guidance, records) {
  if (guidance.manifestHash !== manifest.hash) throw new Error('Guidance manifest is stale');
  const selected = selectGuidance(manifest, [guidance], { strict: true });
  for (const key of ['model', 'policyHash', 'toolingHash']) {
    if (guidance[key] !== manifest[key]) throw new Error(`Guidance ${key} provenance mismatch`);
  }
  if (selected.digest !== guidance.digest) throw new Error('Guidance digest does not match selected bytes');
  for (const entry of selected.entries) {
    const record = records.find(record => record.id === entry.id);
    if (!record || entry.notes.some(note => !record.content.includes(note.text))) {
      throw new Error(`Guidance missing from served example: ${entry.id}`);
    }
  }
}

function copyTo(adapter) {
  if (!adapters.includes(adapter)) throw new Error('Unknown guidance archive target');
  const directory = resolve(root, 'packages', adapter, 'build');
  mkdirSync(directory, { recursive: true });
  copyFileSync(resolve(docs, 'example-guidance.json'), resolve(directory, 'example-guidance.json'));
}

function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--cache-key' && args.length === 1) {
    const file = resolve(root, 'packages/dialtone-docs/.generated/example-guidance/reviewed.json');
    console.info(existsSync(file) ? guidanceHash(JSON.parse(readFileSync(file, 'utf8'))) : 'absent');
    return;
  }
  if (args[0] === '--copy-to' && args.length === 2) { copyTo(args[1]); return; }
  if (args.length && (args.length !== 1 || args[0] !== '--prepare-publication')) throw new Error('Unknown guidance check option');
  const run = (command, parameters) => execFileSync(command, parameters, { cwd: root, stdio: 'inherit',
    env: { ...process.env, pnpm_config_verify_deps_before_run: 'warn', NX_DAEMON: 'false' } });
  if (args[0] === '--prepare-publication') {
    run('pnpm', ['nx', 'run', 'dialtone-docs:build']);
    run('node', ['packages/dialtone-docs/src/generators/build-public-docs.mjs']);
    run('node', ['packages/dialtone-docs/scripts/restore-example-guidance.mjs', '--publication']);
    run('pnpm', ['nx', 'run-many', '-t', 'build', '-p', ...adapters]);
    // Re-read source facts after cached tasks; offline cache output cannot authorize publication.
    run('node', ['packages/dialtone-docs/src/generators/build-public-docs.mjs']);
  }
  assertGuidanceBuild(json('example-guidance-inputs.json'), json('example-guidance.json'), json('public-docs.json'));
  for (const adapter of adapters) {
    const archived = readFileSync(resolve(root, 'packages', adapter, 'build/example-guidance.json'));
    if (!archived.equals(readFileSync(resolve(docs, 'example-guidance.json')))) throw new Error(`Guidance archive mismatch: ${adapter}`);
  }
  console.info('Guidance is complete, source-matching and identical in both adapter archives.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
