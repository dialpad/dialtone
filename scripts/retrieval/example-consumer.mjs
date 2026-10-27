import assert from 'node:assert/strict';
import { normalizeComponentName } from '../lib/component-name.mjs';
import { NodeTypes } from '../../packages/dialtone-docs/src/generators/example-template.mjs';

export function consumerTuple(manifest) {
  return {
    dependencies: manifest.dependencies ?? {},
    devDependencies: manifest.devDependencies ?? {},
    scripts: manifest.scripts ?? {},
  };
}

/** Validate only documented source contracts, not installed runtime compatibility. */
export function checkTemplateApi(ast, metadata, directives, icons = {}) {
  const allowedDirectives = new Set(['bind', 'model', 'on', ...directives.map(name => name.replace(/Directive$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())]);
  const normalizeProp = name => name.replace(/-/g, '').toLowerCase();
  const checked = [];
  function visit(node) {
    if (node.type === NodeTypes.ELEMENT && /^(dt-|Dt[A-Z])/.test(node.tag)) {
      const icon = Object.entries(icons)
        .find(([name]) => normalizeComponentName(name) === normalizeComponentName(node.tag));
      const component = metadata.find(component =>
        normalizeComponentName(component.displayName) === normalizeComponentName(node.tag)) ?? (icon && {
        displayName: icon[0], props: Object.keys(icon[1].props ?? {}).map(name => ({ name })), slots: [], events: [],
      });
      assert.ok(component, node.tag);
      const name = component.displayName;
      assert.ok(!component.tags?.deprecated && !component.metadata?.deprecated, `${name} deprecated`);
      for (const attribute of node.props) {
        const directive = attribute.type === NodeTypes.DIRECTIVE;
        if (directive) assert.ok(allowedDirectives.has(attribute.name), `Unhandled directive ${attribute.name}`);
        if (directive && attribute.name === 'bind') assert.ok(attribute.arg, 'Object-form v-bind is not supported');
        if (directive && attribute.name === 'on') {
          const event = attribute.arg?.content;
          assert.ok(event && component.events?.some(entry => entry.name === event), `${name} event ${event}`);
          checked.push(`${name}@${event}`);
          continue;
        }
        const propName = !directive ? attribute.name : attribute.name === 'model' ? attribute.arg?.content ?? 'modelValue' : attribute.name === 'bind' ? attribute.arg?.content : null;
        if (!propName || ['class', 'style', 'id', 'role', 'tabindex'].includes(propName) || /^(aria-|data-)/.test(propName)) continue;
        const prop = component.props?.find(prop => normalizeProp(prop.name) === normalizeProp(propName));
        assert.ok(prop, `${name}.${propName}`);
        assert.ok(!prop.tags?.deprecated, `${name}.${propName} deprecated`);
        if (directive && attribute.name === 'model') {
          const event = `update:${prop.name}`;
          assert.ok(component.events?.some(entry => entry.name === event), `${name} ${event}`);
        }
        const expression = directive ? attribute.exp?.content : attribute.value?.content;
        const literalPattern = /^(?:-?\d+(?:\.\d+)?|true|false|'[^']*'|"[^"]*")$/;
        const literal = expression && (directive ? expression.match(literalPattern)?.[0] : expression);
        if (literal && prop.values?.length) {
          const value = literal.replace(/^['"]|['"]$/g, '');
          assert.ok(prop.values.some(item => String(item).replace(/^['"]|['"]$/g, '') === value), `${name}.${prop.name}=${literal}`);
        }
        if (prop.name === 'direction' && directive && expression?.startsWith('{')) {
          assert.equal(expression, '{ \'default\': \'column\', \'md\': \'row\' }');
          for (const value of ['column', 'row']) assert.ok(prop.values.includes(value));
        }
        checked.push(`${name}.${prop.name}`);
      }
      if (node.children.some(child => child.type === NodeTypes.ELEMENT || (child.type === NodeTypes.TEXT && child.content.trim()))) assert.ok(component.slots?.some(slot => slot.name === 'default'), `${name} default slot`);
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(ast);
  return [...new Set(checked)];
}
