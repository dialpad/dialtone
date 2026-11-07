/**
 * Status → DtBadge props. Single source for every surface that renders a doc
 * page's lifecycle status, so a new status or a renamed badge type is one edit.
 */
export const STATUS_BADGES = Object.freeze({
  beta: { kind: 'release', variant: 'pre-release', label: 'Beta', emphasis: 'base' },
  new: { kind: 'release', variant: 'pre-release', label: 'New', emphasis: 'strong' },
  planned: { label: 'Planned' },
});

export const getStatusBadge = (status) => STATUS_BADGES[status];
