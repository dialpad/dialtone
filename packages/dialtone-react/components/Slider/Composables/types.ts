import type { SliderFillOrigin, SliderOrientation, SliderReadoutMode } from '../SliderConstants';
import type { SliderMark } from '../utils';

/** A value: a number for one thumb, a pair for a range. */
export type SliderValue = number | number[];

/**
 * The props the composables read, with Vue's defaults applied: the React side of the `props` object every Vue
 * composable receives.
 */
export interface ResolvedSliderProps {
  value: SliderValue | null | undefined;
  min: number;
  max: number;
  step: number;
  snapPoints: number | readonly unknown[] | undefined;
  disabled: boolean;
  orientation: SliderOrientation;
  fillOrigin: SliderFillOrigin | number;
  showTicks: boolean | number;
  minGapSteps: number;
  getValueText: ((value: number, index?: number) => unknown) | null;
  prefix: string;
  suffix: string;
  largeStep: number;
  readout: SliderReadoutMode;
  showMarks: boolean | readonly SliderMark[];
}

/** Vue's `emit`: one callback per event the composables emit. */
export interface SliderEmit {
  valueChange: (value: SliderValue) => void;
  valueCommit: (value: SliderValue) => void;
}

/** A Vue ref's React counterpart: rendered state, with a ref that handlers read and write synchronously. */
export interface SyncedState<T> {
  /** The value this render sees. */
  value: T;
  /** The latest value, including writes this render hasn't seen yet. */
  ref: { current: T };
  set: (next: T) => void;
}
