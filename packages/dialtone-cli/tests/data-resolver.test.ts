import { describe, test, expect, afterEach, onTestFinished } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { resolveData } from '../src/data-resolver.js';

const roots: string[] = [];
afterEach(() => { roots.splice(0).forEach(d => rmSync(d, { recursive: true, force: true })); });

// pnpm's bin shims set NODE_PATH to a whole package store. Node reads it once
// at startup; the internal, untyped Module._initPaths() re-reads it.
const Module = createRequire(import.meta.url)('module');
function pointNodePathAt(dir: string) {
  const saved = process.env.NODE_PATH;
  process.env.NODE_PATH = dir;
  Module._initPaths();
  onTestFinished(() => {
    if (saved === undefined) delete process.env.NODE_PATH;
    else process.env.NODE_PATH = saved;
    Module._initPaths();
  });
}

function write(path: string, content: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(content));
}

interface Layout {
  declares?: string; // the @dialpad/dialtone spec in the app's package.json
  declaredIn?: 'dependencies' | 'devDependencies' | 'peerDependencies';
  umbrella?: {
    version?: string; // defaults to 10.0.4
    omit?: Array<'components' | 'utilities' | 'tokens'>;
    icons?: string; // a @dialpad/dialtone-icons version nested under the umbrella
  };
  icons?: string; // top-level @dialpad/dialtone-icons version
  css?: string;   // top-level @dialpad/dialtone-css version
  vue?: string;   // top-level @dialpad/dialtone-vue version
}

function writeIcons(dir: string, version: string) {
  write(join(dir, 'package.json'), { name: '@dialpad/dialtone-icons', version, exports: { './keywords-icons.json': './dist/keywords-icons.json' } });
  write(join(dir, 'dist/keywords-icons.json'), { marker: `icons-${version}` });
}

function writeCss(dir: string, version: string) {
  write(join(dir, 'package.json'), { name: '@dialpad/dialtone-css', version, exports: { './*': './*' } });
  write(join(dir, 'lib/dist/dialtone-docs.json'), { marker: 'individual-utilities' });
  write(join(dir, 'lib/dist/tokens-docs.json'), { marker: 'individual-tokens' });
}

// A temp app with node_modules laid out like a real install. Each package's
// exports map mirrors the real one's entries for the files the resolver reads.
function project(layout: Layout): string {
  const root = mkdtempSync(join(tmpdir(), 'dialtone-cli-resolver-'));
  roots.push(root);
  mkdirSync(join(root, '.git')); // apps usually sit at a repository root
  const nm = join(root, 'node_modules', '@dialpad');
  const deps = layout.declares ? { '@dialpad/dialtone': layout.declares } : {};
  write(join(root, 'package.json'), { name: 'fixture-app', [layout.declaredIn ?? 'dependencies']: deps });

  if (layout.umbrella) {
    const u = join(nm, 'dialtone');
    const omit = layout.umbrella.omit ?? [];
    write(join(u, 'package.json'), { name: '@dialpad/dialtone', version: layout.umbrella.version ?? '10.0.4', exports: { './*': './dist/*' } });
    if (!omit.includes('components')) write(join(u, 'dist/vue3/component-documentation.json'), [{ displayName: 'DtFromUmbrella' }]);
    if (!omit.includes('utilities')) write(join(u, 'dist/css/dialtone-docs.json'), { marker: 'umbrella-utilities' });
    if (!omit.includes('tokens')) write(join(u, 'dist/css/tokens-docs.json'), { marker: 'umbrella-tokens' });
    if (layout.umbrella.icons) writeIcons(join(u, 'node_modules/@dialpad/dialtone-icons'), layout.umbrella.icons);
  }
  if (layout.icons) writeIcons(join(nm, 'dialtone-icons'), layout.icons);
  if (layout.css) writeCss(join(nm, 'dialtone-css'), layout.css);
  if (layout.vue) {
    write(join(nm, 'dialtone-vue/package.json'), { name: '@dialpad/dialtone-vue', version: layout.vue, exports: { './component-documentation.json': './dist/component-documentation.json' } });
    write(join(nm, 'dialtone-vue/dist/component-documentation.json'), [{ displayName: 'DtFromIndividual' }]);
  }
  return root;
}

