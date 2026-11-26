// The mirrored-keys overlay: the last few keys replayed in a frame ("Escape", "Shift+ArrowDown ×3"), each for
// KEYS_MS, at the bottom of that frame's pane, so a frame that reacts to a key you didn't press in it isn't a mystery.
// Typed text shows as "typing…", never as the text. Drawn by the comparison page, never in the story.
import { useEffect, useRef, useState } from 'react';
import type { Side } from './frames';
import { KEYS_MS, TYPING } from './sync';
import type { KeysState } from './sync';

interface SyncKeysProps {
  keys: KeysState | null;
  /** The frame this overlay is drawn over: it shows only keys replayed in it. */
  side: Side;
}

export function SyncKeys ({ keys, side }: SyncKeysProps) {
  // Entries up to this seq have had their time. They come in order and all last KEYS_MS, so one number is enough: each
  // new latest entry ends, KEYS_MS later, with every entry before it. A newer entry doesn't cancel an older one's
  // timer, which still ends that one on time.
  const [expired, setExpired] = useState(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const latest = keys?.over === side ? keys.entries[keys.entries.length - 1]?.seq ?? null : null;
  useEffect(() => {
    if (latest === null) return;
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setExpired(current => Math.max(current, latest));
    }, KEYS_MS);
    timers.current.add(timer);
  }, [latest]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const shown = keys?.over === side ? keys.entries.filter(entry => entry.seq > expired) : [];
  if (!keys || !shown.length) return null;
  return (
    <div className="compare-keys" data-side={keys.mirrors} aria-hidden="true" style={{ pointerEvents: 'none' }}>
      {shown.map(entry => (
        // Keyed by seq, so a repeated key restarts its entry.
        <span key={entry.seq} className="compare-keys__key" data-typing={entry.label === TYPING || undefined}>
          {entry.label}
          {entry.count > 1 && <span className="compare-keys__count">{` ×${entry.count}`}</span>}
        </span>
      ))}
    </div>
  );
}
