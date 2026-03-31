import { computed, type ComputedRef } from 'vue';
import { MIN_PANEL_SIZE_PX } from '../resizable_constants';
import type { ResizablePanelState, ResizableDirection, ResizableSizeValue } from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';
import { ensureAtLeastOneUnlocked as ensureAtLeastOneUnlockedModel } from './useResizablePanelState';

// ============================================================================
// PANEL SIZING (formerly useResizablePanelSizing.ts)
// ============================================================================

export interface ResizablePanelSizingOptions {
  panel: ComputedRef<ResizablePanelState | undefined>;
  panels: ComputedRef<ResizablePanelState[]>;
  containerSize: ComputedRef<number>;
  containerElement: ComputedRef<HTMLElement | null>;
}

export interface PanelSizeInfo {
  isLocked: boolean;
  pixelSize: number;
  absoluteStyles: Record<string, string>;
}

export function useResizablePanelSizing(options: ResizablePanelSizingOptions) {
  const { panel, panels, containerSize } = options;

  function validatePixelResult(result: number, initialSize: string, container: number): number {
    if (!isFinite(result) || result < 0) {
      console.warn(
        `[resizable] Invalid pixel size result: ${result} for initialSize: ${initialSize}. Using 50% of container.`
      );
      return Math.round(container * 0.5);
    }

    if (container > 0 && result > container) {
      console.warn(`[resizable] Pixel size ${result}px exceeds container ${container}px. Capping at container size.`);
      return container;
    }

    return Math.round(result);
  }

  function convertInitialSizeToPixels(initialSize: ResizableSizeValue | undefined, container: number): number {
    if (!initialSize) return Math.round(container * 0.5);

    const result = parseSizeToPixels(initialSize, container);
    return validatePixelResult(result, initialSize, container);
  }

  function getTotalLockedPixels(): number {
    return panels.value
      .filter(p => !p.collapsed && (p.locked || p.resizable === false))
      .reduce((sum, p) => sum + (p.pixelSize || 0), 0);
  }

  function getUnlockedPanels() {
    return panels.value.filter(p => !p.collapsed && !p.locked && p.resizable !== false);
  }

  function getRemainingSpace(): number {
    const totalLocked = getTotalLockedPixels();
    return Math.max(0, containerSize.value - totalLocked);
  }

  function calculateActualPanelSize(p: ResizablePanelState): number {
    if (p.locked || p.resizable === false) {
      return p.pixelSize;
    } else {
      return calculateUnlockedPanelSize(p.pixelSize);
    }
  }

  function sumPanelSizesBefore(targetPanelId: string): number {
    let position = 0;

    for (const p of panels.value) {
      if (p.id === targetPanelId) {
        break;
      }

      if (!p.collapsed && p.pixelSize) {
        const actualSize = calculateActualPanelSize(p);
        position += actualSize;
      }
    }

    return position;
  }

  function calculatePanelPosition(): number {
    const panelData = panel.value;
    if (!panelData) return 0;

    return sumPanelSizesBefore(panelData.id);
  }

  function getCurrentPanelActualSize(): number {
    const panelData = panel.value;
    if (!panelData) return 0;

    return calculateActualPanelSize(panelData);
  }

  function calculatePanelRightPosition(): number {
    const panelData = panel.value;
    if (!panelData) return containerSize.value;

    const leftPosition = calculatePanelPosition();
    const actualPixelSize = getCurrentPanelActualSize();

    return leftPosition + actualPixelSize;
  }

  function calculateUnlockedPanelSize(panelPixelSize: number): number {
    const unlockedPanels = getUnlockedPanels();
    const remainingSpace = getRemainingSpace();

    if (containerSize.value <= 0) {
      return panelPixelSize;
    }

    if (unlockedPanels.length === 0 || remainingSpace <= 0) {
      return panelPixelSize;
    }

    const totalUnlockedPixels = unlockedPanels.reduce((sum, p) => sum + (p.pixelSize || 0), 0);

    if (totalUnlockedPixels <= 0) {
      return Math.round(remainingSpace / unlockedPanels.length);
    }

    const proportion = panelPixelSize / totalUnlockedPixels;
    return Math.round(remainingSpace * proportion);
  }

  function getCollapsedPanelInfo(): PanelSizeInfo {
    const leftPosition = calculatePanelPosition();
    return {
      isLocked: false,
      pixelSize: 0,
      absoluteStyles: {
        'position': 'absolute',
        'left': `${leftPosition}px`,
        'width': '0px',
        'top': '0px',
        'height': '100%',
        'overflow': 'hidden',
        'min-width': '0',
        'min-height': '0',
        'z-index': '1',
      },
    };
  }

  function validatePanelSizeLimit(panelData: ResizablePanelState): void {
    if (containerSize.value > 0 && panelData.pixelSize > containerSize.value * 2) {
      console.warn(
        `[resizable] Panel ${panelData.id} has unusually large pixelSize: ${panelData.pixelSize}px. Resetting to reasonable size.`
      );
      panelData.pixelSize = convertInitialSizeToPixels(panelData.initialSize, containerSize.value);
    }
  }

  function handleZeroPixelSize(panelData: ResizablePanelState): void {
    if (panelData.pixelSize === 0 && panelData.initialSize === '0') {
      // Intentional — panel is meant to be hidden
    } else if (panelData.pixelSize === 0 && !panelData.pixelSize) {
      panelData.pixelSize = convertInitialSizeToPixels(panelData.initialSize, containerSize.value);
    }
  }

  function initializeAndValidatePanelSize(panelData: ResizablePanelState): void {
    if (!isFinite(panelData.pixelSize) || panelData.pixelSize < 0) {
      panelData.pixelSize = convertInitialSizeToPixels(panelData.initialSize, containerSize.value);
    }

    handleZeroPixelSize(panelData);
    validatePanelSizeLimit(panelData);
  }

  const panelSizeInfo = computed((): PanelSizeInfo => {
    const panelData = panel.value;
    if (!panelData) {
      return {
        isLocked: false,
        pixelSize: 0,
        absoluteStyles: {},
      };
    }

    if (panelData.collapsed) {
      return getCollapsedPanelInfo();
    }

    initializeAndValidatePanelSize(panelData);

    const isLocked = panelData.locked || panelData.resizable === false;
    const leftPosition = calculatePanelPosition();
    const rightPosition = calculatePanelRightPosition();
    const rightValue = Math.max(0, containerSize.value - rightPosition);

    const actualPixelSize = isLocked ? panelData.pixelSize : calculateUnlockedPanelSize(panelData.pixelSize);

    return {
      isLocked,
      pixelSize: actualPixelSize,
      absoluteStyles: {
        left: `${leftPosition}px`,
        right: `${rightValue}px`,
      },
    };
  });

  function initializePanelSize(panelData: ResizablePanelState): void {
    if (!isFinite(panelData.pixelSize) || panelData.pixelSize < 0) {
      panelData.pixelSize = convertInitialSizeToPixels(panelData.initialSize, containerSize.value);
    }

    if (panelData.resizable === false) {
      panelData.locked = true;
    }
  }

  function updatePanelsForViewportChange(newContainerSize: number, oldContainerSize: number): void {
    if (oldContainerSize <= 0 || newContainerSize <= 0) return;

    const scaleFactor = newContainerSize / oldContainerSize;

    panels.value.forEach(panel => {
      if (panel.locked || panel.resizable === false) {
        return;
      }

      if (panel.pixelSize && panel.pixelSize > 0) {
        panel.pixelSize = Math.round(panel.pixelSize * scaleFactor);
      }
    });
  }

  function ensureAtLeastOneUnlocked(): void {
    ensureAtLeastOneUnlockedModel(panels.value);
  }

  return {
    panelSizeInfo,
    initializePanelSize,
    updatePanelsForViewportChange,
    ensureAtLeastOneUnlocked,
    getTotalLockedPixels,
    getRemainingSpace,
    convertInitialSizeToPixels,
  };
}

