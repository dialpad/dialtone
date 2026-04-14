import { DT_BOX_AS_VALUES, DT_BOX_SPACING_VALUES, DT_BOX_SURFACE_VALUES } from './box_constants.js';

export const asValidator = (value) => DT_BOX_AS_VALUES.includes(value);
export const spacingValidator = (value) => DT_BOX_SPACING_VALUES.includes(String(value));
export const surfaceValidator = (value) => DT_BOX_SURFACE_VALUES.includes(value);
