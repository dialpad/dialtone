import { expect, it, vi } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createGuidanceManifest, GUIDANCE_MODEL } from '../src/generators/example-guidance.mjs';
import * as transfer from '../scripts/restore-example-guidance.mjs';
import { trustedGuidanceRun, readGuidanceArchive, restoreActionGuidance } from '../scripts/restore-example-guidance.mjs';

it('accepts successful immutable-tooling runs and rejects failed, foreign or unrelated artifacts', () => {
  const head = 'a'.repeat(40);
  const run = { id: 12, conclusion: 'success', event: 'push', path: '.github/workflows/example-guidance.yml',
    head_sha: head, repository: { full_name: 'dialpad/dialtone' }, head_repository: { full_name: 'dialpad/dialtone' } };
  const origin = { runId: '12', runAttempt: 1, head, toolingRef: head };
  expect(trustedGuidanceRun(run, origin, 'dialpad/dialtone', { toolingTrusted: true })).toBe(true);
  for (const changed of [
    { ...run, conclusion: 'failure' }, { ...run, path: '.github/workflows/unrelated.yml' },
    { ...run, head_sha: 'b'.repeat(40) }, { ...run, head_repository: { full_name: 'someone/fork' } },
  ]) expect(trustedGuidanceRun(changed, origin, 'dialpad/dialtone', { toolingTrusted: true })).toBe(false);
  expect(trustedGuidanceRun(run, origin, 'dialpad/dialtone')).toBe(false);
  expect(trustedGuidanceRun(run, { ...origin, runId: '13' }, 'dialpad/dialtone')).toBe(false);
});

it('reserves a prior run conservatively if its spending receipt is unavailable', async () => {
  const { guidanceSpend } = await import('../scripts/restore-example-guidance.mjs');
  const head = 'a'.repeat(40);
  const run = { id: 12, event: 'workflow_run', display_title: `Example guidance ${head}` };
  expect(guidanceSpend(run, undefined, head)).toBe(1);
  expect(guidanceSpend(run, { usage: { reservedUsd: 0.12 } }, head)).toBe(0.12);
  expect(guidanceSpend(run, undefined, 'b'.repeat(40))).toBe(0);
});


it('reads only the expected JSON member without extracting other artifact paths', () => {
  const valid = Buffer.from('UEsDBBQAAAAAAMVMX12TSynKDgAAAA4AAAAVAAAAZXhhbXBsZS1ndWlkYW5jZS5qc29ueyJlbnRyaWVzIjpbXX1QSwECFAMUAAAAAADFTF9dk0spyg4AAAAOAAAAFQAAAAAAAAAAAAAAgAEAAAAAZXhhbXBsZS1ndWlkYW5jZS5qc29uUEsFBgAAAAABAAEAQwAAAEEAAAAAAA==', 'base64');
  const extra = Buffer.from('UEsDBBQAAAAAAMVMX12TSynKDgAAAA4AAAAVAAAAZXhhbXBsZS1ndWlkYW5jZS5qc29ueyJlbnRyaWVzIjpbXX1QSwMEFAAAAAAAxUxfXQZOQtAcAAAAHAAAABUAAAAuLi9zY3JpcHRzL2RyaXZlci5tanN0aHJvdyBuZXcgRXJyb3IoInVudHJ1c3RlZCIpUEsBAhQDFAAAAAAAxUxfXZNLKcoOAAAADgAAABUAAAAAAAAAAAAAAIABAAAAAGV4YW1wbGUtZ3VpZGFuY2UuanNvblBLAQIUAxQAAAAAAMVMX10GTkLQHAAAABwAAAAVAAAAAAAAAAAAAACAAUEAAAAuLi9zY3JpcHRzL2RyaXZlci5tanNQSwUGAAAAAAIAAgCGAAAAkAAAAAAA', 'base64');
  expect(readGuidanceArchive(valid, 'example-guidance.json')).toEqual({ entries: [] });
  expect(() => readGuidanceArchive(extra, 'example-guidance.json')).toThrow('unexpected artifact paths');
  expect(() => readGuidanceArchive(valid, 'example-guidance-inputs.json')).toThrow('unexpected artifact paths');
});


