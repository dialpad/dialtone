import { describe, test, expect } from 'vitest';
import { searchDocumentation, formatDocumentationResults } from '../../src/tools/docs.js';
import { documentation } from '../../src/data.js';
import type { DocumentationRecord } from '../../src/types.js';

// Minimal in-memory corpus for unit tests — keeps tests fast and isolated.
const fixture: DocumentationRecord[] = [
  {
    id: 'button#usage',
    docId: 'button',
    docTitle: 'Button',
    category: 'components',
    headingPath: ['Usage'],
    content: 'A button conveys an action. Use DtButton kind="primary" for the main call to action. Use kind="danger" for destructive actions.',
    frontmatter: {
      title: 'Button',
      description: 'Interactive button component',
      status: 'ready',
      figmaUrl: 'https://figma.com/button',
      storybook: 'https://dialtone.dialpad.com/vue/?path=/story/button',
    },
    filePath: 'apps/dialtone-documentation/docs/components/button.md',
  },
  {
    id: 'button#variants',
    docId: 'button',
    docTitle: 'Button',
    category: 'components',
    headingPath: ['Variants'],
    content: 'Variants include primary, danger, muted, and clear kinds. Loading spinner shown via loading prop.',
    frontmatter: {
      title: 'Button',
      description: 'Interactive button component',
      status: 'ready',
      figmaUrl: 'https://figma.com/button',
      storybook: 'https://dialtone.dialpad.com/vue/?path=/story/button',
    },
    filePath: 'apps/dialtone-documentation/docs/components/button.md',
  },
  {
    id: 'modal#usage',
    docId: 'modal',
    docTitle: 'Modal',
    category: 'components',
    headingPath: ['Usage'],
    content: 'Modals disable underlying content. Clicking outside the modal does not close it by default. Users must explicitly dismiss via the close button.',
    frontmatter: {
      title: 'Modal',
      description: 'Dialog that focuses user attention',
      status: 'ready',
    },
    filePath: 'apps/dialtone-documentation/docs/components/modal.md',
  },
  {
    id: 'accessibility#tooltip',
    docId: 'accessibility',
    docTitle: 'Accessibility and inclusive design',
    category: 'guides',
    headingPath: ['Tooltip and disabled elements'],
    content: 'DtTooltip can be placed on a disabled DtButton by wrapping the button in a span, since disabled elements do not fire mouse events.',
    frontmatter: {
      title: 'Accessibility',
      description: 'Guidance on building products for everyone',
    },
    filePath: 'apps/dialtone-documentation/docs/guides/accessibility/index.md',
  },
];

// ─── Basic search behavior ───────────────────────────────────────────────────

describe('searchDocumentation', () => {
  test('returns empty results for empty query', () => {
    const { results, notes } = searchDocumentation('', fixture);
    expect(results).toHaveLength(0);
    expect(notes).toEqual([]);
  });

  test('finds records matching a single keyword', () => {
    const { results } = searchDocumentation('modal', fixture);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.details.docId === 'modal')).toBe(true);
  });

  test('highest-scoring result (both terms matched) ranks first', () => {
    const { results } = searchDocumentation('primary danger', fixture);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].details.docId).toBe('button');
  });

  test('returns no results when a word is not in any record', () => {
    const { results } = searchDocumentation('xyzzy', fixture);
    expect(results).toHaveLength(0);
  });

  test('result has correct SearchResult shape', () => {
    const { results } = searchDocumentation('button', fixture);
    expect(results.length).toBeGreaterThan(0);
    const r = results[0];
    expect(r.type).toBe('documentation');
    expect(r.name).toBeTruthy();
    expect(r.details).toBeDefined();
    expect(r.metadata).toBeNull();
  });

  test('section matching more query terms ranks above section matching fewer', () => {
    // button#variants has both 'primary' and 'loading' (2/2)
    // button#usage has 'primary' but not 'loading' (1/2)
    // button#variants must rank first
    const { results } = searchDocumentation('primary loading', fixture);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].details.id).toBe('button#variants');
  });

  test('returns results even when not all query terms match any section', () => {
    // 'xyzzy' matches nothing; 'button' matches sections
    // OR logic: should still return results for the matching term
    const { results } = searchDocumentation('button xyzzy', fixture);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r: any) => r.details.docId === 'button')).toBe(true);
  });

  test('search is case-insensitive', () => {
    const lower = searchDocumentation('button', fixture).results;
    const upper = searchDocumentation('BUTTON', fixture).results;
    const mixed = searchDocumentation('Button', fixture).results;
    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(mixed.length);
  });

  test('returns notes as empty array', () => {
    const { notes } = searchDocumentation('button', fixture);
    expect(notes).toEqual([]);
  });

  test('truncates very long queries and emits a note', () => {
    const longQuery = 'button '.repeat(100); // > 256 chars
    const { results, notes } = searchDocumentation(longQuery, fixture);
    expect(results.length).toBeGreaterThan(0);
    expect(notes.some(n => n.includes('256 characters'))).toBe(true);
  });

  test('caps term count and emits a note', () => {
    // 20 distinct meaningful terms, only first 12 should be used
    const terms = ['button', 'modal', 'primary', 'danger', 'muted', 'clear', 'loading', 'spinner', 'variants', 'usage', 'figma', 'storybook', 'extra1', 'extra2', 'extra3'];
    const { notes } = searchDocumentation(terms.join(' '), fixture);
    expect(notes.some(n => n.includes('12 terms'))).toBe(true);
  });
});

