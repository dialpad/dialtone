// ============================================================================
// OUTPUT FORMATTERS
// ============================================================================

import Table from 'cli-table3';
import type {
  SearchResult,
  ComponentProp,
  ComponentEvent,
  ComponentSlot,
  ValueObject,
  ThemeData,
  Component,
} from '@dialpad/dialtone-query-core';

export type Format = 'minimal' | 'markdown' | 'json';

// ── Table helper ────────────────────────────────────────────────────────────

function makeTable(head: string[], rows: string[][], colWidths?: number[]): string {
  const table = new Table({
    head,
    ...(colWidths ? { colWidths } : {}),
    wordWrap: true,
    wrapOnWordBoundary: true,
  });
  rows.forEach(r => table.push(r));
  return table.toString();
}

// ── Props / Events / Slots tables ───────────────────────────────────────────

export function propsTable(props: ComponentProp[], describe = false): string {
  if (!props.length) return 'No props.';

  if (describe) {
    return makeTable(
      ['Prop', 'Type', 'Description', 'Values'],
      props.map(p => [
        p.name,
        p.type?.name || '',
        (p.description || '').replace(/\n/g, ' '),
        p.values?.join(', ') || '',
      ]),
      [22, 22, 52, 32],
    );
  }

  return makeTable(
    ['Prop', 'Type', 'Values'],
    props.map(p => [
      p.name,
      p.type?.name || '',
      p.values?.join(', ') || '',
    ]),
    [22, 22, 42],
  );
}

export function eventsTable(events: ComponentEvent[]): string {
  if (!events.length) return 'No events.';
  return makeTable(['Event'], events.map(e => [e.name]));
}

export function slotsTable(slots: ComponentSlot[]): string {
  if (!slots.length) return 'No slots.';
  return makeTable(['Slot'], slots.map(s => [s.name]));
}

// ── Minimal (plain text) formatters ─────────────────────────────────────────

function minimalSearchResults(results: SearchResult[]): string {
  if (results.length === 0) return 'No results found.';

  return results.map((r, i) => {
    const tag = r.type === 'component' ? 'component'
      : r.type === 'design-token' ? 'token'
      : r.type === 'icon' ? 'icon'
      : 'class';
    return `${i + 1}. [${tag}] ${r.name}`;
  }).join('\n');
}

function minimalComponent(result: SearchResult, describe = false): string {
  const lines: string[] = [];
  lines.push(result.name);

  if (result.details.description) {
    lines.push(result.details.description);
  }

  if (result.details.props?.length) {
    lines.push('', 'Props:');
    lines.push(propsTable(result.details.props, describe));
  }

  if (result.details.events?.length) {
    lines.push('', 'Events:');
    lines.push(eventsTable(result.details.events));
  }

  if (result.details.slots?.length) {
    lines.push('', 'Slots:');
    lines.push(slotsTable(result.details.slots));
  }

  lines.push('', `Import: import { ${result.name} } from '@dialpad/dialtone-vue'`);

  return lines.join('\n');
}

function minimalToken(result: SearchResult): string {
  const lines: string[] = [result.name];
  const themes = Object.entries(result.details.allThemes || {}) as [string, ThemeData][];
  for (const [theme, data] of themes.slice(0, 3)) {
    if (theme === 'metadata') continue;
    const val = data?.value ?? 'N/A';
    lines.push(`  ${theme}: ${val}`);
  }
  if (themes.length > 3) {
    lines.push(`  ... and ${themes.length - 3} more themes`);
  }
  lines.push(`  Usage: var(${result.name})`);
  return lines.join('\n');
}

// ── Markdown formatters ─────────────────────────────────────────────────────

function markdownSearchResults(results: SearchResult[]): string {
  if (results.length === 0) return 'No results found.';

  return results.map((r, i) => {
    const tag = r.type === 'component' ? 'component'
      : r.type === 'design-token' ? 'token'
      : r.type === 'icon' ? 'icon'
      : 'class';
    let line = `${i + 1}. **${r.name}** _(${tag})_`;
    if (r.type === 'component' && r.details.description) {
      line += ` — ${r.details.description}`;
    }
    return line;
  }).join('\n');
}

