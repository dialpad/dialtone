import { NOTICE_KINDS } from '@/components/notice';
export const TOAST_ALTERNATE_KINDS = ['gradient', ...NOTICE_KINDS];
export const TOAST_ROLES = ['status', 'alert'];
export const TOAST_MIN_DURATION = 6000;
export const TOAST_LAYOUTS = ['default', 'alternate'];

export default {
  TOAST_ROLES,
  TOAST_MIN_DURATION,
  TOAST_LAYOUTS,
  TOAST_ALTERNATE_KINDS,
};
