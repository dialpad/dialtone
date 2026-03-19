import { defineCommand } from 'citty';
import { searchComponents } from '@dialpad/dialtone-query-core';
import type { Component } from '@dialpad/dialtone-query-core';
import { getContext } from '../context.js';
import { formatPrompt } from '../formatters.js';

export const promptCommand = defineCommand({
  meta: { name: 'prompt', description: 'Emit a compact LLM-optimized context block for a component' },
  args: {
    name: { type: 'positional', description: 'Component name', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
  },
  run({ args }) {
    const { components } = getContext();
    const { results } = searchComponents(args.name, components);

    if (results.length === 0) {
      console.error(`No component found matching "${args.name}".`);
      process.exit(1);
    }

    const result = results[0];
    const format = args.format || 'minimal';

    if (format === 'json') {
      // Emit a structured JSON block optimized for LLM context
      const component = {
        name: result.name,
        description: result.details.description,
        props: result.details.props?.map((p: { name: string; type?: { name: string } }) => ({
          name: p.name,
          type: p.type?.name,
        })),
        slots: result.details.slots?.map((s: { name: string }) => s.name),
        events: result.details.events?.map((e: { name: string }) => e.name),
        import: `import { ${result.name} } from '@dialpad/dialtone-vue'`,
      };
      console.log(JSON.stringify(component, null, 2));
      return;
    }

    // Build the Component object for the prompt formatter
    const comp: Component = {
      displayName: result.name,
      description: result.details.description,
      props: result.details.props,
      events: result.details.events,
      slots: result.details.slots,
    };

    console.log(formatPrompt(comp));
  },
});
