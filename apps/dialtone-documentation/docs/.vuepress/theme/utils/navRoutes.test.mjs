import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  dedupeNavItemsByLink,
  findNavCollectionForRoute,
  getCollapsibleNavigationTarget,
  isDescendantOfNavCollection,
} from './navRoutes.js';

describe('getCollapsibleNavigationTarget', () => {
  it('navigates only from marked, closed items in the persistent sidebar', () => {
    const item = {
      navigateToFirstChildWhenPersistent: true,
      children: [{ link: '/foundations/' }],
    };

    assert.equal(getCollapsibleNavigationTarget(item, {
      persistent: true,
      open: false,
      routePath: '/components/',
    }), '/foundations/');
    assert.equal(getCollapsibleNavigationTarget(item, {
      persistent: false,
      open: false,
    }), null);
    assert.equal(getCollapsibleNavigationTarget(item, {
      persistent: true,
      open: true,
    }), null);
    assert.equal(getCollapsibleNavigationTarget({
      children: [{ link: '/utilities/backgrounds/attachment.html' }],
    }, {
      persistent: true,
      open: false,
    }), null);
  });

  it('only reopens a marked group when the current route is one of its descendants', () => {
    const item = {
      navigateToFirstChildWhenPersistent: true,
      children: [
        { link: '/guides/content/' },
        { link: '/guides/content/forms-and-validation/' },
        {
          children: [{ link: '/guides/content/nested/page.html' }],
        },
      ],
    };

    for (const routePath of [
      '/guides/content/forms-and-validation/',
      '/guides/content/nested/page.html',
    ]) {
      assert.equal(getCollapsibleNavigationTarget(item, {
        persistent: true,
        open: false,
        routePath,
      }), null);
    }
  });
});

describe('dedupeNavItemsByLink', () => {
  it('keeps the child page when a grouping parent shares its link', () => {
    const items = [
      { text: 'Tooling', link: '/guides/mcp-server/' },
      { text: 'Dialtone CLI', link: '/guides/cli/' },
      { text: 'Dialtone MCP Server', link: '/guides/mcp-server/' },
    ];

    assert.deepEqual(dedupeNavItemsByLink(items), [items[1], items[2]]);
  });
});

describe('isDescendantOfNavCollection', () => {
  it('matches a page the collection owns', () => {
    assert.equal(
      isDescendantOfNavCollection('/dialtone/whats-new/', '/dialtone/whats-new/posts/some-post.html'),
      true,
    );
  });

  it('does not match the collection page itself', () => {
    assert.equal(isDescendantOfNavCollection('/dialtone/whats-new/', '/dialtone/whats-new/'), false);
  });

  it('does not match a sibling route under the same parent', () => {
    assert.equal(
      isDescendantOfNavCollection('/dialtone/whats-new/', '/dialtone/release-notes/'),
      false,
    );
  });

  it('returns false for links that own no collection', () => {
    assert.equal(
      isDescendantOfNavCollection('/components/', '/dialtone/whats-new/posts/some-post.html'),
      false,
    );
  });

  it('returns false for an undefined link rather than throwing', () => {
    assert.equal(isDescendantOfNavCollection(undefined, '/dialtone/whats-new/posts/x'), false);
  });
});

describe('findNavCollectionForRoute', () => {
  it('returns the owning collection shaped as a nav item', () => {
    assert.deepEqual(findNavCollectionForRoute('/dialtone/whats-new/posts/some-post.html'), {
      link: '/dialtone/whats-new/',
      text: 'Back to What\'s New',
    });
  });

  it('returns null for the collection page itself', () => {
    assert.equal(findNavCollectionForRoute('/dialtone/whats-new/'), null);
  });

  it('returns null for an unrelated route', () => {
    assert.equal(findNavCollectionForRoute('/components/button.html'), null);
  });

  it('anchors at the start of the path, not anywhere within it', () => {
    // Guards the tightening from `.includes()` to `.startsWith()` during the migration.
    assert.equal(findNavCollectionForRoute('/x/dialtone/whats-new/posts/y'), null);
  });
});
