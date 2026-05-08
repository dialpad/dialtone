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
      figmaUrl: null,
      storybook: null,
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
      status: null,
      figmaUrl: null,
      storybook: null,
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

  test('AND logic — all words must appear', () => {
    const { results } = searchDocumentation('primary danger', fixture);
    // Only button#usage mentions both "primary" AND "danger"
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
    expect(typeof r.tier).toBe('number');
  });

  test('tier 1 (heading match) ranks above tier 3 (content-only match)', () => {
    const { results } = searchDocumentation('button', fixture);
    // Results sorted by tier ascending — tier 1 records come first
    expect(results[0].tier).toBe(1);
    expect(results[0].details.docId).toBe('button');
    // All tier values are non-decreasing (sorted correctly)
    for (let i = 1; i < results.length; i++) {
      expect(results[i].tier!).toBeGreaterThanOrEqual(results[i - 1].tier!);
    }
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

describe('Acceptance scenarios — 10 real-query scenarios against the full corpus', () => {
  type Scenario = { query: string; allowlist: string[]; id: string };

  const scenarios: Scenario[] = [
    {
      id: 'TS-002',
      query: "What component do I use for a search box with autocomplete?",
      allowlist: ['combobox', 'search-input'],
    },
    {
      id: 'TS-003',
      query: "What's the difference between DtButton kind='primary' and kind='danger'?",
      allowlist: ['button'],
    },
    {
      id: 'TS-004',
      query: "Why isn't my DtModal closing on outside click — is that correct behavior?",
      allowlist: ['modal'],
    },
    {
      id: 'TS-005',
      query: "DtOldPopover is deprecated — what's the replacement?",
      allowlist: ['popover'],
    },
    {
      id: 'TS-006',
      query: "Which Dialtone component supports multi-select with avatars?",
      allowlist: ['combobox-multi-select', 'combobox'],
    },
    {
      id: 'TS-007',
      query: "How do I wire DtSelectMenu v-model to a Vuex store?",
      allowlist: ['select-menu'],
    },
    {
      id: 'TS-008',
      query: "Can I put DtTooltip on a disabled DtButton?",
      allowlist: ['tooltip', 'button'],
    },
    {
      id: 'TS-009',
      query: "List all components that support dark mode.",
      allowlist: [], // any result is acceptable — cross-cutting query
    },
    {
      id: 'TS-010',
      query: "How do I make DtButton show a loading spinner during async submit?",
      allowlist: ['button'],
    },
    {
      id: 'TS-011',
      query: "Why does DtInput show a red border?",
      allowlist: ['input'],
    },
  ];

  test('corpus is loaded and non-empty', () => {
    expect(documentation.length).toBeGreaterThan(1000);
  });

  // Run all 10 scenarios and assert ≥ 8 pass (acceptance bar per PRD)
  test('≥ 8 of 10 scenarios return a relevant top-3 result', () => {
    const results = scenarios.map(({ id, query, allowlist }) => {
      const { results: hits } = searchDocumentation(query, documentation);
      const top3DocIds = hits.slice(0, 3).map(r => (r.details as DocumentationRecord).docId);
      const pass = allowlist.length > 0
        ? allowlist.some(d => top3DocIds.includes(d))
        : top3DocIds.length > 0;
      return { id, pass, top3DocIds, query: query.slice(0, 40) };
    });

    const passed = results.filter(r => r.pass).length;
    const failing = results.filter(r => !r.pass);

    if (failing.length > 0) {
      console.warn('Failing scenarios (corpus vocabulary gaps to fix):');
      failing.forEach(f => console.warn(`  ${f.id}: "${f.query}..." — got top3: ${f.top3DocIds}`));
    }

    expect(passed).toBeGreaterThanOrEqual(8);
  });

  // Individual scenario tests — document each expected behavior
  for (const { id, query, allowlist } of scenarios) {
    test(`${id}: "${query.slice(0, 55)}..."`, () => {
      const { results: hits } = searchDocumentation(query, documentation);
      const top3DocIds = hits.slice(0, 3).map(r => (r.details as DocumentationRecord).docId);
      if (allowlist.length > 0) {
        expect(
          allowlist.some(d => top3DocIds.includes(d)),
          `Expected one of ${allowlist} in top-3 [${top3DocIds}] for "${query}"`,
        ).toBe(true);
      } else {
        // Cross-cutting query — just needs some results
        expect(top3DocIds.length, `Expected at least one result for "${query}"`).toBeGreaterThan(0);
      }
    });
  }
});
