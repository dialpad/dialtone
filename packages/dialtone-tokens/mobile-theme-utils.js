/**
 * Theme groups that are exclusively built for the native mobile platforms (android and ios). They are skipped by every
 * web output: css, less, json, layered css, theme entrypoints and the token documentation.
 */
export const MOBILE_EXCLUSIVE_THEME_GROUPS = ['mobile-tmo'];

/**
 * Theme groups that are built for the native mobile platforms (android and ios).
 */
export const MOBILE_THEME_GROUPS = ['base', 'dp', 'mobile-tmo'];

const MOBILE_PLATFORMS = ['android_xml', 'android_xml_dimens', 'android_compose', 'ios'];

export const isMobileExclusiveTheme = (theme) => MOBILE_EXCLUSIVE_THEME_GROUPS.includes(theme.group);

export const isMobileTheme = (theme) => MOBILE_THEME_GROUPS.includes(theme.group);

/**
 * Drops the mobile platforms from a Style Dictionary platforms object, for themes that are not built for mobile.
 */
export const removeMobilePlatforms = (platforms) => Object.fromEntries(
  Object.entries(platforms).filter(([name]) => !MOBILE_PLATFORMS.includes(name)),
);

/**
 * Narrows a Style Dictionary platforms object to the mobile platforms. Their `buildDocJson` action is also dropped
 * since the token documentation it feeds (doc.json) is web-facing.
 */
export const toMobilePlatforms = (platforms) => Object.fromEntries(
  Object.entries(platforms)
    .filter(([name]) => MOBILE_PLATFORMS.includes(name))
    .map(([name, platform]) => [name, { ...platform, actions: [] }]),
);
