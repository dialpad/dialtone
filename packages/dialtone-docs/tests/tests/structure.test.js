import { describe, test, expect } from 'vitest';
import { fileExists, isDirectory } from '@helpers/fileReader.js';

describe('Package structure', () => {
  describe('Config files', () => {
    test('package.json exists', () => expect(fileExists('package.json')).toBe(true));
    test('project.json exists', () => expect(fileExists('project.json')).toBe(true));
    test('vite.config.js exists', () => expect(fileExists('vite.config.js')).toBe(true));
  });

  describe('Directories', () => {
    test('src/ exists', () => expect(isDirectory('src')).toBe(true));
    test('tests/helpers/ exists', () => expect(isDirectory('tests/helpers')).toBe(true));
    test('tests/tests/ exists', () => expect(isDirectory('tests/tests')).toBe(true));
  });

  describe('Test helpers', () => {
    test('fileReader.js exists', () => expect(fileExists('tests/helpers/fileReader.js')).toBe(true));
    test('frontmatterParser.js exists', () => expect(fileExists('tests/helpers/frontmatterParser.js')).toBe(true));
    test('markdownParser.js exists', () => expect(fileExists('tests/helpers/markdownParser.js')).toBe(true));
  });
});
