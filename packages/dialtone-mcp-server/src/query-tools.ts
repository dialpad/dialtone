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
  getComponentDetail,
  getValueDetail,
  projectDiscoveryValues,
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
  'Discover with search_components, search_icons, search_tokens, search_utility_classes, or search_documentation. Select a canonical component; call get_component for complete API or named fields. Use get_documentation with an exact section ID for complete prose. Follow returned continuation calls. Results use bundled data; installed compatibility is not checked. Inspect match state, package versions, hashes, unknown metadata and omissions. Import hints verify only the stated exports. Documentation links are latest references. Verify API availability and behavior against installed packages. Discovery omits detail; client-rules remains a separate resource.';
const query = z.string().max(256).trim().min(1);
const offset = z.number().int().min(0).max(100000).default(0);
const specs = {
  search_utility_classes: {
    domain: 'utilityClasses',
    defaultLimit: 15,
    max: 50,
    description:
      'Discover CSS utility classes with property previews/counts. For complete atomic properties, use projection properties with an exact returned class name as query.',
  },
  search_tokens: {
    domain: 'tokens',
    defaultLimit: 15,
    max: 50,
    description:
      'Discover design tokens with named theme previews/counts. For complete atomic theme values, use projection themes with an exact returned token name as query.',
  },
  search_components: {
    domain: 'components',
    defaultLimit: 10,
    max: 30,
    description:
      'Discover component candidates by UI feature or name. API contracts are omitted: select a canonical identity and use get_component for detail.',
  },
  search_icons: {
    domain: 'icons',
    defaultLimit: 20,
    max: 50,
    description:
      'Discover icons by name, category or visual keyword. Icon imports use @dialpad/dialtone-icons/vue.',
  },
  search_documentation: {
    domain: 'documentation',
    defaultLimit: 10,
    max: 30,
    description:
      'Discover documentation sections about usage, accessibility, migrations or design guidance. For complete prose use get_documentation with the returned exact section ID.',
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
          query: stringSchema,
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: spec.max,
            default: spec.defaultLimit,
          },
          offset: offsetSchema,
          ...(name === 'search_tokens' || name === 'search_utility_classes'
            ? {
                projection: {
                  type: 'string',
                  enum: [
                    'summary',
                    name === 'search_tokens' ? 'themes' : 'properties',
                  ],
                  default: 'summary',
                },
              }
            : {}),
        },
        required: ['query'],
        additionalProperties: false,
      },
      outputSchema,
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
                arguments: { query: args.component, limit: 10, offset: 0 },
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
    const spec = specs[name as SearchTool];
    const args = z
      .object({
        query,
        limit: z.number().int().min(1).max(spec.max).default(spec.defaultLimit),
        offset,
        ...(name === 'search_tokens'
          ? { projection: z.enum(['summary', 'themes']).default('summary') }
          : name === 'search_utility_classes'
            ? {
                projection: z
                  .enum(['summary', 'properties'])
                  .default('summary'),
              }
            : {}),
      })
      .strict()
      .parse(input ?? {});
    if (args.projection && args.projection !== 'summary') {
      const selected =
        name === 'search_tokens'
          ? getValueDetail(args.query, 'tokens', tokens)
          : getValueDetail(args.query, 'utilityClasses', utilityClasses);
      return reply(
        createRetrievalEnvelope(
          {
            tool: name,
            args,
            mode: 'detail',
            domain: spec.domain,
            match: selected.match,
            items: selected.items,
            detail: { projection: args.projection, subject: selected.subject },
            notes: selected.subject
              ? []
              : [
                  'No exact source name matched. Use summary discovery and select a returned name.',
                ],
            continuation: selected.subject
              ? null
              : {
                  tool: name,
                  arguments: {
                    query: args.query,
                    projection: 'summary',
                    limit: spec.defaultLimit,
                    offset: 0,
                  },
                },
          },
          bundledProvenance,
        ),
      );
    }
    const found =
      name === 'search_utility_classes'
        ? searchUtilityClasses(args.query, utilityClasses)
        : name === 'search_tokens'
          ? searchTokens(args.query, tokens)
          : name === 'search_components'
            ? searchComponents(args.query, components)
            : name === 'search_icons'
              ? searchIcons(args.query, icons)
              : searchDocumentation(args.query, documentation);
    const items =
      name === 'search_components'
        ? found.results.map((result) => {
            const component = getComponentDetail(
              { component: result.name },
              components,
            ).component;
            return {
              name: result.name,
              canonicalIdentity: result.details.identity,
              description: result.details.description?.slice(0, 280) ?? null,
              metadata: result.metadata,
              apiCounts: Object.fromEntries(
                COMPONENT_SECTIONS.map((section) => [
                  section,
                  component?.[section]?.length ?? null,
                ]),
              ),
              detail: {
                tool: 'get_component',
                arguments: {
                  component: result.name,
                  projection: 'all',
                  limit: 20,
                  offset: 0,
                },
              },
            };
          })
        : name === 'search_documentation'
          ? found.results.map((result) => ({
              id: result.details.id,
              docId: result.details.docId,
              title: result.details.docTitle,
              headingPath: result.details.headingPath,
              excerpt: result.details.content.slice(0, 500),
              contentLength: Array.from(result.details.content).length,
              detail: {
                tool: 'get_documentation',
                arguments: {
                  id: result.details.id,
                  textOffset: 0,
                  textLimit: 6000,
                },
              },
            }))
          : name === 'search_tokens' || name === 'search_utility_classes'
            ? found.results.map((result) => ({
                ...projectDiscoveryValues(result),
                detail: {
                  tool: name,
                  arguments: {
                    query: result.name,
                    projection:
                      name === 'search_tokens' ? 'themes' : 'properties',
                    limit: spec.defaultLimit,
                    offset: 0,
                  },
                },
              }))
            : found.results;
    const exact = 'exactMatch' in found && found.exactMatch === true;
    return reply(
      createRetrievalEnvelope(
        {
          tool: name,
          args,
          mode: 'discovery',
          domain: spec.domain,
          match: items.length ? (exact ? 'exact' : 'candidate') : 'no-match',
          items,
          notes: found.notes,
          omissions:
            name === 'search_components'
              ? [
                  'component_api_details',
                  'description_after_280_characters_if_present',
                ]
              : name === 'search_documentation'
                ? [
                    'prose_after_500_characters_if_present',
                    'other_sections_in_matching_pages',
                  ]
                : name === 'search_tokens' || name === 'search_utility_classes'
                  ? items.some(
                      (item) =>
                        'valueCounts' in item && item.valueCounts.omitted > 0,
                    )
                    ? ['values_not_previewed']
                    : []
                  : [],
          continuation:
            name === 'search_components' && exact
              ? {
                  tool: 'get_component',
                  arguments: {
                    component: found.results[0].name,
                    projection: 'all',
                    limit: 20,
                    offset: 0,
                  },
                }
              : null,
        },
        bundledProvenance,
      ),
    );
  } catch (error) {
    const notes =
      error instanceof z.ZodError
        ? error.issues.map(
            (issue) =>
              `${issue.path.join('.') || 'arguments'}: ${issue.message}`,
          )
        : [error instanceof Error ? error.message : String(error)];
    const domain = Object.hasOwn(specs, name)
      ? specs[name as SearchTool].domain
      : name === 'get_documentation'
        ? 'documentation'
        : 'components';
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
