import { defineCommand } from 'citty';
import { searchComponents } from '@dialpad/dialtone-query-core';
import type { ComponentProp } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';
import { formatComponentOutput, propsTable, eventsTable, slotsTable, type Format } from '../formatters.js';

function formatSingleProp(prop: ComponentProp): string {
  const lines: string[] = [];
  lines.push(prop.name);
  lines.push(`  Type: ${prop.type?.name || 'unknown'}`);
  if (prop.description) {
    lines.push(`  ${prop.description}`);
  }
  if (prop.values?.length) {
    lines.push('');
    lines.push('  Values:');
    prop.values.forEach(v => lines.push(`    ${v}`));
  }
  return lines.join('\n');
}

export const componentCommand = defineCommand({
  meta: { name: 'component', description: 'Show full component docs' },
  args: {
    name: { type: 'positional', description: 'Component name', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
    props: { type: 'boolean', description: 'Show all props', default: false },
    prop: { type: 'string', description: 'Show details for a specific prop' },
    events: { type: 'boolean', description: 'Show events/emits only', default: false },
    slots: { type: 'boolean', description: 'Show slots only', default: false },
    examples: { type: 'boolean', description: 'Show usage examples only', default: false },
    describe: { type: 'boolean', description: 'Include descriptions in props table', default: false },
  },
  run({ args }) {
    const format = (args.format || 'minimal') as Format;
    const { components } = getContext();
    const { results } = searchComponents(args.name, components);

    if (results.length === 0) {
      console.error(`No component found matching "${args.name}".`);
      process.exit(1);
    }

    const result = results[0];

    // --prop <name>: single prop lookup
    if (args.prop) {
      const allProps: ComponentProp[] = result.details.props || [];
      const match = allProps.find(
        (p: ComponentProp) => p.name.toLowerCase() === args.prop!.toLowerCase(),
      );
      if (!match) {
        console.error(`No prop "${args.prop}" on ${result.name}.`);
        console.error(`Available: ${allProps.map((p: ComponentProp) => p.name).join(', ')}`);
        process.exit(1);
      }
      if (format === 'json') {
        console.log(JSON.stringify(match, null, 2));
      } else {
        console.log(formatSingleProp(match));
      }
      return;
    }

    // --props: props table only
    if (args.props) {
      if (format === 'json') {
        console.log(JSON.stringify(result.details.props || [], null, 2));
      } else {
        console.log(propsTable(result.details.props || [], args.describe));
      }
      return;
    }

    // --events: events table only
    if (args.events) {
      if (format === 'json') {
        console.log(JSON.stringify(result.details.events || [], null, 2));
      } else {
        console.log(eventsTable(result.details.events || []));
      }
      return;
    }

    // --slots: slots table only
    if (args.slots) {
      if (format === 'json') {
        console.log(JSON.stringify(result.details.slots || [], null, 2));
      } else {
        console.log(slotsTable(result.details.slots || []));
      }
      return;
    }

    // --examples
    if (args.examples) {
      console.log(formatComponentOutput(result, format, 'examples'));
      return;
    }

    // Default: full component view
    console.log(formatComponentOutput(result, format, undefined, { describe: args.describe }));
  },
});
