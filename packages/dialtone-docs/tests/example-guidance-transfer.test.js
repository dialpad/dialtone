import { expect, it } from 'vitest';
import { trustedGuidanceRun, readGuidanceArchive } from '../scripts/restore-example-guidance.mjs';

it('accepts successful immutable-tooling runs and rejects failed, foreign or unrelated artifacts', () => {
  const head = 'a'.repeat(40);
  const run = { id: 12, conclusion: 'success', event: 'push', path: '.github/workflows/example-guidance.yml',
    head_sha: head, repository: { full_name: 'dialpad/dialtone' }, head_repository: { full_name: 'dialpad/dialtone' } };
  const origin = { runId: '12', head, toolingRef: head };
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
  expect(guidanceSpend(run, undefined, head, '12')).toBe(0);
});


it('reads only the expected JSON member without extracting other artifact paths', () => {
  const valid = Buffer.from('UEsDBBQAAAAAAMVMX12TSynKDgAAAA4AAAAVAAAAZXhhbXBsZS1ndWlkYW5jZS5qc29ueyJlbnRyaWVzIjpbXX1QSwECFAMUAAAAAADFTF9dk0spyg4AAAAOAAAAFQAAAAAAAAAAAAAAgAEAAAAAZXhhbXBsZS1ndWlkYW5jZS5qc29uUEsFBgAAAAABAAEAQwAAAEEAAAAAAA==', 'base64');
  const extra = Buffer.from('UEsDBBQAAAAAAMVMX12TSynKDgAAAA4AAAAVAAAAZXhhbXBsZS1ndWlkYW5jZS5qc29ueyJlbnRyaWVzIjpbXX1QSwMEFAAAAAAAxUxfXQZOQtAcAAAAHAAAABUAAAAuLi9zY3JpcHRzL2RyaXZlci5tanN0aHJvdyBuZXcgRXJyb3IoInVudHJ1c3RlZCIpUEsBAhQDFAAAAAAAxUxfXZNLKcoOAAAADgAAABUAAAAAAAAAAAAAAIABAAAAAGV4YW1wbGUtZ3VpZGFuY2UuanNvblBLAQIUAxQAAAAAAMVMX10GTkLQHAAAABwAAAAVAAAAAAAAAAAAAACAAUEAAAAuLi9zY3JpcHRzL2RyaXZlci5tanNQSwUGAAAAAAIAAgCGAAAAkAAAAAAA', 'base64');
  expect(readGuidanceArchive(valid, 'example-guidance.json')).toEqual({ entries: [] });
  expect(() => readGuidanceArchive(extra, 'example-guidance.json')).toThrow('unexpected artifact paths');
  expect(() => readGuidanceArchive(valid, 'example-guidance-inputs.json')).toThrow('unexpected artifact paths');
});
