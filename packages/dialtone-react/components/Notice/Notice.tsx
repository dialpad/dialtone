import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { DtNoticeAction } from './NoticeAction';
import { DtNoticeContent } from './NoticeContent';
import { DtNoticeIcon } from './NoticeIcon';
import type { NoticeKind, NoticeRole } from './NoticeConstants';

export interface DtNoticeProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'role'> {
  /**
   * Sets an ID on the header element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the header.
   */
  headerId?: string;

  /**
   * Sets an ID on the content element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the content.
   */
  contentId?: string;

  /** Header text of the notice. This can be left blank to remove the header from the notice entirely. */
  headerText?: string;

  /**
   * Provides a role for the notice. 'status' is used to communicate a message. 'alert' is used to communicate an
   * important message that does not contain any interactive elements. 'alertdialog' is used to communicate an
   * important message that does contain interactive elements.
   * @values alert, alertdialog, status
   */
  role?: NoticeRole;

  /**
   * Used in scenarios where the message needs to visually dominate the screen.
   * This will also change the aria role from status to alert.
   * @values true, false
   */
  important?: boolean;

  /**
   * Severity level of the notice, sets the icon and background
   * @values base, critical, info, positive, warning
   */
  kind?: NoticeKind;

  /**
   * Shows the close button in the notice
   * @values true, false
   */
  showClose?: boolean;

  /**
   * Shows the icon in the notice
   * @values true, false
   */
  showIcon?: boolean;

  /**
   * Shows the action in the notice
   * @values true, false
   */
  showAction?: boolean;

  /**
   * Truncates the content instead of wrapping.
   * Used when the notice needs to have a fixed height.
   * @values true, false
   */
  truncateText?: boolean;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Additional class name for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /** Additional class name for the action wrapper element. */
  actionClass?: ClassValue;

  /** The main textual content of the notice */
  children?: ReactNode;

  /** Custom icon */
  icon?: ReactNode;

  /** The header, in place of headerText */
  header?: ReactNode;

  /** A possible action for the user to take, such as a link to another page */
  action?: ReactNode;

  /** Close button click event */
  onClose?: () => void;

  /** The `<aside>` root. */
  ref?: Ref<HTMLElement>;
}

const NOTICE_KIND_CLASSES: Readonly<Record<string, string>> = {
  critical: 'd-notice--critical',
  info: 'd-notice--info',
  positive: 'd-notice--positive',
  warning: 'd-notice--warning',
  base: 'd-notice--base',
};

/**
 * A notice is an informational and assistive message that appears inline with content.
 * @see https://dialtone.dialpad.com/components/notice.html
 */
export function DtNotice ({
  headerId,
  contentId,
  headerText,
  role = 'status',
  important = false,
  kind = 'base',
  showClose = true,
  showIcon = true,
  showAction = true,
  truncateText = false,
  iconClass = '',
  headerClass = '',
  contentClass = '',
  actionClass = '',
  children,
  icon,
  header,
  action,
  onClose,
  className,
  ...rest
}: DtNoticeProps) {
  const noticeClass = cx(
    'd-notice',
    Object.hasOwn(NOTICE_KIND_CLASSES, kind) ? NOTICE_KIND_CLASSES[kind] : undefined,
    { 'd-notice--important': important, 'd-notice--truncate': truncateText },
  );

  return (
    <aside
      className={cx(noticeClass, className)}
      data-qa="notice"
      {...rest}
    >
      {showIcon && (
        <DtNoticeIcon
          kind={kind}
          iconClass={iconClass}
          className={cx({ 'd-notice__icon--has-title': headerText || header !== undefined })}
        >
          {icon}
        </DtNoticeIcon>
      )}
      <DtNoticeContent
        headerId={headerId}
        contentId={contentId}
        headerText={headerText}
        headerClass={headerClass}
        contentClass={contentClass}
        role={role}
        header={header}
      >
        {children}
      </DtNoticeContent>
      <DtNoticeAction
        showAction={showAction}
        showClose={showClose}
        actionClass={actionClass}
        onClose={onClose}
      >
        {action}
      </DtNoticeAction>
    </aside>
  );
}