const sourceHead = 'c'.repeat(40);
const toolingRef = 'a'.repeat(40);
const oldRun = (id, changes = {}) => ({ id, run_attempt: 1, conclusion: 'success', event: 'workflow_run',
  display_title: `Example guidance ${sourceHead}`, path: '.github/workflows/example-guidance.yml', head_sha: toolingRef,
  repository: { full_name: 'dialpad/dialtone' }, head_repository: { full_name: 'dialpad/dialtone' }, ...changes });
const receiptFor = (id, attempt, amount) => ({ schemaVersion: 1, entries: [], usage: { reservedUsd: amount },
  origin: { runId: String(id), runAttempt: attempt, head: sourceHead, toolingRef } });
const mergedSource = [{ number: 1504, merged_at: '2026-10-31', head: { sha: sourceHead } }];

it('restores beyond the first history page and counts previous attempts of the current run', () => {
  const skipped = Array.from({ length: 100 }, (_, id) => oldRun(1000 + id, { conclusion: 'skipped' }));
  const request = endpoint => {
    if (endpoint.includes('runs?') && endpoint.endsWith('page=1')) return { total_count: 102, workflow_runs: skipped };
    if (endpoint.includes('runs?') && endpoint.endsWith('page=2')) return { total_count: 102, workflow_runs: [oldRun(12, { run_attempt: 2 }), oldRun(11)] };
    if (endpoint.endsWith('/12/attempts/1')) return oldRun(12, { conclusion: 'failure' });
    if (endpoint.includes('/pulls')) return mergedSource;
    throw new Error(`Unexpected endpoint ${endpoint}`);
  };
  const result = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead, currentRun: '12', currentAttempt: 2,
    toolingRef, request, readArtifact: (_, id, name) => {
      expect(name).toBe(`example-guidance-${id}-1`);
      return receiptFor(id, 1, id === 12 ? 0.2 : 0.25);
    } });
  expect(result.spentUsd).toBeCloseTo(0.45);
  expect(result.artifacts).toHaveLength(2);
});

it('skips expired attempt downloads without losing spend or recent rerun artifacts', () => {
  vi.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-11-01T12:00:00Z'));
  try {
    const old = '2026-07-01T12:00:00Z';
    const recent = oldRun(12, { run_attempt: 2, created_at: old, run_started_at: '2026-11-01T10:00:00Z' });
    const request = endpoint => {
      if (endpoint.includes('runs?')) return { total_count: 2, workflow_runs: [recent, oldRun(11)] };
      if (endpoint.endsWith('/12/attempts/1')) return oldRun(12, { run_started_at: old });
      if (endpoint.includes('/jobs?')) return { total_count: 1, jobs: [{ name: 'generate' }] };
      if (endpoint.includes('/pulls')) return mergedSource;
      throw new Error(`Unexpected endpoint ${endpoint}`);
    };
    const result = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead,
      currentRun: '99', toolingRef, request, readArtifact: (_, id, name) => {
        if (name === 'example-guidance-12-1') throw new Error('Expired attempt must not download an artifact');
        return receiptFor(id, id === 12 ? 2 : 1, id === 12 ? 0.2 : 0.25);
      } });
    expect(result.artifacts).toHaveLength(2);
    expect(result.spentUsd).toBeCloseTo(1.45);
  } finally { vi.restoreAllMocks(); }
});

it('authenticates the executing dispatch workflow independently of a claimed tooling ref', () => {
  const run = oldRun(12, { event: 'workflow_dispatch', head_sha: 'b'.repeat(40) });
  const request = trusted => endpoint => {
    if (endpoint.includes('runs?')) return { total_count: 1, workflow_runs: [run] };
    if (endpoint.includes('/contents/')) return { sha: endpoint.endsWith(toolingRef) || trusted ? 'd'.repeat(40) : 'e'.repeat(40) };
    if (endpoint.includes('/pulls')) return mergedSource;
    throw new Error(`Unexpected endpoint ${endpoint}`);
  };
  const options = { publication: true, toolingRef, readArtifact: () => receiptFor(12, 1, 0.1) };
  expect(restoreActionGuidance('dialpad/dialtone', { ...options, request: request(false) }).artifacts).toHaveLength(0);
  expect(restoreActionGuidance('dialpad/dialtone', { ...options, request: request(true) }).artifacts).toHaveLength(1);
});

