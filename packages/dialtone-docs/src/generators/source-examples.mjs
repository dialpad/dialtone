import MarkdownIt from 'markdown-it';
import { NON_READY_STATUSES } from './source-sections.mjs';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeComponentName } from '../../../../scripts/lib/component-name.mjs';
import { checkTemplateApi, TemplateApiError } from '../../../../scripts/retrieval/example-consumer.mjs';
import { parseDirectives, trimBlankLines } from '../../../../apps/dialtone-documentation/docs/.vuepress/plugins/fenced-demo-shared.js';
import { baseParse, parserOptions, componentTags, sourceSetup, assertTemplateBindings, assertStaticHtml } from './example-template.mjs';

const markdown = new MarkdownIt({ html: true });
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const require = createRequire(resolve(root, 'packages/combinator/package.json'));
const fields = new Set(['id', 'key', 'state', 'responsibilities', 'interaction', 'representation', 'targetUtilities', 'exclude']);
const text = value => typeof value === 'string' && value.trim().length > 0;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
let sourceApi;

function apiContext() {
  sourceApi ??= {
    metadata: JSON.parse(readFileSync(resolve(root, 'packages/dialtone-vue/dist/component-documentation.json'), 'utf8')),
    icons: require('@dialpad/dialtone-icons/vue'),
    directives: [...readFileSync(resolve(root, 'packages/dialtone-vue/index.js'), 'utf8')
      .matchAll(/export \* from ['"]\.\/(directives\/[^'"]+)['"]/g)]
      .flatMap(match => [...readFileSync(resolve(root, 'packages/dialtone-vue', match[1], 'index.js'), 'utf8')
        .matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}/g)].map(entry => entry[1])),
  };
  return sourceApi;
}

function validateId(id, location) {
  if (typeof id !== 'string' || !/^examples\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+$/.test(id)
    || id.startsWith('examples/presets/') || id === 'examples/presets' || id.length > 256) {
    throw new Error(`${location}: invalid example ID; use a short lowercase slug path outside examples/presets`);
  }
  return id;
}

