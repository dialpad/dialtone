import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
// SKILLS_DIR lets a broken copy be checked without editing the shipped skill.
const skillsRoot = process.env.SKILLS_DIR ? resolve(process.env.SKILLS_DIR) : join(packageRoot, 'skills');
const skillNames = readdirSync(skillsRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const read = (path) => readFileSync(path, 'utf8');

function parseSkill (name) {
  const text = read(join(skillsRoot, name, 'SKILL.md'));
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  const frontmatter = match
    ? Object.fromEntries(match[1].split('\n').map((line) => line.match(/^([\w-]+):\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2]]))
    : null;
  return { text, frontmatter, body: match ? text.slice(match[0].length) : text };
}

// The tools and resources the server registers, read from source so the test needs no build.
const querySource = read(join(packageRoot, 'src/query-tools.ts'));
const indexSource = read(join(packageRoot, 'src/index.ts'));
const serverTools = new Set([
  ...[...querySource.matchAll(/^ {2}(search_[a-z_]+): \{/gm)].map((m) => m[1]),
  ...[...querySource.matchAll(/name: '(get_[a-z_]+)'/g)].map((m) => m[1]),
]);
const serverResources = new Set([...indexSource.matchAll(/"(dialtone:\/\/[a-z-]+)"/g)].map((m) => m[1]));

test('the server source still exposes the tools this test reads', () => {
  for (const tool of ['search_components', 'search_tokens', 'search_utility_classes', 'search_icons', 'search_documentation', 'get_component', 'get_documentation']) {
    assert.ok(serverTools.has(tool), `${tool} not found in src/query-tools.ts`);
  }
});

for (const name of skillNames) {
  test(`${name}: frontmatter names the skill and says when to use it`, () => {
    const { frontmatter } = parseSkill(name);
    assert.ok(frontmatter, 'SKILL.md must start with YAML frontmatter');
    assert.equal(frontmatter.name, name, 'frontmatter name must match the folder name');
    assert.match(frontmatter.name, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(frontmatter.description, 'description is required');
    assert.ok(frontmatter.description.length <= 1024, 'description must be at most 1024 characters');
    assert.match(frontmatter.description, /\bUse (before|when)\b/, 'description must say when to use the skill');
  });

  test(`${name}: every MCP tool and resource it names exists in the server`, () => {
    const { text } = parseSkill(name);
    const tools = [...new Set(text.match(/\b(?:search|get)_[a-z_]+\b/g) ?? [])];
    assert.ok(tools.length > 0, 'expected the skill to name lookup tools');
    for (const tool of tools) assert.ok(serverTools.has(tool), `unknown MCP tool ${tool}`);
    for (const uri of text.match(/dialtone:\/\/[a-z-]+/g) ?? []) assert.ok(serverResources.has(uri), `unknown MCP resource ${uri}`);
  });

  test(`${name}: no Dialtone-repo paths or build steps`, () => {
    const { text } = parseSkill(name);
    const internal = /(^|[\s`(])(packages|apps|scripts|\.agents|\.github)\/|pnpm nx|nx run|run-skill-contract-evals/m;
    assert.doesNotMatch(text, internal);
  });

  test(`${name}: relative links resolve inside the skill`, () => {
    const { body } = parseSkill(name);
    for (const [, target] of body.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const path = resolve(skillsRoot, name, target.split('#')[0]);
      assert.ok(path.startsWith(join(skillsRoot, name)), `${target} leaves the skill folder`);
      assert.ok(existsSync(path), `${target} does not exist`);
    }
  });
}

test('use-dialtone lists the reuse order of client-rules.json', () => {
  const { body } = parseSkill('use-dialtone');
  const order = JSON.parse(read(join(packageRoot, 'client-rules.json'))).priority.order;
  assert.deepEqual(order, ['component', 'primitive', 'utility-class', 'token']);
  const section = body.slice(body.indexOf('## Prefer what Dialtone already has'));
  const items = [...section.matchAll(/^\d+\. (.*)$/gm)].map((m) => m[1]);
  const cues = [/component/i, /primitive/i, /utility class/i, /token/i];
  assert.equal(items.length, cues.length, 'one numbered item per client-rules priority');
  items.forEach((item, i) => assert.match(item, cues[i], `item ${i + 1} should be about ${order[i]}`));
});

test('the package ships every skill file', () => {
  const [{ files }] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: packageRoot, encoding: 'utf8' }));
  const shipped = new Set(files.map((f) => f.path));
  for (const name of readdirSync(join(packageRoot, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
    assert.ok(shipped.has(`skills/${name}/SKILL.md`), `skills/${name}/SKILL.md is not in the package`);
  }
});

// Runs the README command in a throwaway app, with the package installed directly and hoisted.
const readme = read(join(packageRoot, 'README.md'));
const copyCommand = readme.slice(readme.indexOf('## Skills')).match(/```bash\n([\s\S]*?)```/)[1];

for (const layout of ['direct', 'hoisted']) {
  test(`README copy step installs use-dialtone (${layout} install)`, (t) => {
    const root = mkdtempSync(join(tmpdir(), 'dialtone-skill-copy-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const app = layout === 'direct' ? root : join(root, 'apps', 'web');
    const scope = join(root, 'node_modules', '@dialpad');
    mkdirSync(scope, { recursive: true });
    mkdirSync(app, { recursive: true });
    symlinkSync(packageRoot, join(scope, 'dialtone-mcp-server'), 'dir');
    // Run twice: an update must replace the copies, not nest them.
    execFileSync('sh', ['-c', copyCommand], { cwd: app });
    execFileSync('sh', ['-c', copyCommand], { cwd: app });
    const source = read(join(packageRoot, 'skills/use-dialtone/SKILL.md'));
    for (const dir of ['.claude/skills', '.agents/skills']) {
      const copied = join(app, dir, 'use-dialtone');
      assert.equal(read(join(copied, 'SKILL.md')), source, `${dir}/use-dialtone/SKILL.md differs from the package`);
      assert.ok(!existsSync(join(copied, 'use-dialtone')), `${dir} copy is nested`);
    }
  });
}

test('README copy step changes nothing when the package is not installed', (t) => {
  const app = mkdtempSync(join(tmpdir(), 'dialtone-skill-missing-'));
  t.after(() => rmSync(app, { recursive: true, force: true }));
  mkdirSync(join(app, '.claude/skills/use-dialtone'), { recursive: true });
  writeFileSync(join(app, '.claude/skills/use-dialtone/SKILL.md'), 'existing copy');
  assert.throws(() => execFileSync('sh', ['-c', copyCommand], { cwd: app, stdio: 'pipe' }));
  assert.equal(read(join(app, '.claude/skills/use-dialtone/SKILL.md')), 'existing copy');
});
