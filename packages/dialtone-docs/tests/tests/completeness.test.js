import { describe, test, expect } from 'vitest';
import { fileExists, isDirectory } from '@helpers/fileReader.js';

describe('Completeness — required docs exist', () => {
  const categories = [
    'src/content/architecture',
    'src/content/development',
    'src/content/workflows',
    'src/content/reference',
    'src/content/standards',
  ];

  test('all category directories exist', () => {
    for (const dir of categories) {
      expect(isDirectory(dir), `${dir} directory missing`).toBe(true);
    }
  });

  test('all category directories have INDEX.md', () => {
    for (const dir of categories) {
      expect(fileExists(`${dir}/INDEX.md`), `${dir}/INDEX.md missing`).toBe(true);
    }
  });

  test('architecture docs exist', () => {
    const required = [
      'src/content/architecture/architecture-monorepo-structure.md',
      'src/content/architecture/architecture-build-system.md',
      'src/content/architecture/architecture-design-token-pipeline.md',
      'src/content/architecture/architecture-documentation-system.md',
    ];
    for (const file of required) {
      expect(fileExists(file), `${file} missing`).toBe(true);
    }
  });

  test('development docs exist', () => {
    const required = [
      'src/content/development/development-component-workflow.md',
      'src/content/development/development-css-utilities.md',
      'src/content/development/development-design-tokens.md',
      'src/content/development/development-icons.md',
      'src/content/development/development-testing.md',
    ];
    for (const file of required) {
      expect(fileExists(file), `${file} missing`).toBe(true);
    }
  });

  test('workflow docs exist', () => {
    const required = [
      'src/content/workflows/workflow-release-process.md',
      'src/content/workflows/workflow-branch-strategy.md',
      'src/content/workflows/workflow-conventional-commits.md',
      'src/content/workflows/workflow-ci-pipeline.md',
      'src/content/workflows/workflow-component-lifecycle.md',
      'src/content/workflows/workflow-figma-sync.md',
    ];
    for (const file of required) {
      expect(fileExists(file), `${file} missing`).toBe(true);
    }
  });

  test('reference docs exist', () => {
    const required = [
      'src/content/reference/reference-component-api-patterns.md',
      'src/content/reference/reference-accessibility-checklist.md',
    ];
    for (const file of required) {
      expect(fileExists(file), `${file} missing`).toBe(true);
    }
  });

  test('standards docs exist', () => {
    const required = [
      'src/content/standards/standard-ai-documentation.md',
      'src/content/standards/standard-geo-optimization.md',
    ];
    for (const file of required) {
      expect(fileExists(file), `${file} missing`).toBe(true);
    }
  });

  test('templates exist', () => {
    expect(fileExists('src/templates/component.md.hbs'), 'component template missing').toBe(true);
    expect(fileExists('src/templates/architecture.md.hbs'), 'architecture template missing').toBe(true);
  });
});
