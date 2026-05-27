#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..',
);
const cases = JSON.parse(
  readFileSync(
    join(
      repoRoot,
      '.agents/skills/project-start/evals/project-start-cases.json',
    ),
    'utf8',
  ),
);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .filter(Boolean)
    .slice(0, 6)
    .join('-');
}

function inferType(description, ticketMode) {
  if (ticketMode === 'NO-JIRA') return 'chore';

  const text = description.toLowerCase();
  if (
    text.includes('codex') ||
    text.includes('claude') ||
    text.includes('tooling')
  )
    return 'chore';
  if (/\bdoc(s|umentation)?\b/.test(text)) return 'docs';
  if (
    /\b(test|tests|testing|spec|fixture|flaky|flakiness|eval|evals)\b/.test(
      text,
    )
  )
    return 'test';
  if (/\b(fix|bug|regression|broken)\b/.test(text)) return 'fix';
  return 'feat';
}

function planProjectStart(input, { trackedDirty, untrackedFiles }) {
  const parts = input.trim().split(/\s+/);
  const first = parts[0] ?? '';
  const ticketMatch = first.match(/^DLT-\d+$/);
  const ticketMode =
    first === 'NO-JIRA' ? 'NO-JIRA' : ticketMatch ? first : 'unresolved';
  const description =
    ticketMode === 'unresolved' ? input : parts.slice(1).join(' ');
  const type = inferType(description, ticketMode);
  const branchTicket = ticketMode === 'unresolved' ? 'UNRESOLVED' : ticketMode;

  return {
    ticketMode,
    branch: `${type}/${branchTicket}-${slugify(description)}`,
    jiraAction: 'none',
    canCreateBranch: !trackedDirty && ticketMode !== 'unresolved',
    untrackedPolicy: untrackedFiles.length > 0 ? 'report-only' : 'none',
  };
}

const failures = [];

for (const testCase of cases) {
  const actual = planProjectStart(testCase.input, testCase);
  for (const [key, expectedValue] of Object.entries(testCase.expected)) {
    if (actual[key] !== expectedValue) {
      failures.push(
        `${testCase.id}: expected ${key}=${expectedValue}, got ${actual[key]}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error('Project-start eval failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Project-start eval passed: ${cases.length}/${cases.length} cases`);
