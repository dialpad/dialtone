import { normalizeComponentName } from '../../../scripts/lib/component-name.mjs';
import {
  checkTemplateApi, TemplateApiError, isDeprecatedComponent,
} from '../../../scripts/retrieval/example-consumer.mjs';
import {
  baseParse, NodeTypes, ElementTypes, parserOptions,
} from '../../dialtone-docs/src/generators/example-template.mjs';

/** Classify one curated source; materialization remains owned by the UI serializer. */
export function classifyPresetExample({
  component, documentation, publicNames, runtime, icons, policyReason, materialize,
}) {
  const entry = { disposition: 'unresolved', reasons: [], requiredContext: [] };
  const components = new Map(documentation.map(record => [normalizeComponentName(record.displayName), record]));
  const doc = components.get(normalizeComponentName(component));
  if (!publicNames.has(component) || !runtime[component] || !doc) {
    entry.reasons.push('Source unavailable: public runtime component or metadata missing.');
    return entry;
  }
  if (policyReason) {
    entry.disposition = 'policy-excluded';
    entry.reasons.push(`Policy: ${policyReason}`);
    return entry;
  }
  if (isDeprecatedComponent(doc)) {
    entry.disposition = 'deprecated';
    entry.reasons.push(`API deprecated: ${component} deprecated`);
    return entry;
  }
  const iconNames = new Map(Object.keys(icons).filter(name => /^Dt(?:Icon|Illustration)/.test(name))
    .map(name => [normalizeComponentName(name), name]));
  let ast;
  try {
    entry.template = materialize(doc);
    ast = baseParse(entry.template, parserOptions);
  } catch (error) {
    entry.reasons.push(`Materialization unavailable: ${error.message}`);
    return entry;
  }
  const imports = new Set();
  const unknown = new Set();
  const deprecated = new Set();
  function visit(node) {
    if (node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.COMPONENT) {
      const name = normalizeComponentName(node.tag);
      const nested = components.get(name);
      if (nested && publicNames.has(nested.displayName)) {
        imports.add(nested.displayName);
        if (isDeprecatedComponent(nested)) deprecated.add(nested.displayName);
      } else if (iconNames.has(name)) imports.add(iconNames.get(name));
      else unknown.add(node.tag);
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(ast);
  entry.imports = [...imports].sort();
  if (deprecated.size) {
    entry.disposition = 'deprecated';
    entry.reasons.push(`API deprecated: ${[...deprecated].sort().join(', ')} deprecated`);
    return entry;
  }
  if (unknown.size) {
    entry.reasons.push(`API unknown-component: ${[...unknown].sort().join(', ')}`);
    return entry;
  }
  try {
    checkTemplateApi(ast, documentation, [], icons);
  } catch (error) {
    if (!(error instanceof TemplateApiError)) throw error;
    entry.disposition = error.code === 'deprecated' ? 'deprecated' : 'unresolved';
    entry.reasons.push(`API ${error.code}: ${error.message}`);
    return entry;
  }
  entry.disposition = 'eligible/setup-needed';
  return entry;
}
