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
  DT_BOX_SCROLLBAR_VALUES,
} from './box_constants.js';

// Vue's default validator warning omits the invalid value and allowed list.
// This factory adds a dev-only console.warn to fill that gap.
function listValidator (list, extras = []) {
  return (value) => {
    if (extras.includes(value)) return true;
    if (list.includes(String(value))) return true;
    if (process.env.NODE_ENV !== 'production') {
      const allValid = [...extras.map(String), ...list].join(', ');
       
      console.warn(
        `[DtBox] Invalid prop value: "${value}". Valid values: ${allValid}`,
      );
    }
    return false;
  };
}

export const asValidator = listValidator(DT_BOX_AS_VALUES);
export const spacingValidator = listValidator(DT_BOX_SPACING_VALUES);
export const surfaceValidator = listValidator(DT_BOX_SURFACE_VALUES);
export const borderColorValidator = listValidator(DT_BOX_BORDER_COLOR_VALUES);
export const borderWidthValidator = listValidator(DT_BOX_BORDER_WIDTH_VALUES);
export const borderRadiusValidator = listValidator(DT_BOX_BORDER_RADIUS_VALUES);
export const shadowValidator = listValidator(DT_BOX_SHADOW_VALUES);
export const layoutValidator = listValidator(DT_BOX_LAYOUT_VALUES);
export const overflowValidator = listValidator(DT_BOX_OVERFLOW_VALUES);
export const scrollbarValidator = listValidator(DT_BOX_SCROLLBAR_VALUES, [true]);
