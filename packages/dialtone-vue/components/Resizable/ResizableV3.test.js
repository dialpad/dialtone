/**
 * DtResizable V3 tests — Persistence + storage adapter interface.
 *
 * Tests localStorage save/load cycle, validation, custom adapter integration,
 * corrupted data handling, and storageKey vs :storage prop precedence.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import DtResizable from './Resizable.vue';
import {
  useResizableStorage,
  localStorageAdapter,
  validateStoredPanelSize,
} from './Composables';

// Mock ResizeObserver for test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

let wrapper;

afterEach(() => {
  wrapper?.unmount();
  localStorage.clear();
});

// =============================================================================
// localStorageAdapter — Unit Tests
// =============================================================================

describe('V3 — localStorageAdapter', () => {
  describe('save', () => {
    it('should persist data to localStorage', () => {
      const adapter = localStorageAdapter('test-key');
      const data = [{ id: 'a', pixelSize: 300 }];
      adapter.save(data);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(data));
    });

    it('should overwrite previous saved data', () => {
      const adapter = localStorageAdapter('test-key');
      adapter.save([{ id: 'a', pixelSize: 300 }]);
      adapter.save([{ id: 'a', pixelSize: 500 }]);
      const loaded = JSON.parse(localStorage.getItem('test-key'));
      expect(loaded[0].pixelSize).toBe(500);
    });
  });

  describe('load', () => {
    it('should return null when no data exists', () => {
      const adapter = localStorageAdapter('test-key');
      expect(adapter.load()).toBeNull();
    });

    it('should return saved panel data', () => {
      const adapter = localStorageAdapter('test-key');
      const data = [{ id: 'sidebar', pixelSize: 250, collapsed: false }];
      adapter.save(data);
      const loaded = adapter.load();
      expect(loaded).toEqual(data);
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('test-key', 'not-json{{{');
      const adapter = localStorageAdapter('test-key');
      expect(adapter.load()).toBeNull();
    });

    it('should remove corrupted data from localStorage', () => {
      localStorage.setItem('test-key', 'not-json{{{');
      const adapter = localStorageAdapter('test-key');
      adapter.load();
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should return null for non-array JSON', () => {
      localStorage.setItem('test-key', '{"id": "a"}');
      const adapter = localStorageAdapter('test-key');
      expect(adapter.load()).toBeNull();
    });

    it('should return null when array items lack required fields', () => {
      localStorage.setItem('test-key', JSON.stringify([{ name: 'wrong' }]));
      const adapter = localStorageAdapter('test-key');
      expect(adapter.load()).toBeNull();
    });

    it('should return null when pixelSize is negative', () => {
      localStorage.setItem('test-key', JSON.stringify([{ id: 'a', pixelSize: -5 }]));
      const adapter = localStorageAdapter('test-key');
      expect(adapter.load()).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove the storage key', () => {
      const adapter = localStorageAdapter('test-key');
      adapter.save([{ id: 'a', pixelSize: 300 }]);
      adapter.clear();
      expect(localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('round-trip save/load cycle', () => {
    it('should preserve all optional fields', () => {
      const adapter = localStorageAdapter('test-key');
      const data = [
        { id: 'sidebar', pixelSize: 250, collapsed: false, autoCollapsed: false },
        { id: 'content', pixelSize: 750, collapsed: false, autoCollapsed: false },
      ];
      adapter.save(data);
      expect(adapter.load()).toEqual(data);
    });
  });
});

// =============================================================================
// useResizableStorage — Unit Tests
// =============================================================================

describe('V3 — useResizableStorage composable', () => {
  describe('When storageKey is null and no adapter', () => {
    it('should return null on load', () => {
      const storage = useResizableStorage(null);
      expect(storage.loadFromStorage()).toBeNull();
    });

    it('should not throw on save', () => {
      const storage = useResizableStorage(null);
      expect(() => storage.saveToStorage([{ id: 'a', pixelSize: 300, collapsed: false }])).not.toThrow();
    });
  });

  describe('When storageKey is provided', () => {
    it('should save and load via localStorage', () => {
      const storage = useResizableStorage('my-layout');
      const panels = [
        { id: 'sidebar', pixelSize: 250, collapsed: false },
        { id: 'content', pixelSize: 750, collapsed: false },
      ];
      storage.saveToStorage(panels);
      const loaded = storage.loadFromStorage();
      expect(loaded).toHaveLength(2);
      expect(loaded[0].id).toBe('sidebar');
      expect(loaded[0].pixelSize).toBe(250);
    });
  });

  describe('When custom adapter is provided', () => {
    it('should use the custom adapter for save', () => {
      const mockAdapter = { save: vi.fn(), load: vi.fn().mockReturnValue(null), clear: vi.fn() };
      const storage = useResizableStorage(null, mockAdapter);
      storage.saveToStorage([{ id: 'a', pixelSize: 300, collapsed: false }]);
      expect(mockAdapter.save).toHaveBeenCalledOnce();
    });

    it('should use the custom adapter for load', () => {
      const savedData = [{ id: 'panel-a', pixelSize: 400 }];
      const mockAdapter = { save: vi.fn(), load: vi.fn().mockReturnValue(savedData), clear: vi.fn() };
      const storage = useResizableStorage(null, mockAdapter);
      expect(storage.loadFromStorage()).toEqual(savedData);
    });

    it('should use the custom adapter for clear', () => {
      const mockAdapter = { save: vi.fn(), load: vi.fn().mockReturnValue(null), clear: vi.fn() };
      const storage = useResizableStorage(null, mockAdapter);
      storage.clearStorage();
      expect(mockAdapter.clear).toHaveBeenCalledOnce();
    });
  });

  describe('Adapter precedence', () => {
    it('should prefer custom adapter over storageKey', () => {
      const mockAdapter = {
        save: vi.fn(),
        load: vi.fn().mockReturnValue([{ id: 'from-adapter', pixelSize: 999 }]),
        clear: vi.fn(),
      };

      // Set something in localStorage that would be returned by storageKey
      localStorage.setItem('my-layout', JSON.stringify([{ id: 'from-local', pixelSize: 100 }]));

      const storage = useResizableStorage('my-layout', mockAdapter);
      const loaded = storage.loadFromStorage();
      expect(loaded[0].id).toBe('from-adapter');
      expect(mockAdapter.load).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// validateStoredPanelSize — Unit Tests
// =============================================================================

describe('V3 — validateStoredPanelSize', () => {
  const defaultConfig = { id: 'test', initialSize: '50p' };

  it('should return the stored size when valid', () => {
    expect(validateStoredPanelSize(300, 1000, defaultConfig)).toBe(300);
  });

  it('should reset NaN to initial size', () => {
    const result = validateStoredPanelSize(NaN, 1000, defaultConfig);
    expect(result).toBe(500); // 50p of 1000 = 500
  });

  it('should reset Infinity to initial size', () => {
    const result = validateStoredPanelSize(Infinity, 1000, defaultConfig);
    expect(result).toBe(500);
  });

  it('should reset negative values to initial size', () => {
    const result = validateStoredPanelSize(-100, 1000, defaultConfig);
    expect(result).toBe(500);
  });

  it('should reset oversized values (>2x container) to initial size', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = validateStoredPanelSize(2500, 1000, defaultConfig);
    expect(result).toBe(500);
    warnSpy.mockRestore();
  });

  it('should accept zero as a valid size', () => {
    expect(validateStoredPanelSize(0, 1000, defaultConfig)).toBe(0);
  });

  it('should accept sizes up to 2x container', () => {
    expect(validateStoredPanelSize(2000, 1000, defaultConfig)).toBe(2000);
  });
});

// =============================================================================
// Component integration — :storage prop
// =============================================================================

describe('V3 — Storage prop integration', () => {
  describe('When storage prop is provided', () => {
    it('should accept the storage prop without error', () => {
      const mockAdapter = { save: vi.fn(), load: vi.fn().mockReturnValue(null), clear: vi.fn() };
      wrapper = mount(DtResizable, {
        props: { storage: mockAdapter },
        attachTo: document.body,
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should accept storageKey prop without error', () => {
      wrapper = mount(DtResizable, {
        props: { storageKey: 'test-layout' },
        attachTo: document.body,
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('When both storageKey and storage are provided', () => {
    it('should mount without error (adapter takes precedence internally)', () => {
      const mockAdapter = { save: vi.fn(), load: vi.fn().mockReturnValue(null), clear: vi.fn() };
      wrapper = mount(DtResizable, {
        props: { storageKey: 'test-layout', storage: mockAdapter },
        attachTo: document.body,
      });
      expect(wrapper.exists()).toBe(true);
    });
  });
});
