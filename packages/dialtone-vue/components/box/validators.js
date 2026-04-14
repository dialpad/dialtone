import {
  DT_BOX_AS_VALUES,
  DT_BOX_SPACING_VALUES,
  DT_BOX_SURFACE_VALUES,
  DT_BOX_BORDER_COLOR_VALUES,
  DT_BOX_BORDER_WIDTH_VALUES,
  DT_BOX_BORDER_RADIUS_VALUES,
  DT_BOX_SHADOW_VALUES,
  DT_BOX_LAYOUT_VALUES,
  DT_BOX_OVERFLOW_VALUES,
} from './box_constants.js';

export const asValidator = (value) => DT_BOX_AS_VALUES.includes(value);
export const spacingValidator = (value) => DT_BOX_SPACING_VALUES.includes(String(value));
export const surfaceValidator = (value) => DT_BOX_SURFACE_VALUES.includes(value);
export const borderColorValidator = (value) => DT_BOX_BORDER_COLOR_VALUES.includes(value);
export const borderWidthValidator = (value) => DT_BOX_BORDER_WIDTH_VALUES.includes(String(value));
export const borderRadiusValidator = (value) => DT_BOX_BORDER_RADIUS_VALUES.includes(String(value));
export const shadowValidator = (value) => DT_BOX_SHADOW_VALUES.includes(value);
export const layoutValidator = (value) => DT_BOX_LAYOUT_VALUES.includes(String(value));
export const overflowValidator = (value) => DT_BOX_OVERFLOW_VALUES.includes(value);
