import { z } from 'zod';
import type { ProjectData, ResolvedData } from '@dialpad/dialtone-query-core/node';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  componentDocumentation,
  searchUtilityClasses,
  searchTokens,
  searchComponents,
  searchIcons,
  searchDocumentation,
  formatResults,
  formatTokenResults,
  formatComponentResults,
  formatIconResults,
  formatDocumentationResults,
  getComponentDetail,
  getValueDetail,
  formatTokenThemes,
  getComponentDocumentation,
  getDocumentationExampleIds,
  getDocumentationDetail,
  COMPONENT_SECTIONS,
  COMPONENT_DETAIL_LIMIT,
  MATCH_STATES,
  createRetrievalEnvelope,
  paginate,
  formatRetrievalEnvelope,
} from '@dialpad/dialtone-query-core';
import type {
  BundledProvenance,
  MissingComponentReason,
  RetrievalEnvelope,
  SearchResult,
  SearchPage,
} from '@dialpad/dialtone-query-core';

/** Routing only; policy remains in the existing client-rules resource. */
export const ROUTING_INSTRUCTIONS =
  "Search with search_components, search_icons, search_tokens, search_utility_classes or search_documentation for summaries. APIs/themes are samples. Use get_component for selected APIs, get_documentation for exact prose or source-example IDs, and search_tokens projection themes. Follow continuations. Data uses configured installations or bundled data; documentation/examples use bundled data; installed compatibility is not checked. Search documentation for longer example requests; sections give example IDs. Inspect versions, hashes and missing metadata. Import hints verify exports only. Documentation links are latest references. Verify installed behavior. Client-rules remains separate.";
/** Runtime fallback for an omitted or zero search limit; matches the schema default. */
const DEFAULT_LIMIT = 15;
const MISSING_COMPONENT_NOTES: Record<MissingComponentReason, string> = {
  'not-exported': 'The selected installed entry does not export this component. No bundled API was substituted.',
  'exported-without-metadata': 'The selected installed entry exports this name, but no component metadata describes it; it may not be a component.',
  'export-unverified': 'The selected metadata does not describe this name; its installed export availability is unverified.',
};
const query = z.string().max(256).trim().min(1);
const offset = z.number().int().min(0).max(100000).default(0);
const searchLimit = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() ? Number(value) : value,
  z.number().optional(),
);
// Search tools keep their published lenient inputs: unknown keys are stripped.
const searchArgs = z.object({ query: z.string(), limit: searchLimit, offset });
const tokenSearchArgs = searchArgs.extend({
  projection: z.enum(['summary', 'themes']).default('summary'),
});
type SearchArgs = {
  query: string;
  limit?: number;
  offset: number;
  projection?: 'summary' | 'themes';
};
function callText(tool: string, args: Record<string, unknown>) {
  return `\`${tool}(${JSON.stringify(args)})\``;
}
interface SearchSpec {
  domain: string;
  description: string;
  search: (query: string, data: ResolvedData) => { results: SearchResult[]; notes: string[] };
  format: (results: SearchResult[], query: string, page?: SearchPage) => string;
  /** Points each displayed result at its complete-detail call. */
  followUp?: { heading: string; line: (result: SearchResult) => string };
}
const specs: Record<string, SearchSpec> = {
  search_utility_classes: {
    domain: 'utilityClasses',
    description:
      'Search CSS utility classes with their available properties and usage.',
    search: (text, data) => searchUtilityClasses(text, data.utilityClasses),
    format: formatResults,
  },
  search_tokens: {
    domain: 'tokens',
    description:
      'Search design tokens with three named theme samples and usage. For all available theme records, use projection themes with an exact returned token name.',
    search: (text, data) => searchTokens(text, data.tokens),
    format: formatTokenResults,
    followUp: {
      heading:
        '\n**Complete theme records:** Three themes are a sample; they do not identify the active installed theme.\n',
      line: (result) =>
        `- ${result.name}: ${callText('search_tokens', {
          query: result.name,
          projection: 'themes',
          limit: DEFAULT_LIMIT,
          offset: 0,
        })}`,
    },
  },
  search_components: {
    domain: 'components',
    description:
      'Search components by name or feature with sampled APIs and import hints. Use get_component for complete APIs. Source-example hints accompany matching subjects; use search_documentation for longer example requests.',
    search: (text, data) => searchComponents(text, data.components, componentDocumentation),
    format: formatComponentResults,
    followUp: {
      heading:
        '\n**Complete selected API:** The displayed API is an incomplete sample.\n',
      line: (result) =>
        `- ${result.name}: ${callText('get_component', { component: result.name })}`,
    },
  },
  search_icons: {
    domain: 'icons',
    description:
      'Search icons by name, category or keyword with component import examples from @dialpad/dialtone-icons/vue.',
    search: (text, data) => searchIcons(text, data.icons),
    format: formatIconResults,
  },
  search_documentation: {
    domain: 'documentation',
    description:
      'Search documentation prose about usage, accessibility, migrations or design guidance, including longer example requests. Source sections list available examples/* IDs. Use get_documentation for complete prose or an exact example.',
    search: (text, data) => searchDocumentation(text, data.documentation),
    format: formatDocumentationResults,
    followUp: {
      heading:
        '\n**Complete section prose:** Discovery excerpts can omit available guidance.\n',
      line: (result) =>
        `- ${result.details.id}: ${callText('get_documentation', { id: result.details.id })}`,
    },
  },
};
const detailSchema = z
  .object({
    component: query,
    projection: z.enum(['all', ...COMPONENT_SECTIONS]).default('all'),
    field: query.optional(),
    limit: z.number().int().min(1).max(50).default(COMPONENT_DETAIL_LIMIT),
    offset,
  })
  .strict();
