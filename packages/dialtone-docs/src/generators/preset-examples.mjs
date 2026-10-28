import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeComponentName } from '../../../../scripts/lib/component-name.mjs';
import { presetExampleId } from '../../../../scripts/lib/preset-example-id.mjs';
import { assembleExampleRecord, publicIdentities } from './documentation-examples.mjs';
import { assertTemplateBindings } from './example-template.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const read = path => {
  if (isAbsolute(path) || path.split('/').includes('..')) throw new Error(`Invalid preset source path: ${path}`);
  return readFileSync(resolve(root, path));
};

/** Plain JSON is the only bridge from the Vue-aware producer to documentation generation. */
export function buildPresetExampleRecords(report, { records, vuePackage }) {
  if (report?.schemaVersion !== 1 || !Array.isArray(report.inputs)
    || !report.inputs.length || !Array.isArray(report.entries)
    || typeof report.sourceVersions?.vueComponents !== 'string') {
    throw new Error('Missing preset intermediate; run dialtone-combinator:generate-examples');
  }
  const currentHash = hash(JSON.stringify(report.inputs.map(path => [path, hash(read(path))])));
  if (currentHash !== report.inputsHash) throw new Error('Stale preset intermediate; rerun dialtone-combinator:generate-examples');
  const sourcePackage = JSON.parse(read('packages/combinator/package.json'));
  if (report.sourceVersions.combinator !== sourcePackage.version) {
    throw new Error('Preset source version mismatch; rerun dialtone-combinator:generate-examples');
  }
  const ids = new Set();
  const delivered = [];
  const publicComponents = new Set(publicIdentities(vuePackage)
    .filter(identity => identity.kind === 'public').map(identity => identity.canonicalName));
  const dispositions = new Set(['eligible/setup-needed', 'unresolved', 'policy-excluded', 'deprecated']);
  const classified = report.entries.map(entry => {
    if (!entry || !['id', 'component', 'preset'].every(key => typeof entry[key] === 'string' && entry[key])
      || !dispositions.has(entry.disposition) || !Array.isArray(entry.reasons)
      || !Array.isArray(entry.requiredContext) || entry.source?.kind !== 'combinator-preset'
      || typeof entry.source.filePath !== 'string' || typeof entry.source.hash !== 'string'
      || (entry.disposition === 'eligible/setup-needed'
        && (typeof entry.template !== 'string' || !Array.isArray(entry.imports)
          || !entry.imports.every(name => typeof name === 'string')))) {
      throw new Error('Invalid preset intermediate entry; rerun dialtone-combinator:generate-examples');
    }
    return { ...entry, reasons: [...entry.reasons] };
  });
  for (const entry of classified) {
    if (ids.has(entry.id)) throw new Error(`Duplicate preset ID: ${entry.id}`);
    ids.add(entry.id);
    if (entry.id !== presetExampleId(entry.component, entry.preset)) {
      throw new Error(`Preset source identity changed: ${entry.id}`);
    }
    if (hash(read(entry.source.filePath)) !== entry.source.hash) throw new Error(`Preset source changed: ${entry.id}`);
    if (entry.disposition !== 'eligible/setup-needed') continue;
    const page = records.find(record => !record.example && record.category === 'components'
      && normalizeComponentName(record.docTitle) === normalizeComponentName(entry.component));
    if (!page) {
      entry.disposition = 'unresolved';
      entry.reasons.push(`Documentation subject unavailable: ${entry.component}`);
      continue;
    }
    try {
      assertTemplateBindings(entry.template);
    } catch (error) {
      if (!error.message.startsWith('Unresolved template bindings:')) throw error;
      entry.disposition = 'unresolved';
      entry.reasons.push(`Bindings unresolved: ${error.message}`);
      continue;
    }
    const components = entry.imports.filter(name => publicComponents.has(name));
    const icons = entry.imports.filter(name => !publicComponents.has(name));
    const definition = {
      components, icons, directives: [], sourceKind: 'combinator-preset', preset: entry.preset,
      materializationVersion: report.sourceVersions.vueComponents,
      responsibilities: `Initial-state fixture from Combinator copy. No application update handlers or persistence are supplied. ${(entry.requiredContext ?? []).join(' ')}`,
      interaction: 'Copied presentation is not an interaction or accessibility result; verify the containing application.',
    };
    delivered.push(assembleExampleRecord({ id: entry.id, template: entry.template, definition,
      source: { ...page, id: `combinator/${entry.component}#${encodeURIComponent(entry.preset)}` },
      headingPath: ['Combinator preset', entry.preset], filePath: entry.source.filePath, sourceHash: entry.source.hash,
      sourcePackage: { name: sourcePackage.name, version: report.sourceVersions.combinator }, vuePackage }));
  }
  const deliveredIds = new Set(delivered.map(record => record.id));
  const entries = classified.map(({ id, component, preset, source, disposition, reasons }) => ({
    id, component, preset, source, disposition: deliveredIds.has(id) ? 'delivered' : disposition, reasons,
  }));
  return {
    records: delivered,
    coverage: {
      schemaVersion: 1, inputsHash: report.inputsHash, sourceVersions: report.sourceVersions,
      summary: {
        presets: entries.length, delivered: delivered.length,
        consumerVerified: delivered.filter(record => record.example.validation.consumerBuild === 'built'
          && record.example.validation.api === 'passed').length,
        unverified: delivered.filter(record => record.example.validation.consumerBuild !== 'built'
          || record.example.validation.api !== 'passed').length,
        remaining: entries.filter(entry => ['eligible/setup-needed', 'unresolved'].includes(entry.disposition)).length,
        dispositions: Object.fromEntries([...new Set(entries.map(entry => entry.disposition))].sort()
          .map(disposition => [disposition, entries.filter(entry => entry.disposition === disposition).length])),
      },
      entries,
    },
  };
}
