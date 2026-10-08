import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  utilityClasses,
  tokens,
  components,
  icons,
  documentation,
  bundledProvenance,
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
  getComponentDocumentation,
  getDocumentationDetail,
  COMPONENT_SECTIONS,
  createRetrievalEnvelope,
  formatRetrievalEnvelope,
} from '@dialpad/dialtone-query-core';
import type {
  MatchState,
  RetrievalEnvelope,
} from '@dialpad/dialtone-query-core';

/** Routing only; policy remains in the existing client-rules resource. */
export const ROUTING_INSTRUCTIONS =
  'Search with search_components, search_icons, search_tokens, search_utility_classes or search_documentation for readable summaries. Component API and token themes are samples. Use get_component for complete selected APIs or named fields, get_documentation for exact section prose, and search_tokens projection themes for all named theme records. Follow continuation calls. Results use bundled data; installed compatibility is not checked. Inspect source packages, versions, hashes and missing metadata. Import hints verify stated exports only. Documentation links are latest references. Verify availability and behavior against installed packages. Client-rules remains a separate resource.';
const query = z.string().max(256).trim().min(1);
const offset = z.number().int().min(0).max(100000).default(0);
const searchLimit = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() ? Number(value) : value,
  z.number().optional(),
);
const specs = {
  search_utility_classes: {
    domain: 'utilityClasses',
    description:
      'Search CSS utility classes with their available properties and usage.',
  },
  search_tokens: {
    domain: 'tokens',
    description:
      'Search design tokens with three named theme samples and usage. For all available theme records, use projection themes with an exact returned token name.',
  },
  search_components: {
    domain: 'components',
    description:
      'Search components by name or feature with descriptions, sampled props/events/slots and import hints. Use get_component for the complete selected API.',
  },
  search_icons: {
    domain: 'icons',
    description:
      'Search icons by name, category or keyword with component import examples from @dialpad/dialtone-icons/vue.',
  },
  search_documentation: {
    domain: 'documentation',
    description:
      'Search documentation prose about usage, accessibility, migrations or design guidance. Use get_documentation with an exact returned section ID for complete prose.',
  },
} as const;
type SearchTool = keyof typeof specs;
const detailSchema = z
  .object({
    component: query,
    projection: z.enum(['all', ...COMPONENT_SECTIONS]).default('all'),
    field: query.optional(),
    limit: z.number().int().min(1).max(50).default(20),
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
    match: {
      enum: ['exact', 'candidate', 'no-match', 'unavailable', 'unverified'],
    },
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
          limit: { type: 'number', default: 15 },
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
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
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
        'Retrieve complete available prose for an exact documentation section ID. Follow the returned textOffset continuation to read remaining content. Offsets count Unicode code points. This corpus contains prose; code examples require their own verification.',
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
const missingMetadata: Record<string, readonly string[]> = {
  props: ['type', 'values', 'defaultValue', 'required', 'description', 'tags'],
  events: ['type', 'properties', 'description', 'tags'],
  slots: ['bindings', 'description', 'tags'],
  methods: ['params', 'returns', 'description'],
  expose: ['type', 'description'],
};
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
function callText(tool: string, args: Record<string, unknown>) {
  return `\`${tool}(${JSON.stringify(args)})\``;
}
function sourceText(name: SearchTool) {
  const source = bundledProvenance.domains[specs[name].domain];
  return `**Source:** bundled; installed compatibility not checked. ${source.package}@${source.version}; SHA256 ${source.hash}.`;
}
function searchFooter(
  name: SearchTool,
  args: { query: string; limit: number; offset: number; projection?: string },
  total: number,
  returned: number,
) {
  let footer = `\n\n**Results:** ${returned} of ${total}; offset ${args.offset}.\n${sourceText(name)}`;
  const next = args.offset + returned;
  if (args.limit > 0 && returned && next < total && next <= 100000)
    footer += `\n**Continue:** ${callText(name, { ...args, offset: next })}`;
  else if (next < total)
    footer +=
      '\nNo continuation can make progress with this limit within the supported offset range.';
  return footer;
}
function fieldsText(fields: object) {
  return Object.entries(fields)
    .map(
      ([field, value]) =>
        `   - ${field}: ${typeof value === 'string' ? value : JSON.stringify(value)}`,
    )
    .join('\n');
}
function metadataText(metadata: object | null) {
  return metadata ? `**Metadata:**\n${fieldsText(metadata)}\n\n` : '';
}
export function executeQueryTool(name: string, input: unknown) {
  try {
    if (name === 'get_documentation') {
      const args = docsSchema.parse(input ?? {});
      const selected = getDocumentationDetail(args, documentation);
      return reply(
        createRetrievalEnvelope(
          {
            tool: name,
            args,
            mode: 'detail',
            domain: 'documentation',
            match: selected.match,
            items: selected.record ? [selected.record] : [],
            detail: { id: args.id, contentCounts: selected.contentCounts },
            omissions: selected.continuation ? ['remaining_content'] : [],
            continuation: selected.continuation,
            notes: selected.record
              ? []
              : [
                  'No exact section ID matched. Use search_documentation and pass its returned ID.',
                ],
          },
          bundledProvenance,
        ),
      );
    }
    if (name === 'get_component') {
      const args = detailSchema.parse(input ?? {});
      const selected = getComponentDetail(args, components);
      const component = selected.component;
      const continuation =
        selected.match === 'no-match' || selected.match === 'candidate'
          ? component
            ? {
                tool: name,
                arguments: {
                  component: component.displayName,
                  projection: args.projection,
                  limit: args.limit,
                  offset: 0,
                },
              }
            : {
                tool: 'search_components',
                arguments: { query: args.component, limit: 15, offset: 0 },
              }
          : null;
      const notes = [
        'Absent metadata fields are unknown; an empty generated array reports no documented records.',
        'Import verification describes exports only; installed runtime, peer dependencies and compatibility are not checked.',
      ];
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
            match: selected.match as MatchState,
            canonicalIdentity: component?.identity,
            items: selected.items,
            notes,
            detail: {
              projection: args.projection,
              field: args.field ?? null,
              description: component?.description ?? null,
              metadata: component?.metadata ?? null,
              tags: component?.tags ?? null,
              unknown: selected.unknown,
              available: args.field || !component ? selected.available : [],
              unknownContractFields: selected.items
                .map(({ section, contract }) => ({
                  section,
                  name: contract.name,
                  fields: missingMetadata[section].filter(
                    (field) => !Object.hasOwn(contract, field),
                  ),
                }))
                .filter((record) => record.fields.length),
              documentation: component
                ? getComponentDocumentation(
                    component.identity,
                    componentDocumentation,
                  )
                : null,
            },
            continuation,
          },
          bundledProvenance,
        ),
      );
    }
    if (!Object.hasOwn(specs, name))
      throw new Error(
        `Unknown tool '${name}'. Call tools/list for available routes.`,
      );
    const searchName = name as SearchTool;
    const args = z
      .object({
        query: z.string(),
        limit: searchLimit,
        offset,
        ...(name === 'search_tokens'
          ? { projection: z.enum(['summary', 'themes']).default('summary') }
          : {}),
      })
      .parse(input ?? {});
    const pageArgs = {
      query: args.query,
      limit: args.limit || 15,
      offset: args.offset,
      ...(typeof args.projection === 'string'
        ? { projection: args.projection }
        : {}),
    };
    if (name === 'search_tokens' && args.projection === 'themes') {
      const selected = getValueDetail(args.query, tokens);
      const records = selected.items as { theme: string; contract: object }[];
      const page = records.slice(
        pageArgs.offset,
        pageArgs.offset + pageArgs.limit,
      );
      const text = selected.subject
        ? `Theme records for **${selected.subject.name}**:\n\n${metadataText(selected.subject.metadata)}${page
            .map(
              (item, index) =>
                `${index + 1}. **${item.theme}**\n${fieldsText(item.contract)}`,
            )
            .join(
              '\n',
            )}\nTheme values do not identify the active installed theme.`
        : `No exact token source name matched "${args.query}". Use ${callText(name, { query: args.query, projection: 'summary' })} and select a returned name.`;
      return readableReply(
        text +
          searchFooter(
            searchName,
            pageArgs,
            selected.items.length,
            page.length,
          ),
      );
    }
    const found = !args.query.trim()
      ? { results: [], notes: ['No match: query contains only whitespace.'] }
      : name === 'search_utility_classes'
        ? searchUtilityClasses(args.query, utilityClasses)
        : name === 'search_tokens'
          ? searchTokens(args.query, tokens)
          : name === 'search_components'
            ? searchComponents(args.query, components)
            : name === 'search_icons'
              ? searchIcons(args.query, icons)
              : searchDocumentation(args.query, documentation);
    const page = found.results.slice(
      pageArgs.offset,
      pageArgs.offset + pageArgs.limit,
    );
    let text =
      name === 'search_utility_classes'
        ? formatResults(page, args.query)
        : name === 'search_tokens'
          ? formatTokenResults(page, args.query)
          : name === 'search_components'
            ? formatComponentResults(page, args.query)
            : name === 'search_icons'
              ? formatIconResults(page, args.query)
              : formatDocumentationResults(page, args.query);
    if (found.notes.length) text += `\n\n${found.notes.join('\n')}`;
    if (page.length && name === 'search_components') {
      text +=
        '\n**Complete selected API:** The displayed API is an incomplete sample.\n';
      text += page
        .map(
          (result) =>
            `- ${result.name}: ${callText('get_component', { component: result.name })}`,
        )
        .join('\n');
    } else if (page.length && name === 'search_tokens') {
      text +=
        '\n**Complete theme records:** Three themes are a sample; they do not identify the active installed theme.\n';
      text += page
        .map(
          (result) =>
            `- ${result.name}: ${callText(name, { query: result.name, projection: 'themes', limit: 15, offset: 0 })}`,
        )
        .join('\n');
    } else if (page.length && name === 'search_documentation') {
      text +=
        '\n**Complete section prose:** Discovery excerpts can omit available guidance.\n';
      text += page
        .map(
          (result) =>
            `- ${result.details.id}: ${callText('get_documentation', { id: result.details.id })}`,
        )
        .join('\n');
    }
    return readableReply(
      text +
        searchFooter(searchName, pageArgs, found.results.length, page.length),
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
        `Error: ${notes.join('\n')}\n${sourceText(name as SearchTool)}`,
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
        bundledProvenance,
      ),
      true,
    );
  }
}
export function registerQueryTools(server: McpServer) {
  server.server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: queryToolDefinitions(),
  }));
  server.server.setRequestHandler(CallToolRequestSchema, async (request) =>
    executeQueryTool(request.params.name, request.params.arguments),
  );
}
