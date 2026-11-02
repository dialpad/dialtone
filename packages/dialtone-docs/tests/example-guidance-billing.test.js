import { expect, it, vi } from 'vitest';
import { restoreActionGuidance } from '../scripts/restore-example-guidance.mjs';

const previous = 'a'.repeat(40);
const current = 'b'.repeat(40);
const head = 'c'.repeat(40);

function history({ runChanges = {}, originChanges = {} } = {}) {
  const run = { id: 12, run_attempt: 1, conclusion: 'failure', event: 'workflow_run',
    display_title: `Example guidance ${head}`, path: '.github/workflows/example-guidance.yml', head_sha: previous,
    repository: { full_name: 'dialpad/dialtone' }, head_repository: { full_name: 'dialpad/dialtone' },
    updated_at: '2026-11-01T10:00:00Z', ...runChanges };
  const receipt = { schemaVersion: 1, entries: [{ id: 'examples/test', inputHash: 'e'.repeat(64),
    notes: [], status: 'completed-empty' }], usage: { reservedUsd: 0.25, requests: 3 },
  origin: { runId: '12', runAttempt: 1, head, toolingRef: previous, ...originChanges } };
  return {
    generation: true, sourceHead: head, currentRun: '99', toolingRef: current, now: Date.parse('2026-11-01T12:00:00Z'),
    readArtifact: () => receipt,
    request: endpoint => {
      if (endpoint.includes('/runs?')) return { total_count: 1, workflow_runs: [run] };
      if (endpoint.includes(`/commits/${head}/pulls`)) return [{ number: 1504, merged_at: '2026-11-01', head: { sha: head } }];
      if (endpoint.includes('/pulls')) return [];
      if (endpoint.includes('/contents/')) return { sha: endpoint.endsWith(previous) ? 'd'.repeat(40) : 'f'.repeat(40) };
      throw new Error(`Unexpected endpoint ${endpoint}`);
    },
  };
}

it('uses explicitly approved historical receipts without admitting their notes', () => {
  const restored = restoreActionGuidance('dialpad/dialtone', { ...history(), spendingToolingRefs: [previous] });
  expect(restored).toMatchObject({ spentUsd: 0.25, monthlySpentUsd: 0.25, spentRequests: 3, artifacts: [] });
});

it('reads historical spending approval from the restoration environment', () => {
  vi.stubEnv('GUIDANCE_SPENDING_TOOLING_REFS', JSON.stringify([previous]));
  try {
    expect(restoreActionGuidance('dialpad/dialtone', history()))
      .toMatchObject({ monthlySpentUsd: 0.25, artifacts: [] });
  } finally { vi.unstubAllEnvs(); }
});

it.each([
  ['unapproved ref', [], {}],
  ['wrong run', [previous], { originChanges: { runId: '13' } }],
  ['wrong attempt', [previous], { originChanges: { runAttempt: 2 } }],
  ['foreign repository', [previous], { runChanges: { head_repository: { full_name: 'someone/fork' } } }],
  ['different workflow', [previous], { runChanges: { path: '.github/workflows/other.yml' } }],
  ['different workflow bytes', [previous], { runChanges: { head_sha: current } }],
])('keeps %s conservatively charged despite historical approval', (_, spendingToolingRefs, changes) => {
  expect(restoreActionGuidance('dialpad/dialtone', { ...history(changes), spendingToolingRefs }))
    .toMatchObject({ spentUsd: 1, monthlySpentUsd: 15, spentRequests: 500, artifacts: [] });
});

it.each([null, previous, [current.slice(1)], ['latest']])('rejects malformed historical approval before reading history: %j', spendingToolingRefs => {
  expect(() => restoreActionGuidance('dialpad/dialtone', { ...history(), spendingToolingRefs,
    request: () => { throw new Error('History must not be read'); },
  })).toThrow(/Invalid approved guidance configuration/);
});
