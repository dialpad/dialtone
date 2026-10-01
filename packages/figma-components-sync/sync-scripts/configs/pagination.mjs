/**
 * DtPagination.
 *
 * Axes are the PROP API: `totalPages`, `activePage`, `maxVisible`, `showEdges`.
 * `ariaLabel` is required but paints nothing, so it is passed as a constant.
 *
 * The interesting behaviour is ELISION: when `totalPages` exceeds `maxVisible`
 * the component collapses the middle into an ellipsis, and which pages survive
 * depends on where `activePage` sits. That is a structural change, so the axes
 * are chosen to hit each shape — few pages (no elision), many pages with the
 * active page at the start, in the middle, and at the end.
 */
export default {
  component: 'DtPagination', label: '', page: 'Pagination',
  figmaSetId: '286:15583',

  axes: {
    totalPages: [3, 12],
    // Start / middle / end. With totalPages=3 these collapse to 1 and 3, which
    // `invalid` prunes below so the set carries no out-of-range variants.
    activePage: [1, 6, 12],
    maxVisible: [5, 7],
    showEdges: [true, false],
  },

  invalid: c => {
    // An activePage beyond totalPages is not a state the component supports.
    if (c.activePage > c.totalPages) return true;
    // With 3 pages and maxVisible 5 or 7 there is nothing to elide, so both
    // maxVisible values paint the same thing. Keep one.
    if (c.totalPages <= 3 && c.maxVisible !== 5) return true;
    return false;
  },

  props: c => ({
    ariaLabel: 'Pagination',
    totalPages: c.totalPages,
    activePage: c.activePage,
    maxVisible: c.maxVisible,
    showEdges: c.showEdges,
  }),

  variantName: c => `totalPages=${c.totalPages}, activePage=${c.activePage}, `
    + `maxVisible=${c.maxVisible}, showEdges=${c.showEdges}`,
};