const docsSchema = z
  .object({
    id: query,
    textOffset: z.number().int().min(0).max(1000000).default(0),
    textLimit: z.number().int().min(1).max(10000).default(6000),
  })
  .strict();
const stringSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 256,
  pattern: '\\S',
};
const offsetSchema = {
  type: 'integer',
  minimum: 0,
  maximum: 100000,
  default: 0,
};
const outputSchema = {
  type: 'object',
  properties: {
    schemaVersion: { const: 1 },
    mode: { enum: ['discovery', 'detail'] },
    match: { enum: [...MATCH_STATES] },
    canonicalIdentity: { anyOf: [{ type: 'object' }, { type: 'null' }] },
    source: {
      type: 'object',
      required: [
        'selection',
        'installedCompatibility',
        'fallbackReason',
        'buildHash',
        'domains',
      ],
    },
    counts: {
      type: 'object',
      properties: {
        total: { type: 'integer', minimum: 0 },
        returned: { type: 'integer', minimum: 0 },
      },
      required: ['total', 'returned'],
    },
    truncation: {
      type: 'object',
      properties: {
        truncated: { type: 'boolean' },
        omissions: { type: 'array', items: { type: 'string' } },
      },
      required: ['truncated', 'omissions'],
    },
    budget: {
      type: 'object',
      required: ['estimatedTokens', 'maximumEstimatedTokens', 'countingMethod'],
    },
    continuation: {
      anyOf: [
        { type: 'object', required: ['tool', 'arguments'] },
        { type: 'null' },
      ],
    },
    items: { type: 'array' },
    notes: { type: 'array', items: { type: 'string' } },
    detail: { type: 'object' },
  },
  required: [
    'schemaVersion',
    'mode',
    'match',
    'canonicalIdentity',
    'source',
    'counts',
    'truncation',
    'budget',
    'continuation',
    'items',
    'notes',
  ],
  additionalProperties: false,
};
export function queryToolDefinitions() {
  return [
    ...Object.entries(specs).map(([name, spec]) => ({
      name,
      description: spec.description,
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: { type: 'string' },
          limit: { type: 'number', default: DEFAULT_LIMIT },
          offset: offsetSchema,
          ...(name === 'search_tokens'
            ? {
                projection: {
                  type: 'string',
                  enum: ['summary', 'themes'],
                  default: 'summary',
                },
              }
            : {}),
        },
        required: ['query'],
        additionalProperties: true,
      },
    })),
    {
      name: 'get_component',
      description:
        'Retrieve one selected component’s complete available contract or named field: types/defaults, all allowed and deprecated values, required inputs, event payloads, scoped-slot bindings, methods/exposed members, verified export hints and qualified latest documentation links. Selection never substitutes a feature-search candidate; absent metadata is unknown.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          component: stringSchema,
          projection: { enum: ['all', ...COMPONENT_SECTIONS], default: 'all' },
          field: stringSchema,
          limit: { type: 'integer', minimum: 1, maximum: 50, default: COMPONENT_DETAIL_LIMIT },
          offset: offsetSchema,
        },
        required: ['component'],
        additionalProperties: false,
      },
      outputSchema,
    },
    {
      name: 'get_documentation',
      description:
        'Retrieve complete available prose for an exact documentation section ID. Follow the returned textOffset continuation to read remaining content. Offsets count Unicode code points. Selected examples/* IDs include complete source-derived files and setup; check their pinned consumer profile and validation limits. A continued fragment is not a complete runnable example.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          id: stringSchema,
          textOffset: {
            type: 'integer',
            minimum: 0,
            maximum: 1000000,
            default: 0,
          },
          textLimit: {
            type: 'integer',
            minimum: 1,
            maximum: 10000,
            default: 6000,
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      outputSchema,
    },
  ];
}
function reply(envelope: RetrievalEnvelope, isError = false) {
  return {
    content: [
      { type: 'text' as const, text: formatRetrievalEnvelope(envelope) },
    ],
    structuredContent: envelope as unknown as Record<string, unknown>,
    ...(isError ? { isError: true } : {}),
  };
}
function readableReply(text: string, isError = false) {
  return {
    content: [{ type: 'text' as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}
function sourceText(name: string, provenance: BundledProvenance) {
  const source = provenance.domains[specs[name].domain];
  return `**Source:** ${source.selection ?? 'bundled'}; installed compatibility not checked. ${source.package}@${source.version}; SHA256 ${source.hash}.${source.fallbackReason ? ` Fallback: ${source.fallbackReason}.` : ''}`;
}
function exampleHints(ids: string[]) {
  if (!ids.length) return '';
  return `\n\nSource examples (${Math.min(ids.length, 3)} of ${ids.length}; check profile and validation limits):\n${ids.slice(0, 3).map(id => `- ${id}: ${callText('get_documentation', { id })}`).join('\n')}${ids.length > 3 ? '\nRetrieve the matching source section for its full exampleIds list.' : ''}`;
}
function searchFooter(
  name: string,
  args: { query: string; limit: number; offset: number; projection?: string },
  pagination: ReturnType<typeof paginate>,
  provenance: BundledProvenance,
  warnings: string[],
) {
  const { page, total, nextOffset } = pagination;
  const returned = page.length;
  let footer = `\n\n**Results:** ${returned} of ${total}; offset ${args.offset}.\n${sourceText(name, provenance)}`;
  if (warnings.length) footer += `\n${warnings.join('\n')}`;
  if (args.limit > 0 && returned && nextOffset !== null && nextOffset <= 100000)
    footer += `\n**Continue:** ${callText(name, { ...args, offset: nextOffset })}`;
  else if (nextOffset !== null)
    footer +=
      '\nNo continuation can make progress with this limit within the supported offset range.';
  return footer;
}
export function executeQueryTool(name: string, input: unknown, context: ProjectData) {
  const { data, provenance } = context;
  try {
    if (name === 'get_documentation') {
      const args = docsSchema.parse(input ?? {});
      const selected = getDocumentationDetail(args, data.documentation);
      const missingExample = !selected.record && args.id.startsWith('examples/');
      const availableExamples = data.documentation.filter(record => record.example).map(record => record.id);
      return reply(
        createRetrievalEnvelope(
          {
            tool: name,
            args,
            mode: 'detail',
            domain: 'documentation',
            match: selected.match,
            items: selected.record ? [selected.record] : [],
            detail: { id: args.id, contentCounts: selected.contentCounts, exampleIds: selected.record && !selected.record.example ? getDocumentationExampleIds(selected.record.id, data.documentation) : [] },
            omissions: selected.next ? ['remaining_content'] : [],
            continuation: selected.next ? {
              tool: name,
              arguments: selected.next,
            } : missingExample ? { tool: 'search_documentation', arguments: { query: args.id.slice('examples/'.length).replace(/-/g, ' ') } } : null,
            notes: selected.record
              ? []
              : missingExample ? [`No exact example ID matched. Available example IDs (${Math.min(availableExamples.length, 3)} of ${availableExamples.length}): ${availableExamples.slice(0, 3).join(', ')}. Call get_documentation with a chosen ID.`] : [
                  'No exact section ID matched. Use search_documentation and pass its returned ID.',
                ],
          },
          provenance,
        ),
      );
    }
    if (name === 'get_component') {
      const args = detailSchema.parse(input ?? {});
      const selected = getComponentDetail(args, data.components, provenance.domains.components.selection === 'installed' ? context.componentExports : undefined);
      const component = selected.component;
      // A missing field retries the component; any miss except a verified absence can still be searched.
      const continuation = component
        ? selected.match === 'no-match'
          ? {
              tool: name,
              arguments: {
                component: component.displayName,
                projection: args.projection,
                limit: args.limit,
                offset: 0,
              },
            }
          : null
        : selected.match === 'unavailable'
          ? null
          : {
              tool: 'search_components',
              arguments: {
                query: args.component,
                limit: DEFAULT_LIMIT,
                offset: 0,
              },
            };
      const notes = [
        'Absent metadata fields are unknown; an empty generated array reports no documented records.',
        'Import verification describes exports only; installed runtime, peer dependencies and compatibility are not checked.',
      ];
      if (selected.reason) notes.push(MISSING_COMPONENT_NOTES[selected.reason]);
      notes.push(...data.warnings);
      if (!component)
        notes.push(
          `No unique component selected. Use a canonical name${selected.available.length ? `: ${selected.available.join(', ')}` : ' from search_components'}.`,
        );
      else if (args.field && selected.match === 'no-match')
        notes.push(
          `No field '${args.field}' on ${component.displayName}. Retrieve ${args.projection} to see available fields.`,
        );
      return reply(
        createRetrievalEnvelope(
          {
            tool: name,
            args,
            mode: 'detail',
            domain: ['components', 'componentDocumentation'],
            match: selected.match,
            canonicalIdentity: component?.identity,
            items: selected.items,
            notes,
            detail: {
              projection: args.projection,
              exampleIds: component ? getDocumentationExampleIds(component.displayName, data.documentation) : [],
              field: args.field ?? null,
              description: component?.description ?? null,
              metadata: component?.metadata ?? null,
              tags: component?.tags ?? null,
              unknown: selected.unknown,
              available: args.field || !component ? selected.available : [],
              unknownContractFields: selected.unknownContractFields,
              documentation: component
                ? getComponentDocumentation(
                    component.identity,
                    componentDocumentation,
                  )
                : null,
            },
            continuation,
          },
          provenance,
        ),
      );
    }
    if (!Object.hasOwn(specs, name))
      throw new Error(
        `Unknown tool '${name}'. Call tools/list for available routes.`,
      );
    const spec = specs[name];
    const { query: text, limit, ...rest }: SearchArgs = (
      name === 'search_tokens' ? tokenSearchArgs : searchArgs
    ).parse(input ?? {});
    // Keep argument order stable: continuation calls echo these arguments.
    const pageArgs = {
      query: text,
      limit: limit || DEFAULT_LIMIT,
      ...rest,
    };
    if (pageArgs.projection === 'themes') {
      const selected = getValueDetail(pageArgs.query, data.tokens);
      const pagination = paginate(selected.items, pageArgs);
      const page = pagination.page;
      const output = selected.subject
        ? formatTokenThemes(
            selected.subject.name,
            selected.subject.metadata,
            page,
          )
        : `No exact token source name matched "${pageArgs.query}". Use ${callText(name, { query: pageArgs.query, projection: 'summary' })} and select a returned name.`;
      return readableReply(
        output +
          searchFooter(name, pageArgs, pagination, provenance, data.warnings),
      );
    }
    const found = pageArgs.query.trim()
      ? spec.search(pageArgs.query, data)
      : { results: [], notes: ['No match: query contains only whitespace.'] };
    const pagination = paginate(found.results, pageArgs);
    const page = pagination.page;
    let output = spec.format(
      page,
      text,
      pageArgs.offset > 0
        ? { total: found.results.length, offset: pageArgs.offset }
        : undefined,
    );
    if (name === 'search_components') {
      let ids = getDocumentationExampleIds(pageArgs.query, data.documentation);
      if (!ids.length) {
        const source = searchDocumentation(pageArgs.query, data.documentation).results[0];
        if (source) ids = getDocumentationExampleIds(source.details.id, data.documentation);
      }
      output += exampleHints(ids);
    } else if (name === 'search_documentation') {
      output += exampleHints([...new Set(page.flatMap(result => getDocumentationExampleIds(result.details.id, data.documentation)))]);
    } else if (name === 'search_utility_classes') {
      output += exampleHints([...new Set(page.flatMap(result => getDocumentationExampleIds(result.name, data.documentation)))]);
    }
    if (found.notes.length) output += `\n\n${found.notes.join('\n')}`;
    if (page.length && spec.followUp)
      output +=
        spec.followUp.heading + page.map(spec.followUp.line).join('\n');
    return readableReply(
      output + searchFooter(name, pageArgs, pagination, provenance, data.warnings),
    );
  } catch (error) {
    const notes =
      error instanceof z.ZodError
        ? error.issues.map(
            (issue) =>
              `${issue.path.join('.') || 'arguments'}: ${issue.message}`,
          )
        : [error instanceof Error ? error.message : String(error)];
    if (Object.hasOwn(specs, name))
      return readableReply(
        `Error: ${notes.join('\n')}\n${sourceText(name, provenance)}`,
        true,
      );
    const domain =
      name === 'get_documentation' ? 'documentation' : 'components';
    return reply(
      createRetrievalEnvelope(
        {
          tool: name,
          args: {},
          mode: name.startsWith('get_') ? 'detail' : 'discovery',
          domain,
          match: 'unavailable',
          items: [],
          notes,
          omissions: ['invalid_arguments'],
        },
        provenance,
      ),
      true,
    );
  }
}
export function registerQueryTools(server: McpServer, context: ProjectData) {
  server.server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: queryToolDefinitions(),
  }));
  server.server.setRequestHandler(CallToolRequestSchema, async (request) =>
    executeQueryTool(request.params.name, request.params.arguments, context),
  );
}
