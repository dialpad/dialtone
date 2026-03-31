import { defineCommand } from 'citty';
import { searchUtilityClasses } from '@dialpad/dialtone-query-core';
import type { SearchResult, ValueObject } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';
import { type Format } from '../formatters.js';

export const utilityCommand = defineCommand({
  meta: { name: 'utility', description: 'Search CSS utility classes' },
  args: {
    query: { type: 'positional', description: 'CSS property/value to search', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    limit: { type: 'string', description: 'Max results to show (0 = no limit, default 20)', default: '20' },
  },
  run({ args }) {
    const format = (args.format || 'minimal') as Format;
    const limit = Number(args.limit);
    const { utilityClasses } = getContext();
    const { results, notes } = searchUtilityClasses(args.query, utilityClasses);

    if (results.length === 0) {
      console.error(`No utility classes found matching "${args.query}".`);
      process.exit(1);
    }

    if (format === 'json') {
      const output = limit ? results.slice(0, limit) : results;
      console.log(JSON.stringify(output, null, 2));
      return;
    }

    const shown = limit ? results.slice(0, limit) : results;

    if (format === 'markdown') {
      shown.forEach((r: SearchResult) => {
        const props = r.details.properties
          .map((p: ValueObject) => `\`${p.prop}: ${p.value}\``)
          .join(', ');
        console.log(`- **${r.name}** — ${props}`);
      });
    } else {
      // Calculate column widths for table
      const nameWidth = Math.max(5, ...shown.map((r: SearchResult) => r.name.length));
      console.log(`  ${'Class'.padEnd(nameWidth)}  Properties`);
      console.log(`  ${'─'.repeat(nameWidth)}  ${'─'.repeat(40)}`);
      shown.forEach((r: SearchResult) => {
        const props = r.details.properties
          .map((p: ValueObject) => `${p.prop}: ${p.value}`)
          .join('; ');
        console.log(`  ${r.name.padEnd(nameWidth)}  ${props}`);
      });
    }

    if (limit && results.length > limit) {
      console.log(`\n... and ${results.length - limit} more (${results.length} total).`);
      console.log('\n---------------------------------------------------------------');
      console.log('  Tip: To view all results, add --limit 0');
      console.log('---------------------------------------------------------------');
    }

    if (notes.length > 0) {
      console.log('');
      notes.forEach(n => console.log(`Note: ${n}`));
    }
  },
});
