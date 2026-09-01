const LANDING_PAGE_LABELS = new Set(['Catalog', 'Introduction', 'Overview']);

function getDeeperPath (currentPath, candidatePath) {
  if (!candidatePath) return currentPath;
  if (!currentPath || candidatePath.length > currentPath.length) return candidatePath;
  return currentPath;
}

function findDeepestNavPath (items = [], link, ancestors = []) {
  let deepestMatch = null;

  for (const item of items) {
    const path = [...ancestors, item];

    if (item.link === link) deepestMatch = path;

    const descendantMatch = findDeepestNavPath(item.children, link, path);
    deepestMatch = getDeeperPath(deepestMatch, descendantMatch);
  }

  return deepestMatch;
}

/**
 * Returns the navigation hierarchy to show above the current page.
 * The current page is excluded. Landing pages whose route is shared with their
 * collapsible parent do not need a breadcrumb.
 */
export function getNavBreadcrumbs (items, routePath) {
  const path = findDeepestNavPath(items, routePath);
  if (!path || path.length < 2) return [];

  const currentItem = path.at(-1);
  const parentItem = path.at(-2);
  const isLandingPage = currentItem.link === parentItem.link &&
    LANDING_PAGE_LABELS.has(currentItem.text);

  if (isLandingPage) return [];

  return path.slice(0, -1);
}
