import { normalizeComponentName } from '../lib/component-name.mjs';
import { NodeTypes } from '../../packages/dialtone-docs/src/generators/example-template.mjs';

export const isDeprecatedComponent = component => Boolean(component.tags?.deprecated || component.metadata?.deprecated);

export class TemplateApiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TemplateApiError';
    this.code = code;
  }
}

function requireApi(condition, code, message) {
  if (!condition) throw new TemplateApiError(code, message);
}

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
      requireApi(component, 'unknown-component', node.tag);
      const name = component.displayName;
      requireApi(!isDeprecatedComponent(component), 'deprecated', `${name} deprecated`);
      for (const attribute of node.props) {
        const directive = attribute.type === NodeTypes.DIRECTIVE;
        if (directive) requireApi(allowedDirectives.has(attribute.name), 'unsupported-syntax', `Unhandled directive ${attribute.name}`);
        if (directive && attribute.name === 'bind') requireApi(attribute.arg, 'unsupported-syntax', 'Object-form v-bind is not supported');
        if (directive && attribute.name === 'on') {
          const event = attribute.arg?.content;
          requireApi(event && component.events?.some(entry => entry.name === event), 'unknown-member', `${name} event ${event}`);
          checked.push(`${name}@${event}`);
          continue;
        }
        const propName = !directive ? attribute.name : attribute.name === 'model' ? attribute.arg?.content ?? 'modelValue' : attribute.name === 'bind' ? attribute.arg?.content : null;
        if (!propName || ['class', 'style', 'id', 'role', 'tabindex'].includes(propName) || /^(aria-|data-)/.test(propName)) continue;
        const prop = component.props?.find(prop => normalizeProp(prop.name) === normalizeProp(propName));
        requireApi(prop, 'unknown-member', `${name}.${propName}`);
        requireApi(!prop.tags?.deprecated, 'deprecated', `${name}.${propName} deprecated`);
        if (directive && attribute.name === 'model') {
          const event = `update:${prop.name}`;
          requireApi(component.events?.some(entry => entry.name === event), 'unknown-member', `${name} ${event}`);
        }
        const expression = directive ? attribute.exp?.content : attribute.value?.content;
        const literalPattern = /^(?:-?\d+(?:\.\d+)?|true|false|'[^']*'|"[^"]*")$/;
        const literal = expression && (directive ? expression.match(literalPattern)?.[0] : expression);
        if (literal && prop.values?.length) {
          const value = literal.replace(/^['"]|['"]$/g, '');
          requireApi(prop.values.some(item => String(item).replace(/^['"]|['"]$/g, '') === value), 'invalid-value', `${name}.${prop.name}=${literal}`);
        }
        if (prop.name === 'direction' && directive && expression?.startsWith('{')) {
          requireApi(expression === '{ \'default\': \'column\', \'md\': \'row\' }', 'invalid-value', `${name}.direction=${expression}`);
          for (const value of ['column', 'row']) requireApi(prop.values.includes(value), 'invalid-value', `${name}.direction=${value}`);
        }
        checked.push(`${name}.${prop.name}`);
      }
      let defaultContent = false;
      for (const child of node.children) {
        const slot = child.type === NodeTypes.ELEMENT && child.tag === 'template'
          ? child.props.find(prop => prop.type === NodeTypes.DIRECTIVE && prop.name === 'slot') : null;
        if (slot) {
          const slotName = slot.arg?.content ?? 'default';
          requireApi(!slot.arg || slot.arg.isStatic, 'unsupported-syntax', `${name} dynamic slot`);
          requireApi(component.slots?.some(entry => entry.name === slotName), 'unknown-member', `${name} slot ${slotName}`);
          checked.push(`${name}#${slotName}`);
        } else if (child.type === NodeTypes.ELEMENT || child.type === NodeTypes.INTERPOLATION
          || (child.type === NodeTypes.TEXT && child.content.trim())) defaultContent = true;
      }
      if (defaultContent) requireApi(component.slots?.some(slot => slot.name === 'default'), 'unknown-member', `${name} default slot`);
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(ast);
  return [...new Set(checked)];
}
