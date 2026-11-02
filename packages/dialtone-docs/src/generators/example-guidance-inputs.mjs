import { readFileSync, statSync, realpathSync } from 'node:fs';
import { resolve, dirname, relative, extname } from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import { stripMarkdown } from '../utils/strip-markdown.mjs';
import { chunkSections } from './source-sections.mjs';

const require = createRequire(new URL('../../../../apps/dialtone-documentation/package.json', import.meta.url));
const { parse, babelParse } = require('vue/compiler-sfc');
const hash = text => createHash('sha256').update(text).digest('hex');
const codeExtensions = new Set(['.js', '.mjs', '.ts', '.vue']);

/** Reads, hashes and resolves one module once per build; examples share most of the component graph. */
function moduleNode(absolute, root, modules) {
  if (modules.has(absolute)) return modules.get(absolute);
  const path = relative(root, absolute).replaceAll('\\', '/');
  if (path.startsWith('../') || path === '..') throw new Error('Guidance source dependency leaves the repository');
  const bytes = readFileSync(absolute);
  const node = { path, hash: hash(bytes), next: [] };
  if (codeExtensions.has(extname(path))) node.next = moduleImports(bytes.toString('utf8'), absolute, path, root);
  modules.set(absolute, node);
  return node;
}

function moduleFiles(entry, root, seen, modules) {
  const node = moduleNode(realpathSync(entry), root, modules);
  if (seen.has(node.path)) return;
  seen.set(node.path, node.hash);
  for (const next of node.next) moduleFiles(next, root, seen, modules);
}

function moduleImports(source, absolute, path, root) {
  const scripts = path.endsWith('.vue')
    ? Object.values(parse(source).descriptor).filter(value => value && typeof value === 'object' && value.type === 'script').map(value => value.content)
    : [source];
  const imports = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (['ImportDeclaration', 'ExportAllDeclaration', 'ExportNamedDeclaration'].includes(node.type) && node.source) imports.push(node.source.value);
    if ((node.type === 'CallExpression' && (node.callee?.type === 'Import' || node.callee?.name === 'require'))
      || (node.type === 'NewExpression' && node.callee?.name === 'URL')) {
      if (typeof node.arguments?.[0]?.value === 'string') imports.push(node.arguments[0].value);
    }
    if (node.type === 'ImportExpression' && typeof node.source?.value === 'string') imports.push(node.source.value);
    for (const [key, value] of Object.entries(node)) {
      if (['loc', 'comments', 'tokens'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  for (const script of scripts) visit(babelParse(script, { sourceType: 'module', plugins: ['typescript'] }));
  return imports.filter(name => name.startsWith('.') || name.startsWith('@/')).map(specifier => {
    const name = specifier.split(/[?#]/)[0];
    const target = name.startsWith('@/') ? resolve(root, 'packages/dialtone-vue', name.slice(2)) : resolve(dirname(absolute), name);
    const next = [target, `${target}.js`, `${target}.ts`, `${target}.vue`, resolve(target, 'index.js')]
      .find(candidate => { try { return statSync(candidate).isFile(); } catch { return false; } });
    if (!next) throw new Error(`Missing guidance source dependency: ${path} imports ${specifier}`);
    return next;
  });
}

function contractText(value, path = '') {
  if (value && typeof value === 'object' && Object.keys(value).length) {
    return Object.entries(value).map(([key, child]) => contractText(child, path ? `${path}.${key}` : key)).join('\n');
  }
  return `${path}: ${typeof value === 'string' ? value : JSON.stringify(value)}`;
}

/** Facts come from the owning assembler, never a second example parser or inventory. */
export function prepareGuidanceFacts(input, { root, metadata, modules = new Map() }) {
  root = realpathSync(root);
  const sources = [
    { id: 'example', text: `${input.setup ? `<script setup>\n${input.setup}</script>\n` : ''}<template>\n${input.template}\n</template>` },
    { id: 'documentation', text: stripMarkdown(matter(input.rawFile).content) },
  ];
  if (/\bfieldset\b/i.test(input.template)) {
    const guide = resolve(root, 'apps/dialtone-documentation/docs/guides/accessibility/index.md');
    const section = chunkSections(matter(readFileSync(guide, 'utf8')).content)
      .find(section => section.headingPath.at(-1) === 'Form Best Practices');
    if (!section) throw new Error(`${guide}: missing Form Best Practices section required for example guidance`);
    sources.push({ id: `guidance:guides/accessibility#${section.baseSlug}`, text: stripMarkdown(section.raw) });
  }
  const dependencies = new Map();
  for (const name of input.components) {
    const api = metadata.find(entry => entry.identity?.canonicalName === name || entry.displayName === name);
    if (!api) throw new Error(`Missing guidance API contract: ${name}`);
    const contract = Object.fromEntries(['displayName', 'description', 'tags', 'props', 'events', 'slots'].filter(key => api[key] !== undefined).map(key => [key, api[key]]));
    sources.push({ id: `api:${name}`, text: contractText(contract) });
    for (const file of api.sourceFiles ?? []) {
      const absolute = resolve(root, file);
      moduleFiles(absolute, root, dependencies, modules);
      sources.push({ id: `implementation:${relative(root, absolute).replaceAll('\\', '/')}`, text: readFileSync(absolute, 'utf8') });
    }
  }
  const packageRoot = resolve(root, 'packages/dialtone-vue');
  const directiveFiles = input.directives.length
    ? [...readFileSync(resolve(packageRoot, 'index.js'), 'utf8').matchAll(/export \* from ['"]\.\/(directives\/[^'"]+)['"]/g)]
      .map(match => resolve(packageRoot, match[1], 'index.js'))
    : [];
  for (const name of input.directives) {
    const file = directiveFiles.find(file => new RegExp(`default\\s+as\\s+${name}\\b`).test(readFileSync(file, 'utf8')));
    if (!file) throw new Error(`Missing guidance directive contract: ${name}`);
    moduleFiles(file, root, dependencies, modules);
  }
  const uniqueSources = sources.filter((source, index) => sources.findIndex(other => other.id === source.id) === index);
  return { id: input.id, sources: uniqueSources,
    dependencies: [...dependencies].sort(([a], [b]) => a.localeCompare(b)).map(([path, hash]) => ({ path, hash })) };
}
