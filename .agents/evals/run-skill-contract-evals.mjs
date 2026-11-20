#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadMap, matchChangedPaths } from '../../scripts/check-doc-review.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const requiredSections = [
  '## Goal',
  '## Trigger',
  '## Required Context',
  '## Constraints',
  '## Workflow',
  '## Done When',
  '## Verification',
  '## References',
];

const skills = {
  'project-start': {
    resources: [
      '.agents/resources/package-map.md',
      '.agents/resources/agent-tooling-parity.md',
    ],
    patterns: [/NO-JIRA/, /Jira creation is separate/, /chore\/NO-JIRA/],
  },
  'merge-next': {
    resources: [
      '.agents/resources/package-map.md',
      '.agents/resources/agent-tooling-parity.md',
    ],
    patterns: [
      /git merge --no-commit --no-ff/,
      /Do not create a PR/,
      /dialtone-documentation:thumbs -- --force/,
      /Retirement condition/,
      /Wait for user confirmation before committing/,
      /Do not push automatically/,
    ],
  },
  'dialtone-lookup': {
    resources: ['.agents/resources/dialtone-lookup.md'],
    patterns: [
      /Dialtone MCP server/,
      /\.\/node_modules\/\.bin\/dialtone/,
      /Prefer the local `\.\/node_modules\/\.bin\/dialtone` CLI/,
      /Do not guess component APIs/,
    ],
  },
  review: {
    resources: [
      '.agents/resources/rules/general.md',
      '.agents/resources/rule-map.md',
    ],
    patterns: [/Report only/, /Load only rules/],
  },
  validate: {
    resources: [
      '.agents/resources/validation.md',
      '.agents/resources/package-map.md',
    ],
    patterns: [/Do not edit files/, /focused package checks/],
  },
  commit: {
    resources: [
      '.agents/resources/pr-template.md',
      '.agents/resources/validation.md',
    ],
    patterns: [/Stage explicit files only/, /Never create Jira tickets/],
  },
  'pr-prep': {
    resources: [
      '.agents/resources/package-map.md',
      '.agents/resources/validation.md',
      '.agents/resources/doc-sync.md',
      '.agents/resources/pr-template.md',
    ],
    patterns: [
      /\*\*Report-only\*\* \(default for readiness checks\)/,
      /Flag unresolved ticket state/,
      /\*\*Local gates\.\*\*/,
      /Verdict: Ready \| Ready with notes \| Needs fixes \| Needs decision/,
    ],
    references: [
      '.agents/skills/pr-prep/references/adversarial-review.md',
      '.agents/skills/pr-prep/references/reviewer-lens.md',
      '.agents/skills/pr-prep/references/local-gates.md',
      '.agents/skills/pr-prep/references/specialists/keyboard-aria.md',
      '.agents/skills/pr-prep/references/specialists/css.md',
      '.agents/skills/pr-prep/references/specialists/codemods.md',
      '.agents/skills/pr-prep/references/specialists/icons.md',
    ],
  },
  'pr-create': {
    resources: [
      '.agents/resources/pr-template.md',
      '.agents/resources/package-map.md',
    ],
    patterns: [
      /Do not create Jira tickets/,
      /public-safe/,
      /Check prep before any PR write/,
    ],
  },
  'pr-comments': {
    resources: [
      '.agents/resources/rule-map.md',
      '.agents/resources/validation.md',
    ],
    patterns: [/Fetch actual inline comments/, /public replies/],
  },
  'pr-complete': {
    resources: ['.agents/resources/package-map.md'],
    patterns: [/For `NO-JIRA`, skip Jira entirely/, /Ask before deleting/],
  },
  'doc-sync-check': {
    resources: [
      '.agents/resources/doc-sync.md',
      '.agents/resources/validation.md',
    ],
    patterns: [/Default mode is report-only/, /ask before applying/],
  },
  'component-work': {
    resources: [
      '.agents/resources/rule-map.md',
      '.agents/resources/validation.md',
      '.agents/resources/doc-sync.md',
      '.agents/resources/package-map.md',
      '.agents/resources/rules/combinator-variants.md',
      '.agents/resources/rules/vue-components.md',
    ],
    patterns: [
      /Use `validator`, never `validate`/,
      /downstream data/,
      /## Before You Build/,
      /breaking change/,
    ],
    references: [
      '.agents/skills/component-work/references/variants.md',
      '.agents/skills/pr-prep/references/specialists/keyboard-aria.md',
      '.agents/skills/pr-prep/references/specialists/css.md',
    ],
  },
  'icon-work': {
    resources: [
      '.agents/resources/validation.md',
      '.agents/resources/rules/icons.md',
      '.agents/resources/dialtone-lookup.md',
    ],
    patterns: [
      /## Before You Build/,
      /centred in its viewBox/,
      /no `stroke`, `stroke-width` or `stroke-linecap`/i,
      /singular name unless the object itself is plural/,
      /A category folder with no key in the JSON crashes the build/,
    ],
    references: ['.agents/skills/pr-prep/references/specialists/icons.md'],
  },
  'migration-work': {
    resources: [
      '.agents/resources/validation.md',
      '.agents/resources/rules/logical-naming.md',
      '.agents/resources/rules/vue-components.md',
    ],
    patterns: [
      /### 1\. Is it breaking\?/,
      /BREAKING CHANGE:/,
      /drops the body/,
      /A second run changes nothing/,
    ],
    references: ['.agents/skills/pr-prep/references/specialists/codemods.md'],
  },
};

