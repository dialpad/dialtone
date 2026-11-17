import { Children, type HTMLAttributes, type ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';
import {
  DtIconAlertCircle,
  DtIconAlertTriangle,
  DtIconBell,
  DtIconCheckCircle,
  DtIconInfo,
} from '../../icons';
import type { NoticeKind } from './NoticeConstants';

const kindToIcon = new Map([
  ['info', DtIconInfo],
  ['positive', DtIconCheckCircle],
  ['warning', DtIconAlertTriangle],
  ['critical', DtIconAlertCircle],
  ['base', DtIconBell],
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
  const DefaultIcon = kindToIcon.get(kind);

  if (!DefaultIcon && !hasContent(children)) return null;

  return (
    <div
      aria-hidden="true"
      className={cx('d-notice__icon', iconClass, className)}
      {...rest}
    >
      {Children.toArray(children).length > 0
        ? children
        : DefaultIcon && <DefaultIcon size="400" />}
    </div>
  );
}
