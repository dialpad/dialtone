import { MIN_PANEL_SIZE_PX } from '../ResizableConstants';
import type { ResizablePanelState } from '../ResizableConstants';
import { clampSize } from './constraintResolver';

// ============================================================================
// RESIZE HANDLING
// ============================================================================

export interface ResizeHandler {
  processResizeMove: (
    rawCursorPosition: number,
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    containerSizeValue: number,
    handleId?: string,
    allPanels?: ResizablePanelState[],
    beforePanelLeft?: number
  ) => ResizeMoveResult;
}

export interface ResizeMoveResult {
  constrainedCursorPosition: number;
  beforePanelSize: number;
  afterPanelSize: number;
  isValidResize: boolean;
}

export function useResizeHandling(containerSize?: () => number) {
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
    return clampSize(proposedSize, panel.userMinSizePixels, panel.userMaxSizePixels);
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

  return {
    processResizeMove,
  };
}
