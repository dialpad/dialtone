import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import ts from 'typescript';

/** Normalize scan/export paths before deduplication and identity lookup. */
export function uniqueComponentFiles (files, resolveFile = resolve) {
  return [...new Set(files.map(file => resolveFile(file)))];
}

function resolveModule (file, specifier) {
  if (!specifier.startsWith('.')) return null;
  const target = resolve(dirname(file), specifier);
  return [target, `${target}.js`, `${target}.ts`, join(target, 'index.js'), join(target, 'index.ts')]
    .find(candidate => existsSync(candidate) && statSync(candidate).isFile());
}

function readImports (source, file) {
  const imports = new Map();
  for (const statement of source.statements.filter(ts.isImportDeclaration)) {
    const clause = statement.importClause;
    const target = resolveModule(file, statement.moduleSpecifier.text);
    if (!target || !clause) continue;
    if (clause.name) imports.set(clause.name.text, { target, name: 'default' });
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const item of clause.namedBindings.elements) {
        imports.set(item.name.text, { target, name: item.propertyName?.text ?? item.name.text });
      }
    }
  }
  return imports;
}

function namedComponent (item, target, imports, readExports) {
  const name = item.propertyName?.text ?? item.name.text;
  if (target) return readExports(target).get(name);
  const local = imports.get(name);
  return local && readExports(local.target).get(local.name);
}

function readComponentExports (source, file, readExports) {
  const imports = readImports(source, file);
  const exports = new Map();
  for (const statement of source.statements.filter(ts.isExportDeclaration)) {
    const target = statement.moduleSpecifier && resolveModule(file, statement.moduleSpecifier.text);
    if (!statement.exportClause && target) {
      for (const [name, component] of readExports(target)) {
        if (name !== 'default') exports.set(name, component);
      }
    } else if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const item of statement.exportClause.elements) {
        const component = namedComponent(item, target, imports, readExports);
        if (component) exports.set(item.name.text, component);
      }
    }
  }
  return exports;
}

/** Resolve public SFC exports through barrels, including named re-exports. */
export function readPublicComponentExports (packageRoot) {
  const cache = new Map();
  const active = new Set();

  function readExports (file) {
    if (file.endsWith('.vue')) return new Map([['default', file]]);
    if (cache.has(file)) return cache.get(file);
    if (active.has(file)) throw new Error(`Circular component export: ${file}`);
    active.add(file);
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const exports = readComponentExports(source, file, readExports);
    active.delete(file);
    cache.set(file, exports);
    return exports;
  }

  const components = new Map();
  for (const [name, file] of readExports(join(packageRoot, 'index.js'))) {
    const names = components.get(file) ?? [];
    names.push(name);
    components.set(file, names);
  }
  return components;
}

export function withComponentIdentity (doc, file, publicExports, packageRoot, manifest) {
  const exportedNames = publicExports.get(file) ?? [];
  const canonicalName = exportedNames.find(name => /^Dt[A-Z]/.test(name)) ?? exportedNames[0] ?? doc.displayName;
  return {
    ...doc,
    displayName: canonicalName,
    schemaVersion: 2,
    identity: {
      canonicalName,
      aliases: [...new Set([...exportedNames, doc.displayName, basename(file, '.vue')])]
        .filter(name => name !== canonicalName),
      kind: exportedNames.length ? 'public' : 'internal',
      source: { package: manifest.name, version: manifest.version, path: relative(packageRoot, file).split('\\').join('/') },
      imports: exportedNames.map(name => ({
        name,
        from: manifest.name,
        kind: 'root',
        verification: 'source-export',
        package: manifest.name,
        version: manifest.version,
      })),
    },
  };
}
