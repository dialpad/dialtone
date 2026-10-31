import { readFileSync, statSync, realpathSync } from 'node:fs';
import { resolve, dirname, relative, extname } from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import { stripMarkdown } from '../utils/strip-markdown.mjs';

const require = createRequire(new URL('../../../../apps/dialtone-documentation/package.json', import.meta.url));
const { parse, babelParse } = require('vue/compiler-sfc');
const hash = text => createHash('sha256').update(text).digest('hex');
const codeExtensions = new Set(['.js', '.mjs', '.ts', '.vue']);

function moduleFiles(entry, root, seen) {
  const absolute = realpathSync(entry);
  const path = relative(root, absolute).replaceAll('\\', '/');
  if (path.startsWith('../') || path === '..') throw new Error('Guidance source dependency leaves the repository');
  if (seen.has(path)) return;
  const source = readFileSync(absolute, 'utf8');
  seen.set(path, hash(source));
  if (!codeExtensions.has(extname(path))) return;
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
  for (const specifier of imports.filter(name => name.startsWith('.'))) {
    const target = resolve(dirname(absolute), specifier.split(/[?#]/)[0]);
    const next = [target, `${target}.js`, `${target}.ts`, `${target}.vue`, resolve(target, 'index.js')]
      .find(candidate => { try { return statSync(candidate).isFile(); } catch { return false; } });
    if (!next) throw new Error(`Missing guidance source dependency: ${path} imports ${specifier}`);
    moduleFiles(next, root, seen);
  }
}

/** Facts come from the owning assembler, never a second example parser or inventory. */
export function prepareGuidanceFacts(input, { root, metadata }) {
  root = realpathSync(root);
  const sources = [
    { id: 'example', text: `${input.setup ? `<script setup>\n${input.setup}</script>\n` : ''}<template>\n${input.template}\n</template>` },
    { id: 'documentation', text: stripMarkdown(matter(input.rawFile).content) },
  ];
  const dependencies = new Map();
  for (const name of input.components) {
    const api = metadata.find(entry => entry.identity?.canonicalName === name || entry.displayName === name);
    if (!api) throw new Error(`Missing guidance API contract: ${name}`);
    const contract = Object.fromEntries(['displayName', 'description', 'tags', 'props', 'events', 'slots'].filter(key => api[key] !== undefined).map(key => [key, api[key]]));
    sources.push({ id: `api:${name}`, text: JSON.stringify(contract) });
    for (const file of api.sourceFiles ?? []) {
      const absolute = resolve(root, file);
      moduleFiles(absolute, root, dependencies);
      sources.push({ id: `implementation:${relative(root, absolute).replaceAll('\\', '/')}`, text: readFileSync(absolute, 'utf8') });
    }
  }
  for (const name of input.directives) {
    const packageRoot = resolve(root, 'packages/dialtone-vue');
    const barrel = readFileSync(resolve(packageRoot, 'index.js'), 'utf8');
    const files = [...barrel.matchAll(/export \* from ['"]\.\/(directives\/[^'"]+)['"]/g)]
      .map(match => resolve(packageRoot, match[1], 'index.js'));
    const file = files.find(file => new RegExp(`default\\s+as\\s+${name}\\b`).test(readFileSync(file, 'utf8')));
    if (!file) throw new Error(`Missing guidance directive contract: ${name}`);
    moduleFiles(file, root, dependencies);
  }
  const uniqueSources = sources.filter((source, index) => sources.findIndex(other => other.id === source.id) === index);
  return { id: input.id, sources: uniqueSources,
    dependencies: [...dependencies].sort(([a], [b]) => a.localeCompare(b)).map(([path, hash]) => ({ path, hash })) };
}
