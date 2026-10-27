import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { glob } from 'glob';
import config from '../vite.config.js';
import { readPublicComponentExports, withComponentIdentity } from '../../../scripts/lib/vue-component-identity.mjs';
import { normalizeComponentName } from '../../../scripts/lib/component-name.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(packageRoot, '../..');
const require = createRequire(resolve(packageRoot, 'package.json'));
const vueRequire = createRequire(require.resolve('vue/package.json'));
const { baseParse, NodeTypes, ElementTypes, parserOptions } = vueRequire('@vue/compiler-dom');
const hash = (value) => createHash('sha256').update(value).digest('hex');
const manifest = (path) => JSON.parse(readFileSync(path, 'utf8'));
const selected = new Set(['DtLoader/default', 'DtButton/start icon', 'DtToggle/default']);
const copyOptions = { verbose: false, indentSpaces: 2 };
const documentation = manifest(resolve(root, 'packages/dialtone-vue/dist/component-documentation.json'));
const vuePackage = manifest(resolve(root, 'packages/dialtone-vue/package.json'));
const vueRoot = resolve(root, 'packages/dialtone-vue');
const exports = readPublicComponentExports(vueRoot);
const publicNames = new Set(
  [...exports].map(
    ([file]) => withComponentIdentity({ displayName: '' }, file, exports, vueRoot, vuePackage).identity.canonicalName,
  ),
);
const registryPath = resolve(packageRoot, 'src/variants/variants.js');
const registrySource = readFileSync(registryPath, 'utf8');
const bankFiles = new Map(
  [...registrySource.matchAll(/import\s+(Dt\w+)\s+from\s+['"](\.[^'"]+)['"]/g)].map((match) => [
    match[1],
    resolve(dirname(registryPath), match[2]),
  ]),
);
const inputFiles = (
  await glob(
    [
      'packages/combinator/src/**/*.{js,vue,json}',
      'packages/combinator/scripts/*.mjs',
      'packages/combinator/vite.config.js',
      'packages/combinator/package.json',
      'packages/dialtone-vue/{common,components,directives,prototypes}/**/*.{js,vue,json}',
      'packages/dialtone-vue/index.js',
      'packages/dialtone-vue/package.json',
      'packages/dialtone-icons/src/**/*.svg',
      'packages/dialtone-icons/package.json',
      'scripts/lib/**/*.mjs',
      'scripts/build-dialtone-vue-docs.mjs',
      'packages/dialtone-vue/dist/component-documentation.json',
      'package.json',
      'pnpm-lock.yaml',
    ],
    { cwd: root, nodir: true },
  )
).sort();
const inputsHash = hash(JSON.stringify(inputFiles.map((path) => [path, hash(readFileSync(resolve(root, path)))])));
const server = await createServer({
  ...config,
  configFile: false,
  root: packageRoot,
  cacheDir: resolve(packageRoot, '.generated/vite-cache'),
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});
const entries = [];
try {
  const state = await server.ssrLoadModule('/src/lib/variant_state.js');
  const { serializeExampleTemplate } = await server.ssrLoadModule('/src/lib/code_copy.js');
  const { isSupportedComponent, getUnsupportedComponentReason } = await server.ssrLoadModule(
    '/src/lib/component_support.js',
  );
  const registry = (await server.ssrLoadModule('/src/variants/variants.js')).default();
  const runtime = await server.ssrLoadModule('@dialpad/dialtone-vue');
  const icons = await server.ssrLoadModule('@dialpad/dialtone-icons/vue');
  const iconNames = new Map(
    Object.keys(icons)
      .filter((name) => /^Dt(?:Icon|Illustration)/.test(name))
      .map((name) => [normalizeComponentName(name), name]),
  );
  const components = new Map(documentation.map((record) => [normalizeComponentName(record.displayName), record]));
  const ids = new Set();
  for (const component of Object.keys(registry).sort()) {
    const bankFile = bankFiles.get(component);
    if (!bankFile) throw new Error(`No authored bank import for ${component}`);
    for (const preset of state.listVariantNames(registry[component]).sort()) {
      const id = `examples/presets/${encodeURIComponent(component)}/${encodeURIComponent(preset)}`;
      if (ids.has(id)) throw new Error(`Duplicate preset ID: ${id}`);
      ids.add(id);
      const entry = {
        id,
        component,
        preset,
        selected: selected.has(`${component}/${preset}`),
        source: { kind: 'combinator-preset', filePath: relative(root, bankFile), hash: hash(readFileSync(bankFile)) },
        copyOptions,
        disposition: 'unresolved',
        reasons: [],
        requiredContext: [],
      };
      const doc = components.get(normalizeComponentName(component));
      if (!publicNames.has(component) || !runtime[component] || !doc)
        entry.reasons.push('Public runtime component or metadata unavailable.');
      else if (!isSupportedComponent(component, documentation)) {
        entry.disposition = 'policy-excluded';
        entry.reasons.push(getUnsupportedComponentReason(component));
      } else if (doc.tags?.deprecated || doc.metadata?.deprecated) {
        entry.disposition = 'deprecated';
        entry.reasons.push(`${component} is deprecated.`);
      } else {
        try {
          const materialized = state.buildVariantState(runtime[component], doc, registry[component], preset);
          const disabledMembers = state.computeDisabledMembers(
            materialized.info,
            materialized.options.props,
            materialized.options.slots,
          );
          entry.template = serializeExampleTemplate({ ...materialized, disabledMembers, ...copyOptions });
          const imports = new Set();
          const unknown = new Set();
          const deprecated = new Set();
          function visit(node) {
            if (node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.COMPONENT) {
              const name = normalizeComponentName(node.tag);
              const nested = components.get(name);
              if (nested && publicNames.has(nested.displayName)) {
                imports.add(nested.displayName);
                if (nested.tags?.deprecated || nested.metadata?.deprecated) deprecated.add(nested.displayName);
              } else if (iconNames.has(name)) imports.add(iconNames.get(name));
              else unknown.add(node.tag);
            }
            for (const child of node.children ?? []) visit(child);
          }
          visit(baseParse(entry.template, parserOptions));
          entry.imports = [...imports].sort();
          if (deprecated.size) {
            entry.disposition = 'deprecated';
            entry.reasons.push(`Deprecated nested source: ${[...deprecated].sort().join(', ')}.`);
          } else if (unknown.size) entry.reasons.push(`Unresolved source tags: ${[...unknown].sort().join(', ')}.`);
          else {
            entry.disposition = 'eligible/setup-needed';
            entry.requiredContext.push(
              'Source copy only; shared assembly/API/binding/profile validation is required before delivery.',
            );
            if (component === 'DtToggle')
              entry.requiredContext.push(
                'Initial-state fixture; copied markup does not supply application update handling.',
              );
          }
        } catch (error) {
          entry.reasons.push(`Materialization unavailable: ${error.message}`);
        }
      }
      entries.push(entry);
    }
  }
  for (const key of selected)
    if (!entries.some((entry) => `${entry.component}/${entry.preset}` === key)) {
      throw new Error(`Required selected preset removed or renamed: ${key}`);
    }
  const report = {
    schemaVersion: 1,
    inputsHash,
    inputs: inputFiles,
    sourceVersions: {
      combinator: manifest(resolve(packageRoot, 'package.json')).version,
      vueComponents: vuePackage.version,
      icons: manifest(resolve(root, 'packages/dialtone-icons/package.json')).version,
      vue: vueRequire('./package.json').version,
      vite: require('vite/package.json').version,
    },
    summary: {
      banks: Object.keys(registry).length,
      presets: entries.length,
      selected: entries.filter((entry) => entry.selected).length,
      dispositions: Object.fromEntries(
        [...new Set(entries.map((entry) => entry.disposition))]
          .sort()
          .map((value) => [value, entries.filter((entry) => entry.disposition === value).length]),
      ),
      delivered: 0,
    },
    entries,
  };
  const output = resolve(packageRoot, '.generated/preset-examples.json');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report.summary));
} finally {
  await server.close();
}
