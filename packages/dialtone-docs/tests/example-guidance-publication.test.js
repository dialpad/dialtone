import { expect, it } from 'vitest';
import { assertGuidanceBuild } from '../scripts/check-example-guidance.mjs';
import { createGuidanceManifest, selectGuidance } from '../src/generators/example-guidance.mjs';

const manifest = () => createGuidanceManifest([{ id: 'examples/test', sources: [{ id: 'source', text: 'Disabled styling does not prevent events.' }], dependencies: [] }], { model: 'test-model', toolingHash: 'a'.repeat(64) });
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
  expect(() => assertGuidanceBuild(data, guidance, [{ id: 'examples/test', content: 'Note omitted' }])).toThrow();
});
