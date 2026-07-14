#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..',
);
const skillPath = join(repoRoot, '.agents/skills/merge-next/SKILL.md');
const cases = JSON.parse(
  readFileSync(
    join(repoRoot, '.agents/skills/merge-next/evals/merge-next-cases.json'),
    'utf8',
  ),
);

function nextAction(state) {
  if (state.dirty) return 'stop-dirty';
  if (state.unresolvedConflicts) return 'stop-conflicts';
  if (!state.migrationComplete) return 'run-migration';
  if (!state.thumbnailsFresh) return 'regenerate-thumbnails';
  if (!state.userApproved) return 'wait-user-review';
  if (!state.committed) return 'commit-merge';
  if (!state.validationComplete) return 'run-validation';
  if (!state.pushApproved) return 'wait-push-approval';
  return 'push';
}

const failures = [];

for (const testCase of cases) {
  const actual = nextAction(testCase.state);
  if (actual !== testCase.expectedAction) {
    failures.push(
      `${testCase.id}: expected ${testCase.expectedAction}, got ${actual}`,
    );
  }
}

if (!existsSync(skillPath)) {
  failures.push('missing .agents/skills/merge-next/SKILL.md');
} else {
  const body = readFileSync(skillPath, 'utf8');
  const orderedSteps = [
    'git status --short --branch',
    'git merge --no-commit --no-ff origin/staging',
    'merge-migrate-color-stops.mjs',
    'dialtone-documentation:thumbs -- --force',
    'Wait for user confirmation before committing',
    'git commit --no-edit',
    'pnpm nx run dialtone:build',
    'git push origin next',
  ];
  let previousIndex = -1;
  for (const step of orderedSteps) {
    const index = body.indexOf(step);
    if (index === -1) {
      failures.push(`skill is missing ordered step: ${step}`);
    } else if (index < previousIndex) {
      failures.push(`skill step is out of order: ${step}`);
    }
    previousIndex = Math.max(previousIndex, index);
  }

  if (!body.includes('Retirement condition')) {
    failures.push('skill is missing its retirement condition');
  }
}

if (failures.length > 0) {
  console.error('Merge-next eval failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Merge-next eval passed: ${cases.length}/${cases.length} cases`);
