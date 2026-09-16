import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getActiveHeaderLink,
  getLinkedHeaders,
  resolveHeaderTargets,
} from './pageToc.js';

// Split from pageToc.test.mjs, which covers the module's other utilities. Scroll-spy's
// active-header selection is the part with real behaviour worth isolating: it runs per
// animation frame while scrolling, and it caches DOM lookups.
describe('pageToc active header selection', () => {
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

  it('accepts pre-flattened linkedHeaders, matching the derived result', () => {
    const headers = [
      { link: '#usage', children: [{ link: '#variants', children: [] }] },
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
      classes: { getBoundingClientRect: () => ({ top: 900 }) },
    };
    const options = { offset: 180, getTarget: id => targets[id] };

    assert.equal(
      getActiveHeaderLink(headers, scrollContainer, {
        ...options,
        linkedHeaders: getLinkedHeaders(headers),
      }),
      getActiveHeaderLink(headers, scrollContainer, options),
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
  it('resolveHeaderTargets pairs each linked header with its element', () => {
    const targets = { usage: { id: 'usage' }, sizes: { id: 'sizes' } };
    const linked = [{ link: '#usage' }, { link: '#sizes' }, { link: '#missing' }];

    assert.deepEqual(
      resolveHeaderTargets(linked, id => targets[id] ?? null),
      [
        { link: '#usage', element: { id: 'usage' } },
        { link: '#sizes', element: { id: 'sizes' } },
        { link: '#missing', element: null },
      ],
    );
  });

  it('pre-resolved targets produce the same result as resolving per call', () => {
    const headers = [
      { link: '#usage', children: [{ link: '#variants', children: [] }] },
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
      classes: { getBoundingClientRect: () => ({ top: 900 }) },
    };
    const getTarget = id => targets[id];
    const linkedHeaders = getLinkedHeaders(headers);

    assert.equal(
      getActiveHeaderLink(headers, scrollContainer, {
        offset: 180,
        linkedHeaders,
        targets: resolveHeaderTargets(linkedHeaders, getTarget),
      }),
      getActiveHeaderLink(headers, scrollContainer, { offset: 180, getTarget }),
    );
  });

  it('skips a cached element that has been detached rather than treating it as passed', () => {
    const headers = [
      { link: '#usage', children: [] },
      { link: '#variants', children: [] },
      { link: '#classes', children: [] },
    ];
    const scrollContainer = {
      scrollTop: 600,
      clientHeight: 500,
      scrollHeight: 2000,
      getBoundingClientRect: () => ({ top: 100 }),
    };
    // A detached node reports a zero rect, which reads as "above the activation line" and
    // would otherwise carry the active header past where the reader actually is.
    const linkedHeaders = getLinkedHeaders(headers);
    const targets = [
      { link: '#usage', element: { isConnected: true, getBoundingClientRect: () => ({ top: 80 }) } },
      { link: '#variants', element: { isConnected: false, getBoundingClientRect: () => ({ top: 0 }) } },
      { link: '#classes', element: { isConnected: false, getBoundingClientRect: () => ({ top: 0 }) } },
    ];

    assert.equal(
      getActiveHeaderLink(headers, scrollContainer, { offset: 180, linkedHeaders, targets }),
      '#usage',
    );
  });
});