function metadata(token, location) {
  const match = token.content.trim().match(/^<!--\s*@example\s+([\s\S]*?)\s*-->$/);
  if (!match || match[1].includes('-->')) throw new Error(`${location}: @example must occupy its own HTML block`);
  let value;
  try { value = JSON.parse(match[1]); } catch { throw new Error(`${location}: malformed @example JSON`); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(`${location}: @example must be an object`);
  for (const key of Object.keys(value)) if (!fields.has(key)) throw new Error(`${location}: unknown @example field ${key}`);
  if (value.id !== undefined) validateId(value.id, location);
  if (value.key !== undefined && (typeof value.key !== 'string' || !slug.test(value.key))) throw new Error(`${location}: invalid example key`);
  if (value.id !== undefined && value.key !== undefined) throw new Error(`${location}: use either id or key`);
  for (const key of ['responsibilities', 'interaction']) {
    if (value[key] !== undefined && !text(value[key])) throw new Error(`${location}: ${key} must be nonempty text`);
  }
  for (const key of ['state', 'targetUtilities']) {
    if (value[key] !== undefined && (!Array.isArray(value[key]) || !value[key].length
      || value[key].some(entry => !text(entry)) || new Set(value[key]).size !== value[key].length)) throw new Error(`${location}: invalid ${key}`);
  }
  if (value.state?.some(name => !/^[A-Za-z_$][\w$]*$/.test(name))) throw new Error(`${location}: invalid state name`);
  if (value.representation !== undefined && value.representation !== 'static-html') throw new Error(`${location}: unsupported representation`);
  if (value.targetUtilities && value.representation !== 'static-html') throw new Error(`${location}: targetUtilities requires static-html`);
  if (value.representation === 'static-html' && !value.targetUtilities) throw new Error(`${location}: static-html requires targetUtilities`);
  if (value.exclude !== undefined) {
    if (!value.exclude || typeof value.exclude !== 'object' || Array.isArray(value.exclude)
      || Object.keys(value.exclude).some(key => !['reason', 'owner'].includes(key))
      || !text(value.exclude.reason) || !text(value.exclude.owner)
      || Object.keys(value).some(key => !['id', 'key', 'exclude'].includes(key))) throw new Error(`${location}: exclude requires reason and owner, without delivery fields`);
  }
  return value;
}

function liveFence(token) {
  return token.type === 'fence' && /^vue\s+demo(?:-only)?$/.test(token.info.trim());
}

function templateFrom(token) {
  const lines = token.content.split('\n');
  const directives = parseDirectives(lines, token.info.trim().split(/\s+/)[1]);
  if (directives.onlyShow === 'code') return null;
  const end = directives.codeSeparatorIndex < 0 ? lines.length : directives.codeSeparatorIndex;
  const template = trimBlankLines(lines.slice(0, end).filter((_, index) => !directives.directiveLines.has(index)).join('\n'));
  if (/\{props\}/.test(template)) throw new Error('Live source contains a placeholder');
  return { template, displayTwin: directives.codeSeparatorIndex >= 0 };
}

function definitionFor(candidate, options) {
  const { template, annotation } = candidate;
  const definition = { ...annotation, components: [], directives: [] };
  if (annotation.representation === 'static-html') {
    const classes = assertStaticHtml(template);
    if (annotation.targetUtilities.some(name => !classes.includes(name))) throw new Error('Static utility subject must appear literally in source classes');
    definition.utilities = annotation.targetUtilities;
    return { kind: 'static-html-candidate', definition };
  }
  try {
    assertStaticHtml(template);
    return { kind: 'static-html-candidate', reason: 'Static subject and property rules are not enabled for this source.' };
  } catch (error) {
    if (error.code === 'unsupported-inline-tag') return { kind: 'unsupported-source-syntax', reason: error.message };
  }
  if (options.filePath.includes('/utilities/')) return { kind: 'needs-static-representation', reason: 'Utility markup requires an authored static representation and semantic subject.' };
  try {
    assertTemplateBindings(template, sourceSetup(options.rawFile, annotation.state));
  } catch (error) {
    return { kind: 'needs-authored-setup', reason: error.message };
  }
  const context = apiContext();
  const names = componentTags(template);
  const used = [];
  const icons = [];
  for (const tag of names) {
    const identity = options.identities.find(identity => identity.kind === 'public'
      && [identity.canonicalName, ...identity.aliases].some(name =>
        normalizeComponentName(name) === normalizeComponentName(tag)));
    const icon = Object.keys(context.icons).find(name => normalizeComponentName(name) === normalizeComponentName(tag));
    if (identity) used.push(identity.canonicalName);
    else if (icon) icons.push(icon);
    else return { kind: 'unresolved-api', reason: `API unknown-component: ${tag}` };
  }
  const directiveNames = [...template.replace(/<!--[\s\S]*?-->/g, '').matchAll(/\sv-(dt-[a-z0-9-]+)/g)].map(match => match[1]);
  for (const directive of directiveNames) {
    const name = context.directives.find(name => normalizeComponentName(name) === normalizeComponentName(`${directive}-directive`));
    if (!name) return { kind: 'unresolved-api', reason: `API unknown-directive: ${directive}` };
    if (!definition.directives.includes(name)) definition.directives.push(name);
  }
  const apiNames = (options.componentPage?.components ?? []).filter(entry => entry.relation === 'api').map(entry => entry.canonicalName);
  definition.components = [...new Set([...apiNames.filter(name => used.includes(name)), ...used])];
  definition.icons = [...new Set(icons)];
  if (!definition.components.length && !definition.icons.length && !definition.directives.length) {
    return { kind: 'needs-authored-setup', reason: 'No public Dialtone component, icon or directive subject in this Vue source.' };
  }
  definition.materializationVersion = options.vuePackage.version;
  try { checkTemplateApi(baseParse(template, parserOptions), context.metadata, definition.directives, context.icons); }
  catch (error) {
    if (!(error instanceof TemplateApiError)) throw error;
    return { kind: error.code === 'deprecated' ? 'deprecated-api' : 'unresolved-api', reason: `API ${error.code}: ${error.message}` };
  }
  return { kind: 'vue-template-candidate', componentTags: names, definition };
}

/** Read current live fences once; future source kinds cannot enter their identity scope. */
export function readSourceExamples(options) {
  const { rawFile, filePath, sections, records, lineOffset } = options;
  const { data } = matter(rawFile);
  const exclusion = /\/scratch[^/]*\.md$/.test(filePath) ? 'scratch source'
    : filePath.endsWith('.mdx') ? 'MDX markers not supported'
      : NON_READY_STATUSES.has(String(data.status).trim().toLowerCase()) ? 'not-ready source' : null;
  const automatic = filePath.startsWith('apps/dialtone-documentation/docs/components/');
  const candidates = [];
  let referenceCandidates = 0;
  let usageDepth = 0;
  for (const [sectionIndex, section] of sections.entries()) {
    const tokens = markdown.parse(section.raw, {});
    let pending;
    for (const token of tokens) {
      const location = `${filePath}:${lineOffset + (section.sourceStartLine ?? 0) + (token.map?.[0] ?? 0) + 1}`;
      if (token.type === 'html_block' && /<!--\s*example-id:/.test(token.content)) throw new Error(`${location}: migrate legacy example-id to @example JSON`);
      if (token.type === 'html_block' && /<!--\s*@example\b/.test(token.content)) {
        if (pending) throw new Error(`${location}: duplicate or orphan @example`);
        pending = { value: metadata(token, location), end: token.map[1], location };
        continue;
      }
      if (pending && (!liveFence(token) || token.map[0] < pending.end)) throw new Error(`${pending.location}: @example must immediately precede a live Vue demo fence`);
      if (!liveFence(token)) {
        const html = token.type === 'html_block' ? token.content : token.type === 'inline'
          ? (token.children ?? []).filter(child => child.type === 'html_inline').map(child => child.content).join('') : '';
        for (const tag of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(\/?)dialtone-usage\b[^>]*>/g)) {
          usageDepth = Math.max(0, usageDepth + (tag[1] ? -1 : 1));
        }
        if (token.type === 'fence' || (token.type === 'html_block' && /<(?:example-|div\b|p\b|dt-)/.test(token.content))) referenceCandidates++;
        continue;
      }
      const annotation = pending?.value ?? {};
      pending = undefined;
      let live;
      try { live = templateFrom(token); }
      catch (error) { live = { template: '', error: error.message }; }
      if (!live) {
        if (Object.keys(annotation).length) throw new Error(`${location}: @example needs a live Vue demo`);
        referenceCandidates++;
        continue;
      }
      const source = records.find(record => record.headingPath === section.headingPath) ?? records[sectionIndex] ?? {
        id: `${filePath}#${section.baseSlug}`, docId: filePath.replace(/^apps\/dialtone-documentation\/docs\//, '').replace(/\.mdx?$/, ''), headingPath: section.headingPath,
      };
      const docId = source.docId ?? filePath.replace(/^apps\/dialtone-documentation\/docs\//, '').replace(/\.mdx?$/, '');
      const baseId = `examples/docs/${docId}/${section.baseSlug}`;
      const id = annotation.id ?? `${baseId}${annotation.key ? `/${annotation.key}` : ''}`;
      const candidate = { id, sourceLine: lineOffset + (section.sourceStartLine ?? 0) + token.map[0] + 1,
        headingPath: section.headingPath, displayTwin: live.displayTwin ?? false, template: live.template, annotation,
        baseId, unkeyed: !annotation.id && !annotation.key, source, disposition: 'remaining', eligible: false };
      if (exclusion || annotation.exclude) {
        candidate.disposition = 'excluded';
        candidate.reason = exclusion ?? annotation.exclude.reason;
        if (annotation.exclude) candidate.owner = annotation.exclude.owner;
        candidate.syntax = { kind: 'excluded-source' };
      } else {
        const syntax = live.error ? { kind: 'unsupported-source-syntax', reason: live.error } : definitionFor(candidate, options);
        const { definition, ...classification } = syntax;
        candidate.syntax = classification;
        candidate.reason = classification.reason;
        const contextual = usageDepth > 0 || /\b(migration|migrating|before|after|avoid|incorrect|deprecated|do not|don't)\b/i.test(section.headingPath.join(' '));
        candidate.eligible = Boolean(definition) && !contextual
          && (automatic || (annotation.representation === 'static-html'
            && filePath.startsWith('apps/dialtone-documentation/docs/utilities/')));
        if (candidate.eligible) validateId(candidate.id, location);
        candidate.definition = definition;
        if (contextual) candidate.reason = 'Contextual migration/before-after/negative guidance is not a standalone recommendation.';
        else if (definition && !candidate.eligible) candidate.reason = 'Source area is outside the enabled component-page rule.';
      }
      candidates.push(candidate);
    }
    if (pending) throw new Error(`${pending.location}: orphan @example at section end`);
  }
  for (const candidate of candidates) {
    if (candidate.unkeyed && candidates.filter(other => other.baseId === candidate.baseId && other.unkeyed).length > 1
      && candidates.some(other => other.baseId === candidate.baseId && other.eligible && other.unkeyed)) {
      throw new Error(`${filePath}:${candidate.sourceLine}: ambiguous example section; add an @example key or id`);
    }
  }
  const unique = new Set();
  for (const candidate of candidates) {
    if (candidate.eligible && unique.has(candidate.id)) throw new Error(`Duplicate example ID: ${candidate.id}`);
    if (candidate.eligible) unique.add(candidate.id);
    delete candidate.annotation;
    delete candidate.baseId;
    delete candidate.unkeyed;
  }
  return { candidates, referenceCandidates, exclusion };
}
