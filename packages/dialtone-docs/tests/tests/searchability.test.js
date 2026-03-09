import { describe, test, expect } from 'vitest';
import { findFiles, readFile } from '@helpers/fileReader.js';

describe('Searchability — content uses actual names', () => {
  let allContent;

  async function getAllContent() {
    if (allContent) return allContent;
    const files = await findFiles('src/content/**/*.md', { ignore: ['**/INDEX.md', '**/node_modules/**'] });
    allContent = files.map(f => readFile(f)).join('\n');
    return allContent;
  }

  test('documentation mentions actual package names', async () => {
    const content = await getAllContent();
    const packages = ['dialtone-vue', 'dialtone-css', 'dialtone-tokens', 'dialtone-icons'];

    for (const pkg of packages) {
      expect(content, `package name "${pkg}" not found in content`).toContain(pkg);
    }
  });

  test('documentation mentions technical terms', async () => {
    const content = await getAllContent();
    const terms = ['pnpm', 'NX', 'monorepo', 'Vue'];

    for (const term of terms) {
      expect(content, `technical term "${term}" not found in content`).toContain(term);
    }
  });

  test('no placeholder content in substantive files', async () => {
    const files = await findFiles('src/content/**/*.md', { ignore: ['**/INDEX.md', '**/node_modules/**'] });
    const badPatterns = [/\bTODO\b/, /\bFIXME\b/, /\bcoming soon\b/i, /\bTBD\b/];

    for (const file of files) {
      const content = readFile(file);
      // Strip fenced code blocks and inline code before checking — standards
      // docs legitimately mention "TODO" as examples of what NOT to do.
      const stripped = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]+`/g, '')
        .replace(/"[^"]*"/g, '');
      for (const pattern of badPatterns) {
        expect(
          pattern.test(stripped),
          `${file} contains placeholder: ${pattern}`,
        ).toBe(false);
      }
    }
  });
});
