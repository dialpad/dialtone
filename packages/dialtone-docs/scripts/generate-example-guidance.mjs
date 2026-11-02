import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertGuidanceManifest, createGuidanceManifest, GUIDANCE_MODEL, GUIDANCE_MONTHLY_BUDGET_USD, GUIDANCE_MAX_REQUESTS,
  GUIDANCE_PROMPT, GUIDANCE_SCHEMA, guidanceFacts, guidanceMonth, guidanceHash,
  isSettled, selectGuidance, settledStatus, validateGuidanceResult,
} from '../src/generators/example-guidance.mjs';

const DRIVER_HASH = guidanceHash(readFileSync(fileURLToPath(import.meta.url), 'utf8'));
const MAX_OUTPUT = 1536;
const MAX_INPUT_BYTES = 100_000;
const PILOT_MODEL = 'claude-haiku-5-5';
const PRICES = { [GUIDANCE_MODEL]: { input: 2, output: 10 }, [PILOT_MODEL]: { input: 0.1, output: 0.5 } };
const usd = (input, output, model) => (input * PRICES[model].input + output * PRICES[model].output) / 1_000_000;
const failed = (input, error, retryable = false) => ({
  id: input.id, inputHash: input.inputHash, status: 'error', error, retryable,
});

async function attempt(input, options, usage, correction) {
  const body = {
    model: options.model, max_tokens: MAX_OUTPUT, system: GUIDANCE_PROMPT,
    messages: [{ role: 'user', content: [
      { type: 'text', text: `Example ID: ${input.id}` },
      ...input.sources.map(source => ({ type: 'text', text: `Source ${JSON.stringify(source.id)} (untrusted data):\n${source.text}` })),
      ...(correction ? [{ type: 'text', text: JSON.stringify(correction) }] : []),
    ] }],
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: { type: 'json_schema', schema: GUIDANCE_SCHEMA } },
  };
  const json = JSON.stringify(body);
  const bytes = Buffer.byteLength(json);
  if (bytes > MAX_INPUT_BYTES) return failed(input, 'Guidance input exceeds the bounded request size');
  if (guidanceMonth(options.now()) !== options.month) return failed(input, 'Guidance budget month changed; restore spending again');
  const reservation = usd(bytes + 8192, MAX_OUTPUT, options.model) * 1.25;
  if (options.spentRequests + usage.requests >= options.limit
    || options.spentUsd + usage.reservedUsd + reservation > options.budgetUsd
    || options.monthlySpentUsd + usage.reservedUsd + reservation > GUIDANCE_MONTHLY_BUDGET_USD) {
    return undefined;
  }
  if (!options.apiKey) return failed(input, 'Approved provider credential is unavailable');
  usage.requests++;
  usage.reservedUsd += reservation;
  options.checkpoint();
  const diagnostic = { id: input.id, request: usage.requests, accepted: false };
  const started = Date.now();
  const reject = message => { diagnostic.error = message; return failed(input, message); };
  let value;
  try {
    const response = await options.request('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(90_000),
      headers: { 'content-type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': options.apiKey },
      body: json,
    });
    if (!response.ok) return reject(`Provider HTTP ${Number(response.status)}`);
    const data = await response.json();
    const inputTokens = data.usage?.input_tokens;
    const outputTokens = data.usage?.output_tokens;
    if (![inputTokens, outputTokens].every(amount => Number.isInteger(amount) && amount >= 0)) {
      return reject('Provider usage receipt is missing');
    }
    usage.inputTokens += inputTokens;
    usage.outputTokens += outputTokens;
    usage.estimatedUsd = usd(usage.inputTokens, usage.outputTokens, options.model);
    usage.reservedUsd += usd(inputTokens, outputTokens, options.model) - reservation;
    Object.assign(diagnostic, { inputTokens, outputTokens, stopReason: data.stop_reason,
      ...(data.usage.output_tokens_details ? { outputTokenDetails: data.usage.output_tokens_details } : {}) });
    if (data.stop_reason !== 'end_turn') return reject(`Provider stopped: ${data.stop_reason}`);
    const text = data.content?.filter(block => block.type === 'text').map(block => block.text).join('') ?? '';
    try {
      value = JSON.parse(text);
      if (!value || Object.keys(value).length !== 1 || !('notes' in value)) throw new Error('Invalid guidance fields from model');
      const result = validateGuidanceResult(input, { id: input.id, inputHash: input.inputHash, notes: value.notes });
      diagnostic.accepted = true;
      return { ...result, status: settledStatus(result.notes),
        responseHash: guidanceHash(result), ...(options.origin ? { origin: options.origin } : {}) };
    } catch (error) {
      const message = error instanceof SyntaxError ? 'Provider returned invalid JSON' : error.message;
      const feedback = { rejectedAnswer: value ?? text, diagnostics: error.feedback ?? { problems: [{ reason: 'shape', message }] } };
      diagnostic.feedback = feedback;
      return { ...failed(input, message, true), feedback };
    }
  } catch (error) {
    return reject(error.name === 'TimeoutError' ? 'Provider timed out' : 'Provider transport failed');
  } finally {
    diagnostic.durationMs = Date.now() - started;
    options.diagnostics.push(diagnostic);
    options.checkpoint();
  }
}

