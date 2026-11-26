// The scroll cue: when the comparison replays a scroll in a frame, a thin bar at the frame's end edge, with a small
// chevron for the direction, shows for a moment, so a frame that moved on its own isn't a surprise. Drawn by the
// comparison page over the frame, never in the story.
import { useEffect, useState } from 'react';
import type { Side } from './frames';
import type { CueState } from './sync';

/** How long the cue stays, in ms. */
export const CUE_MS = 1000;

interface SyncCueProps {
  cue: CueState | null;
  /** The frame this cue is drawn over: it shows only a scroll replayed in it. */
  side: Side;
}

export function SyncCue ({ cue, side }: SyncCueProps) {
  // The seq of the scroll showing; each new scroll restarts the time.
  const [shown, setShown] = useState<number | null>(null);
  const seq = cue?.over === side ? cue.seq : null;
  useEffect(() => {
    if (seq === null) return;
    setShown(seq);
    const timer = setTimeout(() => setShown(null), CUE_MS);
    return () => clearTimeout(timer);
  }, [seq]);

  if (!cue || cue.over !== side || shown !== cue.seq) return null;
  return (
    <div
      className="compare-cue"
      data-side={cue.mirrors}
      data-direction={cue.direction ?? undefined}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {cue.direction && (
        <svg className="compare-cue__chevron" width="12" height="8" viewBox="0 0 12 8" focusable="false">
          <path d={cue.direction === 'up' ? 'M1 7 L6 2 L11 7' : 'M1 1 L6 6 L11 1'} />
        </svg>
      )}
    </div>
  );
}
