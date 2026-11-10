// Story parity: every Vue story in the unit's component directory has a React story with
// the same id, and each pair has the same arg keys, once React's renames are applied (reactArgKey). A static parse
// (Storybook's own CSF reader), so nothing is bundled or rendered. Also fails a stand-in for a component that's
// already in the tree.
import fs from 'node:fs';
import path from 'node:path';
import { babelParse } from 'storybook/internal/babel';
import { loadCsf } from 'storybook/internal/csf-tools';
import { pascal } from './cases.mjs';

const WRAPPERS = /^(TSSatisfiesExpression|TSAsExpression|TSTypeAssertion|TSNonNullExpression|ParenthesizedExpression)$/;
const unwrap = (node) => {
  while (node && WRAPPERS.test(node.type)) node = node.expression;
  return node;
};
const keyName = p => (p.key.type === 'Identifier' ? p.key.name : String(p.key.value));

/** Top-level `const x = …` (exported or not), so `args: argsData` and `...argsData` resolve. */
function topLevelInits (ast) {
  const inits = new Map();
  for (const statement of ast.program.body) {
    const decl = statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement;
    if (decl?.type !== 'VariableDeclaration') continue;
    for (const d of decl.declarations) if (d.id.type === 'Identifier' && d.init) inits.set(d.id.name, d.init);
  }
  return inits;
}

/**
 * The keys of an args object: an object literal, spreads of other objects, identifiers and `X.args` members that
 * resolve to one in the same file. Anything else is reported as unresolved rather than guessed.
 */
function argKeys (node, inits, seen = new Set()) {
  node = unwrap(node);
  if (node?.type === 'Identifier') {
    if (seen.has(node.name) || !inits.has(node.name)) return { keys: [], unresolved: [node.name] };
    return argKeys(inits.get(node.name), inits, new Set([...seen, node.name]));
  }
  if (node?.type === 'MemberExpression' && !node.computed && node.object.type === 'Identifier') {
    const owner = unwrap(inits.get(node.object.name));
    const prop = owner?.type === 'ObjectExpression'
      && owner.properties.find(p => p.type === 'ObjectProperty' && !p.computed && keyName(p) === node.property.name);
    if (prop) return argKeys(prop.value, inits, seen);
    return { keys: [], unresolved: [`${node.object.name}.${node.property.name}`] };
  }
  if (node?.type === 'ObjectExpression') {
    const out = { keys: [], unresolved: [] };
    for (const p of node.properties) {
      if (p.type === 'SpreadElement') {
        const r = argKeys(p.argument, inits, seen);
        out.keys.push(...r.keys);
        out.unresolved.push(...r.unresolved);
      } else if (p.computed) out.unresolved.push('a computed key');
      else out.keys.push(keyName(p));
    }
    return out;
  }
  return { keys: [], unresolved: [node?.type ?? 'nothing'] };
}

/** One CSF file → its title and stories, each with its id and the keys of its args (meta's plus its own). */
export function readStories (file) {
  const csf = loadCsf(fs.readFileSync(file, 'utf8'), { makeTitle: t => t, fileName: file }).parse();
  if (!csf.meta.title) throw new Error('its default export has no title');
  const inits = topLevelInits(csf._ast);
  const resolve = (node, where) => {
    if (!node) return [];
    const { keys, unresolved } = argKeys(node, inits);
    if (unresolved.length) throw new Error(`can't read the args of ${where} statically (${unresolved.join(', ')})`);
    return keys;
  };
  const metaKeys = resolve(csf._metaAnnotations.args, 'the default export');
  return {
    title: csf.meta.title,
    stories: Object.entries(csf._stories).map(([exportName, story]) => ({
      id: story.id,
      exportName,
      args: new Set([...metaKeys, ...resolve(csf._storyAnnotations[exportName]?.args, exportName)]),
    })),
  };
}

