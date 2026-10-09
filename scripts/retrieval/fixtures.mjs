import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { contractVersion, getProfile } from './profiles.mjs';

const metadataExports = {
  '@dialpad/dialtone': { './*': './dist/*' },
  '@dialpad/dialtone-vue': {
    './component-documentation.json': './dist/component-documentation.json',
  },
  '@dialpad/dialtone-icons': {
    './keywords-icons.json': './dist/keywords-icons.json',
  },
};

export const sha256 = (bytes) =>
  createHash('sha256').update(bytes).digest('hex');

// The caller supplies explicit JSON; this helper never discovers/resolves an installation.
export async function createConsumerFixture(
  parent,
  id,
  { packages = {} } = {},
) {
  const profile = getProfile(id);
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(join(parent, `${id}-`));
  const dependencyRoot = join(directory, profile.layout.dependencyRoot);
  const invocationRoot = join(directory, profile.layout.invocationRoot);
  await mkdir(invocationRoot, { recursive: true });
  await writeFile(
    join(dependencyRoot, 'package.json'),
    JSON.stringify(
      {
        name: `retrieval-${id}`,
        private: true,
        type: 'module',
        dependencies: profile.dependencies,
      },
      null,
      2,
    ),
  );
  const data = [];
  for (const [name, files] of Object.entries(packages)) {
    if (!(name in profile.dependencies))
      throw new Error(`Package ${name} is not declared in ${id}`);
    const root = join(dependencyRoot, 'node_modules', name);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        name,
        version: profile.dependencies[name],
        ...(metadataExports[name] ? { exports: metadataExports[name] } : {}),
      }),
    );
    for (const [path, value] of Object.entries(files)) {
      if (path.startsWith('/') || path.split(/[\\/]/).includes('..'))
        throw new Error(`Unsafe fixture data path: ${path}`);
      const target = join(root, path);
      await mkdir(join(target, '..'), { recursive: true });
      const bytes = JSON.stringify(value);
      await writeFile(target, bytes);
      data.push({ package: name, path, sha256: sha256(bytes) });
    }
  }
  return {
    contractVersion,
    profile: id,
    directory,
    dependencyRoot,
    invocationRoot,
    verification: data.length ? 'lookup-data-only' : 'declaration-only',
    data,
  };
}

// Evidence of a packed artifact is distinct from an installed/build/browser claim.
export async function fingerprintArtifact(profileId, packageRoot, paths) {
  const profile = getProfile(profileId);
  const pkg = JSON.parse(
    await readFile(join(packageRoot, 'package.json'), 'utf8'),
  );
  if (profile.dependencies[pkg.name] !== pkg.version)
    throw new Error(
      `Artifact does not match ${profileId}: ${pkg.name}@${pkg.version}`,
    );
  const data = [];
  for (const path of paths) {
    const bytes = await readFile(join(packageRoot, path));
    const parsed = JSON.parse(bytes);
    data.push({
      path,
      sha256: sha256(bytes),
      shape: Array.isArray(parsed) ? 'array' : typeof parsed,
      records: Array.isArray(parsed)
        ? parsed.length
        : Object.keys(parsed).length,
      schemaVersions: Array.isArray(parsed)
        ? [...new Set(parsed.map((record) => record.schemaVersion ?? null))]
        : [],
    });
  }
  return {
    contractVersion,
    profile: profileId,
    package: pkg.name,
    version: pkg.version,
    verification: 'lookup-data-only',
    data,
  };
}
