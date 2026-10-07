/**
 * @fileoverview Consumer resolution regressions using synthetic package metadata,
 * real filesystem layouts, and the actual ESLint rule/parser.
 */
"use strict";

const assert = require("assert").strict;
const { copyFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { dirname, join } = require("node:path");
const Module = require("module");
const { Linter } = require("eslint");
const parser = require("vue-eslint-parser");
const rule = require("../../../lib/rules/deprecated-class-props");

const UMBRELLA = "@dialpad/dialtone";
const STANDALONE = "@dialpad/dialtone-vue";
const REMOVED = [{ displayName: "DtConsumer", props: [] }];
const SUPPORTED = [{ displayName: "DtConsumer", props: [{ name: "rootClass" }] }];
const code = '<template><dt-consumer root-class="x" /></template>';
const roots = [];

function write (file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value));
}

function project (dependencies = {}, declaredIn = "dependencies") {
  const root = mkdtempSync(join(tmpdir(), "dialtone-eslint-consumer-"));
  roots.push(root);
  mkdirSync(join(root, ".git"));
  write(join(root, "package.json"), { name: "fixture-consumer", [declaredIn]: dependencies });
  return root;
}

function install (root, name, components) {
  const packageDir = join(root, "node_modules", name);
  const umbrella = name === UMBRELLA;
  write(join(packageDir, "package.json"), {
    name,
    version: umbrella ? "10.5.1" : "3.226.0",
    exports: umbrella ? { "./*": "./dist/*" } : {
      "./component-documentation.json": "./dist/component-documentation.json",
    },
  });
  const file = join(packageDir, "dist", umbrella ? "vue3/component-documentation.json" : "component-documentation.json");
  if (components !== undefined) write(file, components);
  return file;
}

function lint (root, filename = join(root, "src", "consumer.vue"), consumerRule = rule, fix = false) {
  const linter = new Linter({ cwd: root });
  const config = [{
    ...(filename === null ? {} : { files: ["**/*.vue"] }),
    languageOptions: { parser },
    plugins: { dialtone: { rules: { "deprecated-class-props": consumerRule } } },
    rules: { "dialtone/deprecated-class-props": "warn" },
  }];
  return {
    messages: linter.verify(code, config, filename ?? undefined),
    ...(fix ? { output: linter.verifyAndFix(code, config, filename ?? undefined).output } : {}),
  };
}

