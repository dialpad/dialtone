import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS,
  PAGE_SCROLL_CONTAINER_SELECTOR,
  createRouteHashScrollGuard,
  flattenHeadersWithDepth,
  getActiveHeaderLink,
  getHashScrollBehavior,
  getCurrentBrowserHash,
  getRightRailTocViewportValues,
  getRouteScrollToTopBehavior,
  getScrollOffset,
  getTargetScrollTop,
  hashToId,
  scrollRouteToTop,
  shouldSyncActiveHeaderFromRouteWatch,
  shouldScrollRouteToTop,
} from './pageToc.js';

describe('pageToc utilities', () => {
  it('uses a docs-owned page scroll container selector', () => {
    assert.equal(PAGE_SCROLL_CONTAINER_SELECTOR, '.dialtone-doc-page-scroll-container');
  });

  it('uses smooth scrolling for hash changes including deep links', () => {
    assert.equal(getHashScrollBehavior(), 'smooth');
  });

  it('shows the right-rail TOC at xxxl only when no combinator uses that space', () => {
    assert.deepEqual(getRightRailTocViewportValues(false), {
      default: false,
      xl: true,
      xxxl: true,
      xxxxl: true,
    });
    assert.deepEqual(getRightRailTocViewportValues(true), {
      default: false,
      xl: true,
      xxxl: false,
      xxxxl: true,
    });
  });

  it('uses the browser hash when available for lazily mounted TOCs', () => {
    assert.equal(getCurrentBrowserHash('#usage', { hash: '#classes' }), '#classes');
    assert.equal(getCurrentBrowserHash('#usage', { hash: '' }), '#usage');
    assert.equal(getCurrentBrowserHash('#usage', null), '#usage');
  });

  it('flattens headers with depth for dropdown rendering', () => {
    const headers = [
      { title: 'Usage', link: '#usage', children: [] },
      {
        title: 'Variants',
        link: '#variants',
        children: [
          { title: 'Size', link: '#size', children: [] },
          {
            title: 'Kind',
            link: '#kind',
            children: [
              { title: 'Muted', link: '#muted', children: [] },
            ],
          },
        ],
      },
    ];

    assert.deepEqual(flattenHeadersWithDepth(headers), [
      { title: 'Usage', link: '#usage', children: [], depth: 0 },
      {
        title: 'Variants',
        link: '#variants',
        children: [
          { title: 'Size', link: '#size', children: [] },
          {
            title: 'Kind',
            link: '#kind',
            children: [
              { title: 'Muted', link: '#muted', children: [] },
            ],
          },
        ],
        depth: 0,
      },
      { title: 'Size', link: '#size', children: [], depth: 1 },
      {
        title: 'Kind',
        link: '#kind',
        children: [
          { title: 'Muted', link: '#muted', children: [] },
        ],
        depth: 1,
      },
      { title: 'Muted', link: '#muted', children: [], depth: 2 },
    ]);
  });

  it('skips scroll for route hash changes written by TOC navigation', () => {
    const guard = createRouteHashScrollGuard();

    guard.skip('#split-button');

    assert.equal(guard.shouldSkip('#classes'), false);
    assert.equal(guard.shouldSkip('#split-button'), true);
    assert.equal(guard.shouldSkip('#split-button'), false);

    guard.skip('');

    assert.equal(guard.shouldSkip(''), true);
  });

  it('scrolls to top only when navigating to a different route without a hash', () => {
    assert.equal(getRouteScrollToTopBehavior(), 'auto');

    assert.equal(
      shouldScrollRouteToTop(
        { path: '/components/card.html', hash: '' },
        { path: '/components/button.html', hash: '#classes' },
      ),
      true,
    );
    assert.equal(
      shouldScrollRouteToTop(
        { path: '/components/card.html', hash: '#usage' },
        { path: '/components/button.html', hash: '#classes' },
      ),
      false,
    );
    assert.equal(
      shouldScrollRouteToTop(
        { path: '/components/button.html', hash: '#classes' },
        { path: '/components/button.html', hash: '#usage' },
      ),
      false,
    );
  });

  it('does not sync active headers during cross-route watcher updates', () => {
    assert.equal(shouldSyncActiveHeaderFromRouteWatch('/components/button.html', undefined), true);
    assert.equal(
      shouldSyncActiveHeaderFromRouteWatch('/components/button.html', '/components/button.html'),
      true,
    );
    assert.equal(
      shouldSyncActiveHeaderFromRouteWatch('/components/box.html', '/components/button.html'),
      false,
    );
  });

  it('temporarily toggles the no-smooth class when route-scrolling to top', () => {
    const classes = new Set();
    const scrollCalls = [];
    let restoreScrollBehavior;
    const scrollContainer = {
      classList: {
        add: className => classes.add(className),
        remove: className => classes.delete(className),
        contains: className => classes.has(className),
      },
      scrollTo (options) {
        scrollCalls.push({
          options,
          noSmooth: this.classList.contains(PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS),
        });
      },
    };

    scrollRouteToTop(scrollContainer, callback => {
      restoreScrollBehavior = callback;
    });

    assert.deepEqual(scrollCalls, [
      {
        options: { top: 0, behavior: 'auto' },
        noSmooth: true,
      },
    ]);
    assert.equal(classes.has(PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS), true);

    restoreScrollBehavior();

    assert.equal(classes.has(PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS), false);
  });

  it('decodes a header link to its target id', () => {
    assert.equal(hashToId('#icon-support'), 'icon-support');
    assert.equal(hashToId('/components/button.html#writing%20guidelines'), 'writing guidelines');
  });

  it('uses the sticky header bottom as the scroll offset', () => {
    const scrollContainer = {
      getBoundingClientRect: () => ({ top: 100 }),
      querySelector: () => ({
        getBoundingClientRect: () => ({ bottom: 220 }),
      }),
    };

    assert.equal(getScrollOffset(scrollContainer), 136);
  });

  it('computes the nested scroll position for a heading', () => {
    const scrollContainer = {
      scrollTop: 120,
      getBoundingClientRect: () => ({ top: 100 }),
    };
    const target = {
      getBoundingClientRect: () => ({ top: 500 }),
    };

    assert.equal(getTargetScrollTop(scrollContainer, target, 80), 440);
  });

  it('selects the deepest passed header as active', () => {
    const headers = [
      { link: '#usage', children: [] },
      {
        link: '#variants',
        children: [
          { link: '#sizes', children: [] },
        ],
      },
      { link: '#classes', children: [] },
    ];
    const scrollContainer = {
      scrollTop: 600,
      clientHeight: 500,
      scrollHeight: 2000,
      getBoundingClientRect: () => ({ top: 100 }),
    };
    const targets = {
      usage: { getBoundingClientRect: () => ({ top: 80 }) },
      variants: { getBoundingClientRect: () => ({ top: 260 }) },
      sizes: { getBoundingClientRect: () => ({ top: 320 }) },
      classes: { getBoundingClientRect: () => ({ top: 900 }) },
    };

    assert.equal(
      getActiveHeaderLink(headers, scrollContainer, {
        offset: 180,
        getTarget: id => targets[id],
      }),
      '#variants',
    );
  });

  it('selects the last available header at the bottom of the scroll container', () => {
    const headers = [
      { link: '#usage', children: [] },
      { link: '#classes', children: [] },
    ];
    const scrollContainer = {
      scrollTop: 1500,
      clientHeight: 500,
      scrollHeight: 2000,
      getBoundingClientRect: () => ({ top: 100 }),
    };

    assert.equal(
      getActiveHeaderLink(headers, scrollContainer, {
        offset: 180,
        getTarget: () => ({}),
      }),
      '#classes',
    );
  });
});
