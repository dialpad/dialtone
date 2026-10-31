import MarkdownIt from 'markdown-it';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../../apps/dialtone-documentation/package.json', import.meta.url));
const { parse, compileScript } = require('vue/compiler-sfc');
const { baseParse, NodeTypes, ElementTypes, parserOptions } = createRequire(require.resolve('vue/package.json'))('@vue/compiler-dom');
export { baseParse, NodeTypes, ElementTypes, parserOptions };
const { isGloballyAllowed } = createRequire(require.resolve('vue/package.json'))('@vue/shared');
const rootRequire = createRequire(new URL('../../../../package.json', import.meta.url));
const parser = createRequire(rootRequire.resolve('eslint-plugin-vue'))('vue-eslint-parser');
const allowed = new Set(['$attrs', '$slots', '$emit', '$el', '$props', '$refs', '$data', '$options', '$parent', '$root', '$forceUpdate', '$nextTick', '$watch']);

export function componentTags(template) {
  const tags = [];
  function visit(node) {
    if (node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.COMPONENT) tags.push(node.tag);
    for (const child of node.children ?? []) visit(child);
  }
  visit(baseParse(template, parserOptions));
  return tags;
}

/** Keep only the named source declarations and their Vue ref import for this cohort. */
export function sourceSetup(rawFile, names = []) {
  if (!names.length) return '';
  const scripts = new MarkdownIt({ html: true }).parse(rawFile, {})
    .filter(token => token.type === 'html_block' && token.level === 0)
    .map(token => token.content.match(/^\s*<script\s+setup\s*>([\s\S]*?)<\/script>\s*$/)?.[1])
    .filter(script => script !== undefined);
  if (scripts.length !== 1) throw new Error(`Missing or ambiguous authored setup for ${names.join(', ')}`);
  const [script] = scripts;
  const { descriptor } = parse(`<script setup>${script}</script>`);
  const compiled = compileScript(descriptor, { id: 'source-example' });
  const declarations = names.map(name => {
    const node = compiled.scriptSetupAst.find(node => node.type === 'VariableDeclaration'
      && node.declarations.length === 1 && node.declarations[0].id.name === name);
    const init = node?.declarations[0].init;
    if (!node || init?.type !== 'CallExpression' || init.callee.name !== 'ref'
      || init.arguments.length !== 1 || init.arguments[0].type !== 'BooleanLiteral') {
      throw new Error(`Unsupported source setup for ${name}`);
    }
    return script.slice(node.start, node.end).trim();
  });
  const imported = compiled.scriptSetupAst.some(node => node.type === 'ImportDeclaration'
    && node.source.value === 'vue' && node.specifiers.some(specifier => specifier.imported?.name === 'ref' && specifier.local.name === 'ref'));
  if (!imported) throw new Error('Authored ref import is missing');
  return `import { ref } from 'vue';\n${declarations.join('\n')}\n`;
}

/** Compiler bindings plus parser references preserve v-for/slot lexical scopes and Vue public properties. */
export function assertTemplateBindings(template, setup = '') {
  const sfc = `${setup ? `<script setup>\n${setup}</script>` : ''}<template>${template}</template>`;
  const { descriptor } = parse(sfc);
  const bindings = setup ? compileScript(descriptor, { id: 'source-example' }).bindings : {};
  const ast = parser.parseForESLint(sfc, { sourceType: 'module', ecmaVersion: 2022 }).ast;
  const missing = new Set();
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'VExpressionContainer') {
      for (const reference of node.references) {
        const name = reference.id.name;
        if (!reference.variable && !(name in bindings)
          && !allowed.has(name) && !isGloballyAllowed(name)) missing.add(name);
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (['parent', 'loc', 'range', 'tokens', 'comments', 'references', 'variables'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  visit(ast.templateBody);
  if (missing.size) throw new Error(`Unresolved template bindings: ${[...missing].join(', ')}`);
}

/** Static HTML is authored markup, never Vue rendering or a copied page script. */
export function assertStaticHtml(template) {
  const ast = baseParse(template, parserOptions);
  const classes = new Set();
  function visit(node) {
    if (node.type === NodeTypes.INTERPOLATION) throw new Error('Static HTML cannot contain interpolation');
    if (node.type === NodeTypes.ELEMENT) {
      if (['script', 'style'].includes(node.tag.toLowerCase())) {
        const error = new Error(`Unsupported inline source tag: ${node.tag}`);
        error.code = 'unsupported-inline-tag';
        throw error;
      }
      if (node.tagType !== ElementTypes.ELEMENT || node.tag.toLowerCase() === 'template') throw new Error(`Non-static HTML tag: ${node.tag}`);
      if (node.props.some(prop => prop.type === NodeTypes.DIRECTIVE || /^on/i.test(prop.name))) throw new Error('Static HTML cannot contain Vue directives or event handlers');
      for (const attribute of node.props) {
        if (attribute.name.toLowerCase() === 'class' && attribute.value) {
          for (const name of attribute.value.content.split(/[ \t\r\n\f]+/).filter(Boolean)) classes.add(name);
        }
      }
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(ast);
  return [...classes];
}
