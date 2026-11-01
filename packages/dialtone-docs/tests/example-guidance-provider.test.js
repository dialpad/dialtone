import { expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as provider from '../scripts/generate-example-guidance.mjs';
import { generateGuidance } from '../scripts/generate-example-guidance.mjs';
import { createGuidanceManifest, GUIDANCE_MODEL, guidanceFacts, guidanceHash, selectGuidance } from '../src/generators/example-guidance.mjs';

const driverHash = guidanceHash(readFileSync(new URL('../scripts/generate-example-guidance.mjs', import.meta.url), 'utf8'));
const manifest = () => createGuidanceManifest([{ id: 'examples/test', sources: [{ id: 'documentation', text: 'Disabled styling does not prevent actions.' }], dependencies: [] }], { model: GUIDANCE_MODEL, toolingHash: 'a'.repeat(64), driverHash });
const answer = () => ({ notes: [{ text: 'Prevent disabled actions in the application.', references: [{ source: 'documentation', quote: 'does not prevent actions' }] }] });

it('rejects a different executed driver before generation or cached reuse', async () => {
  const original = manifest();
  const data = createGuidanceManifest(original.entries.map(guidanceFacts), { ...original, driverHash: 'b'.repeat(64) });
  const artifacts = [{ schemaVersion: 1, entries: [{ ...data.entries[0], notes: [], status: 'completed-empty' }] }];
  let calls = 0;
  await expect(generateGuidance(data, { artifacts, apiKey: 'test-only', limit: 1, budgetUsd: 1,
    request: async () => {
      calls++;
      return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(answer()) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
    } })).rejects.toThrow(/driver.*mismatch/i);
  expect(calls).toBe(0);
});

it('rejects cached notes when the source policy implementation differs from pinned tooling', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'guidance-policy-'));
  try {
    const path = join(directory, 'example-guidance.mjs');
    const source = readFileSync(new URL('../src/generators/example-guidance.mjs', import.meta.url), 'utf8');
    const changed = source.replace('note.references.length > 2', 'note.references.length > 1');
    expect(changed).not.toBe(source);
    writeFileSync(path, changed);
    const policy = await import(pathToFileURL(path).href);
    const current = manifest();
    const data = policy.createGuidanceManifest(current.entries.map(guidanceFacts), current);
    const artifacts = [{ schemaVersion: 1, entries: [{ ...data.entries[0], notes: [], status: 'completed-empty' }] }];
    await expect(generateGuidance(data, { artifacts, request: () => { throw new Error('Must reject before requests'); } }))
      .rejects.toThrow(/manifest/);
    expect(data.driverHash).toBe(current.driverHash);
    expect(data.policyHash).not.toBe(current.policyHash);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

it('uses a bounded tool-less request and preserves a cache hit without another model call', async () => {
  const data = manifest();
  let calls = 0;
  const request = async (url, options) => {
    calls++;
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    const body = JSON.parse(options.body);
    expect(body.tools).toBeUndefined();
    expect(body.max_tokens).toBe(1536);
    expect(body.thinking).toEqual({ type: 'adaptive' });
    expect(body.output_config.effort).toBe('high');
    expect(body.model).toBe(data.model);
    return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(answer()) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
  };
  const output = await generateGuidance(data, { apiKey: 'test-only', request, limit: 1, budgetUsd: 1 });
  expect(output.entries[0].status).toBe('complete');
  expect(output.entries[0].id).toBe(data.entries[0].id);
  expect(output.entries[0].inputHash).toBe(data.entries[0].inputHash);
  expect(output.usage.requests).toBe(1);
  expect(JSON.stringify(output)).not.toContain('test-only');
  const reused = await generateGuidance(data, { artifacts: [output], request, limit: 1, budgetUsd: 1 });
  expect(reused.entries[0].notes).toEqual(output.entries[0].notes);
  expect(reused.usage.requests).toBe(0);
  expect(calls).toBe(1);
});

it.each([
  ['the budget cannot cover one bounded request', { limit: 3, budgetUsd: 0 }],
  ['previous spending on the same source update exhausts it', { limit: 2, budgetUsd: 0.05, spentUsd: 0.05 }],
  ['the repository monthly allowance is exhausted', { limit: 2, budgetUsd: 1, monthlySpentUsd: 25 }],
])('does not spend when %s', async (_, limits) => {
  const output = await generateGuidance(manifest(), { apiKey: 'test-only', request: () => { throw new Error('must not call'); }, ...limits });
  expect(output.usage.requests).toBe(0);
  expect(output.entries[0].status).toBe('pending');
});

it('honors the request limit after invalid output without promoting evidence', async () => {
  const data = manifest();
  let calls = 0;
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 1, budgetUsd: 1, request: async () => {
    calls++;
    return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ ...answer(), validation: 'passed' }) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
  } });
  expect(output.entries[0].status).toBe('error');
  expect(output.entries[0].error).toContain('Invalid guidance fields');
  expect(output.entries[0]).not.toHaveProperty('validation');
  expect(calls).toBe(1);
});

