/**
 * Transform <component-vue-api component-name="X" /> into markdown tables
 * for Props, Slots, and Events.
 *
 * Data is loaded from component-documentation.json (built by dialtone-vue).
 */

import { readFileSync } from 'node:fs';
import { findComponentRecord, componentRootImportRoute, componentImportLine, tableText, apiCode } from './utils.mjs';

let _componentDocData = null;
let _documentationProfile = null;

/**
 * Load and cache the component documentation JSON.
 * @param {string} jsonPath - Absolute path to component-documentation.json
 * @returns {Array} - The parsed array of component docs
 */
export function loadComponentDocs (jsonPath) {
  if (!_componentDocData) {
    _componentDocData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  }
  return _componentDocData;
}

/**
 * Eagerly set the component docs data (avoids top-level await).
 */
export function setComponentDocs (data, documentationProfile = null) {
  _componentDocData = data;
  _documentationProfile = documentationProfile;
}

/**
 * Find a component entry by slug name.
 * @param {string} componentName - e.g. "avatar", "select-menu"
 * @returns {object|null}
 */
export function findComponent (componentName) {
  if (!_componentDocData) return null;
  return findComponentRecord(_componentDocData, componentName);
}

/**
 * Format a prop default value for display.
 */
function formatDefault (prop) {
  const value = prop.defaultValue;
  return apiCode(value !== undefined
    ? (value && typeof value === 'object' ? value.value : value)
    : prop.tags?.default?.[0]?.description);
}

function documentedBoolean (value) {
  return value === true ? 'Yes' : value === false ? 'No' : 'Not documented';
}

function deprecation (item) {
  const tag = Array.isArray(item.tags)
    ? item.tags.find(tag => tag.title === 'deprecated')
    : item.tags?.deprecated?.[0];
  const description = item.description?.match(/@deprecated\b\s*(.*)/i)?.[1];
  if (tag || description !== undefined) {
    return tableText(tag?.description || description || 'Yes');
  }
  return 'Not documented';
}

function typeName (type) {
  return type?.names?.join(' | ') ?? type?.name;
}

function parameters (items) {
  if (!items?.length) return 'Not documented';
  return items.map(item => {
    const type = typeName(item.type);
    const name = item.name || '(unnamed)';
    return `${apiCode(type ? `${name}: ${type}` : name)}${type ? '' : ' (type not documented)'}${item.description ? ` — ${tableText(item.description)}` : ''}`;
  }).join('; ');
}

function requireComponent (name, filePath) {
  const component = findComponent(name);
  if (!component) {
    throw new Error(`Vue API reference "${name}" in ${filePath || '(unknown source page)'} has missing or ambiguous component-documentation.json data. Run node scripts/build-dialtone-vue-docs.mjs and verify the component name against canonical names/aliases.`);
  }
  return component;
}

/**
 * Build a markdown table section for a set of API items.
 * @param {string} heading - Section heading (e.g. "Props")
 * @param {object[]} items - Array of API item objects
 * @param {Function} formatRow - Converts one item into a table row string
 * @param {string[]} headers - Column headers
 * @returns {string[]} - Output markdown lines
 */
function buildApiTable (heading, items, headers, formatRow) {
  if (items.length === 0) return [];
  const output = [];
  output.push(`### ${heading}`);
  output.push('');
  output.push('| ' + headers.join(' | ') + ' |');
  output.push('| ' + headers.map(() => '---').join(' | ') + ' |');
  for (const item of items) {
    output.push(formatRow(item));
  }
  output.push('');
  return output;
}

function importLines (component, alsoImport, filePath) {
  const companions = alsoImport.map(name => requireComponent(name, filePath));
  const line = componentImportLine(_componentDocData, component, alsoImport);
  const profile = _documentationProfile;
  const matchesProfile = profile?.package && profile?.version && profile?.dependency
    && [component, ...companions].every(record => {
      const route = componentRootImportRoute(record);
      return route?.from === profile.package && route.version === profile.version;
    });
  if (!line || !matchesProfile) {
    return [`Import unverified: ${profile ? `${profile.package}@${profile.version} (${profile.dependency})` : 'documentation package/version profile unavailable'}. Verify the public export route against that profile.`, ''];
  }
  return [`Import verified from source exports for ${profile.package}@${profile.version} (docs dependency: ${profile.dependency}); this does not establish compatibility with other installed versions.`, '', '```js', line, '```', ''];
}

/**
 * Generate markdown tables for a component's Vue API.
 * @param {string} componentName - kebab-case name, e.g. "avatar"
 * @param {object} [options]
 * @param {boolean} [options.showImport=true] - Whether to render the import statement
 * @param {string[]} [options.alsoImport=[]] - Additional component names to include in the import
 * @param {string} [options.filePath] - Source page for build diagnostics
 * @returns {string[]} - Output markdown lines
 */
export function transformVueApi (componentName, { showImport = true, alsoImport = [], filePath } = {}) {
  const component = requireComponent(componentName, filePath);

  const output = [];

  if (showImport) {
    output.push(...importLines(component, alsoImport, filePath));
  }

  if (component.metadata?.deprecated) {
    const metadata = component.metadata;
    output.push(`Deprecated: Yes.${metadata.reason ? ` ${tableText(metadata.reason)}` : ''}${metadata.replacement ? ` Replacement: ${apiCode(metadata.replacement)}.` : ''}`, '');
  }

  const props = component.props ? Object.values(component.props) : [];
  output.push(...buildApiTable('Props', props, ['Name', 'Description', 'Type', 'Values', 'Default', 'Required', 'Deprecated'], (prop) => {
    const values = prop.values?.length ? prop.values.map(apiCode).join(', ') : 'Not documented';
    return `| ${apiCode(prop.name)} | ${tableText(prop.description)} | ${apiCode(typeName(prop.type))} | ${values} | ${formatDefault(prop)} | ${documentedBoolean(prop.required)} | ${deprecation(prop)} |`;
  }));

  const slots = component.slots ? Object.values(component.slots) : [];
  output.push(...buildApiTable('Slots', slots, ['Name', 'Description', 'Scoped', 'Bindings', 'Deprecated'], (slot) => {
    return `| ${apiCode(slot.name)} | ${tableText(slot.description)} | ${documentedBoolean(slot.scoped)} | ${parameters(slot.bindings)} | ${deprecation(slot)} |`;
  }));

  const events = component.events ? Object.values(component.events) : [];
  output.push(...buildApiTable('Events', events, ['Name', 'Description', 'Payload', 'Parameters', 'Deprecated'], (event) => {
    const payload = typeName(event.type);
    return `| ${apiCode(event.name)} | ${tableText(event.description)} | ${apiCode(payload)} | ${parameters(event.properties)} | ${deprecation(event)} |`;
  }));

  return output;
}