const claudeRuleParityAllowlist = new Map([
  ['claude-config', 'Skip'],
  ['css-specificity', 'Defer'],
  ['dialtone-query-core', 'Skip exact-name parity'],
  ['general-rules', 'Skip exact-name parity'],
  ['link-and-button-navigation', 'Defer'],
  ['slot-class-props', 'Skip exact-name parity'],
]);

// Shared skills with no thin Claude wrapper yet. Remove a name once its wrapper exists.
const claudeWrapperPendingAllowlist = new Map([
  ['commit', 'No Claude wrapper yet'],
  ['dialtone-lookup', 'No Claude wrapper yet'],
  ['doc-sync-check', 'No Claude wrapper yet'],
  ['merge-next', 'Full Claude copy, not yet a thin wrapper'],
  ['pr-comments', 'No Claude wrapper yet'],
  ['pr-complete', 'No Claude wrapper yet'],
  ['pr-create', 'No Claude wrapper yet'],
  ['project-start', 'No Claude wrapper yet'],
  ['review', 'Full Claude copy, not yet a thin wrapper'],
  ['validate', 'No Claude wrapper yet'],
]);

const agentRuleParityAllowlist = new Map([
  ['codex-tooling', 'Codex-only'],
  ['general', 'Skip exact-name parity'],
  ['query-core', 'Skip exact-name parity'],
]);

function read(relativePath) {
  return readFileSync(join(repoRoot, relativePath), 'utf8');
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

function markdownTableCells(row) {
  return row
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim().replace(/^`(.+)`$/, '$1'));
}

function getRuleParityDecision(
  parityBody,
  ruleName,
  ruleRoot = '.claude/rules',
) {
  const rulePath = `${ruleRoot}/${ruleName}.md`;
  for (const line of parityBody.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = markdownTableCells(line);
    if (cells[0] === rulePath) return cells[2] ?? null;
  }
  return null;
}

