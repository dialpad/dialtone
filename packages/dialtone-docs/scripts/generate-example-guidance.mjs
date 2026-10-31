import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGuidanceManifest, GUIDANCE_PROMPT, GUIDANCE_SCHEMA, guidanceHash, selectGuidance, validateGuidanceResult } from '../src/generators/example-guidance.mjs';

const MODEL = 'claude-sonnet-5-5';
const MAX_OUTPUT = 1536;
const MAX_INPUT_BYTES = 80_000;
const usd = (input, output) => (input * 2 + output * 10) / 1_000_000;
const factsFor = entry => ({ id: entry.id, sources: entry.sources, dependencies: entry.dependencies });

/** No tools, repository execution, hidden retries or default credential access. */
export async function generateGuidance(manifest, {
  apiKey, artifacts = [], request = fetch, limit = 3, budgetUsd = 1, origin,
} = {}) {
  const rebuilt = createGuidanceManifest(manifest.entries.map(factsFor), manifest);
  if (guidanceHash(rebuilt) !== guidanceHash(manifest) || manifest.model !== MODEL) throw new Error('Unapproved model or invalid guidance manifest');
  if (!Number.isInteger(limit) || limit < 0 || limit > 50 || !Number.isFinite(budgetUsd) || budgetUsd < 0 || budgetUsd > 1) throw new Error('Invalid guidance request/spend limit');
  const selected = selectGuidance(manifest, artifacts);
  const entries = [];
  const usage = { requests: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, reservedUsd: 0 };
  for (const input of manifest.entries) {
    const cached = selected.entries.find(entry => entry.id === input.id);
    if (['complete', 'completed-empty'].includes(cached.status)) { entries.push(cached); continue; }
    const body = {
      model: MODEL, max_tokens: MAX_OUTPUT,
      system: GUIDANCE_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify({ id: input.id, inputHash: input.inputHash, sources: input.sources }) }],
      output_config: { format: { type: 'json_schema', schema: GUIDANCE_SCHEMA } },
    };
    const json = JSON.stringify(body);
    const bytes = Buffer.byteLength(json);
    // UTF-8 bytes are a deliberately conservative token allowance, with schema overhead and margin.
    const reservation = usd(bytes + 8192, MAX_OUTPUT) * 1.25;
    if (usage.requests >= limit || usage.reservedUsd + reservation > budgetUsd) { entries.push({ ...cached, status: 'pending' }); continue; }
    let failure = 'Guidance response failed validation';
    try {
      if (bytes > MAX_INPUT_BYTES) throw new Error('Guidance input exceeds the bounded request size');
      if (!apiKey) throw new Error('Approved provider credential is unavailable');
      usage.requests++;
      usage.reservedUsd += reservation;
      const response = await request('https://api.anthropic.com/v1/messages', {
        method: 'POST', signal: AbortSignal.timeout(90_000),
        headers: { 'content-type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey }, body: json,
      });
      if (!response.ok) {
        failure = `Provider HTTP ${Number(response.status)}`;
        throw new Error(failure);
      }
      const data = await response.json();
      usage.inputTokens += data.usage?.input_tokens ?? 0;
      usage.outputTokens += data.usage?.output_tokens ?? 0;
      usage.estimatedUsd = usd(usage.inputTokens, usage.outputTokens);
      if (data.stop_reason !== 'end_turn') throw new Error(`Provider stopped: ${data.stop_reason}`);
      const text = data.content?.filter(block => block.type === 'text').map(block => block.text).join('') ?? '';
      const result = validateGuidanceResult(input, JSON.parse(text));
      entries.push({ ...result, status: result.notes.length ? 'complete' : 'completed-empty', responseHash: guidanceHash(result), ...(origin ? { origin } : {}) });
    } catch (error) {
      // Do not persist arbitrary provider bodies, credential values or model reasoning.
      entries.push({ id: input.id, inputHash: input.inputHash, status: 'error', error: error.name === 'TimeoutError' ? 'Provider timed out' : failure });
    }
  }
  return { schemaVersion: 1, model: MODEL, manifestHash: manifest.hash, policyHash: manifest.policyHash,
    toolingHash: manifest.toolingHash, entries, usage };
}

async function main() {
  const [inputPath, outputPath, ...args] = process.argv.slice(2);
  if (!inputPath || !outputPath || args.length % 2) throw new Error('Usage: generate-example-guidance.mjs INPUT.json OUTPUT.json [--limit N] [--budget-usd N] [--ids ID,ID] [--cache FILE]');
  const pairs = Array.from({ length: args.length / 2 }, (_, index) => args.slice(index * 2, index * 2 + 2));
  const options = Object.fromEntries(pairs);
  for (const key of Object.keys(options)) {
    if (!['--limit', '--budget-usd', '--ids', '--cache'].includes(key)) throw new Error(`Unknown option: ${key}`);
  }
  let manifest = JSON.parse(readFileSync(inputPath, 'utf8'));
  const full = createGuidanceManifest(manifest.entries.map(factsFor), manifest);
  if (guidanceHash(full) !== guidanceHash(manifest)) throw new Error('Invalid guidance manifest');
  if (options['--ids']) {
    const ids = options['--ids'].split(',');
    if (ids.some(id => !manifest.entries.some(entry => entry.id === id))) throw new Error('Pilot ID absent from current manifest');
    const selected = manifest.entries.filter(entry => ids.includes(entry.id)).map(factsFor);
    manifest = createGuidanceManifest(selected, manifest);
  }
  const artifacts = options['--cache'] ? [JSON.parse(readFileSync(options['--cache'], 'utf8'))] : [];
  const result = await generateGuidance(manifest, {
    apiKey: process.env.ANTHROPIC_API_KEY, artifacts,
    limit: Number(options['--limit'] ?? 3), budgetUsd: Number(options['--budget-usd'] ?? 1),
    origin: { head: process.env.GUIDANCE_SOURCE_HEAD ?? process.env.GITHUB_SHA ?? 'local',
      runId: process.env.GITHUB_RUN_ID ?? null, toolingRef: process.env.GUIDANCE_TOOLING_REF ?? 'local' },
  });
  writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  console.info(JSON.stringify({ ...result.usage, statuses: result.entries.map(({ id, status }) => ({ id, status })) }));
  if (result.entries.some(entry => !['complete', 'completed-empty'].includes(entry.status))) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
