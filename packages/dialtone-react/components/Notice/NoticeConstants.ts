export const NOTICE_KINDS = ['base', 'critical', 'info', 'positive', 'warning'] as const;
export const NOTICE_ROLES = ['alert', 'alertdialog', 'status'] as const;

export type NoticeKind = typeof NOTICE_KINDS[number];
export type NoticeRole = typeof NOTICE_ROLES[number];

export default {
  NOTICE_KINDS,
  NOTICE_ROLES,
};