function commandsForChangedFiles(files) {
  const commands = new Set();
  for (const file of files) {
    const isAgentToolingFile =
      file === 'AGENTS.md' || file.startsWith('.agents/');
    const isCodexRuntimeFile = file.startsWith('.codex/');
    const isCodexMarkdownFile = isCodexRuntimeFile && file.endsWith('.md');
    const isCodexScriptFile = isCodexRuntimeFile && file.endsWith('.mjs');

    if (isAgentToolingFile || isCodexRuntimeFile) {
      commands.add('node .agents/evals/run-skill-contract-evals.mjs');
      // Skills with their own behavior-eval runner follow the
      // .agents/skills/<name>/evals/run-<name>-evals.mjs convention.
      const skillMatch = file.match(/^\.agents\/skills\/([^/]+)\//);
      if (skillMatch) {
        const runner = `.agents/skills/${skillMatch[1]}/evals/run-${skillMatch[1]}-evals.mjs`;
        if (existsSync(join(repoRoot, runner))) {
          commands.add(`node ${runner}`);
        }
      }
    }
    if (isAgentToolingFile) {
      commands.add('pnpm exec markdownlint AGENTS.md .agents/**/*.md');
      commands.add(
        'pnpm exec prettier --check --single-quote AGENTS.md .agents/**/*.md .agents/**/*.mjs',
      );
    }
    if (isCodexMarkdownFile) {
      commands.add(`pnpm exec markdownlint ${file}`);
      commands.add(`pnpm exec prettier --check --single-quote ${file}`);
    }
    if (isCodexScriptFile) {
      commands.add(`pnpm exec prettier --check --single-quote ${file}`);
    }
    if (isCodexRuntimeFile) {
      commands.add('./node_modules/.bin/dialtone --help');
    }
    if (file.startsWith('packages/dialtone-vue/')) {
      commands.add('pnpm nx run dialtone-vue:test');
      commands.add('pnpm nx run dialtone-vue:lint');
      commands.add('pnpm nx run dialtone-vue:build');
    }
    if (file.startsWith('packages/dialtone-css/')) {
      commands.add('pnpm nx run dialtone-css:lint');
      commands.add('pnpm nx run dialtone-css:build');
    }
    if (file.startsWith('packages/dialtone-tokens/')) {
      commands.add('pnpm nx run dialtone-tokens:build');
    }
    if (file.startsWith('packages/dialtone-icons/')) {
      commands.add('pnpm nx run dialtone-icons:build');
    }
    if (file.startsWith('packages/combinator/')) {
      commands.add('pnpm --dir packages/combinator test');
      commands.add('pnpm --dir packages/combinator exec eslint src');
      commands.add('pnpm nx run dialtone-combinator:build');
    }
    if (file.startsWith('apps/dialtone-documentation/')) {
      commands.add('pnpm nx run dialtone-documentation:lint');
      commands.add('pnpm nx run dialtone-documentation:build');
    }
    if (file.startsWith('packages/dialtone-docs/')) {
      commands.add('pnpm nx run dialtone-docs:build');
      commands.add('pnpm nx run dialtone-docs:test');
    }
    if (file.startsWith('packages/dialtone-query-core/')) {
      commands.add('pnpm nx run dialtone-query-core:test');
      commands.add('pnpm nx run dialtone-query-core:build');
    }
    if (file.startsWith('packages/dialtone-mcp-server/')) {
      commands.add('pnpm nx run dialtone-mcp-server:build');
    }
    if (file.startsWith('packages/dialtone-cli/')) {
      commands.add('pnpm nx run dialtone-cli:build');
    }
    if (file.startsWith('packages/language-server/')) {
      commands.add('pnpm nx run language-server:build');
    }
    if (file.startsWith('packages/eslint-plugin-dialtone/')) {
      commands.add('pnpm nx run eslint-plugin-dialtone:test');
    }
    if (file.startsWith('packages/stylelint-plugin-dialtone/')) {
      commands.add('pnpm nx run stylelint-plugin-dialtone:test');
    }
    if (file.startsWith('packages/postcss-responsive-variations/')) {
      commands.add('pnpm nx run postcss-responsive-variations:test');
    }
  }
  return [...commands];
}

function docsForChangedFiles(files) {
  const candidates = matchChangedPaths(files, loadMap(repoRoot)).candidates;
  return [...new Set(candidates.flatMap(candidate => candidate.targets.map(target => target.path)))];
}

function prCreatePolicy(caseData) {
  const isCodex = caseData.changedFiles.some(
    (file) =>
      file === 'AGENTS.md' ||
      file.startsWith('.agents/') ||
      file.startsWith('.codex/'),
  );
  const hasVue = caseData.changedFiles.some((file) =>
    file.startsWith('packages/dialtone-vue/'),
  );
  const hasCss = caseData.changedFiles.some((file) =>
    file.startsWith('packages/dialtone-css/'),
  );
  const hasBreakingChange =
    caseData.changeType === 'breaking' ||
    Boolean(caseData.removals?.length) ||
    Boolean(caseData.renames?.length);
  const hasFeatureChange =
    caseData.changeType === 'feature' || Boolean(caseData.newExports?.length);
  const type = hasBreakingChange
    ? 'feat!'
    : hasFeatureChange || hasVue
      ? 'feat'
      : isCodex
        ? 'chore'
        : 'chore';
  return {
    titlePrefix: `${type}: ${caseData.ticketMode}`,
    includeVueChecklist: hasVue,
    includeCssChecklist: hasCss,
    allowJiraCreation: false,
  };
}

function topLevelCommentIds(comments) {
  return comments
    .filter((comment) => comment.in_reply_to_id == null)
    .map((comment) => comment.id);
}

function prCompleteAction(caseData) {
  if (!caseData.merged) return 'stop-unmerged';
  if (caseData.dirty) return 'stop-dirty';
  return 'switch-to-staging';
}

// Problems with a Claude wrapper: it must copy the shared frontmatter and only load the shared file.
function wrapperProblems(sharedPath, wrapperPath) {
  const frontmatter = (text) => text.match(/^---\n(.*?)\n---\n/s);
  const shared = frontmatter(read(sharedPath));
  const wrapperText = read(wrapperPath);
  const wrapper = frontmatter(wrapperText);
  const problems = [];
  if (!shared || !wrapper || wrapper[1] !== shared[1]) {
    problems.push(`${wrapperPath} frontmatter must match ${sharedPath}`);
  }
  const body = wrapper
    ? wrapperText.slice(wrapper[0].length).trim()
    : wrapperText;
  const sharedDir = sharedPath.replace(/SKILL\.md$/, '');
  const loadOnly = `Load \`${sharedPath}\` and follow it. It is the single source for this skill; this wrapper adds no rules. Relative links resolve from \`${sharedDir}\`; backticked paths are from the repo root.`;
  if (body !== loadOnly) {
    problems.push(`${wrapperPath} must only load the shared skill`);
  }
  return problems;
}

const failures = [];

for (const [skillName, config] of Object.entries(skills)) {
  const path = `.agents/skills/${skillName}/SKILL.md`;
  assert(existsSync(join(repoRoot, path)), `missing ${path}`, failures);
  if (!existsSync(join(repoRoot, path))) continue;

  const body = read(path);
  assert(
    /^---\nname: .+\ndescription: .+\n---/s.test(body),
    `${path} has invalid frontmatter`,
    failures,
  );
  assert(!/TODO|\[TODO/i.test(body), `${path} contains TODO text`, failures);

  for (const section of requiredSections) {
    assert(body.includes(section), `${path} missing ${section}`, failures);
  }

  for (const resource of config.resources) {
    assert(
      existsSync(join(repoRoot, resource)),
      `${path} references missing ${resource}`,
      failures,
    );
    assert(
      body.includes(resource),
      `${path} does not list ${resource}`,
      failures,
    );
  }

  for (const pattern of config.patterns) {
    assert(
      pattern.test(body),
      `${path} missing required pattern ${pattern}`,
      failures,
    );
  }

  for (const reference of config.references ?? []) {
    assert(
      existsSync(join(repoRoot, reference)),
      `${path} references missing ${reference}`,
      failures,
    );
    assert(
      body.includes(reference.replace(`.agents/skills/${skillName}/`, '')),
      `${path} does not link ${reference}`,
      failures,
    );
  }
}

// Every shared skill has a thin Claude wrapper: same frontmatter, no rules.
// Claude-only checks run only when .claude exists, so Codex validation never depends on it.
const sharedSkillNames = readdirSync(join(repoRoot, '.agents/skills'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const name of sharedSkillNames) {
  assert(
    existsSync(join(repoRoot, `.agents/skills/${name}/SKILL.md`)),
    `.agents/skills/${name}/SKILL.md is missing`,
    failures,
  );
}

if (existsSync(join(repoRoot, '.claude'))) {

  for (const name of sharedSkillNames) {
    const sharedPath = `.agents/skills/${name}/SKILL.md`;
    const wrapperPath = `.claude/skills/${name}/SKILL.md`;
    if (!existsSync(join(repoRoot, sharedPath))) continue;
    const wrapperExists = existsSync(join(repoRoot, wrapperPath));
    const problems = wrapperExists
      ? wrapperProblems(sharedPath, wrapperPath)
      : [];

    if (claudeWrapperPendingAllowlist.has(name)) {
      assert(
        !wrapperExists || problems.length > 0,
        `${wrapperPath} is now a thin wrapper; remove ${name} from claudeWrapperPendingAllowlist`,
        failures,
      );
      continue;
    }
    assert(
      wrapperExists,
      `${wrapperPath} is missing and ${name} is not in claudeWrapperPendingAllowlist`,
      failures,
    );
    for (const problem of problems) assert(false, problem, failures);
  }

  for (const name of claudeWrapperPendingAllowlist.keys()) {
    assert(
      sharedSkillNames.includes(name),
      `.agents/skills/${name}/SKILL.md no longer exists; remove ${name} from claudeWrapperPendingAllowlist`,
      failures,
    );
  }

  // A wrapper must not point at a shared skill that no longer exists.
  const claudeSkillsDir = join(repoRoot, '.claude/skills');
  const claudeSkillNames = existsSync(claudeSkillsDir)
    ? readdirSync(claudeSkillsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];
  for (const name of claudeSkillNames) {
    const wrapperPath = `.claude/skills/${name}/SKILL.md`;
    if (!existsSync(join(repoRoot, wrapperPath))) continue;
    const loads = read(wrapperPath).matchAll(
      /\.agents\/skills\/[\w-]+\/SKILL\.md/g,
    );
    for (const [sharedPath] of loads) {
      assert(
        existsSync(join(repoRoot, sharedPath)),
        `${wrapperPath} loads ${sharedPath}, which does not exist`,
        failures,
      );
    }
  }
}

// /pr-fill must check the prep verdict before its first PR write.
if (existsSync(join(repoRoot, '.claude/commands/pr-fill.md'))) {
  const prFill = read('.claude/commands/pr-fill.md');
  const check = prFill.indexOf('Verdict record');
  const firstWrite = prFill.indexOf('gh pr edit');
  assert(
    check !== -1 && firstWrite !== -1 && check < firstWrite,
    '.claude/commands/pr-fill.md must check the pr-prep verdict before its first gh pr edit',
    failures,
  );
}

const ruleMap = read('.agents/resources/rule-map.md');
const codexToolingRules = read('.agents/resources/rules/codex-tooling.md');
const agentToolingParity = read('.agents/resources/agent-tooling-parity.md');
assert(
  read('CLAUDE.md').startsWith('@AGENTS.md\n'),
  'CLAUDE.md must import the shared root AGENTS.md policy',
  failures,
);
const componentInstructions = 'packages/dialtone-vue/components/CLAUDE.md';
const sharedVueRule = '.agents/resources/rules/vue-components.md';
assert(
  existsSync(join(repoRoot, componentInstructions)) &&
    read(componentInstructions).trim() === `@../../../${sharedVueRule}` &&
    existsSync(
      resolve(
        repoRoot,
        dirname(componentInstructions),
        `../../../${sharedVueRule}`,
      ),
    ),
  `${componentInstructions} must import the shared Vue policy`,
  failures,
);
for (const ruleName of ['vue-components', 'slot-class-props']) {
  const adapter = `.claude/rules/${ruleName}.md`;
  assert(
    /^---\npaths:\n {2}- ["']packages\/dialtone-vue\/components\/\*\*["']\n---/.test(
      read(adapter),
    ),
    `${adapter} must remain scoped to Vue component files`,
    failures,
  );
  assert(
    read(adapter).includes(`](../../${sharedVueRule})`) &&
      existsSync(join(repoRoot, sharedVueRule)) &&
      ruleMap.includes(sharedVueRule),
    `${adapter} and the Codex rule map must route to ${sharedVueRule}`,
    failures,
  );
}
const badRuleParityFixture = `
| Claude rule | Codex peer or status | Decision | Rationale |
| --- | --- | --- | --- |
| \`.claude/rules/css-specificity.md\` | No exact Codex peer yet | Skip | Wrong decision for this row. |
| \`.claude/rules/slot-class-props.md\` | No exact Codex peer yet | Defer | Correct decision for a different row. |
`;
const claudeRulesPath = ['.claude', 'rules'].join('/');
assert(
  !ruleMap.includes(claudeRulesPath),
  '.agents/resources/rule-map.md must not route Codex runtime rules to Claude rule files',
  failures,
);

const mappedRulePaths = [
  ...ruleMap.matchAll(/\.agents\/resources\/rules\/[a-z0-9-]+\.md/g),
].map((match) => match[0]);
assert(
  mappedRulePaths.length > 0,
  '.agents/resources/rule-map.md does not reference Codex rule resources',
  failures,
);

for (const rulePath of new Set(mappedRulePaths)) {
  assert(
    existsSync(join(repoRoot, rulePath)),
    `.agents/resources/rule-map.md references missing ${rulePath}`,
    failures,
  );
}

assert(
  codexToolingRules.includes('first-class harness alongside Claude tooling') &&
    codexToolingRules.includes('Do not gate Codex validation on `.claude/**`'),
  '.agents/resources/rules/codex-tooling.md must document Codex and Claude harness coexistence',
  failures,
);

assert(
  getRuleParityDecision(badRuleParityFixture, 'css-specificity') !== 'Defer',
  'rule parity decision checks must match the decision on the same row as the Claude rule',
  failures,
);

const claudeRuleNames = readdirSync(join(repoRoot, '.claude/rules'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''));
const claudeRuleNameSet = new Set(claudeRuleNames);

const agentRuleNames = new Set(
  readdirSync(join(repoRoot, '.agents/resources/rules'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, '')),
);

for (const ruleName of claudeRuleNames) {
  const peerExists = agentRuleNames.has(ruleName);
  const allowlistDecision = claudeRuleParityAllowlist.get(ruleName);

  assert(
    peerExists || allowlistDecision,
    `.claude/rules/${ruleName}.md is missing .agents/resources/rules/${ruleName}.md and has no Defer/Skip entry`,
    failures,
  );

  if (allowlistDecision) {
    assert(
      getRuleParityDecision(agentToolingParity, ruleName) === allowlistDecision,
      `.agents/resources/agent-tooling-parity.md missing ${allowlistDecision} entry for .claude/rules/${ruleName}.md`,
      failures,
    );
  }
}

for (const ruleName of agentRuleNames) {
  const peerExists = claudeRuleNameSet.has(ruleName);
  const allowlistDecision = agentRuleParityAllowlist.get(ruleName);

  assert(
    peerExists || allowlistDecision,
    `.agents/resources/rules/${ruleName}.md is missing .claude/rules/${ruleName}.md and has no Codex-only/Skip entry`,
    failures,
  );

  if (allowlistDecision) {
    assert(
      getRuleParityDecision(
        agentToolingParity,
        ruleName,
        '.agents/resources/rules',
      ) === allowlistDecision,
      `.agents/resources/agent-tooling-parity.md missing ${allowlistDecision} entry for .agents/resources/rules/${ruleName}.md`,
      failures,
    );
  }
}

for (const ruleName of claudeRuleParityAllowlist.keys()) {
  assert(
    !agentRuleNames.has(ruleName),
    `.agents/resources/rules/${ruleName}.md now exists; remove ${ruleName} from claudeRuleParityAllowlist`,
    failures,
  );
}

for (const ruleName of agentRuleParityAllowlist.keys()) {
  assert(
    !claudeRuleNameSet.has(ruleName),
    `.claude/rules/${ruleName}.md now exists; remove ${ruleName} from agentRuleParityAllowlist`,
    failures,
  );
}

assert(
  existsSync(join(repoRoot, '.codex/config.toml')),
  'missing .codex/config.toml for Dialtone MCP runtime config',
  failures,
);
if (existsSync(join(repoRoot, '.codex/config.toml'))) {
  const codexConfig = read('.codex/config.toml');
  assert(
    codexConfig.includes('[mcp_servers.dialtone]'),
    '.codex/config.toml must register the Dialtone MCP server',
    failures,
  );
  assert(
    codexConfig.includes('./node_modules/.bin/dialtone-mcp-server'),
    '.codex/config.toml must use the local Dialtone MCP server binary',
    failures,
  );
  assert(
    codexConfig.includes('"search_documentation"'),
    '.codex/config.toml must enable search_documentation',
    failures,
  );
}

const validationCases = JSON.parse(
  read('.agents/skills/validate/evals/changed-paths.json'),
);
for (const testCase of validationCases) {
  const commands = commandsForChangedFiles(testCase.changedFiles);
  for (const expectedCommand of testCase.expectedCommands) {
    assert(
      commands.includes(expectedCommand),
      `${testCase.id} missing validation command ${expectedCommand}`,
      failures,
    );
  }
}

const docCases = JSON.parse(
  read('.agents/skills/doc-sync-check/evals/source-docs-map.json'),
);
for (const testCase of docCases) {
  const docs = docsForChangedFiles(testCase.changedFiles);
  const expectedDocs = [...new Set(testCase.expectedDocs)];
  assert(
    docs.length === expectedDocs.length && expectedDocs.every((expectedDoc) => docs.includes(expectedDoc)),
    `${testCase.id} expected doc mappings ${JSON.stringify(expectedDocs)}, got ${JSON.stringify(docs)}`,
    failures,
  );
}

const prCreateCases = JSON.parse(
  read('.agents/skills/pr-create/evals/template-scenarios.json'),
);
for (const testCase of prCreateCases) {
  const actual = prCreatePolicy(testCase);
  for (const [key, expectedValue] of Object.entries(testCase.expected)) {
    assert(
      actual[key] === expectedValue,
      `${testCase.id} expected ${key}=${expectedValue}, got ${actual[key]}`,
      failures,
    );
  }
}

const commentCases = JSON.parse(
  read('.agents/skills/pr-comments/evals/review-comments.json'),
);
for (const testCase of commentCases) {
  const actualIds = topLevelCommentIds(testCase.comments);
  assert(
    JSON.stringify(actualIds) === JSON.stringify(testCase.expectedTopLevelIds),
    `${testCase.id} did not preserve top-level comment ids`,
    failures,
  );
}

const completeCases = JSON.parse(
  read('.agents/skills/pr-complete/evals/closeout-scenarios.json'),
);
for (const testCase of completeCases) {
  const actualAction = prCompleteAction(testCase);
  assert(
    actualAction === testCase.expectedAction,
    `${testCase.id} expected ${testCase.expectedAction}, got ${actualAction}`,
    failures,
  );
  const actualJira =
    testCase.ticketMode === 'NO-JIRA' ? 'none' : 'separate-explicit-action';
  assert(
    actualJira === testCase.jiraAction,
    `${testCase.id} expected jiraAction=${testCase.jiraAction}, got ${actualJira}`,
    failures,
  );
}

if (failures.length > 0) {
  console.error('Skill contract eval failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Skill contract eval passed: ${Object.keys(skills).length} skills and fixture checks`,
);
