import { defineCommand } from 'citty';
import {
  utilityClasses, tokens, components, icons,
  searchUtilityClasses, searchTokens, searchComponents, searchIcons,
} from '@dialpad/dialtone-query-core';
import type { TokensData, IconsData, SearchResult } from '@dialpad/dialtone-query-core';
import { formatSearchOutput, type Format } from '../formatters.js';

function searchAll(query: string): { results: SearchResult[]; notes: string[] } {
  const classResults = searchUtilityClasses(query, utilityClasses);
  const tokenResults = searchTokens(query, tokens as TokensData);
  const componentResults = searchComponents(query, components);
  const iconResults = searchIcons(query, icons as IconsData);

  return {
    results: [
      ...componentResults.results,
      ...classResults.results,
      ...tokenResults.results,
      ...iconResults.results,
    ],
    notes: [
      ...componentResults.notes,
      ...classResults.notes,
      ...tokenResults.notes,
      ...iconResults.notes,
    ],
  };
}

export const searchCommand = defineCommand({
  meta: { name: 'search', description: 'Search components, tokens, and utilities. Use | for OR queries.' },
  args: {
    query: { type: 'positional', description: 'Search query (use | for OR, e.g. "input|select|menu")', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    limit: { type: 'string', description: 'Max results to show (0 = no limit, default 20)', default: '20' },
  },
  run({ args }) {
    const format = (args.format || 'minimal') as Format;
    const limit = Number(args.limit);

    // Support OR queries via pipe: "input|select|menu"
    const queries = args.query.split('|').map(q => q.trim()).filter(Boolean);

    let merged: SearchResult[];
    let notes: string[];

    if (queries.length > 1) {
      // OR logic: search each term separately, deduplicate by name
      const seen = new Set<string>();
      merged = [];
      notes = [];

      for (const q of queries) {
        const result = searchAll(q);
        for (const r of result.results) {
          if (!seen.has(r.name)) {
            seen.add(r.name);
            merged.push(r);
          }
        }
        notes.push(...result.notes);
      }
    } else {
      // Single query: AND logic (existing behavior)
      const result = searchAll(args.query);
      merged = result.results;
      notes = result.notes;
    }

    const all = limit ? merged.slice(0, limit) : merged;

    console.log(formatSearchOutput(all, format));

    if (format !== 'json') {
      if (limit && merged.length > limit) {
        console.log(`\n... and ${merged.length - limit} more (${merged.length} total).`);
        console.log('\n---------------------------------------------------------------');
        console.log('  Tip: To view all results, add --limit 0');
        console.log('---------------------------------------------------------------');
      }
      if (notes.length > 0) {
        // Deduplicate notes
        const unique = [...new Set(notes)];
        console.log('');
        unique.forEach(n => console.log(`Note: ${n}`));
      }
    }
  },
});