const local = (pkg: string, version: string) => ({ kind: 'local', package: pkg, version });
const bundled = { kind: 'bundled' };
const umbrella = local('@dialpad/dialtone', '10.0.4');
const ALL_BUNDLED = { components: bundled, utilities: bundled, tokens: bundled, icons: bundled, docs: bundled };
const stale = (spec: string) => `package.json declares @dialpad/dialtone "${spec}" but 9.187.0 is installed. Reinstall dependencies to match.`;
const missing = (spec: string) => `package.json declares @dialpad/dialtone "${spec}" but no installed copy with lookup data was found. Reinstall dependencies to match.`;

describe('resolveData: where data comes from', () => {
  test('a declared umbrella wins over stray individual packages', () => {
    const data = resolveData(false, project({ declares: '^10.0.0', umbrella: {}, icons: '5.0.0', css: '9.0.1', vue: '4.0.2' }));
    expect(data.components).toEqual([{ displayName: 'DtFromUmbrella' }]);
    expect(data.utilityClasses).toEqual({ marker: 'umbrella-utilities' });
    expect(data.tokens).toEqual({ marker: 'umbrella-tokens' });
    expect(data.sources).toEqual({ components: umbrella, utilities: umbrella, tokens: umbrella, icons: local('@dialpad/dialtone-icons', '5.0.0'), docs: bundled });
  });

  test.each(['devDependencies', 'peerDependencies'] as const)('an umbrella declared in %s counts too', (declaredIn) => {
    const data = resolveData(false, project({ declares: '^10.0.0', declaredIn, umbrella: {}, vue: '4.0.2' }));
    expect(data.sources.components).toEqual(umbrella);
  });

  test('icons come from the copy the umbrella depends on', () => {
    const data = resolveData(false, project({ declares: '^10.0.0', umbrella: { icons: '6.0.0' }, icons: '5.0.0' }));
    expect(data.sources.icons).toEqual(local('@dialpad/dialtone-icons', '6.0.0'));
  });

  test('a partial umbrella\'s missing domains are bundled, not taken from stray packages', () => {
    const data = resolveData(false, project({ declares: '^10.0.0', umbrella: { omit: ['components'] }, vue: '4.0.2' }));
    expect(data.sources).toEqual({ components: bundled, utilities: umbrella, tokens: umbrella, icons: bundled, docs: bundled });
  });

  test('without a declaration, individual packages win over an installed umbrella', () => {
    // No icons package, so the umbrella is read to fill that gap and competes for the rest.
    const data = resolveData(false, project({ umbrella: {}, css: '9.0.1', vue: '4.0.2' }));
    const css = local('@dialpad/dialtone-css', '9.0.1');
    expect(data.utilityClasses).toEqual({ marker: 'individual-utilities' });
    expect(data.tokens).toEqual({ marker: 'individual-tokens' });
    expect(data.sources).toEqual({ components: local('@dialpad/dialtone-vue', '4.0.2'), utilities: css, tokens: css, icons: bundled, docs: bundled });
  });

  test('without a declaration, an installed umbrella fills the domains no individual package covers', () => {
    // e.g. the umbrella arrives as a dependency of a dependency, with its icons package hoisted beside it.
    const data = resolveData(false, project({ umbrella: {}, icons: '5.0.0' }));
    expect(data.sources).toEqual({ components: umbrella, utilities: umbrella, tokens: umbrella, icons: local('@dialpad/dialtone-icons', '5.0.0'), docs: bundled });
  });

  test('an icons-only install is used', () => {
    const data = resolveData(false, project({ icons: '5.0.0' }));
    expect(data.icons).toEqual({ marker: 'icons-5.0.0' });
    expect(data.sources).toEqual({ ...ALL_BUNDLED, icons: local('@dialpad/dialtone-icons', '5.0.0') });
  });

  test('nothing installed is fully bundled', () => {
    expect(resolveData(false, project({})).sources).toEqual(ALL_BUNDLED);
  });

  test('--bundled ignores installed packages', () => {
    expect(resolveData(true, project({ declares: '^10.0.0', umbrella: {} })).sources).toEqual(ALL_BUNDLED);
  });

  test('a stub package.json in a subfolder does not hide the app\'s declaration', () => {
    // The stray dialtone-css would win for utilities if the declaration weren't found.
    const root = project({ declares: '^10.0.0', umbrella: {}, css: '9.0.1' });
    const sub = join(root, 'src', 'workers');
    write(join(sub, 'package.json'), { type: 'module' });
    expect(resolveData(false, sub).sources.utilities).toEqual(umbrella);
  });

  test('the declaration search stops at a repository root', () => {
    // A separate repo nested inside a project that declares Dialtone uses its own packages.
    const child = join(project({ declares: '^10.0.0', umbrella: {} }), 'vendor', 'other-repo');
    write(join(child, 'package.json'), { name: 'other-repo' });
    mkdirSync(join(child, '.git'));
    writeCss(join(child, 'node_modules/@dialpad/dialtone-css'), '9.0.1');
    expect(resolveData(false, child).sources.utilities).toEqual(local('@dialpad/dialtone-css', '9.0.1'));
  });

  test('NODE_PATH is ignored, so a missing install is not filled from another project', () => {
    pointNodePathAt(join(project({ umbrella: {} }), 'node_modules'));
    expect(resolveData(false, project({ declares: '^10.0.0' })).sources).toEqual(ALL_BUNDLED);
  });

  test('a package without an exports map only supplies its own files', () => {
    // Without exports, Node's fallback lookup would also search NODE_PATH.
    pointNodePathAt(join(project({ vue: '4.2.0' }), 'node_modules'));
    const root = project({});
    write(join(root, 'node_modules/@dialpad/dialtone-vue/package.json'), { name: '@dialpad/dialtone-vue', version: '3.226.0' });
    expect(resolveData(false, root).sources.components).toEqual(bundled);
  });

  test('a data file that parses to null counts as missing', () => {
    const root = project({ declares: '^10.0.0', umbrella: {} });
    write(join(root, 'node_modules/@dialpad/dialtone/dist/vue3/component-documentation.json'), null);
    expect(resolveData(false, root).sources.components).toEqual(bundled);
  });
});

