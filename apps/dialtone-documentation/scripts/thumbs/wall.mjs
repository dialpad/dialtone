import { slugToPascalComponentName } from '../lib/utils.mjs';

/**
 * Filename / slug / export-name conversions for the thumb pipeline.
 * components_list.js uses snake_case filenames (button_group.vue).
 * Output SVG/PNG filenames use kebab-case (button-group.png).
 * dialtone-vue exports are PascalCase prefixed with Dt (DtButtonGroup).
 */

/** 'button_group.vue' → 'button-group' */
export function fileToSlug (filename) {
  return filename.replace(/\.vue$/, '').replace(/_/g, '-');
}

/** 'button-group' → 'DtButtonGroup' */
export const slugToExportName = slugToPascalComponentName;

/** 'DtButtonGroup' → 'button-group' (inverse of slugToExportName) */
export function exportNameToSlug (exportName) {
  return exportName.slice(2).replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
}

// Wall-page slugs that don't match the components_list slug 1:1. After capture,
// copy <source-slug>-*.png to <alias>-*.png so the wall card finds its thumb.
// E.g., the wall card for DtTabGroup resolves to fileName 'tabs' (tabs.md has
// `title: Tabs`), while the component slug from components_list is 'tab-group'.
//
// Shared by generate.mjs (Node) and harness/main.js (Vite) so the picker and
// the generator agree on which components are on the wall.
export const SLUG_ALIASES = {
  'tab-group': ['tabs'],
  'mode-island': ['mode'],
};

export function isOnWall (componentSlug, wallSlugs) {
  if (wallSlugs.has(componentSlug)) return true;
  return (SLUG_ALIASES[componentSlug] ?? []).some(a => wallSlugs.has(a));
}

// Inverse of SLUG_ALIASES: given a wall slug (the fileName the wall uses),
// return the source component slug. For non-aliased pages the wall slug
// matches the source slug — pass-through. Lets the gallery turn 'tabs'
// (wall) into 'tab-group' (component) so it can link to the right preview.
export function wallSlugToComponentSlug (wallSlug) {
  for (const [src, aliases] of Object.entries(SLUG_ALIASES)) {
    if (aliases.includes(wallSlug)) return src;
  }
  return wallSlug;
}

// Derive a wall page's slug from its .md frontmatter. Mirrors theme/index.js's
// `(shortTitle || title).toLowerCase().replaceAll(' ', '-')` rule — which is
// what Overview.vue's `page.fileName` actually resolves to. Using filenames
// would miss aliased cases like `mode-island.md → fileName 'mode'`.
//
// The value pattern handles three quoting modes (double, single, bare) as
// disjoint alternatives so a bare value like `title: He said "hi"` doesn't
// get its trailing quote stripped.
const FIELD_VALUE = /(?:"([^"]*)"|'([^']*)'|(.+?))\s*$/.source;

export function frontmatterToSlug (mdContent) {
  const fm = mdContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const block = fm[1];
  const match =
    block.match(new RegExp(`^shortTitle:\\s*${FIELD_VALUE}`, 'm')) ??
    block.match(new RegExp(`^title:\\s*${FIELD_VALUE}`, 'm'));
  const raw = (match?.[1] ?? match?.[2] ?? match?.[3])?.trim();
  if (!raw) return null;
  return raw.toLowerCase().replaceAll(' ', '-');
}
