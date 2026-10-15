import { onBeforeUnmount, onMounted, watch } from 'vue';
import { autoUpdate, computePosition, flip, hide, offset, shift, size } from '@floating-ui/dom';
import { sameValues } from '../utils';

const VISIBILITY_OPTIONS = {
  visibilityProperty: true,
  opacityProperty: true,
  // Chrome/Edge 114–120 support Popover but only these older option names.
  checkVisibilityCSS: true,
  checkOpacity: true,
};

function isAnchorVisible(anchor) {
  if (anchor.checkVisibility) return anchor.checkVisibility(VISIBILITY_OPTIONS);
  if (!anchor.getClientRects().length) return false;
  if (getComputedStyle(anchor).visibility !== 'visible') return false;
  for (let el = anchor; el; el = el.parentElement) {
    const style = getComputedStyle(el);
    if (style.opacity === '0' || style.contentVisibility === 'hidden') return false;
  }
  return true;
}

function sameRect(a, b) {
  return a.left === b.left && a.top === b.top && a.right === b.right && a.bottom === b.bottom;
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function useSliderTooltipReadout(props, {
  thumbVisualRefs,
  tooltipElRefs,
  isVertical,
  isRtl,
  readoutVisibility,
  formattedValues,
  onPosition,
}) {
  const entries = new Map();

  function shouldOpen(index) {
    return props.readout === 'tooltip' && !props.disabled && readoutVisibility.value[index];
  }

  function close(index) {
    const entry = entries.get(index);
    if (!entry) return;
    entries.delete(index);
    entry.cleanup?.();
    if (entry.tooltip.matches(':popover-open')) entry.tooltip.hidePopover();
  }

  function open(index, anchor, tooltip) {
    if (typeof tooltip.showPopover !== 'function') return;
    let revision = 0;
    let referenceHidden = true;
    let anchorRect = null;
    let geometry = null;
    let frame;
    const entry = { anchor, tooltip, update, cleanup: null };
    const isLive = () => entries.get(index) === entry;

    function currentVisibility() {
      return referenceHidden || !isAnchorVisible(anchor) ? 'hidden' : 'visible';
    }

    // Shown hidden; the first completed position reveals it.
    function reveal() {
      tooltip.style.visibility = 'hidden';
      tooltip.showPopover();
    }

    async function update() {
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
      const boundary = { boundary: [], padding: gap * 2 };
      const content = tooltip.firstElementChild;
      // A closed/replaced readout must never be revived by an older calculation.
      const isCurrent = () => isLive() && current === revision;
      const result = await computePosition(anchor, tooltip, {
        strategy: 'fixed',
        placement: isVertical.value ? (isRtl.value ? 'left' : 'right') : 'top',
        middleware: [
          offset(gap),
          flip(boundary),
          shift(boundary),
          size({
            ...boundary,
            apply({ availableWidth, availableHeight }) {
              if (!isCurrent()) return;
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
        tooltip.style.setProperty('--slider-tooltip-arrow-x', `${clamp(rect.left + rect.width / 2 - result.x, gap, width - gap)}px`);
      } else {
        tooltip.style.setProperty('--slider-tooltip-arrow-y', `${clamp(rect.top + rect.height / 2 - result.y, gap, height - gap)}px`);
      }
      const next = [result.x, result.y, width, height, side, visibility];
      if (!geometry || !sameValues(next, geometry)) {
        geometry = next;
        onPosition();
      }
    }

    // Value watchers position promptly; this frame check covers transformed
    // anchors and a stationary owner's visibility. Comparing against the rect
    // the last update used skips the frame after a watcher already ran. It
    // also replaces autoUpdate's layoutShift observer, which reacts after paint.
    function checkFrame() {
      if (!tooltip.matches(':popover-open') || !anchorRect || !sameRect(anchor.getBoundingClientRect(), anchorRect)) update();
      else tooltip.style.visibility = currentVisibility();
      if (isLive()) frame = requestAnimationFrame(checkFrame);
    }

    entries.set(index, entry);
    reveal();
    const stopPositioning = autoUpdate(anchor, tooltip, update, { layoutShift: false });
    checkFrame();
    entry.cleanup = () => {
      stopPositioning();
      cancelAnimationFrame(frame);
    };
  }

  function sync() {
    for (const [index, entry] of entries) {
      if (!shouldOpen(index) ||
          thumbVisualRefs.value[index] !== entry.anchor || tooltipElRefs.value[index] !== entry.tooltip) {
        close(index);
      }
    }
    readoutVisibility.value.forEach((_, index) => {
      const anchor = thumbVisualRefs.value[index];
      const tooltip = tooltipElRefs.value[index];
      if (!anchor || !tooltip || !shouldOpen(index)) return;
      if (entries.has(index)) entries.get(index).update();
      else open(index, anchor, tooltip);
    });
  }

  watch(
    [() => props.readout, () => props.disabled, isVertical, isRtl, formattedValues, readoutVisibility],
    sync,
    { flush: 'post' },
  );
  onMounted(sync);
  onBeforeUnmount(() => { for (const index of entries.keys()) close(index); });
}
