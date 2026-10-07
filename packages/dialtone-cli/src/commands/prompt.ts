import { defineCommand } from 'citty';
import { componentImportStatement } from '@dialpad/dialtone-query-core';
import type { Component } from '@dialpad/dialtone-query-core';
import { requireComponent } from '../select-component.js';
import { getContext } from '../context.js';
import { formatPrompt } from '../formatters.js';

export const promptCommand = defineCommand({
  meta: { name: 'prompt', description: 'Emit a compact LLM-optimized context block for a component' },
  args: {
    name: { type: 'positional', description: 'Component name', required: true },
    format: { type: 'string', description: 'Output format: minimal, markdown, json', default: 'minimal' },
  },
  run({ args }) {
    const { components, componentImportPath: importFrom } = getContext();
    const result = requireComponent(args.name, components);
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
        identity: result.details.identity,
        import: componentImportStatement(result.details.identity, importFrom),
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
      identity: result.details.identity,
    };

    console.log(formatPrompt(comp, importFrom));
  },
});
