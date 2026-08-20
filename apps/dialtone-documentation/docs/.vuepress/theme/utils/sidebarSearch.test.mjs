import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  collectOpenItemKeys,
  collectOpenItemKeysForRoute,
  filterNavItems,
  flattenNavigableItemPaths,
  isRouteInTree,
  normalizeSearchTerm,
  wrapHighlightIndex,
} from './sidebarSearch.js';

// Shaped like site-nav.json: top-level sections with nested children, some with
// keywords, plus the What's New collection whose posts are not nav children.
const navTree = () => [
  {
    text: 'Components',
    link: '/components/',
    children: [
      { text: 'Button', link: '/components/button.html', keywords: ['cta', 'action'] },
      { text: 'Select Menu', link: '/components/select-menu.html' },
    ],
  },
  {
    text: 'Utilities',
    link: '/utilities/',
    children: [
      {
        text: 'Spacing',
        link: '/utilities/spacing/',
        children: [
          { text: 'Margin', link: '/utilities/spacing/margin.html' },
        ],
      },
    ],
  },
  {
    text: 'Dialtone',
    link: '/dialtone/',
    children: [
      { text: 'What\'s New', link: '/dialtone/whats-new/' },
    ],
  },
];

describe('normalizeSearchTerm', () => {
  it('lowercases and strips separators', () => {
    assert.equal(normalizeSearchTerm('Select-Menu'), 'selectmenu');
    assert.equal(normalizeSearchTerm('What\'s New'), 'whatsnew');
  });

  it('reduces a punctuation-only term to an empty string', () => {
    assert.equal(normalizeSearchTerm('---'), '');
  });
});

describe('filterNavItems', () => {
  it('returns the tree untouched for an empty term', () => {
    const items = navTree();

    assert.equal(filterNavItems(items, ''), items);
    assert.equal(filterNavItems(items, '   '), items);
  });

  it('returns nothing for a punctuation-only term', () => {
    assert.deepEqual(filterNavItems(navTree(), '///'), []);
  });

  it('keeps a matching leaf and the ancestor path to it', () => {
    const filtered = filterNavItems(navTree(), 'margin');

    assert.deepEqual(filtered.map(item => item.text), ['Utilities']);
    assert.deepEqual(filtered[0].children.map(item => item.text), ['Spacing']);
    assert.deepEqual(filtered[0].children[0].children.map(item => item.text), ['Margin']);
  });

  it('matches across separators and case', () => {
    const filtered = filterNavItems(navTree(), 'selectmenu');

    assert.deepEqual(filtered[0].children.map(item => item.text), ['Select Menu']);
  });

  it('matches on keywords, not just visible text', () => {
    const filtered = filterNavItems(navTree(), 'cta');

    assert.deepEqual(filtered.map(item => item.text), ['Components']);
    assert.deepEqual(filtered[0].children.map(item => item.text), ['Button']);
  });

  it('keeps every child when the parent itself matches', () => {
    const filtered = filterNavItems(navTree(), 'components');

    assert.equal(filtered.length, 1);
    assert.deepEqual(filtered[0].children.map(item => item.text), ['Button', 'Select Menu']);
  });

  it('does not mutate the input tree', () => {
    const items = navTree();
    filterNavItems(items, 'margin');

    assert.deepEqual(items, navTree());
  });

  it('returns an empty array when nothing matches', () => {
    assert.deepEqual(filterNavItems(navTree(), 'zzzznope'), []);
  });
});

describe('flattenNavigableItemPaths', () => {
  it('returns dotted index paths for leaf links only', () => {
    assert.deepEqual(flattenNavigableItemPaths(navTree()), [
      '0.0', '0.1', '1.0.0', '2.0',
    ]);
  });

  it('skips parents, which toggle rather than navigate', () => {
    const paths = flattenNavigableItemPaths(navTree());

    assert.ok(!paths.includes('0'));
    assert.ok(!paths.includes('1.0'));
  });

  it('skips items with no link', () => {
    const paths = flattenNavigableItemPaths([{ text: 'Heading only' }, { text: 'A', link: '/a' }]);

    assert.deepEqual(paths, ['1']);
  });

  it('returns an empty array for an empty tree', () => {
    assert.deepEqual(flattenNavigableItemPaths([]), []);
  });
});