// ─── formatDocumentationResults ─────────────────────────────────────────────

describe('formatDocumentationResults', () => {
  test('returns a non-empty markdown string', () => {
    const { results } = searchDocumentation('modal', fixture);
    const formatted = formatDocumentationResults(results, 'modal');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  test('includes the section heading in output', () => {
    const { results } = searchDocumentation('modal', fixture);
    const formatted = formatDocumentationResults(results, 'modal');
    expect(formatted).toContain('Modal');
    expect(formatted).toContain('Usage');
  });

  test('includes content excerpt', () => {
    const { results } = searchDocumentation('modal', fixture);
    const formatted = formatDocumentationResults(results, 'modal');
    expect(formatted).toContain('Modals disable');
  });

  test('includes Storybook link when present', () => {
    const { results } = searchDocumentation('button', fixture);
    const formatted = formatDocumentationResults(results, 'button');
    expect(formatted).toContain('dialtone.dialpad.com');
  });

  test('returns empty string for empty results array', () => {
    expect(formatDocumentationResults([], 'nothing')).toBe('');
  });
});

// ─── Acceptance scenarios (real corpus) ─────────────────────────────────────
// These are the 10 questions from project_mcp_search_documentation_scenarios.md.
// Pass bar: ≥ 8 of 10 must return a relevant top-3 result.
// If a scenario fails here, add the missing vocabulary to the doc page (not the engine).

describe('Acceptance scenarios — real queries against the full corpus', () => {
  // allowlist: expected docTitles that should appear in top-3 results.
  // Using docTitle (stable human name) not docId (file-path format that can change).
  type Scenario = { query: string; allowlist: string[]; id: string };

  const scenarios: Scenario[] = [
    {
      id: 'TS-002',
      query: "What component do I use for a search box with autocomplete?",
      allowlist: ['Combobox'],
    },
    {
      id: 'TS-003',
      query: "What's the difference between DtButton kind='primary' and kind='danger'?",
      allowlist: ['Button'],
    },
    {
      id: 'TS-004',
      query: "Why isn't my DtModal closing on outside click — is that correct behavior?",
      allowlist: ['Modal'],
    },
    {
      id: 'TS-005',
      query: "DtOldPopover is deprecated — what's the replacement?",
      allowlist: ['Popover'],
    },
    {
      id: 'TS-006',
      query: "Which Dialtone component supports multi-select with avatars?",
      allowlist: ['Combobox Multi-Select', 'Combobox'],
    },
    {
      id: 'TS-007',
      query: "How do I wire DtSelectMenu v-model to a Vuex store?",
      allowlist: ['Select menu'],
    },
    {
      id: 'TS-008',
      query: "Can I put DtTooltip on a disabled DtButton?",
      allowlist: ['Tooltip', 'Button'],
    },
    {
      id: 'TS-009',
      query: "List all components that support dark mode.",
      allowlist: [],
    },
    {
      id: 'TS-010',
      query: "How do I make DtButton show a loading spinner during async submit?",
      allowlist: ['Button'],
    },
    {
      id: 'TS-011',
      query: "Why does DtInput show a red border?",
      allowlist: ['Input'],
    },
  ];

  test('corpus is loaded and non-empty', () => {
    expect(documentation.length).toBeGreaterThan(1000);
  });

  for (const { id, query, allowlist } of scenarios) {
    test(`${id}: "${query.slice(0, 55)}..."`, () => {
      const { results: hits } = searchDocumentation(query, documentation);
      const top3Titles = hits.slice(0, 3).map(r => (r.details as DocumentationRecord).docTitle);
      if (allowlist.length > 0) {
        expect(
          allowlist.some(t => top3Titles.includes(t)),
          `Expected one of [${allowlist}] in top-3 titles [${top3Titles}] for "${query}"`,
        ).toBe(true);
      } else {
        expect(top3Titles.length, `Expected at least one result for "${query}"`).toBeGreaterThan(0);
      }
    });
  }

  test('OR logic: partial query match still returns results (migrate DtOldPopover)', () => {
    // "migrate" does not appear verbatim in the corpus — only "migration" does.
    // Under AND logic this returned 0 results.
    // Under OR logic, "DtOldPopover" alone matches the Popover doc — so results are non-empty.
    const { results } = searchDocumentation('migrate DtOldPopover', documentation);
    expect(results.length).toBeGreaterThan(0);
    const allTitles = results.map(r => (r.details as DocumentationRecord).docTitle);
    expect(allTitles).toContain('Popover');
  });
});
