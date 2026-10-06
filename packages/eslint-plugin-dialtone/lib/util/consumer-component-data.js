/**
 * @fileoverview Resolve component metadata from the linted consumer's declaration.
 */
"use strict";

const { existsSync, readFileSync, realpathSync } = require("fs");
const { createRequire } = require("module");
const { dirname, isAbsolute, join, sep } = require("path");

const PACKAGES = ["@dialpad/dialtone", "@dialpad/dialtone-vue"];
const DEPENDENCIES = ["dependencies", "devDependencies", "peerDependencies"];
const cache = new Map();

function* ancestors (dir) {
  for (;;) {
    yield dir;
    if (dirname(dir) === dir || existsSync(join(dir, ".git"))) return;
    dir = dirname(dir);
  }
}

function findConsumer (fromDir) {
  let nearestManifest;
  for (const dir of ancestors(fromDir)) {
    try {
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
      if (!nearestManifest) nearestManifest = dir;
      // Match DLT-3639's declared umbrella precedence. Standalone consumers
      // must also declare their package; a plugin peer/transitive is not proof.
      const packageName = PACKAGES.find(name =>
        DEPENDENCIES.some(key => typeof pkg?.[key]?.[name] === "string")
      );
      if (packageName) return { dir, packageName };
    } catch {
      // A source-directory stub or unreadable manifest does not hide its parent.
    }
  }
  return { dir: nearestManifest ?? fromDir };
}

function readComponents (consumer) {
  const { packageName } = consumer;
  if (!packageName) return null;
  // Search node_modules explicitly so NODE_PATH cannot supply another app's
  // package. Stop at the repository boundary, but allow hoisted workspace deps.
  for (const dir of ancestors(consumer.dir)) {
    const manifest = join(dir, "node_modules", packageName, "package.json");
    if (!existsSync(manifest)) continue;
    try {
      const subpath = packageName === PACKAGES[0]
        ? "vue3/component-documentation.json"
        : "component-documentation.json";
      const file = realpathSync(createRequire(manifest).resolve(`${packageName}/${subpath}`));
      // Packages without exports can fall through to Node's global lookup.
      // Accept only a file belonging to the selected installed package.
      if (!file.startsWith(realpathSync(dirname(manifest)) + sep)) return null;
      const components = JSON.parse(readFileSync(file, "utf8"));
      return Array.isArray(components) ? components : null;
    } catch {
      // A broken selected installation is not replaced by another version.
      return null;
    }
  }
  return null;
}

module.exports = function consumerComponents (context) {
  const cwd = context.cwd ?? context.getCwd?.() ?? process.cwd();
  const filename = context.physicalFilename ?? context.getPhysicalFilename?.()
    ?? context.filename ?? context.getFilename?.();
  const consumer = findConsumer(filename && isAbsolute(filename) ? dirname(filename) : cwd);
  if (!cache.has(consumer.dir)) {
    const components = readComponents(consumer);
    if (components === null) {
      const problem = consumer.packageName
        ? `Could not load valid component-documentation.json from declared ${consumer.packageName} in ${consumer.dir}.`
        : `No @dialpad/dialtone or @dialpad/dialtone-vue dependency is declared in ${consumer.dir}.`;
      console.warn(
        `[eslint-plugin-dialtone] ${problem} ` +
        "The deprecated-class-props rule will not flag anything for this consumer. " +
        "Check its dependencies and reinstall if needed."
      );
    }
    // Cache each consumer separately; never reuse one project's metadata in
    // another. Restart ESLint after changing declarations or installed data.
    cache.set(consumer.dir, components ?? []);
  }
  return cache.get(consumer.dir);
};
