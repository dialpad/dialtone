import { expect, it } from 'vitest';
import { generateGuidance } from '../scripts/generate-example-guidance.mjs';
import { createGuidanceManifest } from '../src/generators/example-guidance.mjs';

const manifest = () => createGuidanceManifest([{ id: 'examples/test', sources: [{ id: 'documentation', text: 'Disabled styling does not prevent actions.' }], dependencies: [] }], { model: 'claude-sonnet-5-5', toolingHash: 'a'.repeat(64) });
const answer = data => ({ id: data.entries[0].id, inputHash: data.entries[0].inputHash, notes: [{ text: 'Prevent disabled actions in the application.', references: [{ source: 'documentation', quote: 'does not prevent actions' }] }] });

it('uses a bounded tool-less request and preserves a cache hit without another model call', async () => {
  const data = manifest();
  let calls = 0;
  const request = async (url, options) => {
    calls++;
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    const body = JSON.parse(options.body);
    expect(body.tools).toBeUndefined();
    expect(body.max_tokens).toBe(1536);
    expect(body.model).toBe(data.model);
    return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(answer(data)) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
  };
  const output = await generateGuidance(data, { apiKey: 'test-only', request, limit: 1, budgetUsd: 1 });
  expect(output.entries[0].status).toBe('complete');
  expect(output.usage.requests).toBe(1);
  expect(JSON.stringify(output)).not.toContain('test-only');
  const reused = await generateGuidance(data, { artifacts: [output], request, limit: 1, budgetUsd: 1 });
  expect(reused.entries[0].notes).toEqual(output.entries[0].notes);
  expect(reused.usage.requests).toBe(0);
  expect(calls).toBe(1);
});

it('does not spend when the budget cannot cover even one bounded request', async () => {
  const output = await generateGuidance(manifest(), { apiKey: 'test-only', request: () => { throw new Error('must not call'); }, limit: 3, budgetUsd: 0 });
  expect(output.usage.requests).toBe(0);
  expect(output.entries[0].status).toBe('pending');
});

it('records invalid output as an error without retrying or promoting evidence', async () => {
  const data = manifest();
  let calls = 0;
  const output = await generateGuidance(data, { apiKey: 'test-only', limit: 1, budgetUsd: 1, request: async () => {
    calls++;
    return { ok: true, json: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ ...answer(data), validation: 'passed' }) }], usage: { input_tokens: 100, output_tokens: 60 } }) };
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
