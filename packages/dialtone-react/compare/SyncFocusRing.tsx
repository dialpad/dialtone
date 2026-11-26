// The fake focus ring: where focus would be in the frame that isn't the source, which never takes real focus while
// sync is on (the agent shims its focus()). Drawn by the comparison page over the frame, never in the story's DOM, and
// dashed in a colour of its own, so it isn't taken for the component's focus ring.
import type { Side } from './frames';
import type { Point, Rect } from './sync';

/** How far the ring stands off the element, in px, as a focus ring's offset does. */
export const RING_OFFSET = 3;

interface SyncFocusRingProps {
  /** The side whose real focus it mirrors. */
  mirrors: Side;
  /** The element's rect, in its frame's viewport. */
  rect: Rect;
  /** Where that viewport starts in the container. */
  offset: Point;
  /** The Contrast toolbar is on high: black and white. */
  highContrast?: boolean;
}

export function SyncFocusRing ({ mirrors, rect, offset, highContrast = false }: SyncFocusRingProps) {
  return (
    <div
      className="compare-ring"
      data-side={mirrors}
      data-contrast={highContrast ? 'high' : undefined}
      aria-hidden="true"
      // Inline, so it never takes the pointer from the frame under it, whatever the stylesheet. Rects are physical
      // (from getBoundingClientRect), so it's placed from the top left.
      style={{
        pointerEvents: 'none',
        transform: `translate(${offset.x + rect.x - RING_OFFSET}px, ${offset.y + rect.y - RING_OFFSET}px)`,
        width: rect.width + 2 * RING_OFFSET,
        height: rect.height + 2 * RING_OFFSET,
      }}
    />
  );
}
