import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { selectGuidance, createGuidanceManifest, guidanceHash } from '../src/generators/example-guidance.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const api = endpoint => JSON.parse(execFileSync('gh', ['api', endpoint], { encoding: 'utf8', maxBuffer: 10_000_000, timeout: 30_000 }));

const MAX_ARTIFACT_BYTES = 32_000_000;

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
  const matches = allPages(`repos/${repository}/actions/runs/${runId}/artifacts`, 'artifacts').filter(item => item.name === name && !item.expired);
  const artifact = matches.length === 1 ? matches[0] : undefined;
  if (!artifact || artifact.size_in_bytes > MAX_ARTIFACT_BYTES) throw new Error('Guidance artifact unavailable or too large');
  const archive = execFileSync('gh', ['api', `repos/${repository}/actions/artifacts/${artifact.id}/zip`], {
    maxBuffer: MAX_ARTIFACT_BYTES, timeout: 60_000,
  });
  return readGuidanceArchive(archive, member);
}

export function trustedGuidanceRun(run, origin, repository, {
  allowFailed = false, toolingTrusted = false, workflowTrusted = false,
} = {}) {
  return toolingTrusted && (run.conclusion === 'success' || (allowFailed && ['failure', 'cancelled'].includes(run.conclusion)))
    && run.path?.split('@')[0] === '.github/workflows/example-guidance.yml'
    && run.repository?.full_name === repository && run.head_repository?.full_name === repository
    && String(run.id) === String(origin?.runId) && Number(origin?.runAttempt) === Number(run.run_attempt ?? 1)
    && sha(origin?.head) && sha(origin?.toolingRef) && sha(run.head_sha)
    && (run.event === 'push' ? run.head_sha === origin.head && run.head_sha === origin.toolingRef
      : ['workflow_run', 'workflow_dispatch'].includes(run.event) && workflowTrusted);
}

export function guidanceSpend(run, receipt, head, currentRun, currentAttempt = 1, budgetUsd = 1) {
  if (run.display_title !== `Example guidance ${head}` ||
      (String(run.id) === String(currentRun) && Number(run.run_attempt ?? 1) === Number(currentAttempt))) return 0;
  const amount = receipt?.usage?.reservedUsd;
  return Number.isFinite(amount) && amount >= 0 ? amount : budgetUsd;
}

function allPages(endpoint, key, request = api) {
  const values = new Map();
  let total = 0;
  for (let page = 1; ; page++) {
    const response = request(`${endpoint}?per_page=100&page=${page}`);
    if (!Array.isArray(response[key]) || !Number.isInteger(response.total_count)) throw new Error('Invalid guidance history');
    total = Math.max(total, response.total_count);
    for (const item of response[key]) values.set(item.id, item);
    if (response[key].length < 100) {
      if (values.size < total) throw new Error(`Incomplete guidance ${key === 'workflow_runs' ? 'workflow history' : 'artifact history'}`);
      return [...values.values()];
    }
  }
}

// Missing receipts remain charged unless complete job metadata proves the model never ran.
function modelCouldHaveRun(repository, run, request) {
  if (!run.conclusion) return true;
  try {
    const jobs = allPages(`repos/${repository}/actions/runs/${run.id}/attempts/${run.run_attempt ?? 1}/jobs`, 'jobs', request);
    return jobs.filter(job => job.name === 'generate').some(job => {
      if (job.conclusion === 'skipped') return false;
      if (!Array.isArray(job.steps)) return true;
      const step = job.steps.find(step => step.name === 'Generate changed notes within the remaining authorization');
      return !step || (step.conclusion !== 'skipped' && (step.started_at === undefined
        || Boolean(step.started_at && !step.started_at.startsWith('0001-'))));
    });
  } catch { return true; }
}

