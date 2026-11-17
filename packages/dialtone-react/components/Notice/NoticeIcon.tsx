import type { HTMLAttributes, ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import {
  DtIconAlertCircle,
  DtIconAlertTriangle,
  DtIconBell,
  DtIconCheckCircle,
  DtIconInfo,
} from '../../icons';
import type { NoticeKind } from './NoticeConstants';
import { hasSlotContent, withSlotFallback } from './slotFallback';

const kindToIcon = new Map<string, ReactNode>([
  ['info', <DtIconInfo size="400" />],
  ['positive', <DtIconCheckCircle size="400" />],
  ['warning', <DtIconAlertTriangle size="400" />],
  ['critical', <DtIconAlertCircle size="400" />],
  ['base', <DtIconBell size="400" />],
]);

export interface DtNoticeIconProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Kind of icon
   * @values base, critical, info, positive, warning
   */
  kind?: NoticeKind;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Custom icon, in place of the kind's icon. */
  children?: ReactNode;
}

export function DtNoticeIcon ({ kind = 'base', iconClass = '', children, className, ...rest }: DtNoticeIconProps) {
  const defaultIcon = kindToIcon.get(kind);

  if (!defaultIcon && !hasSlotContent(children)) return null;

  return (
    <div
      aria-hidden="true"
      className={cx('d-notice__icon', iconClass, className)}
      {...rest}
    >
      {withSlotFallback(children, defaultIcon)}
    </div>
  );
}
