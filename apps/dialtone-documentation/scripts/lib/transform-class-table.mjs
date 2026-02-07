/**
 * Transform <component-class-table component-name="X"> and
 * <component-accessible-table component-name="X"> into markdown tables.
 *
 * Data is loaded from docs/_data/{component}.json which has "classes" and "accessible" arrays.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { escapeTableCell, stripHtmlTags } from './utils.mjs';

/**
 * Load and parse a component's JSON data file.
 * @returns {{ data: object } | { error: string[] }}
 */
function loadComponentData (componentName, dataDir, label) {
  const jsonPath = resolve(dataDir, `${componentName}.json`);
  if (!existsSync(jsonPath)) {
    return { error: [`<!-- ${label} data not found for "${componentName}" -->`] };
  }
  try {
    return { data: JSON.parse(readFileSync(jsonPath, 'utf-8')) };
  } catch {
    return { error: [`<!-- Failed to parse ${label} data for "${componentName}" -->`] };
  }
}

/**
 * Generate a markdown table from the component's CSS class data.
 * @param {string} componentName - kebab-case name, e.g. "avatar"
 * @param {string} dataDir - Absolute path to the _data directory
 * @returns {string[]} - Output markdown lines
 */
export function transformClassTable (componentName, dataDir) {
  const result = loadComponentData(componentName, dataDir, 'Class');
  if (result.error) return result.error;

  const classes = result.data.classes;
  if (!classes || classes.length === 0) {
    return [`<!-- No classes defined for "${componentName}" -->`];
  }

  const output = [];
  output.push('| Class | Applies to | Description |');
  output.push('| --- | --- | --- |');
  for (const entry of classes) {
    const cls = escapeTableCell(entry.class || '');
    const applies = escapeTableCell(entry.applies || '');
    const desc = escapeTableCell(entry.description || '');
    output.push(`| \`${cls}\` | ${applies} | ${desc} |`);
  }
  output.push('');
  return output;
}

/**
 * Generate a markdown table from the component's accessibility data.
 * @param {string} componentName - kebab-case name, e.g. "modal"
 * @param {string} dataDir - Absolute path to the _data directory
 * @returns {string[]} - Output markdown lines
 */
export function transformAccessibleTable (componentName, dataDir) {
  const result = loadComponentData(componentName, dataDir, 'Accessible');
  if (result.error) return result.error;

  const accessible = result.data.accessible;
  if (!accessible || accessible.length === 0) {
    return [`<!-- No accessibility data defined for "${componentName}" -->`];
  }

  const output = [];
  output.push('| Item | Applies to | Description |');
  output.push('| --- | --- | --- |');
  for (const entry of accessible) {
    const item = escapeTableCell(entry.item || '');
    const applies = escapeTableCell(entry.applies || '');
    const desc = escapeTableCell(stripHtmlTags(entry.description || ''));
    output.push(`| \`${item}\` | ${applies} | ${desc} |`);
  }
  output.push('');
  return output;
}