describe('collectOpenItemKeys', () => {
  it('opens every parent so matches deeper in the tree stay visible', () => {
    assert.deepEqual(
      [...collectOpenItemKeys(navTree())],
      ['/components/', '/utilities/', '/utilities/spacing/', '/dialtone/'],
    );
  });

  it('falls back to text when an item has no link', () => {
    const open = collectOpenItemKeys([{ text: 'Group', children: [{ text: 'Child', link: '/c' }] }]);

    assert.deepEqual([...open], ['Group']);
  });

  it('ignores leaves', () => {
    assert.deepEqual([...collectOpenItemKeys([{ text: 'A', link: '/a' }])], []);
  });
});

describe('isRouteInTree', () => {
  it('is false for an item with no children', () => {
    assert.equal(isRouteInTree({ text: 'A', link: '/a' }, '/a'), false);
  });

  it('is true when the route is the item itself and it has children', () => {
    assert.equal(isRouteInTree(navTree()[0], '/components/'), true);
  });

  it('is true for a direct child', () => {
    assert.equal(isRouteInTree(navTree()[0], '/components/button.html'), true);
  });

  it('is true for a grandchild', () => {
    assert.equal(isRouteInTree(navTree()[1], '/utilities/spacing/margin.html'), true);
  });

  it('is false for an unrelated route', () => {
    assert.equal(isRouteInTree(navTree()[0], '/utilities/'), false);
  });

  it('treats a collection\'s owned pages as inside the tree', () => {
    // Blog posts are not nav children of What's New, but belong to it.
    assert.equal(
      isRouteInTree(navTree()[2], '/dialtone/whats-new/posts/some-post.html'),
      true,
    );
  });
});

describe('collectOpenItemKeysForRoute', () => {
  it('opens only the ancestors of the current route', () => {
    assert.deepEqual(
      [...collectOpenItemKeysForRoute(navTree(), '/utilities/spacing/margin.html')],
      ['/utilities/', '/utilities/spacing/'],
    );
  });

  it('opens the section containing a top-level page', () => {
    assert.deepEqual(
      [...collectOpenItemKeysForRoute(navTree(), '/components/button.html')],
      ['/components/'],
    );
  });

  it('opens the owning section for a collection page', () => {
    assert.deepEqual(
      [...collectOpenItemKeysForRoute(navTree(), '/dialtone/whats-new/posts/x.html')],
      ['/dialtone/'],
    );
  });

  it('opens nothing for a route outside the tree', () => {
    assert.deepEqual([...collectOpenItemKeysForRoute(navTree(), '/nope/')], []);
  });
});

describe('wrapHighlightIndex', () => {
  it('enters the list at the first item going down from unset', () => {
    assert.equal(wrapHighlightIndex(-1, 1, 5), 0);
  });

  it('enters the list at the last item going up from unset', () => {
    assert.equal(wrapHighlightIndex(-1, -1, 5), 4);
  });

  it('steps forward and backward', () => {
    assert.equal(wrapHighlightIndex(2, 1, 5), 3);
    assert.equal(wrapHighlightIndex(2, -1, 5), 1);
  });

  it('wraps at both ends', () => {
    assert.equal(wrapHighlightIndex(4, 1, 5), 0);
    assert.equal(wrapHighlightIndex(0, -1, 5), 4);
  });

  it('stays put in a single-item list', () => {
    assert.equal(wrapHighlightIndex(0, 1, 1), 0);
    assert.equal(wrapHighlightIndex(0, -1, 1), 0);
  });
});