/** The unit's `<Name>.parity.tsx` prop renames (e.g. modelValue → checked), read statically. */
export function parityRenames (file) {
  if (!fs.existsSync(file)) return {};
  const ast = babelParse(fs.readFileSync(file, 'utf8'));
  const exported = unwrap(ast.program.body.find(s => s.type === 'ExportDefaultDeclaration')?.declaration);
  const props = exported?.type === 'ObjectExpression'
    && exported.properties.find(p => p.type === 'ObjectProperty' && keyName(p) === 'props');
  const map = unwrap(props?.value);
  if (map?.type !== 'ObjectExpression') return {};
  return Object.fromEntries(map.properties
    .filter(p => p.type === 'ObjectProperty' && unwrap(p.value).type === 'StringLiteral')
    .map(p => [keyName(p), unwrap(p.value).value]));
}

const camel = s => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const upperFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
const isEvent = key => /^on[A-Z]/.test(key);

/**
 * A Vue arg's key as the port names it in React: v-model's `modelValue`
 * becomes `value` (or the unit's parity rename, e.g. `checked`), `onUpdate:x` becomes `onXChange`, focusin and
 * focusout become onFocus and onBlur, kebab-case events become camelCase.
 */
export function reactArgKey (key, renames = {}) {
  if (renames[key]) return renames[key];
  if (key === 'modelValue') return 'value';
  const update = key.match(/^onUpdate:?(.+)$/);
  if (update) {
    const prop = lowerFirst(camel(update[1]));
    return `on${upperFirst(renames[prop] ?? (prop === 'modelValue' ? 'value' : prop))}Change`;
  }
  if (key === 'onFocusIn' || key === 'onFocusin') return 'onFocus';
  if (key === 'onFocusOut' || key === 'onFocusout') return 'onBlur';
  return isEvent(key) ? camel(key) : key;
}

// Event args match case-insensitively: Vue's `onKeydown` is React's `onKeyDown`.
const comparable = key => (isEvent(key) ? key.toLowerCase() : key);

/**
 * Compares the unit's stories. Returns { status: 'ok' | 'bad' | 'na', summary, detail }.
 *   vueDir, reactDir: the unit's directories; name: its PascalCase name; pkg: packages/dialtone-react.
 *   vueRoot, vuePaths: dialtone-vue, and all the unit's Vue sources relative to it (vue-sources.mjs).
 *   standIns: false skips the stand-in check (CI on pushes to dialtone-react).
 */
