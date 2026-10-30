import { createHash } from 'node:crypto';
import MarkdownIt from 'markdown-it';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDirectives, trimBlankLines } from '../../../../apps/dialtone-documentation/docs/.vuepress/plugins/fenced-demo-shared.js';
import { readPublicComponentExports, withComponentIdentity } from '../../../../scripts/lib/vue-component-identity.mjs';
import { normalizeComponentName } from '../../../../scripts/lib/component-name.mjs';
import { getProfile } from '../../../../scripts/retrieval/profiles.mjs';
import matter from 'gray-matter';
import { assertTemplateBindings, assertStaticHtml, sourceSetup, componentTags } from './example-template.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
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
  'examples/loader-default': {
    components: ['DtLoader'], directives: [],
    responsibilities: 'Provide a meaningful loading label when the default loading label is insufficient.',
    interaction: 'Presentational loading indicator; no application action or keyboard interaction is supplied.',
  },
  'examples/loader-sizes': {
    components: ['DtLoader', 'DtStack'], directives: [],
    responsibilities: 'DtStack is layout setup, not the subject of this example. Verify supported sizes against the selected installed API.',
    interaction: 'Presentational size comparison; no application action or keyboard interaction is supplied.',
  },
  'examples/toggle-base-styles': {
    components: ['DtToggle', 'DtStack'], directives: [],
    responsibilities: 'Source fixture only. The source fieldset has no legend; supply appropriate grouping and application state/actions before adopting it.',
    interaction: 'Check names, switch states, disabled behavior and keyboard activation. This fixture does not demonstrate application side effects.',
  },
  'examples/toggle-sizes': {
    components: ['DtToggle', 'DtStack'], directives: [],
    responsibilities: 'Source fixture only. The source fieldset has no legend; provide an appropriate group label and application state/actions.',
    interaction: 'Check names, focus, switch state and keyboard activation. Size comparison is not a complete settings form.',
  },
  'examples/toggle-v-model': {
    components: ['DtToggle'], directives: [], state: ['checked'],
    responsibilities: 'The authored ref(false) supplies local checked state. Connect real application side effects separately.',
    interaction: 'Check label, focus, switch state and keyboard activation; no persistence or remote action is supplied.',
  },
  'examples/utility-word-wrap-normal': {
    components: [], directives: [], representation: 'static-html', utilities: ['d-ww-normal'],
    responsibilities: 'Load Dialtone CSS and its default theme; preserve the source context. The unrelated page-table script is not required.',
  },
};
export const selectedExampleIds = Object.keys(selected);
const profile = getProfile('dt10-pinned');
const evidence = JSON.parse(readFileSync(new URL('./example-validation.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
let publicExports;

/** Evidence follows the delivered files (including tool pins), not unrelated source-page edits. */
export function payloadHash({ files, dependencies }) {
  return hash(JSON.stringify({ files, dependencies }));
}

function candidateSyntax(token, rawFile, id, filePath) {
  let template;
  try {
    template = liveTemplate('coverage candidate', token);
  } catch (error) {
    return { kind: 'unsupported-source-syntax', reason: error.message };
  }
  try {
    assertStaticHtml(template);
    return { kind: 'static-html-candidate' };
  } catch (error) {
    if (error.code === 'unsupported-inline-tag') return { kind: 'unsupported-source-syntax', reason: error.message };
    if (filePath.includes('/utilities/')) return { kind: 'needs-static-representation', reason: error.message };
  }
  try {
    assertTemplateBindings(template, sourceSetup(rawFile, selected[id]?.state));
    return { kind: 'vue-template-candidate', componentTags: componentTags(template) };
  } catch (error) {
    return { kind: 'needs-authored-setup', reason: error.message };
  }
}

export function buildExampleCoverage({ rawFile, filePath, records }) {
  const { data, content } = matter(rawFile);
  const tokens = markdown.parse(content, {});
  const lineOffset = rawFile.slice(0, rawFile.length - content.length).split('\n').length - 1;
  const exclusion = /\/scratch[^/]*\.md$/.test(filePath) ? 'scratch source'
    : filePath.endsWith('.mdx') ? 'MDX markers not supported'
      : ['planned', 'beta', 'wip'].includes(String(data.status).toLowerCase()) ? 'not-ready source' : null;
  const deliveredIds = records.filter(record => record.example).map(record => record.id);
  const candidates = [];
  let referenceCandidates = 0;
  for (const [index, token] of tokens.entries()) {
    if (token.type === 'fence' && /^vue\s+demo(?:-only)?$/.test(token.info.trim())) {
      const directives = parseDirectives(token.content.split('\n'), token.info.trim().split(/\s+/)[1]);
      if (directives.onlyShow === 'code') {
        referenceCandidates++;
        continue;
      }
      const id = tokens[index - 1]?.content?.trim().match(/^<!-- example-id: (examples\/[a-z0-9-]+) -->$/)?.[1] ?? null;
      candidates.push({
        sourceLine: token.map[0] + 1 + lineOffset, id, displayTwin: directives.codeSeparatorIndex >= 0,
        syntax: candidateSyntax(token, rawFile, id, filePath),
        disposition: exclusion ? 'excluded' : deliveredIds.includes(id) ? 'delivered' : 'remaining' });
    } else if (token.type === 'fence' || (token.type === 'html_block' && /<(?:example-|div\b|p\b|dt-)/.test(token.content))) referenceCandidates++;
  }
  const remaining = candidates.filter(candidate => candidate.disposition === 'remaining').length;
  return {
    filePath, sourceHash: hash(rawFile), exclusion, liveCandidates: candidates.length,
    referenceCandidates, deliveredIds, remaining,
    complete: !exclusion && candidates.length > 0 && remaining === 0 && referenceCandidates === 0, candidates };
}

/** Live demo markup before any @code separator, without fence directive lines. */
function liveTemplate(id, fence) {
  if (fence?.type !== 'fence' || !/^vue\s+demo(?:-only)?$/.test(fence.info.trim())) throw new Error(`Example ${id} must precede a live Vue demo fence`);
  const lines = fence.content.split('\n');
  const fenceDirectives = parseDirectives(lines, fence.info.trim().split(/\s+/)[1]);
  if (fenceDirectives.onlyShow === 'code') throw new Error(`Example ${id} has no live demo`);
  const end = fenceDirectives.codeSeparatorIndex < 0 ? lines.length : fenceDirectives.codeSeparatorIndex;
  const template = trimBlankLines(lines.slice(0, end).filter((_, line) => !fenceDirectives.directiveLines.has(line)).join('\n'));
  if (/\{props\}/.test(template)) throw new Error(`Example ${id} contains a placeholder`);
  return template;
}

/** Every Dialtone component and directive in the live markup must be declared for assembly. */
function assertDeclaredUsage(id, template, definition) {
  const markup = template.replace(/<!--[\s\S]*?-->/g, '');
  const declared = (names, name) => names.some(other => normalizeComponentName(other) === normalizeComponentName(name));
  const missing = [
    ...componentTags(markup)
      .filter(name => !declared([...definition.components, ...(definition.icons ?? [])], name)),
    ...[...markup.matchAll(/\sv-(dt-[a-z0-9-]+)/g)].map(match => match[1])
      .filter(name => !declared(definition.directives, `${name}-directive`)).map(name => `v-${name}`),
  ];
  if (missing.length) throw new Error(`Example ${id} uses unconfigured ${[...new Set(missing)].join(', ')}`);
}

export function publicIdentities(vuePackage) {
  const vueRoot = resolve(root, 'packages/dialtone-vue');
  publicExports ??= readPublicComponentExports(vueRoot);
  return [...publicExports].map(([file]) => withComponentIdentity({ displayName: '' }, file, publicExports, vueRoot, vuePackage).identity);
}

/** The five consumer files, in the order the payload hash binds. */
function consumerFiles(names, template, directives, setup = '', id = 'examples/button-default', icons = []) {
  const button = id.startsWith('examples/button-');
  return {
    'package.json': JSON.stringify({
      name: button ? 'dialtone-button-example' : id.startsWith('examples/presets/') ? 'dialtone-preset-example' : `dialtone-${id.slice('examples/'.length)}-example`, private: true, type: 'module',
      scripts: { dev: 'vite', build: 'vite build' }, dependencies: profile.dependencies,
      devDependencies: { vite: '8.0.3', '@vitejs/plugin-vue': '6.0.5' },
    }, null, 2) + '\n',
    'vite.config.js': 'import { defineConfig } from \'vite\';\nimport vue from \'@vitejs/plugin-vue\';\nexport default defineConfig({ plugins: [vue()] });\n',
    'App.vue': `<script setup>\nimport { ${names.join(', ')} } from '@dialpad/dialtone/vue';\n${icons.length ? `import { ${icons.join(', ')} } from '@dialpad/dialtone-icons/vue';\n` : ''}${setup}</script>\n\n<template>\n${template}\n</template>\n`,
    'main.js': `import { createApp } from 'vue';\n${directives.length ? `import { ${directives.join(', ')} } from '@dialpad/dialtone/vue';\n` : ''}import '@dialpad/dialtone/css';\nimport '@dialpad/dialtone/css-default-theme';\nimport App from './App.vue';\n\nconst app = createApp(App);\n${directives.map(name => `app.use(${name});\n`).join('')}app.mount('#app');\n`,
    'index.html': `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><title>${button ? 'Dialtone Button example' : 'Dialtone source example'}</title></head><body><div id="app"></div><script type="module" src="/main.js"></script></body></html>\n`,
  };
}

/** Shared assembly and payload-bound qualification for authored fences and materialized presets. */
export function assembleExampleRecord({ id, template, definition, rawFile = '', source, headingPath, filePath, vuePackage, sourceHash = hash(rawFile), sourcePackage }) {
  assertDeclaredUsage(id, template, definition);
  const setup = sourceSetup(rawFile, definition.state);
  const staticHtml = definition.representation === 'static-html';
  if (staticHtml) assertStaticHtml(template);
  else assertTemplateBindings(template, setup);
  const names = definition.components;
  const identities = publicIdentities(vuePackage);
  const components = names.map(name => {
    const identity = identities.find(identity => identity.canonicalName === name && identity.kind === 'public');
    if (!identity) throw new Error(`Missing public identity for ${name}`);
    return identity;
  });
  const files = staticHtml ? { 'example.html': template + '\n' } : consumerFiles(names, template, definition.directives, setup, id, definition.icons);
  const dependencies = staticHtml ? { '@dialpad/dialtone': profile.dependencies['@dialpad/dialtone'] } : profile.dependencies;
  const payload = payloadHash({ files, dependencies });
  const { run: savedRun, ...perExample } = evidence.examples[id] ?? {};
  const run = evidence.runs[savedRun];
  const saved = run ? { ...perExample, ...run } : undefined;
  const artifact = profile.artifacts[saved?.artifact?.package];
  const matchesProfile = saved?.profile === profile.id && artifact &&
    saved.artifact.version === artifact.version && saved.artifact.integrity === artifact.integrity;
  const savedValidation = saved?.payloadHash === payload && matchesProfile ? saved : { payloadHash: payload, consumerBuild: 'unverified' };
  const unverifiedPreset = definition.sourceKind === 'combinator-preset'
    && !(savedValidation.consumerBuild === 'built' && savedValidation.api === 'passed');
  const manual = savedValidation.manualReview;
  const manualPassed = manual?.status === 'passed' &&
    ['date', 'reviewer', 'browser', 'os', 'assistiveTechnology'].every(key => manual[key]);
  const validation = manual?.status === 'passed' && !manualPassed
    ? { ...savedValidation, manualReview: { ...manual, status: 'pending' } }
    : savedValidation;
  const manualSummary = manualPassed
    ? `reviewer-reported spot checks passed on ${manual.date} by ${manual.reviewer} (${manual.browser}; ${manual.os}; ${manual.assistiveTechnology}).`
    : 'manual browser, keyboard and screen-reader review pending; reviewer and browser/AT versions not yet recorded.';
  sourcePackage ??= staticHtml ? JSON.parse(readFileSync(resolve(root, 'packages/dialtone-css/package.json'), 'utf8')) : vuePackage;
  const content = staticHtml ? [
    `# ${id}`,
    `Source: ${filePath} — ${headingPath.join(' > ')} (${source.id}). SHA-256: ${sourceHash}.`,
    `Representation: authored static HTML. Utility subject: ${definition.utilities.join(', ')}.`,
    `Consumer profile: ${profile.id}; ${Object.entries(dependencies).map(([name, version]) => `${name}@${version}`).join(', ')}. Other installations are unverified.`,
    'Setup: include @dialpad/dialtone/css and @dialpad/dialtone/css-default-theme in the containing page using its existing asset setup. This is an HTML fragment, not a Vue application. No App.vue, main.js, Vue dependency or page script is supplied.',
    definition.responsibilities,
    `Validation: CSS ${validation.css ?? 'unverified'}; application build not applicable. Payload SHA-256: ${payload}. No browser/layout or assistive-technology result is claimed.`,
    ...(validation.missingClasses?.length ? [`Unverified source wrapper classes in the pinned stylesheet: ${validation.missingClasses.join(', ')}. Supply or verify the required responsive CSS before relying on that layout. The authored HTML is retained unchanged.`] : []),
    `## example.html\n\n\`\`\`html\n${files['example.html']}\`\`\``,
  ].join('\n\n') : [
    `# ${id}`,
    `Source: ${filePath} — ${headingPath.join(' > ')} (${definition.sourceKind === 'combinator-preset' ? 'provenance: ' : ''}${source.id}). SHA-256: ${sourceHash}.`,
    ...(definition.materializationVersion ? [`Materialization source: @dialpad/dialtone-vue@${definition.materializationVersion}. This source version can differ from the pinned consumer profile.`] : []),
    `Consumer profile: ${profile.id}. Exact pins: ${Object.entries(profile.dependencies).map(([name, version]) => `${name}@${version}`).join(', ')}. Other installations are unverified.`,
    `Language: Vue 3 JavaScript SFC. CSS and default theme are imported in main.js. ${definition.directives.length ? `Register ${definition.directives.join(', ')} with app.use; these are directive plugins, not components.` : 'Components are imported locally; no plugin is needed.'}`,
    unverifiedPreset
      ? 'Setup: this source fixture is not verified against the pinned dependencies; those versions may lack its components or APIs. To validate it, copy the five files into an empty directory and try npm install and npm run build before running npm run dev.'
      : 'Setup: copy all five files below into an empty directory. Run npm install, npm run build and npm run dev. package.json pins the consumer dependencies and Vite SFC build tooling; main.js includes component, directive and CSS/theme setup.',
    `State/events: ${setup ? 'Authored local state is included below; no hidden handlers.' : 'No external state or hidden handlers.'} ${definition.responsibilities}`,
    `Validation: consumer build ${validation.consumerBuild}; API/export/deprecation checks ${validation.api ?? 'unverified'}. Validation is tied to payload SHA-256 ${payload}.`,
    `Interaction/accessibility: ${manualSummary} ${definition.interaction}`,
    ...Object.entries(files).map(([name, code]) => `## ${name}\n\n\`\`\`${name.split('.').pop()}\n${code}\`\`\``),
  ].join('\n\n');
  return { ...source, id, category: 'examples', content, example: {
    source: {
      id: source.id, filePath, headingPath, hash: sourceHash,
      package: sourcePackage.name, version: sourcePackage.version,
      ...(definition.sourceKind ? { kind: definition.sourceKind, preset: definition.preset } : {}),
    },
    representation: staticHtml ? 'static-html' : 'vue-app',
    components, directives: definition.directives,
    ...(definition.icons?.length ? { icons: definition.icons } : {}),
    ...(staticHtml ? { utilities: definition.utilities } : {}),
    profile: { id: profile.id, dependencies }, validation,
    manualReview: staticHtml ? 'not-applicable' : manualPassed ? 'passed' : 'pending',
  } };
}

/** Selected IDs are authored beside fences; neither section names nor fence order select them. */
export function buildExampleRecords({ rawFile, sections, records, filePath, vuePackage }) {
  const result = [];
  for (const [sectionIndex, section] of sections.entries()) {
    if (!section.raw.includes('example-id:')) continue;
    const tokens = markdown.parse(section.raw, {});
    for (const [index, token] of tokens.entries()) {
      if (token.type !== 'html_block' || !token.content.includes('example-id:')) continue;
      const marker = token.content.trim().match(/^<!-- example-id: (examples\/[a-z0-9-]+) -->$/);
      if (!marker) throw new Error('Malformed example-id marker');
      const id = marker[1];
      const definition = selected[id];
      if (!definition) throw new Error(`Unconfigured example ID: ${id}`);
      if (result.some(record => record.id === id)) throw new Error(`Duplicate example ID: ${id}`);
      const template = liveTemplate(id, tokens[index + 1]);
      result.push(assembleExampleRecord({ id, template, definition, rawFile, source: records[sectionIndex],
        headingPath: section.headingPath, filePath, vuePackage }));
    }
  }
  return result;
}
