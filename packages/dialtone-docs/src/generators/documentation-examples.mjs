import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDirectives, trimBlankLines } from '../../../../apps/dialtone-documentation/docs/.vuepress/plugins/fenced-demo-shared.js';
import { readPublicComponentExports, withComponentIdentity } from '../../../../scripts/lib/vue-component-identity.mjs';
import { normalizeComponentName } from '../../../../scripts/lib/component-name.mjs';
import { getProfile } from '../../../../scripts/retrieval/profiles.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const require = createRequire(resolve(root, 'apps/dialtone-documentation/package.json'));
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt({ html: true });
// Opt-in assembly metadata; live example markup remains solely in the source page.
const selected = {
  'examples/button-default': {
    components: ['DtButton', 'DtStack'], directives: [],
    responsibilities: 'Add application click handlers for real actions; retain meaningful button text.',
    interaction: 'Check Tab order, visible focus, Enter/Space activation and accessible names; the three importance variants share the same interaction pattern.',
  },
  'examples/button-disabled-tooltip': {
    components: ['DtButton', 'DtStack'], directives: ['DtTooltipDirective'],
    responsibilities: 'The source uses both native disabled and a focusable span wrapping an aria-disabled button. The class and aria-disabled do not themselves prevent application actions; consumers must prevent disabled actions in their handlers. The wrapper remains literal source markup.',
    interaction: 'Check wrapper focus, tooltip on keyboard focus/hover, Escape dismissal, accessible name/description relationship and disabled-action prevention before recommending this pattern.',
  },
};
const profile = getProfile('dt10-pinned');
const evidence = JSON.parse(readFileSync(new URL('./example-validation.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');

/** Selected IDs are authored beside fences; neither section names nor fence order select them. */
export function buildExampleRecords({ rawFile, sections, records, filePath, vuePackage }) {
  const result = [];
  for (const [sectionIndex, section] of sections.entries()) {
    const tokens = markdown.parse(section.raw, {});
    for (const [index, token] of tokens.entries()) {
      const marker = token.type === 'html_block' && token.content.trim().match(/^<!-- example-id: (examples\/[a-z0-9-]+) -->$/);
      if (!marker) continue;
      const id = marker[1];
      const definition = selected[id];
      if (!definition) throw new Error(`Unconfigured example ID: ${id}`);
      if (result.some(record => record.id === id)) throw new Error(`Duplicate example ID: ${id}`);
      const fence = tokens[index + 1];
      if (fence?.type !== 'fence' || !/^vue\s+demo(?:-only)?$/.test(fence.info.trim())) throw new Error(`Example ${id} must precede a live Vue demo fence`);
      const lines = fence.content.split('\n');
      const directives = parseDirectives(lines, fence.info.trim().split(/\s+/)[1]);
      if (directives.onlyShow === 'code') throw new Error(`Example ${id} has no live demo`);
      const end = directives.codeSeparatorIndex < 0 ? lines.length : directives.codeSeparatorIndex;
      const template = trimBlankLines(lines.slice(0, end).filter((_, line) => !directives.directiveLines.has(line)).join('\n'));
      if (/\{props\}/.test(template)) throw new Error(`Example ${id} contains a placeholder`);
      const names = definition.components;
      const markup = template.replace(/<!--[\s\S]*?-->/g, '');
      const usedComponents = [...markup.matchAll(/<(dt-[a-z0-9-]+|Dt[A-Z][A-Za-z0-9]*)(?=[\s/>])/g)]
        .map(match => match[1]);
      const usedDirectives = [...markup.matchAll(/\sv-(dt-[a-z0-9-]+)/g)].map(match => match[1]);
      const missing = [
        ...usedComponents.filter(name => !names.some(declared =>
          normalizeComponentName(declared) === normalizeComponentName(name))),
        ...usedDirectives.filter(name => !definition.directives.some(declared => normalizeComponentName(declared) === normalizeComponentName(`${name}-directive`))).map(name => `v-${name}`),
      ];
      if (missing.length) throw new Error(`Example ${id} uses unconfigured ${[...new Set(missing)].join(', ')}`);
      const vueRoot = resolve(root, 'packages/dialtone-vue');
      const exports = readPublicComponentExports(vueRoot);
      const identities = [...exports].map(([file]) => withComponentIdentity({ displayName: '' }, file, exports, vueRoot, vuePackage).identity);
      const components = names.map(name => {
        const identity = identities.find(identity => identity.canonicalName === name && identity.kind === 'public');
        if (!identity) throw new Error(`Missing public identity for ${name}`);
        return identity;
      });
      const files = {
        'package.json': JSON.stringify({
          name: 'dialtone-button-example', private: true, type: 'module',
          scripts: { dev: 'vite', build: 'vite build' }, dependencies: profile.dependencies,
          devDependencies: { vite: '8.0.3', '@vitejs/plugin-vue': '6.0.5' },
        }, null, 2) + '\n',
        'vite.config.js': 'import { defineConfig } from \'vite\';\nimport vue from \'@vitejs/plugin-vue\';\nexport default defineConfig({ plugins: [vue()] });\n',

        'App.vue': `<script setup>\nimport { ${names.join(', ')} } from '@dialpad/dialtone/vue';\n</script>\n\n<template>\n${template}\n</template>\n`,
        'main.js': `import { createApp } from 'vue';\n${definition.directives.length ? `import { ${definition.directives.join(', ')} } from '@dialpad/dialtone/vue';\n` : ''}import '@dialpad/dialtone/css';\nimport '@dialpad/dialtone/css-default-theme';\nimport App from './App.vue';\n\nconst app = createApp(App);\n${definition.directives.map(name => `app.use(${name});\n`).join('')}app.mount('#app');\n`,
        'index.html': '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><title>Dialtone Button example</title></head><body><div id="app"></div><script type="module" src="/main.js"></script></body></html>\n',
      };
      const sourceHash = hash(rawFile);
      const payloadHash = hash(JSON.stringify({ files, dependencies: profile.dependencies, sourceHash }));
      const validation = evidence[id]?.payloadHash === payloadHash ? evidence[id] : { payloadHash, consumerBuild: 'unverified' };
      const source = records[sectionIndex];
      const content = [
        `# ${id}`,
        `Source: ${filePath} — ${section.headingPath.join(' > ')} (${source.id}). SHA-256: ${sourceHash}.`,
        `Consumer profile: ${profile.id}. Exact pins: ${Object.entries(profile.dependencies).map(([name, version]) => `${name}@${version}`).join(', ')}. Other installations are unverified.`,
        `Language: Vue 3 JavaScript SFC. CSS and default theme are imported in main.js. ${definition.directives.length ? `Register ${definition.directives.join(', ')} with app.use; these are directive plugins, not components.` : 'Components are imported locally; no plugin is needed.'}`,
        'Setup: copy all five files below into an empty directory. Run npm install, npm run build and npm run dev. package.json pins the consumer dependencies and Vite SFC build tooling; main.js includes component, directive and CSS/theme setup.',
        `State/events: no external state or hidden handlers. These display examples do not place a call. ${definition.responsibilities}`,
        `Validation: consumer build ${validation.consumerBuild}; API/export/deprecation checks ${validation.api ?? 'unverified'}. Validation is tied to payload SHA-256 ${payloadHash}.`,
        `Interaction/accessibility: manual browser, keyboard and screen-reader review pending; reviewer and browser/AT versions not yet recorded. ${definition.interaction}`,
        ...Object.entries(files).map(([name, code]) => `## ${name}\n\n\`\`\`${name.endsWith('.vue') ? 'vue' : name.endsWith('.html') ? 'html' : name.endsWith('.json') ? 'json' : 'js'}\n${code}\`\`\``),
      ].join('\n\n');
      result.push({ ...source, id, category: 'examples', content, example: {
        source: {
          id: source.id, filePath, headingPath: section.headingPath, hash: sourceHash,
          package: vuePackage.name, version: vuePackage.version,
        },
        components, directives: definition.directives,
        profile: { id: profile.id, dependencies: profile.dependencies }, validation,
        manualReview: 'pending',
      } });
    }
  }
  return result;
}