describe("deprecated-class-props consumer metadata resolution", () => {
  let warnings;
  let originalWarn;

  beforeEach(() => {
    warnings = [];
    originalWarn = console.warn;
    console.warn = warning => warnings.push(warning);
  });

  afterEach(() => {
    console.warn = originalWarn;
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  });

  function assertRemoved (root, filename, fix = false) {
    const result = lint(root, filename, rule, fix);
    assert.equal(result.messages.length, 1);
    assert.equal(result.messages[0].messageId, "propRemoved");
    if (fix) assert.equal(result.output, '<template><dt-consumer class="x" /></template>');
    assert.deepEqual(warnings, []);
  }

  function assertUnavailable (root, packageName, consumerRule = rule) {
    assert.deepEqual(lint(root, undefined, consumerRule).messages, []);
    assert.equal(warnings.length, 1);
    assert.ok(/deprecated-class-props/.test(warnings[0]));
    if (packageName) assert.ok(warnings[0].includes(packageName));
  }

  it("activates checks and autofix for a declared umbrella-only consumer", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, REMOVED);
    assertRemoved(root, undefined, true);
  });

  it("activates checks and autofix for a declared standalone-only consumer", () => {
    const root = project({ [STANDALONE]: "^3" });
    install(root, STANDALONE, REMOVED);
    assertRemoved(root, undefined, true);
  });

  for (const declaredIn of ["dependencies", "devDependencies", "peerDependencies"]) {
    it(`uses declared umbrella data before a conflicting declared standalone in ${declaredIn}`, () => {
      const root = project({ [UMBRELLA]: "^10", [STANDALONE]: "^3" }, declaredIn);
      install(root, UMBRELLA, SUPPORTED);
      install(root, STANDALONE, REMOVED);
      assert.deepEqual(lint(root).messages, []);
      assert.deepEqual(warnings, []);
    });
  }

  it("ignores a stray standalone beside a declared umbrella", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, REMOVED);
    install(root, STANDALONE, SUPPORTED);
    assertRemoved(root);
  });

  it("ignores a stray umbrella beside a declared standalone", () => {
    const root = project({ [STANDALONE]: "^3" });
    install(root, STANDALONE, REMOVED);
    install(root, UMBRELLA, SUPPORTED);
    assertRemoved(root);
  });

  it("does not treat undeclared/transitive packages as consumer metadata", () => {
    const root = project({ "some-other-package": "1.0.0" });
    install(root, UMBRELLA, REMOVED);
    install(root, STANDALONE, REMOVED);
    assertUnavailable(root);
  });

  it("warns without substituting standalone data when the declared umbrella is missing", () => {
    const root = project({ [UMBRELLA]: "^10", [STANDALONE]: "^3" });
    install(root, STANDALONE, REMOVED);
    assertUnavailable(root, UMBRELLA);
    assert.deepEqual(lint(root, join(root, "src", "second.vue")).messages, []);
    lint(root, undefined, rule, true);
    assert.equal(warnings.length, 1, "one diagnostic across files and autofix passes");
  });

  it("warns without substituting stray data when the declared umbrella lacks its data export", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA);
    install(root, STANDALONE, REMOVED);
    assertUnavailable(root, UMBRELLA);
  });

  it("does not substitute an umbrella when declared standalone data is missing", () => {
    const root = project({ [STANDALONE]: "^3" });
    install(root, UMBRELLA, REMOVED);
    assertUnavailable(root, STANDALONE);
  });

  it("disables checks gracefully for non-array top-level metadata", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, {});
    install(root, STANDALONE, REMOVED);
    assertUnavailable(root, UMBRELLA);
  });

  it("disables checks gracefully for invalid JSON", () => {
    const root = project({ [STANDALONE]: "^3" });
    const file = install(root, STANDALONE, []);
    writeFileSync(file, "{");
    assertUnavailable(root, STANDALONE);
  });

  it("accepts a valid empty metadata array without a load warning", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, []);
    assert.deepEqual(lint(root).messages, []);
    assert.deepEqual(warnings, []);
  });

  it("does not use metadata from the plugin's own location for an undeclared consumer", () => {
    const consumer = project();
    const plugin = project();
    install(plugin, STANDALONE, REMOVED);
    // Copy just the rule and resolver into an isolated plugin installation.
    // Its data would falsely flag the same DtConsumer identity if the loader
    // fell back to a plugin-relative require instead of the consumer root.
    const pluginLib = join(plugin, "lib");
    for (const file of ["rules/deprecated-class-props.js", "util/consumer-component-data.js"]) {
      const destination = join(pluginLib, file);
      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(join(__dirname, "../../../lib", file), destination);
    }
    const ruleFile = join(pluginLib, "rules/deprecated-class-props.js");
    const pluginRequire = Module.createRequire(ruleFile);
    assert.equal(pluginRequire(`${STANDALONE}/component-documentation.json`)[0].displayName, "DtConsumer");
    assertUnavailable(consumer, undefined, require(ruleFile));
  });

  it("keeps two consumer roots separate in one process", () => {
    const current = project({ [UMBRELLA]: "^10" });
    const legacy = project({ [STANDALONE]: "^3" });
    install(current, UMBRELLA, REMOVED);
    install(legacy, STANDALONE, SUPPORTED);
    assert.deepEqual(lint(legacy).messages, []);
    assertRemoved(current);
    assert.deepEqual(lint(legacy).messages, []);
  });

  it("finds the consumer declaration above a source-directory stub manifest", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, REMOVED);
    write(join(root, "src", "package.json"), { type: "module" });
    assertRemoved(root);
  });

  it("uses ESLint's working directory for virtual input without a physical filename", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, REMOVED);
    assertRemoved(root, null);
  });

  it("uses the linted file's own package when ESLint runs from a parent workspace", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, SUPPORTED);
    const child = join(root, "packages", "legacy");
    write(join(child, "package.json"), { dependencies: { [STANDALONE]: "^3" } });
    install(child, STANDALONE, REMOVED);
    assertRemoved(root, join(child, "src", "consumer.vue"));
  });

  it("does not inherit a declaration across a nested repository boundary", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, REMOVED);
    const child = join(root, "vendor", "other-repo");
    write(join(child, "package.json"), { name: "other-repo" });
    mkdirSync(join(child, ".git"));
    assertUnavailable(child);
  });

  it("resolves a workspace consumer's declared standalone from a hoisted installation", () => {
    const root = project({ [UMBRELLA]: "^10" });
    install(root, UMBRELLA, SUPPORTED);
    install(root, STANDALONE, REMOVED);
    const child = join(root, "packages", "legacy");
    write(join(child, "package.json"), { dependencies: { [STANDALONE]: "^3" } });
    assertRemoved(root, join(child, "src", "consumer.vue"));
  });

  it("ignores NODE_PATH even when a selected package without exports is missing its own file", () => {
    const unrelated = project({ [STANDALONE]: "^3" });
    install(unrelated, STANDALONE, REMOVED);
    const root = project({ [STANDALONE]: "^3" });
    write(join(root, "node_modules", STANDALONE, "package.json"), {
      name: STANDALONE,
      version: "3.226.0",
    });
    // Node's global resolution must remain real to exercise the file-ownership
    // guard; substituting require.resolve here would hide the leakage bug.
    const saved = process.env.NODE_PATH;
    process.env.NODE_PATH = join(unrelated, "node_modules");
    Module._initPaths();
    try {
      assertUnavailable(root, STANDALONE);
    } finally {
      if (saved === undefined) delete process.env.NODE_PATH;
      else process.env.NODE_PATH = saved;
      Module._initPaths();
    }
  });
});
