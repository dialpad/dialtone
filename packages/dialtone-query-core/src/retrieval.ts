import type { ComponentIdentity } from './types.js';

export type MatchState =
  | 'exact'
  | 'candidate'
  | 'no-match'
  | 'unavailable'
  | 'unverified';
export interface DomainStamp {
  package: string;
  version: string;
  schemaVersion: number;
  hash: string;
  contentHash?: string;
}
export interface BundledProvenance {
  schemaVersion: number;
  buildHash: string;
  domains: Record<string, DomainStamp>;
}
export interface Continuation {
  tool: string;
  arguments: Record<string, unknown>;
}
export interface RetrievalEnvelope {
  schemaVersion: 1;
  mode: 'discovery' | 'detail';
  match: MatchState;
  canonicalIdentity: ComponentIdentity | null;
  source: {
    selection: string;
    installedCompatibility: 'not_checked';
    fallbackReason: string | null;
    buildHash: string;
    domains: Record<string, DomainStamp>;
  };
  counts: { total: number; returned: number };
  truncation: { truncated: boolean; omissions: string[] };
  budget: {
    estimatedTokens: number;
    maximumEstimatedTokens: number;
    countingMethod: 'ceil(UTF-8 bytes of compact JSON / 4)';
  };
  continuation: Continuation | null;
  items: unknown[];
  notes: string[];
  detail?: Record<string, unknown>;
}
export const RETRIEVAL_BUDGETS = { discovery: 1500, detail: 12000 } as const;
interface EnvelopeOptions {
  tool: string;
  args: Record<string, unknown> & { limit?: number; offset?: number };
  mode: RetrievalEnvelope['mode'];
  domain: string | string[];
  match: MatchState;
  canonicalIdentity?: ComponentIdentity | null;
  items: unknown[];
  notes?: string[];
  omissions?: string[];
  detail?: Record<string, unknown>;
  continuation?: Continuation | null;
}
/** Shared pagination: count output bytes and retain whole requested records. */
export function createRetrievalEnvelope(
  options: EnvelopeOptions,
  provenance: BundledProvenance,
): RetrievalEnvelope {
  const offset = options.args.offset ?? 0;
  const limit = options.args.limit ?? 20;
  const total = options.items.length;
  const selectedDomains = Array.isArray(options.domain)
    ? options.domain
    : [options.domain];
  const domains = Object.fromEntries(
    selectedDomains.map((domain) => [domain, provenance.domains[domain]]),
  );
  const envelope: RetrievalEnvelope = {
    schemaVersion: 1,
    mode: options.mode,
    match: options.match,
    canonicalIdentity: options.canonicalIdentity ?? null,
    source: {
      selection: 'bundled',
      installedCompatibility: 'not_checked',
      fallbackReason: null,
      buildHash: provenance.buildHash,
      domains,
    },
    counts: { total, returned: 0 },
    truncation: { truncated: false, omissions: [...(options.omissions ?? [])] },
    budget: {
      estimatedTokens: 0,
      maximumEstimatedTokens: RETRIEVAL_BUDGETS[options.mode],
      countingMethod: 'ceil(UTF-8 bytes of compact JSON / 4)',
    },
    continuation: null,
    items: options.items.slice(offset, offset + limit),
    notes: options.notes ?? [],
    ...(options.detail ? { detail: options.detail } : {}),
  };
  function update() {
    envelope.counts.returned = envelope.items.length;
    const hasMore = offset + envelope.items.length < total;
    envelope.truncation.truncated =
      offset > 0 || hasMore || envelope.truncation.omissions.length > 0;
    envelope.continuation = hasMore
      ? {
          tool: options.tool,
          arguments: {
            ...options.args,
            offset: offset + envelope.items.length,
          },
        }
      : options.continuation ?? null;
    if (hasMore && !envelope.truncation.omissions.includes('remaining_records'))
      envelope.truncation.omissions.push('remaining_records');
    // Settle the small self-counting field to include its own decimal digits.
    for (let i = 0; i < 3; i++)
      envelope.budget.estimatedTokens = Math.ceil(
        Buffer.byteLength(JSON.stringify(envelope), 'utf8') / 4,
      );
  }
  update();
  while (
    envelope.budget.estimatedTokens > envelope.budget.maximumEstimatedTokens &&
    envelope.items.length
  ) {
    envelope.items.pop();
    if (!envelope.truncation.omissions.includes('output_budget'))
      envelope.truncation.omissions.push('output_budget');
    update();
  }
  if (total > offset && envelope.items.length === 0) {
    envelope.match = 'unavailable';
    envelope.truncation.omissions.push('atomic_contract_exceeds_budget');
    update();
    envelope.continuation = null;
  }
  // Metadata can itself exceed budget on adversarial inputs. Report the loss.
  if (
    envelope.budget.estimatedTokens > envelope.budget.maximumEstimatedTokens
  ) {
    envelope.notes = [
      'Requested metadata exceeds the output budget. Request a narrower component projection or field.',
    ];
    delete envelope.detail;
    envelope.truncation.omissions.push('oversized_metadata');
    envelope.match = 'unavailable';
    update();
    envelope.continuation = null;
  }
  for (let i = 0; i < 3; i++)
    envelope.budget.estimatedTokens = Math.ceil(
      Buffer.byteLength(JSON.stringify(envelope), 'utf8') / 4,
    );
  return envelope;
}

/** JSON text retains every fact clients can read in structuredContent. */
export function formatRetrievalEnvelope(result: RetrievalEnvelope): string {
  const qualification =
    'Source: bundled data; installed compatibility not checked. Documentation links are latest references.';
  return `${result.mode === 'detail' ? 'Selected detail' : 'Discovery'}: ${result.match}. ${qualification}\n${JSON.stringify(result)}`;
}
