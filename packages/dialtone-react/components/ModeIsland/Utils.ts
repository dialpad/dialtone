/** Get the opposite mode (light <-> dark). */
export function getOppositeMode (currentMode: string | null | undefined): 'light' | 'dark' {
  return currentMode === 'light' ? 'dark' : 'light';
}

/** The mode on the root HTML element, or 'light'. Returns the default during SSR, where no DOM exists. */
export function getRootMode (): string {
  if (typeof document === 'undefined') return 'light';
  const rootMode = document.documentElement.getAttribute('data-dt-mode');
  return rootMode || 'light';
}

/** The contrast on the root HTML element, or 'default'. Returns the default during SSR, where no DOM exists. */
export function getRootContrast (): string {
  if (typeof document === 'undefined') return 'default';
  const rootContrast = document.documentElement.getAttribute('data-dt-contrast');
  return rootContrast || 'default';
}

/** The material on the root HTML element, or 'sandstone'. Returns the default during SSR, where no DOM exists. */
export function getRootMaterial (): string {
  if (typeof document === 'undefined') return 'sandstone';
  const rootMaterial = document.documentElement.getAttribute('data-dt-material');
  return rootMaterial || 'sandstone';
}

/** The mode of the nearest ancestor with a data-dt-mode attribute, or the root mode. */
export function findParentMode (el: Element | null | undefined): string {
  let parent = el?.parentElement;
  while (parent && parent !== document.documentElement) {
    const mode = parent.getAttribute('data-dt-mode');
    if (mode !== null) return mode;
    parent = parent.parentElement;
  }
  return getRootMode();
}