it('reports a credential rejection without exposing the provider body', async () => {
  const output = await generateGuidance(manifest(), { apiKey: 'test-only', limit: 1, budgetUsd: 1,
    request: async () => ({ ok: false, status: 401, json: async () => ({ detail: 'must not persist' }) }) });
  expect(output.entries[0].error).toBe('Provider HTTP 401');
  expect(JSON.stringify(output)).not.toContain('must not persist');
});


it('gives its one repair the rejected answer and every actionable validation problem', async () => {
  const data = manifest();
  const rejected = answer();
  rejected.notes[0].text = 'x'.repeat(241);
  rejected.notes[0].references = [{ source: 'invented', quote: 'not a real quote' }];
  const bodies = [];
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 2, budgetUsd: 1,
    request: async (_, options) => {
      bodies.push(JSON.parse(options.body));
      return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(bodies.length === 1 ? rejected : answer()) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
    } });
  const blocks = bodies[1].messages[0].content;
  expect(Array.isArray(blocks)).toBe(true);
  expect(blocks.some(block => block.text.includes('Disabled styling does not prevent actions.'))).toBe(true);
  const feedback = JSON.parse(blocks.at(-1).text);
  expect(feedback.rejectedAnswer).toEqual(rejected);
  expect(feedback.diagnostics).toMatchObject({ noteLengths: [241], characters: 241, limit: 240, validSourceIds: ['documentation'] });
  expect(feedback.diagnostics.problems).toEqual(expect.arrayContaining([
    expect.objectContaining({ reason: 'unknown-source', source: 'invented', quote: 'not a real quote' }),
    expect.objectContaining({ reason: 'length' }),
  ]));
  expect(output.entries[0].status).toBe('complete');
  expect(output.usage.requests).toBe(2);
  expect(output.diagnostics).toHaveLength(2);
  expect(output.diagnostics[0]).toMatchObject({ id: data.entries[0].id, accepted: false, stopReason: 'end_turn' });
  expect(output.diagnostics[1].accepted).toBe(true);
  const selected = selectGuidance(data, [output]);
  expect(selected.entries[0].notes).toEqual(answer().notes);
  expect(JSON.stringify(selected)).not.toContain('rejectedAnswer');
});

it('settles successful requests to actual usage before reserving the next request', async () => {
  const first = manifest();
  const facts = first.entries[0];
  const data = createGuidanceManifest([facts, { ...facts, id: 'examples/second' }].map(guidanceFacts), first);
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 2, budgetUsd: 0.05,
    request: async () => ({ ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(answer()) }], usage: { input_tokens: 100, output_tokens: 60 } }) }) });
  expect(output.usage.requests).toBe(2);
  expect(output.usage.reservedUsd).toBeCloseTo(output.usage.estimatedUsd);
});


it('bounds serialized requests including JSON escaping rather than raw source characters', async () => {
  const facts = manifest().entries[0];
  const text = facts.sources[0].text + '"'.repeat(50000);
  expect(Buffer.byteLength(text)).toBeLessThan(100000);
  const data = createGuidanceManifest([{ id: facts.id, sources: [{ id: 'documentation', text }], dependencies: [] }], manifest());
  const rejected = await generateGuidance(data, { apiKey: 'test-only', budgetUsd: 1, request: () => { throw new Error('oversized serialized request must not leave'); } });
  expect(rejected.usage.requests).toBe(0);
  expect(rejected.entries[0].error).toContain('bounded request size');
});

