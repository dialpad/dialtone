import { defineCommand } from 'citty';
import { searchDocumentation, formatDocumentationResults, getDocumentationDetail, getDocumentationExampleIds, getDocumentationContext, componentDocumentation, bundledProvenance, createRetrievalEnvelope } from '@dialpad/dialtone-query-core';
import type { DocumentationRecord, DocumentationContextReference } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';

function shellArgument(value: string): string {
  return /^[\w./#:-]+$/.test(value) ? value : "'" + value.replaceAll("'", "'\\''") + "'";
}

function referenceCommand(item: DocumentationContextReference): string {
  if (item.kind === 'documentation') return `dialtone docs --id ${shellArgument(item.id)}`;
  if (item.kind === 'component-api') return `dialtone component ${shellArgument(item.component)}`;
  if (item.kind === 'utility') return `dialtone utility ${shellArgument(item.name)}`;
  return item.targetDocId ? `dialtone docs --id ${shellArgument(item.targetDocId)} --context`
    : item.url ?? `Unresolved authored link: ${item.href}`;
}

export const docsCommand = defineCommand({
  meta: { name: 'docs', description: 'Search Dialtone documentation for usage guidance, recipes, and patterns' },
  args: {
    query: { type: 'positional', description: 'Natural-language question or keywords', required: false },
    id: { type: 'string', description: 'Retrieve a complete documentation record by exact ID' },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    limit: { type: 'string', description: 'Max search results (default 10; 0 = all), or context references (default 20; 1-50)' },
    context: { type: 'boolean', description: 'List related documentation/API context for --id' },
    offset: { type: 'string', description: 'Context reference offset (default 0)' },
  },
  run({ args }) {
    const integer = /^(0|[1-9]\d*)$/;
    const limitText = args.limit ?? (args.context ? '20' : '10');
    const limit = integer.test(limitText) ? Number(limitText) : NaN;
    if (args.context) {
      const offsetText = args.offset ?? '0';
      const offset = integer.test(offsetText) ? Number(offsetText) : NaN;
      if (!args.id?.trim() || args.query || !Number.isInteger(limit) || limit < 1 || limit > 50
        || !Number.isInteger(offset) || offset < 0 || offset > 100000) {
        console.error('Use --id <id> --context with --limit 1-50 and --offset 0-100000; no positional query.');
        process.exit(1);
      }
      const selected = getDocumentationContext({ id: args.id }, getContext().documentation, componentDocumentation);
      const envelope = createRetrievalEnvelope({
        tool: 'dialtone docs', args: { id: args.id, context: true, limit, offset }, mode: 'detail',
        domain: ['documentation', 'componentDocumentation'], match: selected.match, items: selected.items, notes: selected.notes,
        detail: { id: args.id, docId: selected.docId, sourceSectionId: selected.sourceSectionId, documentation: selected.documentation },
      }, bundledProvenance);
      if (args.format === 'json') console.log(JSON.stringify(envelope, null, 2));
      else {
        console.log(`Context for ${args.id}: ${envelope.counts.returned} of ${envelope.counts.total} references (bundled; installed compatibility not checked).`);
        for (const item of envelope.items as DocumentationContextReference[]) {
          console.log(`- ${item.relation}: ${referenceCommand(item)}`);
        }
        if (selected.documentation) console.log(`Page (latest reference): ${selected.documentation.url}`);
        for (const note of envelope.notes) console.log(`Note: ${note}`);
        if (envelope.continuation) console.log(`Continue: dialtone docs --id ${shellArgument(args.id)} --context --limit ${limit} --offset ${envelope.continuation.arguments.offset}`);
      }
      if (envelope.match === 'no-match' || envelope.match === 'unavailable') process.exitCode = 1;
      return;
    }
    if (args.offset !== undefined) {
      console.error('--offset is only available with --id <id> --context.');
      process.exit(1);
    }
    if (!Number.isInteger(limit) || limit < 0) {
      console.error(`Invalid --limit value "${args.limit}". Expected a non-negative integer (0 = no limit).`);
      process.exit(1);
    }
    const { documentation } = getContext();
    if (args.id !== undefined) {
      if (!args.id.trim() || args.query) {
        console.error('Use either a positional query or --id <documentation-id>.');
        process.exit(1);
      }
      const detail = getDocumentationDetail({ id: args.id, textLimit: Number.MAX_SAFE_INTEGER }, documentation);
      if (!detail.record) {
        console.error(`No documentation found with ID "${args.id}".`);
        if (args.id.startsWith('examples/')) {
          const ids = documentation.filter(record => record.example).map(record => record.id);
          console.error(`Available example IDs (${Math.min(ids.length, 3)} of ${ids.length}): ${ids.slice(0, 3).join(', ')}. Use dialtone docs --id <id>.`);
        }
        process.exit(1);
      }
      console.log(args.format === 'json' ? JSON.stringify([detail.record], null, 2) : detail.record.content);
      if (args.format !== 'json' && !detail.record.example) {
        const ids = getDocumentationExampleIds(detail.record.id, documentation);
        if (ids.length) console.log(`\nSource examples:\n${ids.map(id => `${id}: dialtone docs --id ${id}`).join('\n')}`);
      }
      if (args.format !== 'json') console.log(`\nRelated context: dialtone docs --id ${shellArgument(args.id)} --context`);
      return;
    }
    if (!args.query) {
      console.error('Provide a documentation query or --id <documentation-id>.');
      process.exit(1);
    }
    const { results, notes } = searchDocumentation(args.query, documentation);
    for (const note of new Set(notes)) console.error(`Note: ${note}`);

    if (results.length === 0) {
      console.error(`No documentation found matching "${args.query}".`);
      process.exit(1);
    }

    const limited = limit > 0 ? results.slice(0, limit) : results;

    if (args.format === 'json') {
      console.log(JSON.stringify(limited.map(r => r.details as DocumentationRecord), null, 2));
      return;
    }

    // markdown and minimal both use the documentation formatter (prose excerpts + links)
    console.log(formatDocumentationResults(limited, args.query));
    console.log(`\nComplete sections:\n${limited.map(result => `dialtone docs --id ${shellArgument(result.details.id)}`).join('\n')}`);
    const ids = [...new Set(limited.flatMap(result => getDocumentationExampleIds(result.details.id, documentation)))];
    if (ids.length) console.log(`\nSource examples (${Math.min(ids.length, 3)} of ${ids.length}; check profile and validation limits):\n${ids.slice(0, 3).map(id => `${id}: dialtone docs --id ${id}`).join('\n')}${ids.length > 3 ? '\nRetrieve the matching source section with --id for its full example list.' : ''}`);

    if (limit > 0 && results.length > limit) {
      console.log(`\n... and ${results.length - limit} more (${results.length} total). Use --limit 0 to see all.`);
    }
  },
});
