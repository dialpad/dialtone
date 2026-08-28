/**
 * Status → DtBadge props. Single source for every surface that renders a doc
 * page's lifecycle status, so a new status or a renamed badge type is one edit.
 */
export const STATUS_BADGES = Object.freeze({
  beta: { type: 'info', text: 'Beta' },
  new: { type: 'bulletin', text: 'New' },
  planned: { text: 'Planned' },
});

export const getStatusBadge = (status) => STATUS_BADGES[status];
