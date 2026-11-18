import { useCallback, useRef, useState } from 'react';
import type { SyncedState } from './types';

/**
 * State with a synchronous mirror. Vue's composables write a ref and read it back in the same handler (updateThumbValue
 * then commitIfChanged); React state only updates on the next render, so handlers read and write `ref`, and `set`
 * schedules the render.
 */
export function useSyncedState<T> (initial: T | (() => T)): SyncedState<T> {
  const [value, setValue] = useState(initial);
  const ref = useRef(value);
  const set = useCallback((next: T) => {
    ref.current = next;
    setValue(() => next);
  }, []);
  return { value, ref, set };
}
