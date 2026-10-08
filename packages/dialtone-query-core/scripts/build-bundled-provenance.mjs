import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

/** Strip only the declared repository prefix, retaining semantic directories. */
function normalizeSourcePath(value, sourceRoot) {
  const normalized = value.replaceAll('\\', '/');
  const prefix = sourceRoot.replaceAll('\\', '/').replace(/\/$/, '') + '/';
  return normalized.startsWith(prefix)
    ? normalized.slice(prefix.length)
    : value;
}
function canonicalContent(value, key, sourceRoot) {
  if (Array.isArray(value))
    return value.map((item) => canonicalContent(item, key, sourceRoot));
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((name) => [name, canonicalContent(value[name], name, sourceRoot)]),
    );
  return key === 'sourceFiles' && typeof value === 'string'
    ? normalizeSourcePath(value, sourceRoot)
    : value;
}
/** Exact bytes and normalized content hashes serve distinct purposes. */
export function stampDatasets(inputs, { sourceRoot = root } = {}) {
  const domains = Object.fromEntries(
    [...inputs]
      .sort((a, b) => a.domain.localeCompare(b.domain))
      .map((input) => [
        input.domain,
        {
          package: input.package,
          version: input.version,
          schemaVersion: input.schemaVersion,
          hash: createHash('sha256').update(input.bytes).digest('hex'),
          contentHash: createHash('sha256')
            .update(
              JSON.stringify(
                canonicalContent(JSON.parse(input.bytes), '', sourceRoot),
              ),
            )
            .digest('hex'),
        },
      ]),
  );
  const contentIdentity = Object.fromEntries(
    Object.entries(domains).map(([name, stamp]) => [
      name,
      {
        package: stamp.package,
        version: stamp.version,
        schemaVersion: stamp.schemaVersion,
        contentHash: stamp.contentHash,
      },
    ]),
  );
  return {
    schemaVersion: 1,
    buildHash: createHash('sha256')
      .update(JSON.stringify(contentIdentity))
      .digest('hex'),
    domains,
  };
}
export function buildBundledProvenance() {
  const files = [
    ['utilityClasses', 'dialtone-css', 'lib/dist/dialtone-docs.json', 1],
    ['tokens', 'dialtone-css', 'lib/dist/tokens-docs.json', 1],
    ['components', 'dialtone-vue', 'dist/component-documentation.json', 2],
    ['icons', 'dialtone-icons', 'dist/keywords-icons.json', 1],
    ['documentation', 'dialtone-docs', 'dist/public-docs.json', 1],
    [
      'componentDocumentation',
      'dialtone-docs',
      'dist/component-doc-links.json',
      1,
    ],
  ];
  const stamp = stampDatasets(
    files.map(([domain, folder, artifact, schemaVersion]) => {
      const manifest = JSON.parse(
        readFileSync(resolve(root, 'packages', folder, 'package.json'), 'utf8'),
      );
      const bytes = readFileSync(resolve(root, 'packages', folder, artifact));
      JSON.parse(bytes); // Fail closed instead of stamping malformed artifacts.
      return {
        domain,
        package: manifest.name,
        version: manifest.version,
        schemaVersion,
        bytes,
      };
    }),
  );
  const output = resolve(
    root,
    'packages/dialtone-query-core/src/generated/bundled-provenance.json',
  );
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(stamp, null, 2));
  return stamp;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  buildBundledProvenance();