it('fails closed when the server reports an incomplete workflow history', () => {
  expect(() => restoreActionGuidance('dialpad/dialtone', { generation: true, toolingRef,
    request: () => ({ total_count: 2, workflow_runs: [] }) })).toThrow('Incomplete guidance workflow history');
});


it('charges missing receipts only when a completed run could have reached the model', () => {
  const request = endpoint => {
    if (endpoint.includes('runs?')) return { total_count: 4, workflow_runs: [oldRun(12), oldRun(11), oldRun(10), oldRun(9)] };
    if (endpoint.includes('/12/attempts/1/jobs?')) return { total_count: 1, jobs: [{ name: 'generate', steps: [
      { name: 'Generate changed notes within the remaining authorization', conclusion: 'skipped', started_at: '2026-10-31T15:00:00Z' },
    ] }] };
    if (endpoint.includes('/11/attempts/1/jobs?')) return { total_count: 1, jobs: [{ name: 'generate', steps: [
      { name: 'Generate changed notes within the remaining authorization', conclusion: 'failure', started_at: '2026-10-31T15:00:00Z' },
    ] }] };
    if (endpoint.includes('/9/attempts/1/jobs?')) return { total_count: 0, jobs: [] };
    throw new Error(`Unavailable endpoint ${endpoint}`);
  };
  const result = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead, currentRun: '13',
    toolingRef, request, readArtifact: () => undefined });
  // A skipped model step spent nothing; started and unverifiable attempts remain conservative.
  expect(result.spentUsd).toBe(3);
});


it('does not reserve spend for unstarted attempts, while running and unknown attempts remain conservative', () => {
  const runs = ['queued', 'pending', 'waiting', 'requested', 'in_progress', undefined]
    .map((status, index) => oldRun(20 + index, { status, conclusion: null }));
  const result = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead, currentRun: '99', toolingRef,
    request: () => ({ total_count: runs.length, workflow_runs: runs }),
    readArtifact: () => { throw new Error('No unstarted/running receipt should be read'); },
  });
  expect(result.spentUsd).toBe(2);
});

