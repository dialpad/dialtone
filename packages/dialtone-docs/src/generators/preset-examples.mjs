import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeComponentName } from '../../../../scripts/lib/component-name.mjs';
import { assembleExampleRecord } from './documentation-examples.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const read = path => {
  if (isAbsolute(path) || path.split('/').includes('..')) throw new Error(`Invalid preset source path: ${path}`);
  return readFileSync(resolve(root, path));
};

/** Plain JSON is the only bridge from the Vue-aware producer to documentation generation. */
export function buildPresetExampleRecords(report, { records, vuePackage }) {
  if (report?.schemaVersion !== 1 || !Array.isArray(report.inputs)
    || !report.inputs.length || !Array.isArray(report.entries)) {
    throw new Error('Missing preset intermediate; run dialtone-combinator:generate-examples');
  }
  const currentHash = hash(JSON.stringify(report.inputs.map(path => [path, hash(read(path))])));
  if (currentHash !== report.inputsHash) throw new Error('Stale preset intermediate; rerun dialtone-combinator:generate-examples');
  const sourcePackage = JSON.parse(read('packages/combinator/package.json'));
  const ids = new Set();
  const delivered = [];
  for (const entry of report.entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate preset ID: ${entry.id}`);
    ids.add(entry.id);
    if (!entry.selected) continue;
    if (entry.id !== `examples/presets/${encodeURIComponent(entry.component)}/${encodeURIComponent(entry.preset)}`) {
      throw new Error(`Preset source identity changed: ${entry.id}`);
    }
    if (entry.disposition !== 'eligible/setup-needed') throw new Error(`Selected preset is not eligible: ${entry.id}`);
    if (hash(read(entry.source.filePath)) !== entry.source.hash) throw new Error(`Preset source changed: ${entry.id}`);
    const page = records.find(record => !record.example && record.category === 'components'
      && normalizeComponentName(record.docTitle) === normalizeComponentName(entry.component));
    if (!page) throw new Error(`No public documentation subject for ${entry.component}`);
    const icons = entry.imports.filter(name => /^Dt(?:Icon|Illustration)/.test(name));
    const components = entry.imports.filter(name => !icons.includes(name));
    const definition = {
      components, icons, directives: [], sourceKind: 'combinator-preset', preset: entry.preset,
      responsibilities: `Initial-state fixture from Combinator copy. No application update handlers or persistence are supplied. ${(entry.requiredContext ?? []).join(' ')}`,
      interaction: 'Copied presentation is not an interaction or accessibility result; verify the containing application.',
    };
    delivered.push(assembleExampleRecord({ id: entry.id, template: entry.template, definition,
      source: { ...page, id: `combinator/${entry.component}#${encodeURIComponent(entry.preset)}` },
      headingPath: ['Combinator preset', entry.preset], filePath: entry.source.filePath, sourceHash: entry.source.hash,
      sourcePackage: { name: sourcePackage.name, version: report.sourceVersions.combinator }, vuePackage }));
  }
  if (!delivered.length) throw new Error('No selected preset sources delivered');
  const deliveredIds = new Set(delivered.map(record => record.id));
  const entries = report.entries.map(({ id, component, preset, source, disposition, reasons }) => ({
    id, component, preset, source, disposition: deliveredIds.has(id) ? 'delivered' : disposition, reasons,
  }));
  return {
    records: delivered,
    coverage: {
      schemaVersion: 1, inputsHash: report.inputsHash, sourceVersions: report.sourceVersions,
      summary: {
        presets: entries.length, delivered: delivered.length,
        remaining: entries.filter(entry => ['eligible/setup-needed', 'unresolved'].includes(entry.disposition)).length,
        dispositions: Object.fromEntries([...new Set(entries.map(entry => entry.disposition))].sort()
          .map(disposition => [disposition, entries.filter(entry => entry.disposition === disposition).length])),
      },
      entries,
    },
  };
}