function markdownPropsTable(props: ComponentProp[]): string {
  const lines = ['| Prop | Type | Description | Values |', '|------|------|-------------|--------|'];
  props.forEach((p: ComponentProp) => {
    const type = p.type?.name || 'unknown';
    const desc = (p.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const values = (p.values || []).join(', ').replace(/\|/g, '\\|');
    lines.push(`| ${p.name} | ${type} | ${desc} | ${values} |`);
  });
  return lines.join('\n');
}

function markdownComponent(result: SearchResult): string {
  const lines: string[] = [];
  lines.push(`# ${result.name}`);
  if (result.details.description) {
    lines.push('', result.details.description);
  }

  if (result.details.props?.length) {
    lines.push('', '## Props', '');
    lines.push(markdownPropsTable(result.details.props));
  }

  if (result.details.events?.length) {
    lines.push('', '## Events', '');
    result.details.events.forEach((e: ComponentEvent) => {
      lines.push(`- \`${e.name}\``);
    });
  }

  if (result.details.slots?.length) {
    lines.push('', '## Slots', '');
    result.details.slots.forEach((s: ComponentSlot) => {
      lines.push(`- \`${s.name}\``);
    });
  }

  lines.push('', '## Usage', '', '```vue', `import { ${result.name} } from '@dialpad/dialtone-vue'`, '```');
  return lines.join('\n');
}

function markdownToken(result: SearchResult): string {
  const lines: string[] = [`# ${result.name}`, ''];
  const themes = Object.entries(result.details.allThemes || {}) as [string, ThemeData][];
  lines.push('| Theme | Value |');
  lines.push('|-------|-------|');
  for (const [theme, data] of themes) {
    if (theme === 'metadata') continue;
    const val = data?.value ?? 'N/A';
    lines.push(`| ${theme} | ${val} |`);
  }
  lines.push('', '```css', `color: var(${result.name});`, '```');
  return lines.join('\n');
}

// ── Prompt formatter (LLM-optimized) ────────────────────────────────────────

export function formatPrompt(component: Component): string {
  const lines: string[] = [];
  lines.push(`<${component.displayName}>`);

  if (component.description) {
    // Truncate to first sentence. Only split after a period followed by
    // whitespace and an uppercase letter (actual sentence boundary).
    // Avoids splitting on abbreviations like "e.g.", "i.e.", "etc."
    const firstSentence = component.description.split(/\.(?=\s+[A-Z])/)[0];
    lines.push(firstSentence.endsWith('.') ? firstSentence : firstSentence + '.');
  }

  if (component.props?.length) {
    const propList = component.props.slice(0, 8).map((p: ComponentProp) => {
      const type = p.type?.name || '?';
      return `${p.name}:${type}`;
    });
    lines.push(`Props: ${propList.join(', ')}`);
    if (component.props.length > 8) {
      lines.push(`(+${component.props.length - 8} more)`);
    }
  }

  if (component.slots?.length) {
    lines.push(`Slots: ${component.slots.map((s: ComponentSlot) => s.name).join(', ')}`);
  }

  if (component.events?.length) {
    lines.push(`Events: ${component.events.map((e: ComponentEvent) => e.name).join(', ')}`);
  }

  lines.push(`Import: import { ${component.displayName} } from '@dialpad/dialtone-vue'`);
  return lines.join('\n');
}

// ── Public API ──────────────────────────────────────────────────────────────

export function formatSearchOutput(results: SearchResult[], format: Format): string {
  if (format === 'json') return JSON.stringify(results, null, 2);
  if (format === 'markdown') return markdownSearchResults(results);
  return minimalSearchResults(results);
}

export function formatComponentOutput(result: SearchResult, format: Format, filter?: 'props' | 'events' | 'examples', options?: { describe?: boolean }): string {
  if (format === 'json') {
    if (filter === 'props') return JSON.stringify(result.details.props || [], null, 2);
    if (filter === 'events') return JSON.stringify(result.details.events || [], null, 2);
    return JSON.stringify(result, null, 2);
  }

  if (filter === 'props') {
    if (format === 'markdown') return markdownPropsTable(result.details.props || []);
    return propsTable(result.details.props || [], options?.describe);
  }

  if (filter === 'events') {
    if (format === 'markdown') {
      return (result.details.events || []).map((e: ComponentEvent) => `- \`${e.name}\``).join('\n') || 'No events.';
    }
    return eventsTable(result.details.events || []);
  }

  if (filter === 'examples') {
    return `import { ${result.name} } from '@dialpad/dialtone-vue'\n\n<${result.name} />`;
  }

  if (format === 'markdown') return markdownComponent(result);
  return minimalComponent(result, options?.describe);
}

export function formatTokenOutput(result: SearchResult, format: Format): string {
  if (format === 'json') return JSON.stringify(result, null, 2);
  if (format === 'markdown') return markdownToken(result);
  return minimalToken(result);
}
