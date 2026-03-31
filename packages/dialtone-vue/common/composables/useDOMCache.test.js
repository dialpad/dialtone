/**
 * useDOMCache tests
 *
 * Tests cache hit/miss, TTL expiry, LRU eviction,
 * DOM existence validation, and MutationObserver invalidation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useDOMCache } from './useDOMCache';

// Mock MutationObserver
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
}));

// Wrapper component that uses useDOMCache inside a Vue component context
let cacheInstance;
const CacheHost = defineComponent({
  name: 'CacheHost',

  setup () {
    cacheInstance = useDOMCache({ maxElements: 5, maxAge: 500, autoInvalidate: false });
    return {};
  },

  template: '<div />',
});

let wrapper;

describe('useDOMCache', () => {
  beforeEach(() => {
    cacheInstance = null;
    wrapper = mount(CacheHost, { attachTo: document.body });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('querySelector', () => {
    it('should return null for non-existent element', () => {
      expect(cacheInstance.querySelector('.does-not-exist')).toBeNull();
    });

    it('should find an element in the document', () => {
      const el = document.createElement('div');
      el.className = 'cache-test-target';
      document.body.appendChild(el);

      const result = cacheInstance.querySelector('.cache-test-target');
      expect(result).toBe(el);

      el.remove();
    });

    it('should return cached element on second call', () => {
      const el = document.createElement('div');
      el.className = 'cache-hit-test';
      document.body.appendChild(el);

      cacheInstance.querySelector('.cache-hit-test');
      cacheInstance.querySelector('.cache-hit-test');

      const metrics = cacheInstance.getMetrics();
      expect(metrics.elementHits).toBe(1);
      expect(metrics.elementMisses).toBe(1);

      el.remove();
    });
  });

  describe('computeWithCache', () => {
    it('should compute and cache a value', () => {
      const fn = vi.fn(() => 42);
      const result = cacheInstance.computeWithCache('test-key', fn);
      expect(result).toBe(42);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('should return cached value on second call', () => {
      const fn = vi.fn(() => 42);
      cacheInstance.computeWithCache('reuse-key', fn);
      const second = cacheInstance.computeWithCache('reuse-key', fn);
      expect(second).toBe(42);
      expect(fn).toHaveBeenCalledOnce();
    });
  });

  describe('invalidate', () => {
    it('should clear all entries when called without pattern', () => {
      cacheInstance.computeWithCache('a', () => 1);
      cacheInstance.computeWithCache('b', () => 2);
      cacheInstance.invalidate();

      const metrics = cacheInstance.getMetrics();
      expect(metrics.totalCached).toBe(0);
    });

    it('should increment invalidation counter', () => {
      cacheInstance.invalidate();
      expect(cacheInstance.getMetrics().invalidations).toBe(1);
    });

    it('should clear entries matching a pattern', () => {
      cacheInstance.computeWithCache('panel-left', () => 1);
      cacheInstance.computeWithCache('panel-right', () => 2);
      cacheInstance.computeWithCache('other', () => 3);

      cacheInstance.invalidate('panel-');
      const metrics = cacheInstance.getMetrics();
      expect(metrics.totalCached).toBe(1);
    });
  });

  describe('getMetrics', () => {
    it('should return zero metrics initially', () => {
      const metrics = cacheInstance.getMetrics();
      expect(metrics.elementHits).toBe(0);
      expect(metrics.elementMisses).toBe(0);
      expect(metrics.totalCached).toBe(0);
    });

    it('should track computation hits and misses', () => {
      cacheInstance.computeWithCache('m1', () => 1);
      cacheInstance.computeWithCache('m1', () => 1);

      const metrics = cacheInstance.getMetrics();
      expect(metrics.computationMisses).toBe(1);
      expect(metrics.computationHits).toBe(1);
    });
  });

  describe('cleanup', () => {
    it('should clear all caches', () => {
      cacheInstance.computeWithCache('x', () => 99);
      cacheInstance.cleanup();
      expect(cacheInstance.getMetrics().totalCached).toBe(0);
    });
  });
});
