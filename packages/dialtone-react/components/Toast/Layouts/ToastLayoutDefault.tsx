import { useId } from 'react';
import { cx } from '../../../common/cx';
import { DtNoticeAction, DtNoticeContent, DtNoticeIcon, type NoticeKind } from '../../Notice';
import type { ToastLayoutProps } from './ToastLayoutProps';

const TOAST_KIND_CLASSES: Readonly<Record<string, string>> = {
  critical: 'd-toast--critical',
  info: 'd-toast--info',
  positive: 'd-toast--positive',
  warning: 'd-toast--warning',
  base: 'd-toast--base',
};

export function ToastLayoutDefault ({
  isShown = false,
  headerId,
  contentId,
  headerText,
  message = '',
  role = 'status',
  kind = 'base',
  important = false,
  showClose = true,
  showIcon = true,
  showAction = true,
  iconClass = '',
  headerClass = '',
  contentClass = '',
  actionClass = '',
  className,
  children,
  icon,
  header,
  action,
  onClose,
  ...listeners
}: ToastLayoutProps) {
  const generatedHeaderId = useId();
  const generatedContentId = useId();

  if (!isShown) return null;

  const kindClass = Object.hasOwn(TOAST_KIND_CLASSES, kind) ? TOAST_KIND_CLASSES[kind] : undefined;

  return (
    <div
      className={cx('d-toast', kindClass, className, { 'd-toast--important': important })}
      data-qa="dt-toast"
      aria-hidden={!isShown}
    >
      <div className="d-toast__dialog">
        {showIcon && (
          <DtNoticeIcon
            // Vue's validator only warns, so a toast kind Notice doesn't know (gradient) renders without an icon.
            kind={kind as NoticeKind}
            iconClass={iconClass}
            // Vue's condition is `headerText || $slots.header`, but DtToast always passes its layout a header slot,
            // so the icon always has this class.
            className="d-notice__icon--has-title"
            {...listeners}
          >
            {icon}
          </DtNoticeIcon>
        )}
        <DtNoticeContent
          headerId={headerId ?? generatedHeaderId}
          contentId={contentId ?? generatedContentId}
          headerText={headerText}
          message={message}
          headerClass={headerClass}
          contentClass={contentClass}
          role={role}
          header={header}
          {...listeners}
        >
          {children}
        </DtNoticeContent>
        <DtNoticeAction
          showAction={showAction}
          showClose={showClose}
          actionClass={actionClass}
          {...listeners}
          onClose={onClose}
        >
          {action}
        </DtNoticeAction>
      </div>
    </div>
  );
}
