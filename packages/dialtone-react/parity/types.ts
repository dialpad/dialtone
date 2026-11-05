import type { ComponentType, ReactNode } from 'react';

/**
 * How the generic DOM parity test renders a unit: components/<Name>/<Name>.parity.tsx default-exports one.
 * Names that match Vue's need no entry; only what the conventions rename does.
 */
export interface ParityMap {
  // The harness renders any component with props built from a Vue case, so it can't know the props type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  /** Vue prop or attribute → React prop, where the conventions rename it (e.g. modelValue → checked). */
  props?: Record<string, string>;
  /** Vue prop → value transform, where the value's shape differs. */
  values?: Record<string, (value: unknown) => unknown>;
  /** Vue slot → React prop. The default slot is children; a function turns the parsed content into [prop, value]. */
  slots?: Record<string, string | ((content: ReactNode) => [string, unknown])>;
}

/** components/<Name>/deviations.json: accepted differences from Vue's DOM, one per case, each with a reason. */
export type Deviations = Record<string, { reason: string; skip?: true; react?: string }>;
