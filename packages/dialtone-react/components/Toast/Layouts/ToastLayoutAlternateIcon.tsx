import type { HTMLAttributes, ReactNode } from 'react';
import { cx, type ClassValue } from '../../../common/cx';
import {
  DtIconAlertTriangle,
  DtIconBell,
  DtIconInfo,
  DtIconSparkle,
  type IconSize,
} from '../../../icons';
import { withSlotFallback } from '../../Notice/slotFallback';
import type { ToastAlternateKind } from '../ToastConstants';

const kindToIcon = new Map<string, (size: IconSize) => ReactNode>([
  ['info', size => <DtIconInfo size={size} />],
  ['positive', size => <DtIconInfo size={size} />],
  ['warning', size => <DtIconAlertTriangle size={size} />],
  ['critical', size => <DtIconInfo size={size} />],
  ['base', size => <DtIconBell size={size} />],
  ['gradient', size => <DtIconSparkle size={size} />],
]);

export interface DtToastLayoutAlternateIconProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Kind of icon
   * @values base, critical, info, positive, warning, gradient
   */
  kind?: ToastAlternateKind;

  /** The size of the kind's icon. */
  size?: IconSize;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Custom icon, in place of the kind's icon. */
  children?: ReactNode;
}

export function DtToastLayoutAlternateIcon ({
  kind = 'base',
  size = 400,
  iconClass = '',
  children,
  className,
  ...rest
}: DtToastLayoutAlternateIconProps) {
  const defaultIcon = kindToIcon.get(kind);

  return (
    <div
      aria-hidden="true"
      className={cx('d-toast-layout-alternate__icon', iconClass, className)}
      {...rest}
    >
      {withSlotFallback(children, defaultIcon?.(size))}
    </div>
  );
}
