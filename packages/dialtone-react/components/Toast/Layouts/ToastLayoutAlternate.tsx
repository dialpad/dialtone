import { useId } from 'react';
import { cx } from '../../../common/cx';
import { DtNoticeAction, DtNoticeContent } from '../../Notice';
import { withSlotFallback } from '../../Notice/slotFallback';
import { DtToastLayoutAlternateIcon } from './ToastLayoutAlternateIcon';
import type { ToastLayoutProps } from './ToastLayoutProps';

const TOAST_ALTERNATE_KIND_CLASSES: Readonly<Record<string, string>> = {
  critical: 'd-toast-alternate--critical',
  info: 'd-toast-alternate--info',
  positive: 'd-toast-alternate--positive',
  warning: 'd-toast-alternate--warning',
  gradient: 'd-toast-alternate--gradient',
};

export function ToastLayoutAlternate ({
  isShown = false,
  headerId,
  contentId,
  headerText,
  message = '',
  role = 'status',
  kind = 'base',
  // Vue's alternate layout declares neither, so they fall into its $attrs and are dropped there.
  important: _important,
  showAction: _showAction,
  showClose = true,
  showIcon = true,
  iconClass = '',
  headerClass = '',
  contentClass = '',
  actionClass = '',
  className,
  children,
  icon,
  header,
  // The alternate layout has no action slot.
  action: _action,
  onClose,
  ...listeners
}: ToastLayoutProps) {
  const generatedHeaderId = useId();
  const generatedContentId = useId();

  if (!isShown) return null;

  const kindClass = Object.hasOwn(TOAST_ALTERNATE_KIND_CLASSES, kind) ? TOAST_ALTERNATE_KIND_CLASSES[kind] : undefined;

  return (
    <div
      className={cx('d-toast-alternate', className, kindClass)}
      data-qa="dt-toast"
      aria-hidden={!isShown}
    >
      <div className="d-toast-alternate__dialog">
        <div className="d-toast-alternate__header">
          {showIcon && (
            <DtToastLayoutAlternateIcon
              kind={kind}
              iconClass={iconClass}
              size="200"
              {...listeners}
            >
              {icon}
            </DtToastLayoutAlternateIcon>
          )}
          <DtNoticeContent
            headerId={headerId ?? generatedHeaderId}
            contentId={contentId ?? generatedContentId}
            headerText={headerText}
            headerClass={headerClass}
            contentClass={contentClass}
            role={role}
            header={header}
            {...listeners}
          />

          {/* Close Button. Vue passes `button-size`, which NoticeAction doesn't declare, so it lands on its root. */}
          <DtNoticeAction
            showAction={false}
            showClose={showClose}
            actionClass={actionClass}
            button-size="100"
            {...listeners}
            onClose={onClose}
          />
        </div>
        {/* Content Section */}
        <div className="d-toast-alternate__content">
          {withSlotFallback(children, message)}
        </div>
      </div>
    </div>
  );
}
