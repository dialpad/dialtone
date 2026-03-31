import type { ResizablePanelConfig, ResizablePanelState } from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';

/**
 * Interface for the saved panel data structure in localStorage
 */
export interface SavedPanelData {
  id: string;
  pixelSize: number;
  locked?: boolean;
  collapsed?: boolean;
  /** Whether this panel was auto-collapsed by the system (vs manually by user) */
  autoCollapsed?: boolean;
  /** Proportion of container this panel should occupy (set by drag, used for viewport scaling) */
  manualTargetRatio?: number;
}

/**
 * Validate required properties of SavedPanelData
 */
function validateRequiredProperties(data: Record<string, unknown>): boolean {
  return typeof data.id === 'string' && typeof data.pixelSize === 'number' && data.pixelSize >= 0;
}

/**
 * Validate optional properties of SavedPanelData
 */
function validateOptionalProperties(data: Record<string, unknown>): boolean {
  return (
    (data.locked === undefined || typeof data.locked === 'boolean') &&
    (data.collapsed === undefined || typeof data.collapsed === 'boolean') &&
    (data.autoCollapsed === undefined || typeof data.autoCollapsed === 'boolean')
  );
}

/**
 * Type guard to check if an object is a valid SavedPanelData
 */
function isSavedPanelData(obj: unknown): obj is SavedPanelData {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const data = obj as Record<string, unknown>;
  return validateRequiredProperties(data) && validateOptionalProperties(data);
}

/**
 * Type guard to check if an array contains valid SavedPanelData objects
 */
function isSavedPanelDataArray(obj: unknown): obj is SavedPanelData[] {
  return Array.isArray(obj) && obj.every(item => isSavedPanelData(item));
}

/**
 * Validates a stored panel size against container bounds and returns a safe value.
 *
 * Checks for:
 * - Non-finite values (NaN, Infinity)
 * - Negative values
 * - Oversized values (> 2x container size, likely corrupted)
 *
 * @param storedSize - The pixel size loaded from storage
 * @param containerSize - Current container size in pixels
 * @param panelConfig - Panel configuration with initialSize fallback
 * @returns Validated size or initialSize fallback if invalid
 */
export function validateStoredPanelSize(
  storedSize: number,
  containerSize: number,
  panelConfig: ResizablePanelConfig
): number {
  if (!isFinite(storedSize)) {
    return parseSizeToPixels(panelConfig.initialSize || '50p', containerSize);
  }

  if (storedSize < 0) {
    return parseSizeToPixels(panelConfig.initialSize || '50p', containerSize);
  }

  if (containerSize > 0 && storedSize > containerSize * 2) {
    console.warn(
      `[resizable] Stored size ${storedSize}px for panel '${panelConfig.id}' exceeds 2x container (${containerSize}px). Resetting to initial size.`
    );
    return parseSizeToPixels(panelConfig.initialSize || '50p', containerSize);
  }

  return storedSize;
}

/**
 * Composable for managing localStorage operations for resizable panels.
 * Provides simple save/load functionality with validation for pixel-based panel states.
 */
export function useResizableStorage(storageKey: string | null) {
  function saveToStorage(panels: ResizablePanelState[]) {
    if (!storageKey) return;

    try {
      const stateToSave = panels.map(panel => ({
        id: panel.id,
        pixelSize: panel.pixelSize,
        locked: panel.locked,
        collapsed: panel.collapsed,
        autoCollapsed: panel.autoCollapsed,
      }));

      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('[resizable] Failed to save to storage:', error);
    }
  }

  /**
   * Load panel state from localStorage with runtime type validation.
   * Returns null if no valid data is found.
   */
  function loadFromStorage(): SavedPanelData[] | null {
    if (!storageKey) {
      return null;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        return null;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(saved);
      } catch {
        localStorage.removeItem(storageKey);
        return null;
      }

      if (!isSavedPanelDataArray(parsed)) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('[resizable] Failed to load saved panel data:', error);
      try {
        if (storageKey) {
          localStorage.removeItem(storageKey);
        }
      } catch (clearError) {
        console.warn('[resizable] Failed to clear corrupted panel data:', clearError);
      }
      return null;
    }
  }

  /**
   * Restore panel from saved data with type safety
   */
  function restorePanelFromStorage(panel: ResizablePanelState, savedPanel: SavedPanelData): void {
    if (panel.restoredFromStorage) {
      return;
    }

    if (savedPanel.pixelSize !== undefined) {
      panel.pixelSize = savedPanel.pixelSize;
    }

    if (savedPanel.locked !== undefined && panel.resizable !== false) {
      panel.locked = savedPanel.locked;
    }

    if (savedPanel.collapsed !== undefined) {
      panel.collapsed = savedPanel.collapsed;
    }

    if (savedPanel.autoCollapsed !== undefined) {
      panel.autoCollapsed = savedPanel.autoCollapsed;
    }

    panel.restoredFromStorage = true;
  }

  /**
   * Simple load from storage with basic validation
   */
  function loadFromStorageWithValidation(panels: ResizablePanelState[]): boolean {
    const savedState = loadFromStorage();
    if (!savedState) {
      return false;
    }

    const currentPanelIds = new Set(panels.map(p => p.id));
    const savedPanelIds = new Set(savedState.map(p => p.id));

    const hasIncompatiblePanels = Array.from(currentPanelIds).some(id => !savedPanelIds.has(id));

    if (hasIncompatiblePanels) {
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      return false;
    }

    savedState.forEach(savedPanel => {
      const panel = panels.find(p => p.id === savedPanel.id);
      if (panel) {
        restorePanelFromStorage(panel, savedPanel);
      }
    });

    return true;
  }

  /**
   * Clear saved storage data
   */
  function clearStorage(): void {
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }

  return {
    saveToStorage,
    loadFromStorage,
    loadFromStorageWithValidation,
    restorePanelFromStorage,
    clearStorage,
  };
}
