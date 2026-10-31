import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { selectGuidance, createGuidanceManifest, guidanceHash } from '../src/generators/example-guidance.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const api = endpoint => JSON.parse(execFileSync('gh', ['api', endpoint], { encoding: 'utf8', maxBuffer: 10_000_000 }));

const MAX_ARTIFACT_BYTES = 10_000_000;

/** Inspect one known JSON member; never extract source-controlled artifact paths. */
export function readGuidanceArchive(archive, member) {
  if (archive.length > MAX_ARTIFACT_BYTES) throw new Error('Guidance artifact is too large');
  const directory = mkdtempSync(resolve(tmpdir(), 'dialtone-guidance-zip-'));
  try {
    const file = resolve(directory, 'artifact.zip');
    writeFileSync(file, archive);
    const entries = execFileSync('unzip', ['-Z1', file], { encoding: 'utf8', maxBuffer: 100_000, timeout: 30_000 })
      .trim().split('\n');
    if (entries.length !== 1 || entries[0] !== member) throw new Error('Guidance contains unexpected artifact paths');
    return JSON.parse(execFileSync('unzip', ['-p', file, member], {
      encoding: 'utf8', maxBuffer: MAX_ARTIFACT_BYTES, timeout: 30_000,
    }));
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

function fromAction(repository, runId, name, member) {
  const { artifacts } = api(`repos/${repository}/actions/runs/${runId}/artifacts?per_page=100`);
  const artifact = artifacts.find(item => item.name === name && !item.expired);
  if (!artifact || artifact.size_in_bytes > MAX_ARTIFACT_BYTES) throw new Error('Guidance artifact unavailable or too large');
  const archive = execFileSync('gh', ['api', `repos/${repository}/actions/artifacts/${artifact.id}/zip`], {
    maxBuffer: MAX_ARTIFACT_BYTES, timeout: 60_000,
  });
  return readGuidanceArchive(archive, member);
}

export function trustedGuidanceRun(run, origin, repository, { allowFailed = false, toolingTrusted = false } = {}) {
  return toolingTrusted && (run.conclusion === 'success' || (allowFailed && ['failure', 'cancelled'].includes(run.conclusion))) && run.path?.split('@')[0] === '.github/workflows/example-guidance.yml'
    && run.repository?.full_name === repository && run.head_repository?.full_name === repository
    && String(run.id) === String(origin?.runId) && sha(origin?.head) && sha(origin?.toolingRef)
    && (run.event === 'push' ? run.head_sha === origin.head && run.head_sha === origin.toolingRef
      : ['workflow_run', 'workflow_dispatch'].includes(run.event));
}

export function guidanceSpend(run, receipt, head, currentRun) {
  if (run.display_title !== `Example guidance ${head}` || String(run.id) === String(currentRun)) return 0;
  const amount = receipt?.usage?.reservedUsd;
  return Number.isFinite(amount) && amount >= 0 ? amount : run.event === 'push' ? 15 : 1;
}

function artifactOrigin(artifact) {
  if (artifact.origin) return artifact.origin;
  const origins = [...new Map(artifact.entries.filter(entry => entry.origin)
    .map(entry => [JSON.stringify(entry.origin), entry.origin])).values()];
  return origins.length === 1 ? origins[0] : undefined;
}

function reviewedSource(repository, head, pullRequest, publication) {
  const pulls = api(`repos/${repository}/commits/${head}/pulls`);
  return pulls.some(pr => {
    if (!pr.merged_at && (publication || pr.number !== pullRequest)) return false;
    if (pr.head.sha === head) return true;
    const comparison = api(`repos/${repository}/compare/${head}...${pr.head.sha}`);
    return ['ahead', 'identical'].includes(comparison.status);
  });
}

function fromActions(repository, pullRequest, publication, generation) {
  const runs = api(`repos/${repository}/actions/workflows/example-guidance.yml/runs?per_page=30`).workflow_runs;
  const artifacts = [];
  const trustedRefs = new Map();
  let spentUsd = 0;
  for (const run of runs) {
    let receipt;
    try {
      const artifact = fromAction(repository, run.id, `example-guidance-${run.id}`, 'example-guidance.json');
      const origin = artifactOrigin(artifact);
      if (!origin || !sha(origin.toolingRef)) continue;
      if (!trustedRefs.has(origin.toolingRef)) {
        trustedRefs.set(origin.toolingRef, origin.toolingRef === process.env.GUIDANCE_TOOLING_REF
          || reviewedSource(repository, origin.toolingRef, 0, true));
      }
      if (!trustedGuidanceRun(run, origin, repository, {
        allowFailed: generation,
        toolingTrusted: trustedRefs.get(origin.toolingRef),
      })) continue;
      receipt = artifact;
      if (!reviewedSource(repository, origin.head, pullRequest, publication)) continue;
      artifacts.push(artifact);
    } catch {
      console.warn(`Guidance artifact ${run.id} unavailable; exact archived bytes or a visible refresh may be needed.`);
    } finally {
      if (generation) {
        spentUsd += guidanceSpend(run, receipt, process.env.GUIDANCE_SOURCE_HEAD, process.env.GITHUB_RUN_ID);
      }
    }
  }
  return { artifacts, spentUsd };
}

async function bytes(url, maximum) {
  if (new URL(url).origin !== 'https://registry.npmjs.org') throw new Error('Unexpected guidance archive host');
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok || new URL(response.url).origin !== 'https://registry.npmjs.org') throw new Error('Guidance archive unavailable');
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > maximum) throw new Error('Guidance archive exceeds size limit');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** Public npm integrity binds the previously published archive; no package scripts are executed. */
async function fromPublishedPackages() {
  const artifacts = [];
  for (const name of ['dialtone-cli', 'dialtone-mcp-server']) {
    const directory = mkdtempSync(resolve(tmpdir(), 'dialtone-guidance-published-'));
    try {
      const metadata = JSON.parse(await bytes(`https://registry.npmjs.org/@dialpad%2f${name}/latest`, 1_000_000));
      const archive = await bytes(metadata.dist.tarball, 20_000_000);
      const integrity = `sha512-${createHash('sha512').update(archive).digest('base64')}`;
      if (integrity !== metadata.dist.integrity) throw new Error('Guidance package integrity mismatch');
      const file = resolve(directory, 'package.tgz');
      writeFileSync(file, archive);
      const content = execFileSync('tar', ['-xOzf', file, 'package/build/example-guidance.json'], {
        maxBuffer: 10_000_000, timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'],
      });
      artifacts.push(JSON.parse(content));
    } catch {
      console.warn(`No reusable published ${name} guidance archive; this is expected before the first guidance release.`);
    } finally { rmSync(directory, { recursive: true, force: true }); }
  }
  return artifacts;
}

async function main() {
  const publication = process.argv.includes('--publication');
  const generation = process.argv.includes('--generation');
  const pullRequest = Number(process.env.GUIDANCE_PULL_REQUEST ?? 0);
  const repository = process.env.GITHUB_REPOSITORY || 'dialpad/dialtone';
  const manifestPath = resolve(root, 'packages/dialtone-docs/dist/example-guidance-inputs.json');
  if (process.argv[2] === '--source-run') {
    const runId = Number(process.argv[3]);
    if (!Number.isSafeInteger(runId) || runId <= 0) throw new Error('Invalid source run');
    const manifest = fromAction(repository, runId, 'example-guidance-inputs', 'example-guidance-inputs.json');
    const facts = manifest.entries.map(({ id, sources, dependencies }) => ({ id, sources, dependencies }));
    if (guidanceHash(createGuidanceManifest(facts, manifest)) !== guidanceHash(manifest)) throw new Error('Invalid source manifest');
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(manifestPath, JSON.stringify(manifest) + '\n');
    return;
  }
  const manifest = JSON.parse(readFileSync(manifestPath));
  const artifacts = await fromPublishedPackages();
  let spentUsd = 0;
  try {
    const restored = fromActions(repository, pullRequest, publication, generation);
    artifacts.push(...restored.artifacts);
    spentUsd = restored.spentUsd;
  } catch {
    if (generation) throw new Error('Cannot verify previous model spending; generation is stopped');
    console.warn('Guidance Actions lookup unavailable; publication still requires exact matching archived results.');
  }
  const selected = selectGuidance(manifest, artifacts);
  const directory = resolve(root, 'packages/dialtone-docs/.generated/example-guidance');
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, 'reviewed.json'), JSON.stringify(selected, null, 2) + '\n');
  writeFileSync(resolve(directory, 'previous-spend.json'), JSON.stringify({ spentUsd }) + '\n');
  console.info(`Restored guidance: ${JSON.stringify(selected.summary)}`);
  if (publication) selectGuidance(manifest, [selected], { strict: true });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
