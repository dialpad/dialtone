import { defineCommand } from 'citty';
import { searchTokens } from '@dialpad/dialtone-query-core';
import type { TokensData, SearchResult } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';
import { formatTokenOutput, type Format } from '../formatters.js';

export const tokenCommand = defineCommand({
  meta: { name: 'token', description: 'Look up a design token' },
  args: {
    name: { type: 'positional', description: 'Token name or search query', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    values: { type: 'boolean', description: 'Show theme values for the first match', default: false },
    all: { type: 'boolean', description: 'Include HSL decomposition tokens', default: false },
    limit: { type: 'string', description: 'Max results to show (0 = no limit, default 20)', default: '20' },
  },
  run({ args }) {
    const format = (args.format || 'minimal') as Format;
    const limit = Number(args.limit);
    const { tokens } = getContext();
    const { results } = searchTokens(args.name, tokens as TokensData, { includeHsl: args.all });

    if (results.length === 0) {
      console.error(`No token found matching "${args.name}".`);
      process.exit(1);
    }

    // --values: show full detail for the first match
    if (args.values) {
      console.log(formatTokenOutput(results[0], format));
      return;
    }

    // Default: list token names
    if (format === 'json') {
      const output = limit ? results.slice(0, limit) : results;
      console.log(JSON.stringify(output.map((r: SearchResult) => r.name), null, 2));
      return;
    }

    const shown = limit ? results.slice(0, limit) : results;
    shown.forEach((r: SearchResult) => console.log(r.name));
    if (limit && results.length > limit) {
      console.log(`\n... and ${results.length - limit} more (${results.length} total).`);
      console.log('\n---------------------------------------------------------------');
      console.log('  Tip: To view all results, add --limit 0');
      console.log('---------------------------------------------------------------');
    }
  },
});
