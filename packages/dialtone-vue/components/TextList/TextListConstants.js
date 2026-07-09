import { TEXT_TONE_MODIFIERS } from '@/components/Text/TextConstants';
import { DT_STACK_GAP } from '@/components/Stack/StackConstants';

export const DT_TEXT_LIST_DEFAULT_TYPE = 'unordered';
export const DT_TEXT_LIST_DEFAULT_GAP = '0';
export const DT_TEXT_LIST_GAP = DT_STACK_GAP.filter(gap => Number(gap) <= 400);

export const DT_TEXT_LIST_CONTEXT = Symbol('DtTextListContext');

export const DT_TEXT_LIST_TYPES = ['unordered', 'ordered'];

export const DT_TEXT_LIST_UNORDERED_MARKERS = ['disc', 'circle', 'square'];
export const DT_TEXT_LIST_ORDERED_MARKERS = ['decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'];
export const DT_TEXT_LIST_MARKERS = [
  ...DT_TEXT_LIST_UNORDERED_MARKERS,
  ...DT_TEXT_LIST_ORDERED_MARKERS,
  'none',
];

export const DT_TEXT_LIST_MARKER_TONES = Object.keys(TEXT_TONE_MODIFIERS);

export default {
  DT_TEXT_LIST_DEFAULT_TYPE,
  DT_TEXT_LIST_DEFAULT_GAP,
  DT_TEXT_LIST_GAP,
  DT_TEXT_LIST_CONTEXT,
  DT_TEXT_LIST_TYPES,
  DT_TEXT_LIST_UNORDERED_MARKERS,
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_MARKER_TONES,
};
