/**
 * useDOMCache — shared composable for caching DOM queries and computed values.
 *
 * Features:
 * - Element query caching with TTL expiry
 * - DOM existence validation before returning cached elements
 * - LRU eviction when cache exceeds maxElements
 * - Computed value caching with dependency tracking
 * - Automatic invalidation via MutationObserver
 * - Performance metrics (hit/miss/invalidation counts)
 */

import { ref, onUnmounted, nextTick } from 'vue';

// ─── Types ────────────────────────────────────────────────────────────────

interface CachedElement {
  element: Element;
  selector: string;
  timestamp: number;
  hitCount: number;
}

interface CachedComputation<T> {
  value: T;
  dependencies: string[];
  timestamp: number;
  hitCount: number;
}

export interface DOMCacheOptions {
  /** Maximum cached elements (default: 50) */
  maxElements?: number;
  /** TTL for cached entries in ms (default: 5000) */
  maxAge?: number;
  /** Invalidate cache on DOM mutations (default: true) */
  autoInvalidate?: boolean;
  /** Scope MutationObserver to this element instead of document.body */
  observeRoot?: HTMLElement | (() => HTMLElement | null);
}

export interface DOMCacheMetrics {
  elementHits: number;
  elementMisses: number;
  computationHits: number;
  computationMisses: number;
  invalidations: number;
  elementHitRate: number;
  computationHitRate: number;
  totalCached: number;
}

// ─── Pure helpers ─────────────────────────────────────────────────────────

function findLRUKey(cache: Map<string, CachedElement>): string {
  let oldest = '';
  let oldestTime = Infinity;

  for (const [key, entry] of cache.entries()) {
    if (
      entry.timestamp < oldestTime ||
      (entry.timestamp === oldestTime && entry.hitCount < (cache.get(oldest)?.hitCount ?? 0))
    ) {
      oldest = key;
      oldestTime = entry.timestamp;
    }
  }
  return oldest;
}

function cleanExpired<T extends { timestamp: number }>(
  cache: Map<string, T>,
  maxAge: number,
): number {
  const cutoff = Date.now() - maxAge;
  let cleaned = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.timestamp < cutoff) { cache.delete(key); cleaned++; }
  }
  return cleaned;
}

function shouldInvalidate(mutations: MutationRecord[]): boolean {
  return mutations.some((m) => {
    if (m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0)) return true;
    if (m.type === 'attributes' && ['class', 'id', 'style'].includes(m.attributeName || '')) return true;
    return false;
  });
}

// ─── Composable ───────────────────────────────────────────────────────────

export function useDOMCache(options: DOMCacheOptions = {}) {
  const {
    maxElements = 50,
    maxAge = 5000,
    autoInvalidate = true,
    observeRoot,
  } = options;

  const elementCache = ref(new Map<string, CachedElement>());
  const computationCache = ref(new Map<string, CachedComputation<unknown>>());
  const metrics = ref({
    elementHits: 0,
    elementMisses: 0,
    computationHits: 0,
    computationMisses: 0,
    invalidations: 0,
  });

  let observer: MutationObserver | null = null;

  function isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > maxAge;
  }

  function evictIfFull(): void {
    if (elementCache.value.size < maxElements) return;
    const key = findLRUKey(elementCache.value);
    if (key) elementCache.value.delete(key);
  }

  function runCleanup(): void {
    cleanExpired(elementCache.value, maxAge);
    cleanExpired(computationCache.value, maxAge);
    evictIfFull();
  }

  // ── Element queries ─────────────────────────────────────────────────

  function querySelector(
    selector: string,
    container?: Element,
  ): Element | null {
    const cacheKey = container
      ? `${selector}@${container.tagName}`
      : selector;
    const cached = elementCache.value.get(cacheKey);

    if (cached && !isExpired(cached.timestamp) && document.contains(cached.element)) {
      cached.hitCount++;
      metrics.value.elementHits++;
      return cached.element;
    }

    const element = container
      ? container.querySelector(selector)
      : document.querySelector(selector);
    metrics.value.elementMisses++;

    if (element) {
      runCleanup();
      elementCache.value.set(cacheKey, {
        element,
        selector: cacheKey,
        timestamp: Date.now(),
        hitCount: 1,
      });
    }

    return element;
  }

  function querySelectorAll(
    selector: string,
    container?: Element,
  ): Element[] {
    const elements = container
      ? Array.from(container.querySelectorAll(selector))
      : Array.from(document.querySelectorAll(selector));

    // Pre-populate individual cache entries
    elements.forEach((el, i) => {
      const key = container
        ? `${selector}:nth(${i})@${container.tagName}`
        : `${selector}:nth(${i})`;
      if (!elementCache.value.has(key)) {
        elementCache.value.set(key, {
          element: el,
          selector: key,
          timestamp: Date.now(),
          hitCount: 0,
        });
      }
    });

    return elements;
  }

  // ── Computation caching ─────────────────────────────────────────────

  function computeWithCache<T>(
    key: string,
    computeFn: () => T,
    dependencies: string[] = [],
  ): T {
    const cached = computationCache.value.get(key) as CachedComputation<T> | undefined;

    if (
      cached &&
      !isExpired(cached.timestamp) &&
      cached.dependencies.every((dep) => querySelector(dep) !== null)
    ) {
      cached.hitCount++;
      metrics.value.computationHits++;
      return cached.value;
    }

    const value = computeFn();
    metrics.value.computationMisses++;
    computationCache.value.set(key, {
      value,
      dependencies,
      timestamp: Date.now(),
      hitCount: 1,
    });
    return value;
  }

  // ── Invalidation ────────────────────────────────────────────────────

  function invalidate(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of elementCache.value.keys()) {
        if (regex.test(key)) elementCache.value.delete(key);
      }
      for (const key of computationCache.value.keys()) {
        if (regex.test(key)) computationCache.value.delete(key);
      }
    } else {
      elementCache.value.clear();
      computationCache.value.clear();
    }
    metrics.value.invalidations++;
  }

  // ── Metrics ─────────────────────────────────────────────────────────

  function getMetrics(): DOMCacheMetrics {
    const m = metrics.value;
    const eTotal = m.elementHits + m.elementMisses;
    const cTotal = m.computationHits + m.computationMisses;
    return {
      ...m,
      elementHitRate: eTotal > 0 ? Math.round((m.elementHits / eTotal) * 10000) / 100 : 0,
      computationHitRate: cTotal > 0 ? Math.round((m.computationHits / cTotal) * 10000) / 100 : 0,
      totalCached: elementCache.value.size + computationCache.value.size,
    };
  }

  // ── Lifecycle ───────────────────────────────────────────────────────

  function cleanup(): void {
    if (observer) { observer.disconnect(); observer = null; }
    elementCache.value.clear();
    computationCache.value.clear();
  }

  nextTick(() => {
    if (!autoInvalidate) return;
    if (typeof MutationObserver === 'undefined' || typeof MutationObserver.prototype === 'undefined') return;
    try {
      const root = typeof observeRoot === 'function' ? observeRoot() : observeRoot;
      const target = root ?? document.body;
      observer = new MutationObserver((mutations) => {
        if (shouldInvalidate(mutations)) invalidate();
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id', 'style'],
      });
    } catch {
      // MutationObserver unavailable or mocked improperly (test environments)
    }
  });

  onUnmounted(() => { cleanup(); });

  return {
    querySelector,
    querySelectorAll,
    computeWithCache,
    invalidate,
    getMetrics,
    cleanup,
  };
}
