import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { glob } from 'glob';
import config from '../vite.config.js';
import { readPublicComponentExports, withComponentIdentity } from '../../../scripts/lib/vue-component-identity.mjs';
import { presetExampleId } from '../../../scripts/lib/preset-example-id.mjs';
import { classifyPresetExample } from './classify-preset-example.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(packageRoot, '../..');
const require = createRequire(resolve(packageRoot, 'package.json'));
const vueRequire = createRequire(require.resolve('vue/package.json'));
const hash = (value) => createHash('sha256').update(value).digest('hex');
const manifest = (path) => JSON.parse(readFileSync(path, 'utf8'));
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
const inputFiles = (
  await glob(
    [
      'packages/combinator/src/**/*.{js,vue,json}',
      'packages/combinator/scripts/*.mjs',
      'packages/combinator/vite.config.js',
      'packages/combinator/package.json',
      'packages/dialtone-vue/{common,components,directives,prototypes}/**/*.{js,vue,json}',
      'packages/dialtone-vue/vite.config.js',
      'packages/dialtone-vue/index.js',
      'packages/dialtone-vue/package.json',
      'packages/dialtone-icons/*.{cjs,mjs,js,json}',
      'packages/dialtone-icons/src/**/*.{cjs,mjs,js,json,svg,vue}',
      'packages/dialtone-icons/vue/*.{cjs,mjs,js,json}',
      'scripts/lib/**/*.mjs',
      'scripts/retrieval/example-consumer.mjs',
      'packages/dialtone-docs/src/generators/example-template.mjs',
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
  // Match loaded exports by identity, so import aliases and re-exports do not become source policy.
  const bankFiles = new Map([...server.environments.ssr.moduleGraph.idToModuleMap.values()]
    .filter(module => module.file && module.ssrModule?.default
      && ![...module.importedModules].some(child => child.ssrModule?.default === module.ssrModule.default))
    .map(module => [module.ssrModule.default, module.file]));
  const runtime = await server.ssrLoadModule('@dialpad/dialtone-vue');
  const icons = await server.ssrLoadModule('@dialpad/dialtone-icons/vue');
  const ids = new Set();
  for (const component of Object.keys(registry).sort()) {
    const bankFile = bankFiles.get(registry[component]);
    if (!bankFile) throw new Error(`No loaded bank source for ${component}`);
    for (const preset of state.listVariantNames(registry[component]).sort()) {
      const id = presetExampleId(component, preset);
      if (ids.has(id)) throw new Error(`Duplicate preset ID: ${id}`);
      ids.add(id);
      const entry = {
        id,
        component,
        preset,
        source: { kind: 'combinator-preset', filePath: relative(root, bankFile), hash: hash(readFileSync(bankFile)) },
        copyOptions,
        ...classifyPresetExample({ component, documentation, publicNames, runtime, icons,
          policyReason: isSupportedComponent(component, documentation) ? '' : getUnsupportedComponentReason(component),
          materialize: doc => {
            const materialized = state.buildVariantState(runtime[component], doc, registry[component], preset);
            const disabledMembers = state.computeDisabledMembers(
              materialized.info, materialized.options.props, materialized.options.slots,
            );
            return serializeExampleTemplate({ ...materialized, disabledMembers, ...copyOptions });
          },
        }),
      };
      entries.push(entry);
    }
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
