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
  if (!defaultValue) return "''";
  const val = defaultValue.value;
  if (val === 'undefined' || val === undefined) return "''";
  if (defaultValue.func) return '(function)';
  return val;
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

  // Props table
  const props = component.props ? Object.values(component.props) : [];
  if (props.length > 0) {
    output.push('### Props');
    output.push('');
    output.push('| Name | Description | Type | Default |');
    output.push('| --- | --- | --- | --- |');
    for (const prop of props) {
      const name = escapeTableCell(prop.name || '');
      const desc = escapeTableCell(prop.description || '');
      const type = escapeTableCell(prop.type ? prop.type.name : '');
      const def = escapeTableCell(formatDefault(prop.defaultValue));
      output.push(`| \`${name}\` | ${desc} | \`${type}\` | \`${def}\` |`);
    }
    output.push('');
  }

  // Slots table
  const slots = component.slots ? Object.values(component.slots) : [];
  if (slots.length > 0) {
    output.push('### Slots');
    output.push('');
    output.push('| Name | Description |');
    output.push('| --- | --- |');
    for (const slot of slots) {
      const name = escapeTableCell(slot.name || '');
      const desc = escapeTableCell(slot.description || '');
      output.push(`| \`${name}\` | ${desc} |`);
    }
    output.push('');
  }

  // Events table
  const events = component.events ? Object.values(component.events) : [];
  if (events.length > 0) {
    output.push('### Events');
    output.push('');
    output.push('| Name | Description | Payload |');
    output.push('| --- | --- | --- |');
    for (const event of events) {
      const name = escapeTableCell(event.name || '');
      const desc = escapeTableCell(event.description || '');
      const payload = escapeTableCell(
        event.type && event.type.names ? event.type.names.join(' \\| ') : '',
      );
      output.push(`| \`${name}\` | ${desc} | \`${payload}\` |`);
    }
    output.push('');
  }

  return output;
}