function publishedFixture({ legacy = false, content = '{"schemaVersion":1,"entries":[]}' } = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'guidance-package-'));
  try {
    mkdirSync(join(directory, 'package/build'), { recursive: true });
    writeFileSync(join(directory, legacy ? 'package/package.json' : 'package/build/example-guidance.json'), content);
    const archive = execFileSync('tar', ['-czf', '-', '-C', directory, 'package']);
    const metadata = { dist: { tarball: 'https://registry.npmjs.org/guidance-fixture.tgz',
      integrity: `sha512-${createHash('sha512').update(archive).digest('base64')}` } };
    return { archive, metadata };
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

function mockRegistry(fixture, { metadataStatus = 200, tarballStatus = 200, offline = false } = {}) {
  vi.stubGlobal('fetch', async url => {
    if (offline) throw new Error('Simulated registry outage');
    const metadata = url.endsWith('/latest');
    const response = new Response(metadata ? JSON.stringify(fixture.metadata) : fixture.archive,
      { status: metadata ? metadataStatus : tarballStatus });
    Object.defineProperty(response, 'url', { value: url });
    return response;
  });
}

it.each([
  ['valid published guidance', {}, {}, 2],
  ['a valid older package without guidance', { legacy: true }, {}, 0],
])('restores %s without inventing replacement notes', async (_, archiveOptions, responseOptions, count) => {
  mockRegistry(publishedFixture(archiveOptions), responseOptions);
  try { expect(await transfer.fromPublishedPackages()).toHaveLength(count); }
  finally { vi.unstubAllGlobals(); }
});

it.each(['transport', 'registry HTTP', 'registry 404', 'tarball HTTP', 'integrity', 'invalid JSON', 'invalid tar'])(
  'stops on %s failure instead of treating published guidance as absent', async kind => {
    const fixture = publishedFixture({ content: kind === 'invalid JSON' ? '{broken' : undefined });
    if (kind === 'integrity') fixture.metadata.dist.integrity = 'sha512-mismatched';
    if (kind === 'invalid tar') {
      fixture.archive = Buffer.from('not a tar archive');
      fixture.metadata.dist.integrity = `sha512-${createHash('sha512').update(fixture.archive).digest('base64')}`;
    }
    mockRegistry(fixture, { offline: kind === 'transport', metadataStatus: kind === 'registry HTTP' ? 503 : kind === 'registry 404' ? 404 : 200,
      tarballStatus: kind === 'tarball HTTP' ? 404 : 200 });
    try {
      const result = transfer.fromPublishedPackages();
      await expect(result).rejects.toThrow(/published.*guidance/i);
      if (kind === 'transport') {
        await expect(result).rejects.toMatchObject({
          message: expect.stringContaining('Simulated registry outage'),
          cause: expect.objectContaining({ message: 'Simulated registry outage' }),
        });
      }
    }
    finally { vi.unstubAllGlobals(); }
  },
);


it.each(['generation', 'publication'])('propagates earlier-head artifact failures during %s', mode => {
  expect(() => restoreActionGuidance('dialpad/dialtone', {
    [mode]: true, toolingRef, sourceHead: 'd'.repeat(40), currentRun: '99',
    request: () => ({ total_count: 1, workflow_runs: [oldRun(12)] }),
    readArtifact: () => { throw new Error('Artifact transport failed'); },
  })).toThrow('Artifact transport failed');
});

it.each([['null', null], ['primitive', false], ['array', []]])('rejects malformed Actions artifact JSON: %s', (_, artifact) => {
  expect(() => restoreActionGuidance('dialpad/dialtone', { generation: true,
    toolingRef, sourceHead: 'd'.repeat(40), currentRun: '99',
    request: () => ({ total_count: 1, workflow_runs: [oldRun(12)] }),
    readArtifact: () => artifact,
  })).toThrow('Invalid guidance artifact');
});

it.each([['unreadable', 1], ['genuinely absent', 0]])('publication CLI handles %s Actions artifacts without masking errors', (state, expectedStatus) => {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'guidance-publication-')));
  try {
    const docs = join(directory, 'packages/dialtone-docs');
    mkdirSync(join(docs, 'scripts'), { recursive: true });
    mkdirSync(join(docs, 'dist'), { recursive: true });
    mkdirSync(join(docs, '.generated/example-guidance'), { recursive: true });
    mkdirSync(join(directory, 'bin'));
    const manifest = createGuidanceManifest([{ id: 'examples/test',
      sources: [{ id: 'documentation', text: 'Prevent disabled actions.' }], dependencies: [],
    }], { model: GUIDANCE_MODEL, toolingHash: 'a'.repeat(64), driverHash: 'b'.repeat(64) });
    const input = manifest.entries[0];
    const fixture = publishedFixture({ content: JSON.stringify({ schemaVersion: 1, entries: [{
      id: input.id, inputHash: input.inputHash, status: 'completed-empty', notes: [],
    }] }) });
    writeFileSync(join(docs, 'dist/example-guidance-inputs.json'), JSON.stringify(manifest));
    const reviewed = join(docs, '.generated/example-guidance/reviewed.json');
    writeFileSync(reviewed, '{"preserve":"reviewed bytes"}');
    const script = readFileSync(new URL('../scripts/restore-example-guidance.mjs', import.meta.url), 'utf8')
      .replace('\'../src/generators/example-guidance.mjs\'',
        JSON.stringify(new URL('../src/generators/example-guidance.mjs', import.meta.url).href));
    const scriptPath = join(docs, 'scripts/restore-example-guidance.mjs');
    writeFileSync(scriptPath, script);
    const preload = join(directory, 'registry.mjs');
    writeFileSync(preload, `const metadata = ${JSON.stringify(fixture.metadata)};
const archive = Buffer.from(${JSON.stringify(fixture.archive.toString('base64'))}, 'base64');
globalThis.fetch = async url => {
  const response = new Response(url.endsWith('/latest') ? JSON.stringify(metadata) : archive);
  Object.defineProperty(response, 'url', { value: url });
  return response;
};`);
    writeFileSync(join(directory, 'bin/gh'), `#!${process.execPath}
const endpoint = process.argv[3];
if (endpoint.includes('/actions/workflows/')) {
  console.log(${JSON.stringify(JSON.stringify({ total_count: 1, workflow_runs: [oldRun(12)] }))});
} else if (${JSON.stringify(state)} === 'unreadable') {
  console.error('Simulated Actions read failure'); process.exitCode = 1;
} else { console.log('{"total_count":0,"artifacts":[]}'); }
`, { mode: 0o700 });
    const env = { ...process.env, PATH: `${join(directory, 'bin')}:${process.env.PATH}`,
      GUIDANCE_TOOLING_REF: toolingRef, GUIDANCE_BUDGET_USD: '1', GITHUB_REPOSITORY: 'dialpad/dialtone' };
    for (const key of ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GH_TOKEN', 'GITHUB_TOKEN']) delete env[key];
    const result = spawnSync(process.execPath, ['--import', preload, scriptPath, '--publication'],
      { cwd: directory, env, encoding: 'utf8' });
    expect(result.status).toBe(expectedStatus);
    if (expectedStatus) {
      expect(result.stderr).toContain('Simulated Actions read failure');
      expect(readFileSync(reviewed, 'utf8')).toBe('{"preserve":"reviewed bytes"}');
    } else {
      expect(JSON.parse(readFileSync(reviewed, 'utf8')).entries[0].inputHash).toBe(input.inputHash);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});


it.each([
  ['verified no jobs', false, 0],
  ['unavailable job history', true, 15],
])('charges a cancelled attempt conservatively unless it has %s', (_, unavailable, expected) => {
  const result = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead, currentRun: '99', toolingRef,
    now: Date.parse('2026-11-15T12:00:00Z'), readArtifact: () => undefined,
    request: endpoint => {
      if (endpoint.includes('runs?')) return { total_count: 1, workflow_runs: [oldRun(40, {
        status: 'completed', conclusion: 'cancelled', updated_at: '2026-11-15T10:00:00Z',
      })] };
      if (unavailable) throw new Error('Job history unavailable');
      return { total_count: 0, jobs: [] };
    },
  });
  expect(result.monthlySpentUsd).toBe(expected);
  expect(result.spentUsd).toBe(unavailable ? 1 : 0);
});

