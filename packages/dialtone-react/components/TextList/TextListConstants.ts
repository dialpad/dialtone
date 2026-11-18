import { TEXT_TONE_MODIFIERS } from '../Text/TextConstants';
import { DT_STACK_GAP, type StackGap } from '../Stack/StackConstants';

export const DT_TEXT_LIST_DEFAULT_TYPE = 'unordered';
export const DT_TEXT_LIST_GAP = DT_STACK_GAP.filter(
  gap => Number(gap) <= 400,
) as unknown as readonly TextListGapUpTo400[];

export const DT_TEXT_LIST_TYPES = ['unordered', 'ordered'] as const;

export const DT_TEXT_LIST_UNORDERED_MARKERS = ['disc', 'circle', 'square'] as const;
export const DT_TEXT_LIST_ORDERED_MARKERS = [
  'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman',
] as const;
export const DT_TEXT_LIST_MARKERS = [
  ...DT_TEXT_LIST_UNORDERED_MARKERS,
  ...DT_TEXT_LIST_ORDERED_MARKERS,
  'none',
] as const;

export const DT_TEXT_LIST_MARKER_TONES = Object.keys(TEXT_TONE_MODIFIERS) as readonly TextListMarkerTone[];

type TextListGapUpTo400 = Exclude<StackGap, '450' | '500' | '525' | '550' | '600' | '650' | '700' | '750' | '800'>;

// The validators' value sets, as literal unions.
export type TextListType = typeof DT_TEXT_LIST_TYPES[number];
export type TextListMarker = typeof DT_TEXT_LIST_MARKERS[number];
export type TextListMarkerTone = keyof typeof TEXT_TONE_MODIFIERS;
export type TextListGap = TextListGapUpTo400;

export default {
  DT_TEXT_LIST_DEFAULT_TYPE,
  DT_TEXT_LIST_GAP,
  DT_TEXT_LIST_TYPES,
  DT_TEXT_LIST_UNORDERED_MARKERS,
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_MARKER_TONES,
};
