/**
 * Per-component thumbnail variant configuration.
 *
 *   variant       — name of the Combinator variant to use (default: 'default')
 *   propOverrides — extra props merged on top of the variant's props
 *                   (use this to force open state on overlays, etc.)
 *
 * If a component isn't listed here, the 'default' variant is used with no overrides.
 */

export const THUMB_VARIANTS = {
  // Overlays — force open state so the popup content is visible in the screenshot.
  DtModal: { propOverrides: { open: true } },
  DtTooltip: { propOverrides: { show: true } },
  DtHovercard: { propOverrides: { show: true } },
  DtComboboxWithPopover: { propOverrides: { open: true } },

  // Non-default variant selections.
  DtEmptyState: { variant: 'with icon and actions', propOverrides: { size: 200 } },
  DtStack: { variant: 'row, align start' },
  DtPagination: { variant: 'active page' },
};
