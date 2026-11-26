// The phantom cursor: where the real pointer in the other frame is, drawn in the comparison page above this frame,
// never in the story's DOM. Tinted and labelled with the side it mirrors.
import type { Side } from './frames';
import type { Size } from './sync';

const LABELS: Record<Side, string> = { vue: 'Vue', react: 'React' };

// An arrow whose tip, the hotspot, is the SVG's origin. The SVG sits at the root's origin and the root is a 0×0 box,
// so the root's position is the hotspot: no border or centring to subtract.
export const ARROW_PATH = 'M0 0 L0 16.5 L4.4 12.4 L7.3 19 L10.1 17.8 L7.3 11.3 L13 11.3 Z';

// Room the label needs to the right of and below the hotspot before it flips to the other side.
const LABEL_ROOM = { width: 96, height: 48 };

interface SyncCursorProps {
  /** The side whose real pointer this shows. */
  mirrors: Side;
  /** The hotspot, in the container's pixels. */
  x: number;
  y: number;
  /** The mirrored pointer's button is down. */
  pressed: boolean;
  /** The container's size, to keep the label inside it. */
  bounds: Size;
  /** The Contrast toolbar is on high: a black and white cursor. */
  highContrast?: boolean;
}

export function SyncCursor ({ mirrors, x, y, pressed, bounds, highContrast = false }: SyncCursorProps) {
  return (
    <div
      className="compare-cursor"
      data-side={mirrors}
      data-pressed={pressed || undefined}
      data-contrast={highContrast ? 'high' : undefined}
      data-flip-x={x > bounds.width - LABEL_ROOM.width || undefined}
      data-flip-y={y > bounds.height - LABEL_ROOM.height || undefined}
      aria-hidden="true"
      // Inline, so it never takes the pointer from the frame under it, whatever the stylesheet.
      style={{ pointerEvents: 'none', transform: `translate(${x}px, ${y}px)` }}
    >
      <svg className="compare-cursor__pointer" width="14" height="20" viewBox="0 0 14 20" focusable="false">
        <circle className="compare-cursor__press" cx="0" cy="0" r="9" />
        <path className="compare-cursor__arrow" d={ARROW_PATH} />
      </svg>
      <span className="compare-cursor__label">{LABELS[mirrors]}</span>
    </div>
  );
}
