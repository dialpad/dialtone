import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  replaceBrowserHash,
  writeRouteHash,
} from './pageToc.js';

describe('pageToc route hash utilities', () => {
  it('writes route hash changes with push by default and restores router scroll behavior', async () => {
    const scrollBehavior = () => {};
    const calls = [];
    const skippedHashes = [];
    const router = {
      options: { scrollBehavior },
      async push (location) {
        calls.push({
          location,
          scrollBehavior: this.options.scrollBehavior,
        });
      },
    };
    const route = {
      path: '/components/button.html',
      query: { theme: 'dp' },
      hash: '#usage',
    };
    const guard = {
      skip: hash => skippedHashes.push(hash),
    };

    await writeRouteHash(router, route, '#classes', guard);

    assert.deepEqual(skippedHashes, ['#classes']);
    assert.deepEqual(calls, [
      {
        location: {
          path: '/components/button.html',
          query: { theme: 'dp' },
          hash: '#classes',
        },
        scrollBehavior: undefined,
      },
    ]);
    assert.equal(router.options.scrollBehavior, scrollBehavior);
  });

  it('replaces route hash changes for intentional route updates and can clear the hash', async () => {
    const scrollBehavior = () => {};
    const calls = [];
    const skippedHashes = [];
    const router = {
      options: { scrollBehavior },
      async replace (location) {
        calls.push({
          location,
          scrollBehavior: this.options.scrollBehavior,
        });
      },
    };
    const route = {
      path: '/components/button.html',
      query: {},
      hash: '#classes',
    };
    const guard = {
      skip: hash => skippedHashes.push(hash),
    };

    await writeRouteHash(router, route, '', guard, { replace: true });

    assert.deepEqual(skippedHashes, ['']);
    assert.deepEqual(calls, [
      {
        location: {
          path: '/components/button.html',
          query: {},
          hash: '',
        },
        scrollBehavior: undefined,
      },
    ]);
    assert.equal(router.options.scrollBehavior, scrollBehavior);
  });

  it('does not write route hash changes when the current hash already matches', async () => {
    const calls = [];
    const skippedHashes = [];
    const router = {
      options: { scrollBehavior: () => {} },
      async push (location) {
        calls.push(location);
      },
    };
    const route = {
      path: '/components/button.html',
      query: {},
      hash: '#usage',
    };
    const guard = {
      skip: hash => skippedHashes.push(hash),
    };

    await writeRouteHash(router, route, '#usage', guard);

    assert.deepEqual(skippedHashes, []);
    assert.deepEqual(calls, []);
  });

  it('writes route hash changes when the browser hash differs from stale route state', async () => {
    const calls = [];
    const skippedHashes = [];
    const router = {
      options: { scrollBehavior: () => {} },
      async push (location) {
        calls.push(location);
      },
    };
    const route = {
      path: '/components/toggle.html',
      query: {},
      hash: '#accessibility',
    };
    const guard = {
      skip: hash => skippedHashes.push(hash),
    };

    await writeRouteHash(router, route, '#accessibility', guard, { currentHash: '#classes' });

    assert.deepEqual(skippedHashes, ['#accessibility']);
    assert.deepEqual(calls, [
      {
        path: '/components/toggle.html',
        query: {},
        hash: '#accessibility',
      },
    ]);
  });

  it('replaces the browser hash without router navigation for passive scroll-spy sync', () => {
    const calls = [];
    const history = {
      state: { scroll: 'state' },
      replaceState: (state, title, url) => calls.push({ state, title, url }),
    };

    replaceBrowserHash('#classes', {
      history,
      location: {
        pathname: '/components/toggle.html',
        search: '?theme=dp',
        hash: '#accessibility',
      },
    });
    replaceBrowserHash('', {
      history,
      location: {
        pathname: '/components/toggle.html',
        search: '?theme=dp',
        hash: '#classes',
      },
    });

    assert.deepEqual(calls, [
      {
        state: { scroll: 'state' },
        title: '',
        url: '/components/toggle.html?theme=dp#classes',
      },
      {
        state: { scroll: 'state' },
        title: '',
        url: '/components/toggle.html?theme=dp',
      },
    ]);
  });
});