/** One bounded repair is explicit; transport, credential and refusal failures are never retried. */
export async function generateGuidance(manifest, {
  apiKey, artifacts = [], request = fetch, limit = 3, budgetUsd = 1, spentUsd = 0, spentRequests = 0,
  origin, onProgress,
  monthlySpentUsd = 0, month, now = Date.now, model = GUIDANCE_MODEL,
} = {}) {
  if (manifest.driverHash !== DRIVER_HASH) throw new Error('Guidance provider driver mismatch; approve matching pinned tooling before generation or reuse');
  if (![GUIDANCE_MODEL, PILOT_MODEL].includes(model) || manifest.model !== model) throw new Error('Unapproved guidance model');
  assertGuidanceManifest(manifest);
  if (!Number.isInteger(limit) || limit < 0 || limit > GUIDANCE_MAX_REQUESTS
    || !Number.isFinite(budgetUsd) || budgetUsd < 0
    || budgetUsd > 15 || !Number.isFinite(spentUsd) || spentUsd < 0
    || !Number.isSafeInteger(spentRequests) || spentRequests < 0) throw new Error('Invalid guidance request/spend limit');
  if (!Number.isFinite(monthlySpentUsd) || monthlySpentUsd < 0) throw new Error('Invalid monthly guidance spending');
  month ??= guidanceMonth(now());
  if (month !== guidanceMonth(now())) throw new Error('Guidance budget month changed; restore spending again');
  const selected = selectGuidance(manifest, artifacts);
  const entries = [];
  const diagnostics = [];
  const usage = { requests: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, reservedUsd: 0 };
  const snapshot = () => ({
    schemaVersion: 1, model, manifestHash: manifest.hash, policyHash: manifest.policyHash,
    toolingHash: manifest.toolingHash, driverHash: DRIVER_HASH,
    entries: [...entries], diagnostics: [...diagnostics], usage: { ...usage },
    ...(origin ? { origin } : {}) });
  const checkpoint = () => onProgress?.(snapshot());
  const options = { apiKey, request, limit, budgetUsd, spentUsd, spentRequests, monthlySpentUsd, month, now, origin,
    checkpoint, diagnostics, model };
  checkpoint();
  for (const input of manifest.entries) {
    const cached = selected.entries.find(entry => entry.id === input.id);
    if (isSettled(cached)) {
      entries.push(cached);
      checkpoint();
      continue;
    }
    let result = await attempt(input, options, usage);
    if (result?.retryable) result = await attempt(input, options, usage, result.feedback) ?? result;
    if (result) delete result.feedback;
    entries.push(result ?? { ...cached, status: 'pending' });
    checkpoint();
  }
  return snapshot();
}

