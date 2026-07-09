import {
  DT_TEXT_LIST_TYPES,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_MARKER_TONES,
  DT_TEXT_LIST_GAP,
} from './TextListConstants';

function optionalListValidator (list) {
  return value => value == null || list.includes(String(value));
}

export const textListTypeValidator = value => DT_TEXT_LIST_TYPES.includes(String(value));
export const textListMarkerValidator = optionalListValidator(DT_TEXT_LIST_MARKERS);
export const textListMarkerToneValidator = optionalListValidator(DT_TEXT_LIST_MARKER_TONES);
export const textListGapValidator = optionalListValidator(DT_TEXT_LIST_GAP);