it('checkpoints completed notes and the next request reservation before spending again', async () => {
  const first = manifest();
  const facts = first.entries[0];
  const data = createGuidanceManifest([facts, { ...facts, id: 'examples/z-interrupted' }].map(guidanceFacts), first);
  let latest;
  const observed = [];
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 2, budgetUsd: 1,
    onProgress: value => { latest = JSON.parse(JSON.stringify(value)); },
    request: async () => {
      observed.push(latest);
      if (observed.length === 2) throw new Error('Simulated interrupted transport');
      return { ok: true, json: async () => ({ stop_reason: 'end_turn', usage: { input_tokens: 100, output_tokens: 60 },
        content: [{ type: 'text', text: JSON.stringify(answer()) }] }) };
    } });
  expect(observed[0]?.usage.requests).toBe(1);
  expect(observed[0]?.usage.reservedUsd).toBeGreaterThan(0);
  expect(observed[1]?.entries[0].status).toBe('complete');
  expect(observed[1]?.usage.requests).toBe(2);
  expect(observed[1]?.usage.reservedUsd).toBeGreaterThan(observed[0].usage.estimatedUsd);
  expect(latest).toEqual(output);
  expect(JSON.stringify(latest)).not.toContain('test-only');
});


it('reserves from the shared monthly remainder before each real provider request', async () => {
  const first = manifest();
  const data = createGuidanceManifest([first.entries[0], { ...first.entries[0], id: 'examples/second' }].map(guidanceFacts), first);
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 2, budgetUsd: 15, monthlySpentUsd: 24.95,
    request: async () => ({ ok: true, json: async () => ({ stop_reason: 'end_turn',
      content: [{ type: 'text', text: JSON.stringify(answer()) }], usage: { input_tokens: 10000, output_tokens: 1000 } }) }) });
  expect(output.usage.requests).toBe(1);
  expect(output.entries[0].status).toBe('complete');
  expect(output.entries[1].status).toBe('pending');
});

it('stops at a Chicago calendar-month boundary until spending is restored again', async () => {
  const first = manifest();
  const data = createGuidanceManifest([first.entries[0], { ...first.entries[0], id: 'examples/second' }].map(guidanceFacts), first);
  let time = Date.parse('2026-12-01T05:59:59Z');
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 2, budgetUsd: 1,
    month: '2026-11', now: () => time,
    request: async () => {
      time = Date.parse('2026-12-01T06:00:01Z');
      return { ok: true, json: async () => ({ stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(answer()) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
    } });
  expect(output.usage.requests).toBe(1);
  expect(output.entries[1].error).toMatch(/month changed/i);
});

it('keeps comparison results unpublishable and reconciles both model prices inside one spend cap', async () => {
  const data = manifest();
  const models = [];
  const comparison = await provider.compareGuidance(data, [data.entries[0].id], { apiKey: 'test-only', limit: 4, budgetUsd: 1,
    request: async (_, options) => {
      models.push(JSON.parse(options.body).model);
      return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(answer()) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
    } });
  expect(models).toEqual(['claude-haiku-5-5', 'claude-sonnet-5-5']);
  expect(comparison.usage.estimatedUsd).toBeCloseTo(0.00084);
  expect(comparison.usage.reservedUsd).toBeCloseTo(0.00084);
  expect(comparison.usage.requests).toBe(2);
  expect(comparison.pilot.map(arm => arm.entries[0].status)).toEqual(['complete', 'complete']);
  expect(comparison.entries).toEqual([]);
  expect(() => selectGuidance(data, [comparison], { strict: true })).toThrow(/successful guidance/);
  const exhausted = await provider.compareGuidance(data, [data.entries[0].id], { apiKey: 'test-only', budgetUsd: 1, spentUsd: 1,
    request: () => { throw new Error('must not spend again'); } });
  expect(exhausted.usage.requests).toBe(0);
  await expect(provider.compareGuidance(data, [data.entries[0].id], { budgetUsd: 1.01 })).rejects.toThrow(/pilot/i);
});
