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
  /**
   * Vue slot → React prop. The default slot is children; a function turns the content into [prop, value].
   * The content is parsed HTML, or, for a slot Vue rendered with a scope (iconSize, inputProps, an item per row),
   * a render prop that takes the scope and returns the HTML Vue rendered for it, or a mismatch marker.
   */
  slots?: Record<string, string | ((content: SlotContent) => [string, unknown])>;
}

/** What a Vue slot becomes on the React side: static content, or a render prop for a slot rendered with a scope. */
export type SlotContent = ReactNode | ((scope: unknown) => ReactNode);

/** components/<Name>/deviations.json: accepted differences from Vue's DOM, one per case, each with a reason. */
export type Deviations = Record<string, {
  reason: string;
  skip?: true;
  /** The HTML React renders instead of Vue's. */
  react?: string;
  /**
   * Waives the Math.random check, when Vue calls it only to make an id (ProgressCircle's gradient id; the port uses
   * useId) or through a library the port doesn't use (rich-text-editor's). The DOM is still compared, so the gate
   * counts a case whose deviation is only this as matching Vue, though it's still in the deviation count.
   */
  noRandom?: true;
}>;