// ============================================================================
// RESIZE HANDLING (formerly useResizeHandling.ts)
// ============================================================================

export interface ResizeHandler {
  getEventPosition: (event: MouseEvent | TouchEvent) => { clientX: number; clientY: number };
  getCoordinate: (position: { clientX: number; clientY: number }) => number;
  processResizeMove: (
    rawCursorPosition: number,
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    containerSizeValue: number,
    handleId?: string,
    allPanels?: ResizablePanelState[],
    beforePanelLeft?: number
  ) => ResizeMoveResult;
  calculateNewSizes: (
    delta: number,
    startBeforeSize: number,
    startAfterSize: number
  ) => { newBeforeSize: number; newAfterSize: number };
  updatePanelSizes: (
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    deltaPixels: number,
    containerSizeValue: number,
    skipConstraints?: boolean
  ) => boolean;
}

export interface ResizeMoveResult {
  constrainedCursorPosition: number;
  beforePanelSize: number;
  afterPanelSize: number;
  isValidResize: boolean;
}

export function useResizeHandling(direction: ResizableDirection, containerSize?: () => number) {
  function getEventPosition(event: MouseEvent | TouchEvent) {
    if ('touches' in event) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: event.clientX, clientY: event.clientY };
  }

  function getCoordinate(position: { clientX: number; clientY: number }) {
    return direction === 'row' ? position.clientX : position.clientY;
  }

  function checkPanelsResizable(
    rawCursorPosition: number,
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState
  ): ResizeMoveResult | null {
    if (beforePanel.resizable === false || afterPanel.resizable === false) {
      return {
        constrainedCursorPosition: rawCursorPosition,
        beforePanelSize: beforePanel.pixelSize || 0,
        afterPanelSize: afterPanel.pixelSize || 0,
        isValidResize: false,
      };
    }
    return null;
  }

  function applyPanelConstraints(proposedSize: number, panel: ResizablePanelState): number {
    let constrainedSize = proposedSize;

    if (panel.userMinSizePixels !== undefined) {
      constrainedSize = Math.max(constrainedSize, panel.userMinSizePixels);
    }
    if (panel.userMaxSizePixels !== undefined) {
      constrainedSize = Math.min(constrainedSize, panel.userMaxSizePixels);
    }

    return constrainedSize;
  }

  function calculateMaxCursorForAfterPanel(
    afterPanel: ResizablePanelState,
    containerSizeValue: number,
    allPanels?: ResizablePanelState[]
  ): number {
    const minPixels = afterPanel.userMinSizePixels;

    if (minPixels === undefined || !allPanels) {
      return containerSizeValue;
    }

    const afterPanelIndex = allPanels.findIndex(p => p.id === afterPanel.id);
    const panelsAfterThis = allPanels.slice(afterPanelIndex + 1);
    const totalFixedSpaceAfter = panelsAfterThis.reduce((sum, panel) => sum + (panel.pixelSize || 0), 0);

    return containerSizeValue - minPixels - totalFixedSpaceAfter;
  }

  function calculateAfterPanelSize(
    cursorPosition: number,
    containerSizeValue: number,
    afterPanel: ResizablePanelState,
    allPanels?: ResizablePanelState[]
  ): number {
    if (!allPanels) {
      return containerSizeValue - cursorPosition;
    }

    const afterPanelIndex = allPanels.findIndex(p => p.id === afterPanel.id);
    const panelsAfterThis = allPanels.slice(afterPanelIndex + 1);
    const totalFixedSpaceAfter = panelsAfterThis.reduce((sum, panel) => sum + (panel.pixelSize || 0), 0);

    return containerSizeValue - cursorPosition - totalFixedSpaceAfter;
  }

  function processResizeMove(
    rawCursorPosition: number,
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    containerSizeValue: number,
    handleId?: string,
    allPanels?: ResizablePanelState[],
    beforePanelLeft?: number
  ): ResizeMoveResult {
    const nonResizableResult = checkPanelsResizable(rawCursorPosition, beforePanel, afterPanel);
    if (nonResizableResult) return nonResizableResult;

    const beforeLeft = beforePanelLeft || 0;
    const proposedBeforeSize = rawCursorPosition - beforeLeft;
    const proposedAfterSize = containerSizeValue - rawCursorPosition;

    let constrainedBeforeSize = applyPanelConstraints(proposedBeforeSize, beforePanel);
    let constrainedAfterSize = applyPanelConstraints(proposedAfterSize, afterPanel);

    const maxCursorForAfterPanel = calculateMaxCursorForAfterPanel(afterPanel, containerSizeValue, allPanels);
    const beforePanelCursor = beforeLeft + constrainedBeforeSize;
    const effectiveCursor = Math.min(beforePanelCursor, maxCursorForAfterPanel);

    let constrainedCursorPosition;

    if (effectiveCursor < beforePanelCursor) {
      constrainedCursorPosition = effectiveCursor;
      constrainedBeforeSize = constrainedCursorPosition - beforeLeft;
      constrainedAfterSize = calculateAfterPanelSize(
        constrainedCursorPosition,
        containerSizeValue,
        afterPanel,
        allPanels
      );
    } else {
      constrainedCursorPosition = beforePanelCursor;
      constrainedAfterSize = calculateAfterPanelSize(
        constrainedCursorPosition,
        containerSizeValue,
        afterPanel,
        allPanels
      );
    }

    return {
      constrainedCursorPosition,
      beforePanelSize: constrainedBeforeSize,
      afterPanelSize: constrainedAfterSize,
      isValidResize: constrainedBeforeSize >= MIN_PANEL_SIZE_PX && constrainedAfterSize >= MIN_PANEL_SIZE_PX,
    };
  }

  function calculateNewSizes(delta: number, startBeforeSize: number, startAfterSize: number) {
    const totalSize = startBeforeSize + startAfterSize;
    const currentContainerSize = containerSize ? containerSize() : 1000;
    const deltaPercentage = (delta / currentContainerSize) * 100;

    const newBeforeSize = startBeforeSize + deltaPercentage;
    const newAfterSize = totalSize - newBeforeSize;

    return { newBeforeSize, newAfterSize };
  }

  function getPanelConstraintBounds(
    panel: ResizablePanelState,
    containerSizeValue: number
  ): { min: number; max: number } {
    return {
      min: panel.userMinSizePixels ?? 10,
      max: panel.userMaxSizePixels ?? containerSizeValue,
    };
  }

  function applyBasicBoundsCheck(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    newBeforePixels: number,
    newAfterPixels: number
  ): boolean {
    if (newBeforePixels >= MIN_PANEL_SIZE_PX && newAfterPixels >= MIN_PANEL_SIZE_PX) {
      beforePanel.pixelSize = Math.round(newBeforePixels);
      afterPanel.pixelSize = Math.round(newAfterPixels);
      beforePanel.locked = true;
      return true;
    }
    return false;
  }

  function applyFullConstraints(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    newBeforePixels: number,
    newAfterPixels: number,
    containerSizeValue: number
  ): void {
    const beforeBounds = getPanelConstraintBounds(beforePanel, containerSizeValue);
    const afterBounds = getPanelConstraintBounds(afterPanel, containerSizeValue);

    const constrainedBeforePixels = Math.max(beforeBounds.min, Math.min(beforeBounds.max, newBeforePixels));
    const constrainedAfterPixels = Math.max(afterBounds.min, Math.min(afterBounds.max, newAfterPixels));

    beforePanel.pixelSize = Math.round(constrainedBeforePixels);
    afterPanel.pixelSize = Math.round(constrainedAfterPixels);
    beforePanel.locked = true;
  }

  function checkUpdatePanelsResizable(beforePanel: ResizablePanelState, afterPanel: ResizablePanelState): boolean {
    return !(beforePanel.resizable === false || afterPanel.resizable === false);
  }

  function updatePanelSizes(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    deltaPixels: number,
    containerSizeValue: number,
    skipConstraints = false
  ) {
    if (!checkUpdatePanelsResizable(beforePanel, afterPanel)) {
      return false;
    }

    const newBeforePixels = (beforePanel.pixelSize || 0) + deltaPixels;
    const newAfterPixels = (afterPanel.pixelSize || 0) - deltaPixels;

    if (skipConstraints) {
      return applyBasicBoundsCheck(beforePanel, afterPanel, newBeforePixels, newAfterPixels);
    }

    applyFullConstraints(beforePanel, afterPanel, newBeforePixels, newAfterPixels, containerSizeValue);
    return true;
  }

  return {
    getEventPosition,
    getCoordinate,
    processResizeMove,
    calculateNewSizes,
    updatePanelSizes,
  };
}
