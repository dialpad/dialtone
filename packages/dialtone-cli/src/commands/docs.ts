import { defineCommand } from 'citty';
import { searchDocumentation, formatDocumentationResults, getDocumentationDetail, getDocumentationExampleIds } from '@dialpad/dialtone-query-core';
import type { DocumentationRecord } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';

export const docsCommand = defineCommand({
  meta: { name: 'docs', description: 'Search Dialtone documentation for usage guidance, recipes, and patterns' },
  args: {
    query: { type: 'positional', description: 'Natural-language question or keywords', required: false },
    id: { type: 'string', description: 'Retrieve a complete documentation record by exact ID' },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    limit: { type: 'string', description: 'Max results to show (0 = no limit, default 10)', default: '10' },
  },
  run({ args }) {
    const limit = Number.parseInt(args.limit, 10);
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
    const ids = [...new Set(limited.flatMap(result => getDocumentationExampleIds(result.details.id, documentation)))];
    if (ids.length) console.log(`\nSource examples (${Math.min(ids.length, 3)} of ${ids.length}; check profile and validation limits):\n${ids.slice(0, 3).map(id => `${id}: dialtone docs --id ${id}`).join('\n')}${ids.length > 3 ? '\nRetrieve the matching source section with --id for its full example list.' : ''}`);

    if (limit > 0 && results.length > limit) {
      console.log(`\n... and ${results.length - limit} more (${results.length} total). Use --limit 0 to see all.`);
    }
  },
});
