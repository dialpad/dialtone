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
 * Generate a markdown table from the component's CSS class data.
 * @param {string} componentName - kebab-case name, e.g. "avatar"
 * @param {string} dataDir - Absolute path to the _data directory
 * @returns {string[]} - Output markdown lines
 */
export function transformClassTable (componentName, dataDir) {
  const jsonPath = resolve(dataDir, `${componentName}.json`);
  if (!existsSync(jsonPath)) {
    return [`<!-- Class data not found for "${componentName}" -->`];
  }

  let data;
  try {
    data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  } catch {
    return [`<!-- Failed to parse class data for "${componentName}" -->`];
  }

  const classes = data.classes;
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
  const jsonPath = resolve(dataDir, `${componentName}.json`);
  if (!existsSync(jsonPath)) {
    return [`<!-- Accessible data not found for "${componentName}" -->`];
  }

  let data;
  try {
    data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  } catch {
    return [`<!-- Failed to parse accessible data for "${componentName}" -->`];
  }

  const accessible = data.accessible;
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
