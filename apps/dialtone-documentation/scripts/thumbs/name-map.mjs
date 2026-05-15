/**
 * Filename / slug / export-name conversions for the thumb pipeline.
 * components_list.js uses snake_case filenames (button_group.vue).
 * Output SVG/PNG filenames use kebab-case (button-group.png).
 * dialtone-vue exports are PascalCase prefixed with Dt (DtButtonGroup).
 */
import { slugToPascalComponentName } from '../lib/utils.mjs';

/** 'button_group.vue' → 'button-group' */
export function fileToSlug (filename) {
  return filename.replace(/\.vue$/, '').replace(/_/g, '-');
}

/** 'button-group' → 'DtButtonGroup' — re-export of scripts/lib helper for ergonomic local naming. */
export const slugToExportName = slugToPascalComponentName;

/** 'button_group.vue' → 'DtButtonGroup' */
export function fileToExportName (filename) {
  return slugToPascalComponentName(fileToSlug(filename));
}

/** 'DtButtonGroup' → 'button-group' (inverse of slugToExportName) */
export function exportNameToSlug (exportName) {
  return exportName.slice(2).replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
}
