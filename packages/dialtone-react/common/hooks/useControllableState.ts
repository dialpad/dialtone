import { useCallback, useState } from 'react';

/**
 * State that's controlled when `value` is set and uncontrolled otherwise: Vue's v-model in React
 * (conventions › Vue → React). The setter calls `onChange` either way, with any extra arguments.
 */
export function useControllableState<T, Rest extends unknown[] = []> ({ value, defaultValue, onChange }: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (value: T, ...rest: Rest) => void;
}): [T, (next: T, ...rest: Rest) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const setValue = useCallback((next: T, ...rest: Rest) => {
    if (!controlled) setInternal(next);
    onChange?.(next, ...rest);
  }, [controlled, onChange]);
  return [controlled ? value : internal, setValue];
}