export function storyParity ({ vueDir, reactDir, name, pkg, vueRoot, vuePaths, standIns = true }) {
  const storiesIn = dir => (fs.existsSync(dir) && fs.statSync(dir).isDirectory()
    ? fs.readdirSync(dir).filter(f => f.endsWith('.stories.js')).sort() : []);
  const vueFiles = storiesIn(vueDir);
  const reactFiles = fs.readdirSync(reactDir).filter(f => /\.stories\.tsx?$/.test(f)).sort();
  // Only the component directory's stories are compared. A directive's stories would need React files of the same
  // name next to the component's, and Vue's tooltip has two tooltip.stories.js (the component's and the directive's).
  // The row names them instead, so it doesn't claim Vue has none.
  const home = path.relative(vueRoot, vueDir);
  const unchecked = vuePaths.filter(p => p !== home)
    .flatMap(p => storiesIn(path.join(vueRoot, p)).map(f => `${p}/${f}`));
  const note = unchecked.length ? `${unchecked.join(', ')} not checked yet` : '';
  const withNote = summary => [summary, note].filter(Boolean).join(' · ');
  if (!vueFiles.length) {
    const parts = [!unchecked.length && 'no Vue stories', reactFiles.length && `${reactFiles.length} React-only files`];
    return { status: 'na', summary: withNote(parts.filter(Boolean).join(' · ')) };
  }
  const problems = [];
  const read = (file) => {
    try {
      return readStories(file);
    } catch (error) {
      problems.push(`- ${path.relative(pkg, file)}: ${error.message.split('\n')[0]}`);
      return null;
    }
  };
  // Vue's X.stories.js is React's X.stories.tsx (tab has Tab, TabPanel and Tabs stories in one unit).
  const missingFiles = vueFiles.map(f => f.replace(/\.js$/, '.tsx')).filter(f => !reactFiles.includes(f));
  const vue = vueFiles.flatMap(f => read(path.join(vueDir, f))?.stories ?? []);
  const react = new Map(reactFiles.flatMap(f => read(path.join(reactDir, f))?.stories ?? []).map(s => [s.id, s]));
  const renames = parityRenames(path.join(reactDir, `${name}.parity.tsx`));

  const missing = [];
  const argDiffs = [];
  let matched = 0;
  for (const story of vue) {
    const port = react.get(story.id);
    if (!port) { missing.push(`- ${story.id} (export \`${story.exportName}\`)`); continue; }
    react.delete(story.id);
    const expected = new Map([...story.args].map(k => [comparable(reactArgKey(k, renames)), k]));
    const actual = new Map([...port.args].map(k => [comparable(k), k]));
    const absent = [...expected].filter(([k]) => !actual.has(k))
      .map(([, vueKey]) => { const want = reactArgKey(vueKey, renames); return want === vueKey ? `\`${vueKey}\`` : `\`${want}\` (Vue's \`${vueKey}\`)`; });
    const extra = [...actual].filter(([k]) => !expected.has(k)).map(([, k]) => `\`${k}\``);
    if (absent.length || extra.length) {
      argDiffs.push(`- ${story.id}: ${[absent.length && `missing ${absent.join(', ')}`, extra.length && `not in Vue ${extra.join(', ')}`]
        .filter(Boolean).join('; ')}`);
    } else matched++;
  }
  const reactOnly = [...react.keys()].map(id => `- ${id}`);

  // A stand-in for a component that's in the tree. CI on pushes to dialtone-react skips this: a merge can leave some.
  const staleStandIns = [];
  if (standIns) {
    for (const f of reactFiles) {
      const source = fs.readFileSync(path.join(reactDir, f), 'utf8');
      for (const [, unit] of source.matchAll(/<StandIn\s+for=["']([a-z0-9-]+)["']/g)) {
        const component = pascal(unit);
        if (fs.existsSync(path.join(pkg, 'components', component, `${component}.tsx`))) staleStandIns.push(`- ${f}: \`${unit}\``);
      }
    }
  }
  const stale = [...new Set(staleStandIns)];

  const summary = withNote(`${matched}/${vue.length} stories match Vue`
    + (reactOnly.length ? ` · ${reactOnly.length} React-only` : '')
    + (stale.length ? ` · ${stale.length} stale stand-in${stale.length === 1 ? '' : 's'}` : ''));
  const failed = problems.length || missingFiles.length || missing.length || argDiffs.length || stale.length;
  if (!failed) return { status: 'ok', summary };
  return {
    status: 'bad',
    summary: problems.length && !vue.length ? withNote('couldn\'t read the stories') : summary,
    detail: [
      missingFiles.length && `React story files missing (one per Vue story file, next to the component):\n${missingFiles.map(f => `- components/${name}/${f}`).join('\n')}`,
      problems.length && `Story files that couldn't be read:\n${problems.join('\n')}`,
      missing.length && `Vue stories with no React story of the same id (title plus export name):\n${missing.join('\n')}`,
      argDiffs.length && `Stories whose arg keys differ from Vue's (after React's renames and the unit's \`${name}.parity.tsx\` props):\n${argDiffs.join('\n')}`,
      reactOnly.length && `React-only stories (allowed):\n${reactOnly.join('\n')}`,
      stale.length && `Stand-ins for components that are already in the tree; use the component:\n${stale.join('\n')}`,
    ].filter(Boolean).join('\n\n'),
  };
}