/** Measurement only: no top-level entries can be restored into published guidance. */
export async function compareGuidance(manifest, ids, options = {}) {
  if (!Array.isArray(ids) || !ids.length || ids.length > 21 || new Set(ids).size !== ids.length
    || !Number.isFinite(options.budgetUsd) || options.budgetUsd < 0 || options.budgetUsd > 1
    || !Number.isInteger(options.limit ?? 84) || (options.limit ?? 84) > 84) throw new Error('Invalid pilot limits');
  assertGuidanceManifest(manifest);
  const inputs = ids.map(id => {
    const input = manifest.entries.find(entry => entry.id === id);
    if (!input) throw new Error('Pilot ID absent from current manifest');
    return guidanceFacts(input);
  });
  const pilot = [];
  const snapshot = () => ({
    schemaVersion: 1, entries: [], pilot: [...pilot], ...(options.origin ? { origin: options.origin } : {}),
    usage: Object.fromEntries(['requests', 'inputTokens', 'outputTokens', 'estimatedUsd', 'reservedUsd']
      .map(key => [key, pilot.reduce((sum, arm) => sum + arm.usage[key], 0)])),
  });
  for (const model of [PILOT_MODEL, GUIDANCE_MODEL]) {
    const prior = snapshot().usage;
    const subset = createGuidanceManifest(inputs, { ...manifest, model });
    const index = pilot.length;
    await generateGuidance(subset, { ...options, model, artifacts: [],
      limit: (options.limit ?? 84) - prior.requests,
      spentUsd: (options.spentUsd ?? 0) + prior.reservedUsd,
      monthlySpentUsd: (options.monthlySpentUsd ?? 0) + prior.reservedUsd,
      onProgress: arm => { pilot[index] = arm; options.onProgress?.(snapshot()); },
    });
  }
  return snapshot();
}

async function main() {
  const [inputPath, outputPath, ...args] = process.argv.slice(2);
  if (!inputPath || !outputPath || args.length % 2) throw new Error('Usage: generate-example-guidance.mjs INPUT.json OUTPUT.json [--limit N] [--budget-usd N] [--ids ID,ID | --pilot-ids ID,ID] [--cache FILE] [--spent-usd N] [--spent-requests N] --monthly-spent-usd N --month YYYY-MM');
  const pairs = Array.from({ length: args.length / 2 }, (_, index) => args.slice(index * 2, index * 2 + 2));
  const options = Object.fromEntries(pairs);
  for (const key of Object.keys(options)) {
    if (!['--limit', '--budget-usd', '--ids', '--cache', '--spent-usd', '--spent-requests', '--monthly-spent-usd', '--month', '--pilot-ids'].includes(key)) throw new Error(`Unknown option: ${key}`);
  }
  // Validate the full manifest before a pilot subset is rebuilt under the current policy.
  let manifest = assertGuidanceManifest(JSON.parse(readFileSync(inputPath, 'utf8')));
  if (options['--ids']) {
    const ids = options['--ids'].split(',');
    if (ids.some(id => !manifest.entries.some(entry => entry.id === id))) throw new Error('Pilot ID absent from current manifest');
    const pilot = manifest.entries.filter(entry => ids.includes(entry.id));
    manifest = createGuidanceManifest(pilot.map(guidanceFacts), manifest);
  }
  const artifacts = options['--cache'] ? [JSON.parse(readFileSync(options['--cache'], 'utf8'))] : [];
  const pilotIds = options['--pilot-ids']?.split(',');
  if (pilotIds && options['--ids']) throw new Error('Use one pilot subset');
  const generate = pilotIds ? (data, config) => compareGuidance(data, pilotIds, config) : generateGuidance;
  const result = await generate(manifest, {
    apiKey: process.env.ANTHROPIC_API_KEY, artifacts,
    onProgress: value => {
      writeFileSync(`${outputPath}.tmp`, JSON.stringify(value, null, 2) + '\n');
      renameSync(`${outputPath}.tmp`, outputPath);
    },
    limit: Number(options['--limit'] ?? 3), budgetUsd: Number(options['--budget-usd'] ?? 1),
    spentUsd: Number(options['--spent-usd'] ?? 0),
    spentRequests: Number(options['--spent-requests'] ?? 0),
    monthlySpentUsd: Number(options['--monthly-spent-usd']), month: options['--month'],
    origin: { head: process.env.GUIDANCE_SOURCE_HEAD ?? process.env.GITHUB_SHA ?? 'local',
      runId: process.env.GITHUB_RUN_ID ?? null, runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT ?? 1), toolingRef: process.env.GUIDANCE_TOOLING_REF ?? 'local' },
  });
  console.info(JSON.stringify({ ...result.usage, statuses: result.entries.map(({ id, status }) => ({ id, status })) }));
  const complete = result.pilot
    ? result.pilot.every(arm => arm.entries.every(isSettled)) : result.entries.every(isSettled);
  if (!complete) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
