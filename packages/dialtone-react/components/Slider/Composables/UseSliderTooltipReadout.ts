import { useEffect, useEffectEvent, useRef } from 'react';
import { autoUpdate, computePosition, flip, hide, offset, shift, size, type Placement } from '@floating-ui/dom';
import { sameValues } from '../utils';
import type { ResolvedSliderProps } from './types';

const VISIBILITY_OPTIONS = {
  visibilityProperty: true,
  opacityProperty: true,
  // Chrome/Edge 114–120 support Popover but only these older option names.
  checkVisibilityCSS: true,
  checkOpacity: true,
};

function isAnchorVisible (anchor: HTMLElement): boolean {
  if (anchor.checkVisibility) return anchor.checkVisibility(VISIBILITY_OPTIONS);
  if (!anchor.getClientRects().length) return false;
  if (getComputedStyle(anchor).visibility !== 'visible') return false;
  for (let el: HTMLElement | null = anchor; el; el = el.parentElement) {
    const style = getComputedStyle(el);
    if (style.opacity === '0' || style.contentVisibility === 'hidden') return false;
  }
  return true;
}

function sameRect (a: DOMRect, b: DOMRect): boolean {
  return a.left === b.left && a.top === b.top && a.right === b.right && a.bottom === b.bottom;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface Entry {
  anchor: HTMLElement;
  tooltip: HTMLElement;
  update: () => Promise<void>;
  cleanup: (() => void) | null;
}

/** What the open readouts read from the component, always its latest render. */
interface ReadoutCallbacks {
  shouldOpen: (index: number) => boolean;
  placement: () => Placement;
  onPosition: () => void;
}

// The open readouts and their positioning loops, outside React: Floating UI
// and animation frames drive them between renders.
function createTooltipReadouts ({ shouldOpen, placement, onPosition }: ReadoutCallbacks) {
  const entries = new Map<number, Entry>();

  function close (index: number) {
    const entry = entries.get(index);
    if (!entry) return;
    entries.delete(index);
    entry.cleanup?.();
    if (entry.tooltip.matches(':popover-open')) entry.tooltip.hidePopover();
  }

  function open (index: number, anchor: HTMLElement, tooltip: HTMLElement) {
    if (typeof tooltip.showPopover !== 'function') return;
    let revision = 0;
    let referenceHidden: boolean | undefined = true;
    let anchorRect: DOMRect | null = null;
    let geometry: unknown[] | null = null;
    let frame: number | undefined;
    const entry: Entry = { anchor, tooltip, update, cleanup: null };
    const isLive = () => entries.get(index) === entry;

    function currentVisibility () {
      return referenceHidden || !isAnchorVisible(anchor) ? 'hidden' : 'visible';
    }

    // Shown hidden; the first completed position reveals it.
    function reveal () {
      tooltip.style.visibility = 'hidden';
      tooltip.showPopover();
    }

    async function update () {
      if (!isLive()) return;
      if (!tooltip.matches(':popover-open')) {
        if (!shouldOpen(index) || !anchor.isConnected || !tooltip.isConnected || !isAnchorVisible(anchor)) {
          close(index);
          return;
        }
        reveal();
      }
      const current = ++revision;
      const rect = anchor.getBoundingClientRect();
      anchorRect = rect;
      const gap = parseFloat(getComputedStyle(tooltip).paddingBlockStart) || 0;
      const boundary = { boundary: [] as Element[], padding: gap * 2 };
      const content = tooltip.firstElementChild as HTMLElement | null;
      // A closed/replaced readout must never be revived by an older calculation.
      const isCurrent = () => isLive() && current === revision;
      const result = await computePosition(anchor, tooltip, {
        strategy: 'fixed',
        placement: placement(),
        middleware: [
          offset(gap),
          flip(boundary),
          shift(boundary),
          size({
            ...boundary,
            apply ({ availableWidth, availableHeight }) {
              if (!isCurrent() || !content) return;
              content.style.maxInlineSize = `${Math.max(0, availableWidth - gap * 2)}px`;
              content.style.maxBlockSize = `${Math.max(0, availableHeight - gap * 2)}px`;
            },
          }),
          hide(),
        ],
      });
      if (!isCurrent()) return;

      // Read before writing: size() and hide() just measured, so layout is clean.
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      // flip() only falls back to the opposite side, so there is no -start/-end suffix.
      const side = result.placement;
      referenceHidden = result.middlewareData.hide?.referenceHidden;
      const visibility = currentVisibility();

      tooltip.dataset.side = side;
      // Floating UI returns physical viewport coordinates, including under RTL.
      Object.assign(tooltip.style, { left: `${result.x}px`, top: `${result.y}px`, visibility });
      // Each side's arrow rule (slider.less) reads only the axis it slides along.
      if (side === 'top' || side === 'bottom') {
        tooltip.style.setProperty(
          '--slider-tooltip-arrow-x',
          `${clamp(rect.left + rect.width / 2 - result.x, gap, width - gap)}px`,
        );
      } else {
        tooltip.style.setProperty(
          '--slider-tooltip-arrow-y',
          `${clamp(rect.top + rect.height / 2 - result.y, gap, height - gap)}px`,
        );
      }
      const next = [result.x, result.y, width, height, side, visibility];
      if (!geometry || !sameValues(next, geometry)) {
        geometry = next;
        onPosition();
      }
    }

    // Value changes position promptly; this frame check covers transformed
    // anchors and a stationary owner's visibility, every frame (a throttled
    // check visibly lagged a dragged container). Comparing against the rect
    // the last update used skips the frame after a value change already ran.
    function checkFrame () {
      if (!tooltip.matches(':popover-open') || !anchorRect || !sameRect(anchor.getBoundingClientRect(), anchorRect)) {
        update();
      } else {
        tooltip.style.visibility = currentVisibility();
      }
      if (isLive()) frame = requestAnimationFrame(checkFrame);
    }

    entries.set(index, entry);
    reveal();
    const stopPositioning = autoUpdate(anchor, tooltip, update, { layoutShift: false });
    checkFrame();
    entry.cleanup = () => {
      stopPositioning();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }

  return {
    entries,
    open,
    close,
    closeAll () {
      for (const index of [...entries.keys()]) close(index);
    },
  };
}

// Each readout is a native manual popover kept in place in the DOM (so it
// inherits local themes), positioned with Floating UI and shown only while
// its thumb is hovered, dragged or focused.
export function useSliderTooltipReadout (props: ResolvedSliderProps, {
  thumbVisualEls,
  tooltipEls,
  isVertical,
  isRtl,
  readoutVisibility,
  formattedValues,
  onPosition,
}: {
  thumbVisualEls: { current: (HTMLElement | null)[] };
  tooltipEls: { current: (HTMLElement | null)[] };
  isVertical: boolean;
  isRtl: boolean;
  readoutVisibility: boolean[];
  formattedValues: string[];
  onPosition: () => void;
}) {
  const readouts = useRef<ReturnType<typeof createTooltipReadouts> | null>(null);

  // Read by the positioning code the effects set up (autoUpdate, animation
  // frames), so they always see the latest props.
  const shouldOpen = useEffectEvent((index: number) => (
    props.readout === 'tooltip' && !props.disabled && !!readoutVisibility[index]
  ));
  const placement = useEffectEvent((): Placement => (isVertical ? (isRtl ? 'left' : 'right') : 'top'));
  const positioned = useEffectEvent(() => onPosition());

  // Declared before the sync effect below, so the readouts exist when it first runs.
  useEffect(() => {
    const tracker = createTooltipReadouts({
      shouldOpen: (index) => shouldOpen(index),
      placement: () => placement(),
      onPosition: () => positioned(),
    });
    readouts.current = tracker;
    return () => {
      tracker.closeAll();
      readouts.current = null;
    };
  }, []);

  const sync = useEffectEvent(() => {
    const tracker = readouts.current;
    if (!tracker) return;
    for (const [index, entry] of tracker.entries) {
      if (!shouldOpen(index) ||
          thumbVisualEls.current[index] !== entry.anchor || tooltipEls.current[index] !== entry.tooltip) {
        tracker.close(index);
      }
    }
    readoutVisibility.forEach((_, index) => {
      const anchor = thumbVisualEls.current[index];
      const tooltip = tooltipEls.current[index];
      if (!anchor || !tooltip || !shouldOpen(index)) return;
      const entry = tracker.entries.get(index);
      if (entry) entry.update();
      else tracker.open(index, anchor, tooltip);
    });
  });

  // Vue's post-flush watcher plus onMounted(sync): after the DOM updates, on
  // mount and whenever any of these change.
  const key = JSON.stringify([props.readout, props.disabled, isVertical, isRtl, formattedValues, readoutVisibility]);
  useEffect(() => sync(), [key]);
}
