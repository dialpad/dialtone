import { defineCommand } from 'citty';
import { searchDocumentation, formatDocumentationResults } from '@dialpad/dialtone-query-core';
import type { DocumentationRecord } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';

export const docsCommand = defineCommand({
  meta: { name: 'docs', description: 'Search Dialtone documentation for usage guidance, recipes, and patterns' },
  args: {
    query: { type: 'positional', description: 'Natural-language question or keywords', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    limit: { type: 'string', description: 'Max results to show (0 = no limit, default 10)', default: '10' },
  },
  run({ args }) {
    const limit = Number(args.limit);
    const { documentation } = getContext();
    const { results } = searchDocumentation(args.query, documentation);

    if (results.length === 0) {
      console.error(`No documentation found matching "${args.query}".`);
      process.exit(1);
    }

    const limited = limit ? results.slice(0, limit) : results;

    if (args.format === 'json') {
      console.log(JSON.stringify(limited.map(r => r.details as DocumentationRecord), null, 2));
      return;
    }

    // markdown and minimal both use the documentation formatter (prose excerpts + links)
    console.log(formatDocumentationResults(limited, args.query));

    if (limit && results.length > limit) {
      console.log(`\n... and ${results.length - limit} more (${results.length} total). Use --limit 0 to see all.`);
    }
  },
});