it('accounts all source heads in the Chicago month and reserves unknown spending conservatively', () => {
  const heads = [sourceHead, ...['d', 'e', 'f', '1'].map(value => value.repeat(40))];
  const endings = ['2026-11-10T12:00:00Z', '2026-11-10T12:00:00Z',
    '2026-11-01T04:59:59Z', '2026-11-01T05:00:00Z', undefined];
  const runs = heads.map((head, index) => oldRun(20 + index, {
    display_title: `Example guidance ${head}`, updated_at: endings[index],
  }));
  const result = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead, currentRun: '99', toolingRef,
    now: Date.parse('2026-11-15T12:00:00Z'),
    request: endpoint => {
      if (endpoint.includes('runs?')) return { total_count: runs.length, workflow_runs: runs };
      if (endpoint.includes('/jobs?')) return { total_count: 1, jobs: [{ name: 'generate' }] };
      const match = /commits\/([a-f0-9]{40})\/pulls/.exec(endpoint);
      if (match) return [{ number: 1504, merged_at: '2026-11-01', head: { sha: match[1] } }];
      throw new Error(`Unexpected endpoint ${endpoint}`);
    },
    readArtifact: (_, id) => {
      const index = id - 20;
      if (index === 4) return undefined;
      const receipt = receiptFor(id, 1, [0.2, 0.3, 0.7, 0.4][index]);
      receipt.origin.head = heads[index];
      return receipt;
    },
  });
  expect(result.spentUsd).toBeCloseTo(0.2);
  expect(result.month).toBe('2026-11');
  expect(result.monthlySpentUsd).toBeCloseTo(15.9);
});
