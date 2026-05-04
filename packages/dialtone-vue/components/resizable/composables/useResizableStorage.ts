import { DEFAULT_PANEL_SIZE } from '../ResizableConstants';
import type { ResizablePanelConfig, ResizablePanelState } from '../ResizableConstants';
import type { ResizableStorageAdapter, ResizableStoragePanelData } from '../ResizableConstants';
import { parseSizeToPixels } from '../ResizableUtils';

// Re-export for backward compatibility
export type SavedPanelData = ResizableStoragePanelData;

// ============================================================================
// VALIDATION
// ============================================================================

function validateRequiredProperties(data: Record<string, unknown>): boolean {
  return typeof data.id === 'string' && typeof data.pixelSize === 'number' && data.pixelSize >= 0;
}

function validateOptionalProperties(data: Record<string, unknown>): boolean {
  return (
    (data.collapsed === undefined || typeof data.collapsed === 'boolean') &&
    (data.autoCollapsed === undefined || typeof data.autoCollapsed === 'boolean')
  );
}

function isSavedPanelData(obj: unknown): obj is ResizableStoragePanelData {
  if (typeof obj !== 'object' || obj === null) return false;
  const data = obj as Record<string, unknown>;
  return validateRequiredProperties(data) && validateOptionalProperties(data);
}

function isSavedPanelDataArray(obj: unknown): obj is ResizableStoragePanelData[] {
  return Array.isArray(obj) && obj.every(item => isSavedPanelData(item));
}

/**
 * Validates a stored panel size against container bounds and returns a safe value.
 *
 * Checks for non-finite values, negative values, and oversized values (> 2x container).
 */
export function validateStoredPanelSize(
  storedSize: number,
  containerSize: number,
  panelConfig: ResizablePanelConfig
): number {
  if (!isFinite(storedSize) || storedSize < 0) {
    return parseSizeToPixels(panelConfig.initialSize || DEFAULT_PANEL_SIZE, containerSize);
  }

  if (containerSize > 0 && storedSize > containerSize * 2) {
    console.warn(
      `[resizable] Stored size ${storedSize}px for panel '${panelConfig.id}' exceeds 2x container (${containerSize}px). Resetting.`
    );
    return parseSizeToPixels(panelConfig.initialSize || DEFAULT_PANEL_SIZE, containerSize);
  }

  return storedSize;
}

// ============================================================================
// LOCALSTORAGE ADAPTER
// ============================================================================

/**
 * Create a localStorage-backed storage adapter.
 *
 * @param key - The localStorage key to use
 * @returns A ResizableStorageAdapter backed by localStorage
 *
 * @example
 * ```vue
 * <dt-resizable :storage="localStorageAdapter('my-layout')">
 * ```
 */
export function localStorageAdapter(key: string): ResizableStorageAdapter {
  return {
    save(data: ResizableStoragePanelData[]): void {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('[resizable] Failed to save to localStorage:', error);
      }
    },

    load(): ResizableStoragePanelData[] | null {
      try {
        const saved = localStorage.getItem(key);
        if (!saved) return null;

        let parsed: unknown;
        try {
          parsed = JSON.parse(saved);
        } catch {
          localStorage.removeItem(key);
          return null;
        }

        if (!isSavedPanelDataArray(parsed)) {
          localStorage.removeItem(key);
          return null;
        }

        return parsed;
      } catch (error) {
        console.warn('[resizable] Failed to load from localStorage:', error);
        try { localStorage.removeItem(key); } catch { /* ignore */ }
        return null;
      }
    },

    clear(): void {
      try {
        localStorage.removeItem(key);
      } catch { /* ignore */ }
    },
  };
}

// ============================================================================
// COMPOSABLE
// ============================================================================

/**
 * Composable for managing panel persistence.
 *
 * Accepts either a storageKey (string → auto-creates localStorage adapter)
 * or a custom ResizableStorageAdapter. The adapter takes precedence.
 *
 * @param storageKeyOrAdapter - localStorage key string, or null
 * @param customAdapter - Optional custom adapter (overrides storageKey)
 */
export function useResizableStorage(
  storageKeyOrAdapter: string | null,
  customAdapter?: ResizableStorageAdapter
) {
  // Resolve the adapter: custom > storageKey > null
  const adapter: ResizableStorageAdapter | null = customAdapter
    ?? (storageKeyOrAdapter ? localStorageAdapter(storageKeyOrAdapter) : null);

  function saveToStorage(panels: ResizableStoragePanelData[] | ResizablePanelState[]): void {
    if (!adapter) return;

    const data: ResizableStoragePanelData[] = panels.map(panel => ({
      id: panel.id,
      pixelSize: panel.pixelSize,
      collapsed: panel.collapsed,
      autoCollapsed: panel.autoCollapsed,
    }));

    adapter.save(data);
  }

  function loadFromStorage(): ResizableStoragePanelData[] | null {
    if (!adapter) return null;

    const data = adapter.load();
    if (!data) return null;

    // Re-validate even if adapter returned data (defense in depth)
    if (!isSavedPanelDataArray(data)) {
      adapter.clear();
      return null;
    }

    return data;
  }

  function restorePanelFromStorage(panel: ResizablePanelState, savedPanel: ResizableStoragePanelData): void {
    if (panel.restoredFromStorage) return;

    if (savedPanel.pixelSize !== undefined) {
      panel.pixelSize = savedPanel.pixelSize;
    }
    if (savedPanel.collapsed !== undefined) {
      panel.collapsed = savedPanel.collapsed;
    }
    if (savedPanel.autoCollapsed !== undefined) {
      panel.autoCollapsed = savedPanel.autoCollapsed;
    }

    panel.restoredFromStorage = true;
  }

  function loadFromStorageWithValidation(panels: ResizablePanelState[]): boolean {
    const savedState = loadFromStorage();
    if (!savedState) return false;

    const currentPanelIds = new Set(panels.map(p => p.id));
    const savedPanelIds = new Set(savedState.map(p => p.id));

    // Clear if current panels don't all exist in saved (panel config changed)
    const hasIncompatiblePanels = Array.from(currentPanelIds).some(id => !savedPanelIds.has(id));
    if (hasIncompatiblePanels) {
      if (adapter) adapter.clear();
      return false;
    }

    savedState.forEach(savedPanel => {
      const panel = panels.find(p => p.id === savedPanel.id);
      if (panel) restorePanelFromStorage(panel, savedPanel);
    });

    return true;
  }

  function clearStorage(): void {
    if (adapter) adapter.clear();
  }

  return {
    saveToStorage,
    loadFromStorage,
    loadFromStorageWithValidation,
    restorePanelFromStorage,
    clearStorage,
  };
}
