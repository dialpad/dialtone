import { NOTICE_KINDS } from '../Notice/NoticeConstants';

export const TOAST_ALTERNATE_KINDS = ['gradient', ...NOTICE_KINDS] as const;
export const TOAST_ROLES = ['status', 'alert'] as const;
export const TOAST_MIN_DURATION = 6000;
export const TOAST_LAYOUTS = ['default', 'alternate'] as const;

export type ToastAlternateKind = typeof TOAST_ALTERNATE_KINDS[number];
export type ToastRole = typeof TOAST_ROLES[number];
export type ToastLayout = typeof TOAST_LAYOUTS[number];

export default {
  TOAST_ROLES,
  TOAST_MIN_DURATION,
  TOAST_LAYOUTS,
  TOAST_ALTERNATE_KINDS,
};
