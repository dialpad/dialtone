/**
 * Transform <component-vue-api component-name="X" /> into markdown tables
 * for Props, Slots, and Events.
 *
 * Data is loaded from component-documentation.json (built by dialtone-vue).
 */

import { readFileSync } from 'node:fs';
import { escapeTableCell, codeCell, findComponentRecord, componentRootImportName } from './utils.mjs';

let _componentDocData = null;

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
export function setComponentDocs (data) {
  _componentDocData = data;
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
function formatDefault (defaultValue) {
  if (!defaultValue) return '\'\'';
  const val = defaultValue.value;
  if (val === 'undefined' || val === undefined) return '\'\'';
  if (defaultValue.func) return '(function)';
  return val;
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

function importLines (component, alsoImport) {
  const main = componentRootImportName(component);
  if (!main) return ['<!-- Import unavailable: upgrade metadata or verify the public export route. -->', ''];
  const names = [main, ...alsoImport.map(name => componentRootImportName(findComponent(name))).filter(Boolean)];
  return ['```js', `import { ${[...new Set(names)].join(', ')} } from '@dialpad/dialtone-vue';`, '```', ''];
}

/**
 * Generate markdown tables for a component's Vue API.
 * @param {string} componentName - kebab-case name, e.g. "avatar"
 * @param {object} [options]
 * @param {boolean} [options.showImport=true] - Whether to render the import statement
 * @param {string[]} [options.alsoImport=[]] - Additional component names to include in the import
 * @returns {string[]} - Output markdown lines
 */
export function transformVueApi (componentName, { showImport = true, alsoImport = [] } = {}) {
  const component = findComponent(componentName);
  if (!component) {
    return [`<!-- Vue API data not found for "${componentName}" -->`];
  }

  const output = [];

  if (showImport) {
    output.push(...importLines(component, alsoImport));
  }

  const props = component.props ? Object.values(component.props) : [];
  output.push(...buildApiTable('Props', props, ['Name', 'Description', 'Type', 'Default'], (prop) => {
    const name = codeCell(prop.name);
    const desc = escapeTableCell(prop.description || '');
    const type = codeCell(prop.type ? prop.type.name : '');
    const def = codeCell(formatDefault(prop.defaultValue));
    return `| \`${name}\` | ${desc} | \`${type}\` | \`${def}\` |`;
  }));

  const slots = component.slots ? Object.values(component.slots) : [];
  output.push(...buildApiTable('Slots', slots, ['Name', 'Description'], (slot) => {
    const name = codeCell(slot.name);
    const desc = escapeTableCell(slot.description || '');
    return `| \`${name}\` | ${desc} |`;
  }));

  const events = component.events ? Object.values(component.events) : [];
  output.push(...buildApiTable('Events', events, ['Name', 'Description', 'Payload'], (event) => {
    const name = codeCell(event.name);
    const desc = escapeTableCell(event.description || '');
    const payload = codeCell(
      event.type && event.type.names ? event.type.names.join(' | ') : '',
    );
    return `| \`${name}\` | ${desc} | \`${payload}\` |`;
  }));

  return output;
}
