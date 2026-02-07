/**
 * Transform <component-vue-api component-name="X" /> into markdown tables
 * for Props, Slots, and Events.
 *
 * Data is loaded from component-documentation.json (built by dialtone-vue).
 */

import { readFileSync } from 'node:fs';
import { escapeTableCell, slugToPascalComponentName } from './utils.mjs';

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
  const pascalName = slugToPascalComponentName(componentName);
  return _componentDocData.find(
    c => c.displayName && c.displayName.toLowerCase() === pascalName.toLowerCase(),
  ) || null;
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

/**
 * Generate markdown tables for a component's Vue API.
 * @param {string} componentName - kebab-case name, e.g. "avatar"
 * @returns {string[]} - Output markdown lines
 */
export function transformVueApi (componentName) {
  const component = findComponent(componentName);
  if (!component) {
    return [`<!-- Vue API data not found for "${componentName}" -->`];
  }

  const output = [];

  // Values wrapped in backticks don't need pipe escaping — GFM processes
  // code spans before pipe splitting, so pipes inside are literal.
  const codeCell = (text) => (text || '').replace(/\s+/g, ' ').trim();

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
