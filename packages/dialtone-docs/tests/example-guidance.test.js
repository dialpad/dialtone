import { describe, expect, it } from 'vitest';
import { applyGuidance, createGuidanceManifest, selectGuidance, validateGuidanceResult } from '../src/generators/example-guidance.mjs';

import { buildRecords } from '../src/generators/build-public-docs.mjs';
import { fileURLToPath } from 'node:url';

const config = { model: 'test-model', toolingHash: 'a'.repeat(64) };
const facts = { id: 'examples/docs/components/button/default', sources: [
  { id: 'example', text: '<dt-button aria-disabled="true">Call</dt-button>' },
  { id: 'documentation', text: 'Disabled styling does not suppress application handlers.' },
], dependencies: [{ path: 'component.vue', hash: 'b'.repeat(64) }] };
const manifest = entries => createGuidanceManifest(entries, config);
function result(input, notes = [{ text: 'Prevent disabled actions in application handlers.', references: [{ source: 'documentation', quote: 'does not suppress application handlers' }] }]) {
  return { id: input.id, inputHash: input.inputHash, notes };
}
function artifact(input, notes) {
  return { schemaVersion: 1, entries: [{ ...result(input, notes), status: 'complete', origin: { head: 'c'.repeat(40), runId: 1 } }] };
}

describe('generated example guidance', () => {
  it('adds guidance to retrieval prose without changing consumer proof or source records', () => {
    const records = buildRecords(fileURLToPath(new URL('../../../apps/dialtone-documentation/docs/components/button.md', import.meta.url))).filter(record => record.example);
    const data = createGuidanceManifest([{ id: records[0].id, sources: [{ id: 'example', text: '<dt-button>Save</dt-button>' }], dependencies: [] }], { model: 'test-model', toolingHash: 'a'.repeat(64) });
    const input = data.entries[0];
    const notes = [{ text: 'Use a literal $& action label.', references: [{ source: 'example', quote: 'Save' }] }];
    const selection = selectGuidance(data, [{ schemaVersion: 1, entries: [{ id: input.id, inputHash: input.inputHash, notes, status: 'complete' }] }]);
    const [enriched] = applyGuidance(records, selection);
    expect(enriched.content).toContain('Use a literal $& action label.');
    expect(enriched.example).toEqual(records[0].example);
    expect(records[0].content).not.toContain('Use a literal $& action label.');
    expect(enriched.content).not.toContain(input.inputHash);
  });

  it('reuses equivalent facts but invalidates changed source or model', () => {
    const [input] = manifest([facts]).entries;
    const reordered = { dependencies: facts.dependencies, sources: facts.sources, id: facts.id };
    expect(manifest([reordered]).entries[0].inputHash).toBe(input.inputHash);
    for (const changed of [
      { ...facts, sources: [{ id: 'example', text: 'Changed example' }] },
    ]) expect(manifest([changed]).entries[0].inputHash).not.toBe(input.inputHash);
    expect(createGuidanceManifest([facts], { ...config, model: 'another-model' }).entries[0].inputHash).not.toBe(input.inputHash);
  });

  it.each([
    ['extra proof field', value => ({ ...value, validation: 'passed' })],
    ['wrong input', value => ({ ...value, inputHash: 'f'.repeat(64) })],
    ['invented reference', value => ({ ...value, notes: [{ text: 'Unsupported claim', references: [{ source: 'documentation', quote: 'verified in a browser' }] }] })],
    ['unbounded notes', value => ({ ...value, notes: [{ text: 'x'.repeat(241), references: value.notes[0].references }] })],
    ['extra note', value => ({ ...value, notes: [...value.notes, ...value.notes, ...value.notes] })],
  ])('rejects %s', (_, change) => {
    const [input] = manifest([facts]).entries;
    expect(() => validateGuidanceResult(input, change(result(input)))).toThrow();
  });

  it('distinguishes pending, error and completed-empty, with strict publication rejection', () => {
    const data = manifest([facts]);
    const [input] = data.entries;
    expect(selectGuidance(data).entries[0].status).toBe('pending');
    const failed = { schemaVersion: 1, entries: [{ id: input.id, inputHash: input.inputHash, status: 'error', error: 'Provider unavailable' }] };
    expect(selectGuidance(data, [failed]).entries[0].status).toBe('error');
    expect(() => selectGuidance(data, [failed], { strict: true })).toThrow(/guidance/i);
    expect(selectGuidance(data, [artifact(input, [])], { strict: true }).entries[0].status).toBe('completed-empty');
  });

  it('prunes removed entries and refuses stale results for an edited example', () => {
    const old = manifest([facts]);
    const cached = artifact(old.entries[0]);
    expect(selectGuidance(manifest([]), [cached], { strict: true }).entries).toEqual([]);
    const next = manifest([{ ...facts, sources: [{ id: 'example', text: 'Edited markup' }] }]);
    expect(selectGuidance(next, [cached]).entries[0].status).toBe('pending');
    expect(() => selectGuidance(next, [cached], { strict: true })).toThrow(/guidance/i);
  });

  it('fails conflicting outputs for identical inputs rather than choosing unreviewed prose', () => {
    const data = manifest([facts]);
    expect(() => selectGuidance(data, [artifact(data.entries[0]), artifact(data.entries[0], [])])).toThrow(/conflict/i);
  });
});