function reviewedSource(repository, head, pullRequest, publication, request = api) {
  const pulls = request(`repos/${repository}/commits/${head}/pulls`);
  return pulls.some(pr => {
    if (!pr.merged_at && (publication || pr.number !== pullRequest)) return false;
    if (pr.head.sha === head) return true;
    const comparison = request(`repos/${repository}/compare/${head}...${pr.head.sha}`);
    return ['ahead', 'identical'].includes(comparison.status);
  });
}

export function restoreActionGuidance(repository, {
  pullRequest = 0, publication = false, generation = false,
  sourceHead = process.env.GUIDANCE_SOURCE_HEAD, currentRun = process.env.GITHUB_RUN_ID,
  currentAttempt = Number(process.env.GITHUB_RUN_ATTEMPT ?? 1), toolingRef = process.env.GUIDANCE_TOOLING_REF,
  budgetUsd = Number(process.env.GUIDANCE_BUDGET_USD ?? 1), request = api, readArtifact = fromAction,
} = {}) {
  if (!sha(toolingRef) || ![1, 15].includes(budgetUsd)) throw new Error('Invalid approved guidance configuration');
  const runs = allPages(`repos/${repository}/actions/workflows/example-guidance.yml/runs`, 'workflow_runs', request);
  const artifacts = [];
  const trustedRefs = new Map();
  const workflowBlobs = new Map();
  const blob = ref => {
    if (!sha(ref)) return undefined;
    if (!workflowBlobs.has(ref)) {
      workflowBlobs.set(ref, request(`repos/${repository}/contents/.github/workflows/example-guidance.yml?ref=${ref}`).sha);
    }
    return workflowBlobs.get(ref);
  };
  let spentUsd = 0;
  for (const latest of runs) {
    for (let attempt = 1; attempt <= (latest.run_attempt ?? 1); attempt++) {
      if (String(latest.id) === String(currentRun) && attempt === currentAttempt) continue;
      const run = attempt === (latest.run_attempt ?? 1) ? latest
        : request(`repos/${repository}/actions/runs/${latest.id}/attempts/${attempt}`);
      if (run.conclusion === 'skipped') continue;
      let receipt;
      try {
        if (!['success', 'failure', 'cancelled'].includes(run.conclusion)) continue;
        const artifact = readArtifact(repository, run.id, `example-guidance-${run.id}-${attempt}`, 'example-guidance.json');
        const origin = artifact.origin;
        if (!origin || !sha(origin.toolingRef)) continue;
        if (!trustedRefs.has(origin.toolingRef)) {
          trustedRefs.set(origin.toolingRef, origin.toolingRef === toolingRef
            || reviewedSource(repository, origin.toolingRef, 0, true, request));
        }
        const workflowTrusted = run.head_sha === origin.toolingRef
          || (sha(blob(run.head_sha)) && blob(run.head_sha) === blob(origin.toolingRef));
        if (!trustedGuidanceRun(run, origin, repository, {
          allowFailed: generation, toolingTrusted: trustedRefs.get(origin.toolingRef), workflowTrusted,
        })) continue;
        receipt = artifact;
        if (reviewedSource(repository, origin.head, pullRequest, publication, request)) artifacts.push(artifact);
      } catch {
        console.warn(`Guidance artifact ${run.id}/${attempt} unavailable; exact archived bytes or a visible refresh may be needed.`);
      } finally {
        if (generation) {
          const charge = guidanceSpend(run, receipt, sourceHead, currentRun, currentAttempt, budgetUsd);
          if (charge && (receipt || modelCouldHaveRun(repository, run, request))) spentUsd += charge;
        }
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
    const attempt = Number(process.argv[5]);
    if (process.argv[4] !== '--source-attempt' || !Number.isSafeInteger(attempt) || attempt <= 0) throw new Error('Invalid source attempt');
    const manifest = fromAction(repository, runId, `example-guidance-inputs-${attempt}`, 'example-guidance-inputs.json');
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
    const restored = restoreActionGuidance(repository, { pullRequest, publication, generation });
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
