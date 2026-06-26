#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    patterns: [/Report only/, /Flag unresolved ticket state/],
  },
  'pr-create': {
    resources: [
      '.agents/resources/pr-template.md',
      '.agents/resources/package-map.md',
    ],
    patterns: [/Do not create Jira tickets/, /public-safe/],
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
    ],
    patterns: [/Use `validator`, never `validate`/, /downstream data/],
  },
  'component-variant': {
    resources: [
      '.agents/resources/rules/combinator-variants.md',
      '.agents/resources/rule-map.md',
      '.agents/resources/package-map.md',
    ],
    patterns: [
      /variants_<component>\.js/,
      /component-wall thumbnail/,
      /Do not rely on repo-external personal variant skills/,
    ],
  },
};

const claudeRuleParityAllowlist = new Map([
  ['claude-config', 'Skip'],
  ['css-specificity', 'Defer'],
  ['dialtone-query-core', 'Skip exact-name parity'],
  ['general-rules', 'Skip exact-name parity'],
  ['link-and-button-navigation', 'Defer'],
  ['slot-class-props', 'Defer'],
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

function getRuleParityDecision(parityBody, ruleName) {
  const rulePath = `.claude/rules/${ruleName}.md`;
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
      if (file.startsWith('.agents/skills/project-start/')) {
        commands.add(
          'node .agents/skills/project-start/evals/run-project-start-evals.mjs',
        );
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

function isReleaseConfig(file) {
  return (
    file.includes('release') ||
    file === '.releaserc' ||
    file === '.releaserc.json'
  );
}

function isBranchStrategy(file) {
  return file.includes('branch') || file === 'AGENTS.md';
}

function isCommitConvention(file) {
  return file === '.github/COMMIT_CONVENTION.md';
}

function docsForChangedFiles(files) {
  const docs = new Set();
  for (const file of files) {
    if (file.startsWith('packages/dialtone-vue/')) {
      docs.add(
        'packages/dialtone-docs/src/content/development/development-component-workflow.md',
      );
      docs.add(
        'packages/dialtone-docs/src/content/reference/reference-component-api-patterns.md',
      );
      docs.add(
        'packages/dialtone-docs/src/content/reference/reference-accessibility-checklist.md',
      );
      docs.add(
        'packages/dialtone-docs/src/content/development/development-testing.md',
      );
    }
    if (file.startsWith('packages/dialtone-tokens/')) {
      docs.add(
        'packages/dialtone-docs/src/content/development/development-design-tokens.md',
      );
      docs.add(
        'packages/dialtone-docs/src/content/architecture/architecture-design-token-pipeline.md',
      );
    }
    if (file.startsWith('packages/dialtone-css/')) {
      docs.add(
        'packages/dialtone-docs/src/content/development/development-css-utilities.md',
      );
    }
    if (file.startsWith('packages/dialtone-icons/')) {
      docs.add(
        'packages/dialtone-docs/src/content/development/development-icons.md',
      );
    }
    if (file.startsWith('.github/workflows/')) {
      docs.add(
        'packages/dialtone-docs/src/content/workflows/workflow-ci-pipeline.md',
      );
    }
    if (isReleaseConfig(file)) {
      docs.add(
        'packages/dialtone-docs/src/content/workflows/workflow-release-process.md',
      );
    }
    if (isBranchStrategy(file)) {
      docs.add(
        'packages/dialtone-docs/src/content/workflows/workflow-branch-strategy.md',
      );
    }
    if (isCommitConvention(file)) {
      docs.add(
        'packages/dialtone-docs/src/content/workflows/workflow-conventional-commits.md',
      );
    }
  }
  return [...docs];
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
}

const ruleMap = read('.agents/resources/rule-map.md');
const codexToolingRules = read('.agents/resources/rules/codex-tooling.md');
const agentToolingParity = read('.agents/resources/agent-tooling-parity.md');
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
      getRuleParityDecision(agentToolingParity, ruleName) ===
        allowlistDecision,
      `.agents/resources/agent-tooling-parity.md missing ${allowlistDecision} entry for .claude/rules/${ruleName}.md`,
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
  for (const expectedDoc of testCase.expectedDocs) {
    assert(
      docs.includes(expectedDoc),
      `${testCase.id} missing doc mapping ${expectedDoc}`,
      failures,
    );
  }
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
