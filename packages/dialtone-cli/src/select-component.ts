import { searchComponents } from '@dialpad/dialtone-query-core';
import type { Component, SearchResult } from '@dialpad/dialtone-query-core';

type ComponentSelection =
  | { ok: true; result: SearchResult; warning: string | null }
  | { ok: false; message: string };

const MAX_CANDIDATES = 10;

/**
 * Pick the one component `component` and `prompt` describe. Only an exact
 * name is selected; anything else lists candidates, even a single one,
 * because a wrong pick looks exactly like a right answer.
 */
export function selectComponent(name: string, components: Component[]): ComponentSelection {
  if (!name.trim()) {
    // An empty query would match every component.
    return { ok: false, message: 'Component name is empty.' };
  }
  const { results, exactMatch, warning } = searchComponents(name, components);
  if (exactMatch) {
    return { ok: true, result: results[0], warning };
  }
  const lines = results.length === 0
    ? [`No component found matching "${name}".`]
    : [`No component named "${name}". Did you mean:`, ...results.slice(0, MAX_CANDIDATES).map(r => `  ${r.name}`)];
  if (results.length > MAX_CANDIDATES) {
    lines.push(`  ... and ${results.length - MAX_CANDIDATES} more (${results.length} total).`);
  }
  if (warning) {
    lines.push(`Note: ${warning}`);
  }
  return { ok: false, message: lines.join('\n') };
}

/**
 * selectComponent for a command: on failure, prints the message and exits 1;
 * otherwise prints any warning to stderr and returns the component.
 */
export function requireComponent(name: string, components: Component[]): SearchResult {
  const selection = selectComponent(name, components);
  if (!selection.ok) {
    console.error(selection.message);
    process.exit(1);
  }
  if (selection.warning) {
    console.error(`Note: ${selection.warning}`);
  }
  return selection.result;
}
