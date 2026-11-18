import { devWarn } from '../../common/dev';
import {
  DT_BOX_AS_VALUES,
  DT_BOX_SPACING_VALUES,
  DT_BOX_INSET_VALUES,
  DT_BOX_INSET_SIDE_VALUES,
  DT_BOX_SURFACE_VALUES,
  DT_BOX_BORDER_COLOR_VALUES,
  DT_BOX_BORDER_WIDTH_VALUES,
  DT_BOX_BORDER_RADIUS_VALUES,
  DT_BOX_SHADOW_VALUES,
  DT_BOX_POSITION_VALUES,
  DT_BOX_Z_INDEX_VALUES,
  DT_BOX_LAYOUT_VALUES,
  DT_BOX_OVERFLOW_VALUES,
  DT_BOX_SCROLLBAR_VALUES,
} from './BoxConstants';

export type BoxValidator = (value: unknown) => boolean;

// A validator that names the invalid value and the allowed list in its warning, as dialtone-vue's does. Like Vue's, it
// warns in development only (common/dev.ts).
function listValidator (list: readonly string[], extras: readonly unknown[] = []): BoxValidator {
  return (value) => {
    if (extras.includes(value)) return true;
    if (list.includes(String(value))) return true;
    const allValid = [...extras.map(String), ...list].join(', ');
    devWarn(
      `[DtBox] Invalid prop value: "${String(value)}". Valid values: ${allValid}`,
    );
    return false;
  };
}

export const asValidator = listValidator(DT_BOX_AS_VALUES);
export const spacingValidator = listValidator(DT_BOX_SPACING_VALUES);
export const insetValidator = listValidator(DT_BOX_INSET_VALUES);
export const insetSideValidator = listValidator(DT_BOX_INSET_SIDE_VALUES);
export const surfaceValidator = listValidator(DT_BOX_SURFACE_VALUES);
export const borderColorValidator = listValidator(DT_BOX_BORDER_COLOR_VALUES);
export const borderWidthValidator = listValidator(DT_BOX_BORDER_WIDTH_VALUES);
export const borderRadiusValidator = listValidator(DT_BOX_BORDER_RADIUS_VALUES);
export const shadowValidator = listValidator(DT_BOX_SHADOW_VALUES);
export const positionValidator = listValidator(DT_BOX_POSITION_VALUES);
export const zIndexValidator = listValidator(DT_BOX_Z_INDEX_VALUES);
export const layoutValidator = listValidator(DT_BOX_LAYOUT_VALUES);
export const overflowValidator = listValidator(DT_BOX_OVERFLOW_VALUES);
export const scrollbarValidator = listValidator(DT_BOX_SCROLLBAR_VALUES, [true]);
