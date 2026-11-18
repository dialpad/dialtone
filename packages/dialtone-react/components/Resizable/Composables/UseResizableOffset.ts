/**
 * Offset positioning hook for resize handles.
 *
 * Calculates dynamic offsets from DOM elements (e.g. a fixed header/toolbar)
 * so handles and panel content can avoid overlapping external UI.
 */

import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ResizableOffsetOptions {
  /** CSS selector for the element to measure offset from (auto-measures block-size) */
  offsetElement?: string | null;
  /** Explicit pixel offset. Overrides offsetElement measurement when both provided. */
  offsetAmount?: number | null;
  /** Which edge(s) the offset applies to (default: 'start') */
  offsetDirection?: 'start' | 'end' | 'both';
  /** Layout direction — affects which dimension is measured */
  direction?: 'row' | 'column';
}

export interface ResizableOffsetResult {
  calculatedOffset: number;
  updateOffset: () => void;
  handleStyles: Record<string, string>;
  contentStyles: Record<string, string>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useResizableOffset (
  options: ResizableOffsetOptions = {},
): ResizableOffsetResult {
  const {
    offsetElement = null,
    offsetAmount = null,
    offsetDirection = 'start',
    direction = 'row',
  } = options;

  const [calculatedOffset, setCalculatedOffset] = useState(0);

  const updateOffset = useCallback((): void => {
    // Explicit amount wins over element measurement
    if (offsetAmount != null && offsetAmount > 0) {
      setCalculatedOffset(offsetAmount);
      return;
    }

    if (!offsetElement) { setCalculatedOffset(0); return; }

    try {
      const element = document.querySelector(offsetElement);
      if (!element) { setCalculatedOffset(0); return; }

      const rect = element.getBoundingClientRect();
      const dim = direction === 'row' ? rect.height : rect.width;
      setCalculatedOffset(dim);
    } catch (error) {
      console.warn('[resizable] Failed to measure offset element:', error);
      setCalculatedOffset(0);
    }
  }, [offsetAmount, offsetElement, direction]);

  // ── Styles — logical properties rotate with writing-mode ──

  const handleStyles = useMemo(() => {
    const styles: Record<string, string> = {};
    if (calculatedOffset <= 0) return styles;
    const px = `${calculatedOffset}px`;
    if (offsetDirection === 'start' || offsetDirection === 'both') styles.insetBlockStart = px;
    if (offsetDirection === 'end' || offsetDirection === 'both') styles.insetBlockEnd = px;
    return styles;
  }, [calculatedOffset, offsetDirection]);

  const contentStyles = useMemo(() => {
    const styles: Record<string, string> = {};
    if (calculatedOffset <= 0) return styles;
    const px = `${calculatedOffset}px`;
    if (offsetDirection === 'start' || offsetDirection === 'both') styles.paddingBlockStart = px;
    if (offsetDirection === 'end' || offsetDirection === 'both') styles.paddingBlockEnd = px;
    return styles;
  }, [calculatedOffset, offsetDirection]);

  // Vue measures once, on mount, with the options it was set up with. The port measures on mount too, and again when
  // the selector, the amount or the direction changes.
  useLayoutEffect(() => { updateOffset(); }, [updateOffset]);

  return { calculatedOffset, updateOffset, handleStyles, contentStyles };
}
