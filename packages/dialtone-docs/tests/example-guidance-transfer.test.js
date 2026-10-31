import { expect, it } from 'vitest';
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
  expect(guidanceSpend(run, undefined, head, '13')).toBe(1);
  expect(guidanceSpend(run, { usage: { reservedUsd: 0.12 } }, head, '13')).toBe(0.12);
  expect(guidanceSpend(run, undefined, 'b'.repeat(40), '13')).toBe(0);
  expect(guidanceSpend({ ...run, run_attempt: 1 }, undefined, head, '12', 2)).toBe(1);
  expect(guidanceSpend({ ...run, run_attempt: 2 }, undefined, head, '12', 2)).toBe(0);
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
  const skipped = Array.from({ length: 100 }, (_, id) => oldRun(1000 + id, { conclusion: 'skipped', display_title: 'Unrelated source' }));
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