describe('resolveData: install warnings', () => {
  test('declared but not installed uses bundled data, not stray packages, and warns', () => {
    const data = resolveData(false, project({ declares: '^10.0.0', css: '9.0.1', vue: '4.0.2' }));
    expect(data.sources).toEqual(ALL_BUNDLED);
    expect(data.warnings).toEqual([missing('^10.0.0')]);
  });

  test.each(['^10.0.0', '~10.1', '10.0.0-next.10', '10.x', '10.0.0+build.1'])('a different installed major warns for "%s"', (spec) => {
    expect(resolveData(false, project({ declares: spec, umbrella: { version: '9.187.0' } })).warnings).toEqual([stale(spec)]);
  });

  test('a matching major does not warn', () => {
    expect(resolveData(false, project({ declares: '^10.0.0', umbrella: {} })).warnings).toEqual([]);
  });

  test('a range with alternatives warns only when no alternative matches', () => {
    expect(resolveData(false, project({ declares: '^9 || ^10', umbrella: {} })).warnings).toEqual([]);
    expect(resolveData(false, project({ declares: '^10 || ^11', umbrella: { version: '9.187.0' } })).warnings).toEqual([stale('^10 || ^11')]);
  });

  // Only single caret, tilde and exact versions are compared; anything else would need a semver dependency.
  test.each(['*', 'workspace:*', '>=10', '8 - 9'])('"%s" never warns', (spec) => {
    expect(resolveData(false, project({ declares: spec, umbrella: { version: '9.187.0' } })).warnings).toEqual([]);
  });
});
